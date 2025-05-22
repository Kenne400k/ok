// pcar.js - Console-based car racing mini-game for Messenger
module.exports.config = {
  name: "pcar",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Thiện Phát",
  description: "Mini-game đua xe console trên Messenger với các tính năng nâng cao",
  commandCategory: "game",
  usages: "pcar [create|join|start|leave|status|addbot|stop|info|top|profile|garage|customize|tournament|leaderboard|achievements]",
  cooldowns: 0 // Đã bỏ cooldown theo yêu cầu
};

const fs = require("fs");
const { createCanvas } = require("canvas");
const path = require("path");

// Import các module tiện ích
const constants = require("./src/utils/constants");
const db = require('./src/utils/databaseManager');
const progression = require('./src/utils/progression');

// Import các hàm tiến trình từ module progression
const { 
  getOrCreatePlayerProgression, 
  checkAndAwardAchievements, 
  calculateLevel, 
  getNewlyUnlockedItems, 
  hasAchievement, 
  getSeasonLeaderboard, 
  loadPlayerData, 
  savePlayerData
} = progression;

// Import các hằng số từ module constants
const { 
  TRACK_LENGTH, 
  LANE_HEIGHT, 
  CELL_WIDTH, 
  CANVAS_WIDTH, 
  MAX_PLAYERS,
  SKILLS,
  BOT_DIFFICULTIES,
  WEATHER_TYPES,
  CAR_CUSTOMIZATIONS,
  OBSTACLE_TYPES
} = constants;

// Map các thuộc tính của WEATHER_TYPES để đảm bảo tương thích với mã cũ
for (const weatherType in WEATHER_TYPES) {
  WEATHER_TYPES[weatherType].speedEffect = WEATHER_TYPES[weatherType].effects.speedFactor - 1;
  WEATHER_TYPES[weatherType].handlingEffect = WEATHER_TYPES[weatherType].effects.controlFactor - 1;
  WEATHER_TYPES[weatherType].visibilityEffect = WEATHER_TYPES[weatherType].effects.visibility - 1;
}

// Đã import SKILLS từ constants ở trên

// Các hệ thống dữ liệu người chơi
const playerStats = new Map(); // playerId -> { wins: 0, races: 0, bestTime: null }

// Hệ thống cấp độ và thành tích
const playerProgression = new Map(); // playerId -> { xp: 0, level: 1, achievements: [], car: {}, seasonPoints: 0 }

// Thành tích có thể đạt được
const ACHIEVEMENTS = [
  {
    id: "first_win",
    name: "Chiến thắng đầu tiên",
    description: "Thắng một cuộc đua",
    xpReward: 100,
    condition: (player) => player.stats.wins >= 1,
    icon: "🏆"
  },
  {
    id: "win_streak",
    name: "Chuỗi thắng",
    description: "Thắng 3 cuộc đua liên tiếp",
    xpReward: 300,
    condition: (player) => player.streak >= 3,
    icon: "🔥"
  },
  {
    id: "speed_demon",
    name: "Quỷ tốc độ",
    description: "Đạt tốc độ tối đa trong một cuộc đua",
    xpReward: 150,
    condition: (player) => player.maxSpeedReached === true,
    icon: "⚡"
  },
  {
    id: "comeback_king",
    name: "Vua lội ngược dòng",
    description: "Thắng khi từng ở vị trí cuối cùng",
    xpReward: 250,
    condition: (player) => player.hadComeback === true,
    icon: "👑"
  },
  {
    id: "skill_master",
    name: "Bậc thầy kỹ năng",
    description: "Sử dụng skill thành công 10 lần",
    xpReward: 200,
    condition: (player) => player.skillsUsed >= 10,
    icon: "🧙"
  },
  {
    id: "veteran_racer",
    name: "Tay đua kỳ cựu",
    description: "Tham gia 20 cuộc đua",
    xpReward: 250,
    condition: (player) => player.stats.races >= 20,
    icon: "🏁"
  },
  {
    id: "weather_master",
    name: "Bậc thầy thời tiết",
    description: "Thắng trong mọi điều kiện thời tiết",
    xpReward: 300,
    condition: (player) => 
      player.weatherWins && 
      Object.keys(WEATHER_TYPES).every(weather => player.weatherWins[weather]),
    icon: "☂️"
  },
  {
    id: "car_collector",
    name: "Sưu tầm xe",
    description: "Sở hữu 5 phụ kiện xe khác nhau",
    xpReward: 350,
    condition: (player) => 
      player.car && 
      Object.keys(player.car).filter(key => player.car[key]).length >= 5,
    icon: "🚗"
  },
  {
    id: "season_champion",
    name: "Nhà vô địch mùa giải",
    description: "Xếp hạng nhất trong một mùa giải",
    xpReward: 500,
    condition: (player) => player.seasonChampion === true,
    icon: "🏅"
  },
  {
    id: "tournament_winner",
    name: "Vô địch giải đấu",
    description: "Thắng một giải đấu",
    xpReward: 400,
    condition: (player) => player.tournamentWins && player.tournamentWins > 0,
    icon: "🎯"
  }
];

// Đã import CAR_CUSTOMIZATIONS từ constants ở trên

// Các mức độ và XP cần cho mỗi cấp
const XP_LEVELS = [
  { level: 1, xpNeeded: 0, reward: "🔑 Khóa màu xe Đỏ" },
  { level: 2, xpNeeded: 100, reward: "🔑 Khóa màu xe Xanh" },
  { level: 3, xpNeeded: 250, reward: "🔑 Khóa decal Sọc đua" },
  { level: 4, xpNeeded: 500, reward: "🔑 Khóa bánh xe Thể thao" },
  { level: 5, xpNeeded: 800, reward: "🔑 Khóa decal Lửa và động cơ V6" },
  { level: 6, xpNeeded: 1200, reward: "🔑 Khóa booster Cơ bản" },
  { level: 7, xpNeeded: 1700, reward: "🔑 Khóa decal Ngôi sao" },
  { level: 8, xpNeeded: 2300, reward: "🔑 Khóa màu Cam và bánh xe Đua" },
  { level: 9, xpNeeded: 3000, reward: "🔑 Khóa booster Turbo" },
  { level: 10, xpNeeded: 4000, reward: "🔑 Khóa màu Bạc, decal Carbon và động cơ V8" },
  { level: 12, xpNeeded: 5500, reward: "🔑 Khóa bánh xe Địa hình" },
  { level: 14, xpNeeded: 7500, reward: "🔑 Khóa booster Nitro" },
  { level: 15, xpNeeded: 10000, reward: "🔑 Khóa màu Vàng kim và động cơ V12" },
  { level: 18, xpNeeded: 15000, reward: "🔑 Khóa bánh xe Cao cấp" },
  { level: 20, xpNeeded: 25000, reward: "🔑 Khóa màu Cầu vồng, booster Tên lửa và động cơ Điện" }
];

// Thông tin mùa giải hiện tại
const CURRENT_SEASON = {
  id: 1,
  name: "🏆 Mùa 1: Khởi đầu",
  startDate: new Date("2025-04-01"),
  endDate: new Date("2025-06-30"),
  rewards: [
    { rank: 1, reward: "🥇 Huy hiệu Vô địch Mùa 1", xp: 1000 },
    { rank: 2, reward: "🥈 Huy hiệu Á quân Mùa 1", xp: 800 },
    { rank: 3, reward: "🥉 Huy hiệu Hạng ba Mùa 1", xp: 600 },
    { rank: 10, reward: "🏅 Huy hiệu Top 10 Mùa 1", xp: 400 },
    { rank: 100, reward: "🎖️ Huy hiệu Tham gia Mùa 1", xp: 200 }
  ]
};

// Đã import BOT_DIFFICULTIES từ constants ở trên

// Hệ thống giải đấu
const tournaments = new Map(); // tournamentId -> Tournament

// Đã import WEATHER_TYPES từ constants ở trên

// Car properties
class Car {
  constructor(playerId, name, isBot = false, botDifficulty = 'normal') {
    this.playerId = playerId;
    this.name = name;
    this.position = 0;
    this.speed = 1;
    this.baseMaxSpeed = 3;
    this.maxSpeed = 3;
    this.acceleration = 0.5;
    this.handling = 1.0;
    this.braking = 1.0;
    this.boostPower = 1.0;
    this.weatherResistance = 1.0;
    
    // Thống kê hiệu suất
    this.totalSpeed = 0; // Tổng tốc độ (để tính trung bình)
    this.highestSpeed = 0; // Tốc độ cao nhất đạt được
    this.overtakes = 0; // Số lần vượt
    this.skillsUsed = 0; // Số lần sử dụng kỹ năng
    this.boostTime = 0; // Thời gian boost
    
    // Initialize base color (can be customized later)
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    
    this.effects = [];
    this.isBot = isBot;
    this.botDifficulty = botDifficulty;
    this.lastMove = null;
    this.health = 100; // Health points
    
    // Dữ liệu theo dõi thành tích
    this.maxSpeedReached = false; // For achievement tracking
    this.hadComeback = false; // For achievement tracking
    this.streak = 0; // For achievement tracking
    
    try {
      // Chọn skill ngẫu nhiên cho xe (với kiểm tra an toàn)
      if (SKILLS && SKILLS.length > 0) {
        const randomSkillIndex = Math.floor(Math.random() * SKILLS.length);
        this.skill = { 
          ...SKILLS[randomSkillIndex],
          cooldownRemaining: 0 
        };
      } else {
        // Fallback khi không có skills
        this.skill = {
          name: "basic_boost",
          displayName: "🚀 Basic Boost",
          description: "Tăng tốc nhẹ",
          cooldown: 3,
          cooldownRemaining: 0
        };
      }
      
      // Kiểm tra tồn tại của các danh sách tùy chỉnh xe
      this.customization = {};
      
      // Thêm màu sắc mặc định
      if (CAR_CUSTOMIZATIONS && CAR_CUSTOMIZATIONS.colors && CAR_CUSTOMIZATIONS.colors.length > 0) {
        this.customization.color = CAR_CUSTOMIZATIONS.colors[0];
      } else {
        this.customization.color = { id: "red", name: "Đỏ", value: "#FF0000" };
      }
      
      // Thêm các phần còn lại với kiểm tra an toàn
      const customizationTypes = [
        { type: 'decal', collection: 'decals', fallback: { id: "none", name: "Không có", value: null } },
        { type: 'wheels', collection: 'wheels', fallback: { id: "standard", name: "Tiêu chuẩn", value: "standard" } },
        { type: 'booster', collection: 'boosters', fallback: { id: "none", name: "Không có", value: null } },
        { type: 'engine', collection: 'engines', fallback: { id: "standard", name: "Tiêu chuẩn", value: "standard" } }
      ];
      
      for (const { type, collection, fallback } of customizationTypes) {
        if (CAR_CUSTOMIZATIONS && CAR_CUSTOMIZATIONS[collection] && CAR_CUSTOMIZATIONS[collection].length > 0) {
          this.customization[type] = CAR_CUSTOMIZATIONS[collection][0];
        } else {
          this.customization[type] = fallback;
        }
      }
    } catch (error) {
      console.error("Lỗi khởi tạo xe:", error.message);
      
      // Khởi tạo các giá trị mặc định nếu có lỗi
      this.skill = {
        name: "basic_boost",
        displayName: "🚀 Tăng tốc cơ bản",
        description: "Tăng tốc nhẹ",
        cooldown: 3,
        cooldownRemaining: 0
      };
      
      this.customization = {
        color: { id: "red", name: "Đỏ", value: "#FF0000" },
        decal: { id: "none", name: "Không có", value: null },
        wheels: { id: "standard", name: "Tiêu chuẩn", value: "standard" },
        booster: { id: "none", name: "Không có", value: null },
        engine: { id: "standard", name: "Tiêu chuẩn", value: "standard" }
      };
    }
    
    // Set bot difficulty if this is a bot
    if (isBot && BOT_DIFFICULTIES[botDifficulty]) {
      this.botSettings = BOT_DIFFICULTIES[botDifficulty];
    }
    
    // Initialize tracking for race metrics
    this.raceMetrics = {
      fastestLap: null,
      skillsUsedThisRace: 0,
      positionHistory: [], // To track if the player was once in last place (for comeback achievement)
      weatherWins: {} // Track wins in different weather conditions
    };
  }
  
  // Calculate total stats based on customizations and apply them
  applyCustomizationStats() {
    // Reset to base values
    this.maxSpeed = this.baseMaxSpeed;
    this.acceleration = 0.5;
    this.handling = 1.0;
    this.braking = 1.0;
    this.boostPower = 1.0;
    this.weatherResistance = 1.0;
    
    // Apply customization bonuses
    const parts = ['decal', 'wheels', 'booster', 'engine'];
    for (const part of parts) {
      if (this.customization[part] && this.customization[part].stats) {
        const stats = this.customization[part].stats;
        
        if (stats.speed) this.maxSpeed += stats.speed;
        if (stats.acceleration) this.acceleration += stats.acceleration;
        if (stats.handling) this.handling += stats.handling;
        if (stats.braking) this.braking += stats.braking;
        if (stats.boostPower) this.boostPower += stats.boostPower;
        if (stats.boostDuration) this.boostDuration = stats.boostDuration;
        if (stats.weatherResistance) this.weatherResistance += stats.weatherResistance;
      }
    }
    
    // Apply bot difficulty modifiers if this is a bot
    if (this.isBot && this.botSettings) {
      this.maxSpeed *= this.botSettings.speedMultiplier;
    }
  }
  
  // Set car customization
  setCustomization(type, itemId) {
    if (!CAR_CUSTOMIZATIONS[type]) return false;
    
    const item = CAR_CUSTOMIZATIONS[type].find(item => item.id === itemId);
    if (!item) return false;
    
    this.customization[type] = item;
    
    // If the customization affects the color, update it
    if (type === 'color') {
      this.color = item.value;
    }
    
    // Recalculate stats after customization changes
    this.applyCustomizationStats();
    
    return true;
  }

  // Apply weather effects to car performance
  applyWeatherEffects(weather) {
    if (!weather || !WEATHER_TYPES[weather]) return;
    
    const weatherEffects = WEATHER_TYPES[weather];
    
    // Calculate weather resistance factor (higher is better)
    const resistanceFactor = Math.max(0, 1 - (this.weatherResistance / 2));
    
    // Apply effects with resistance taken into account
    const speedEffect = weatherEffects.speedEffect * resistanceFactor;
    const handlingEffect = weatherEffects.handlingEffect * resistanceFactor;
    
    // Temporarily modify car stats
    this.maxSpeed = Math.max(1, this.maxSpeed * (1 + speedEffect));
    this.handling = Math.max(0.5, this.handling * (1 + handlingEffect));
    
    // Add weather effect
    this.effects.push({
      type: "weather",
      weatherType: weather,
      duration: 3, // Weather effects last for 3 turns
      icon: weatherEffects.icon
    });
  }

  move(action, room) {
    this.lastMove = action;
    
    // Get weather effects if applicable
    const weatherEffect = room && room.currentWeather ? WEATHER_TYPES[room.currentWeather] : null;
    
    // Base movement calculation factoring in customizations and weather
    let movementFactor = 1;
    if (weatherEffect) {
      // Weather affects movement (apply resistance from car stats)
      movementFactor *= (1 + (weatherEffect.speedEffect * (1 - this.weatherResistance)));
    }
    
    // Lưu vị trí cũ để tính toán vị trí tương đối
    const oldPosition = this.position;
    const oldRank = room ? room.getPlayerRank(this.playerId) : null;
    
    switch(action.toLowerCase()) {
      case "right":
        // Normal movement with acceleration and handling factored in
        this.position += this.speed * movementFactor * (1 + (this.acceleration * 0.1));
        break;
      case "boost":
        // Boost affected by boostPower stat
        const boostAmount = this.speed * 2 * this.boostPower;
        this.position += boostAmount * movementFactor;
        
        // Add boost effect for visual feedback
        const boostDuration = Math.round(1 + (this.customization.booster?.stats?.boostDuration || 0));
        this.effects.push({type: "boost", duration: boostDuration});
        
        // Track boost time for stats
        this.boostTime += boostDuration;
        break;
      case "brake":
        // Braking affected by braking stat
        const brakeEfficiency = 1 + (this.braking * 0.2);
        this.position += Math.max(1, Math.floor((this.speed / 2) * movementFactor));
        this.speed = Math.max(1, this.speed - (1 * brakeEfficiency));
        
        // Add visual brake effect
        this.effects.push({type: "brake", duration: 1});
        break;
      case "jump":
        // Jump affected by handling
        const jumpHeight = 1 + (this.handling * 0.1);
        this.position += (this.speed + jumpHeight) * movementFactor;
        this.effects.push({type: "jump", duration: 1});
        break;
      case "left":
        // Moving backwards affected by handling
        const backwardEfficiency = 1 + (this.handling * 0.05);
        this.position = Math.max(0, this.position - (1 * backwardEfficiency));
        break;
    }

    // Cap position to track length
    this.position = Math.min(this.position, TRACK_LENGTH);

    // Update speed after move (max determined by car stats)
    if (action !== "brake") {
      // Acceleration determines how quickly the car reaches max speed
      const accelerationFactor = 0.5 + (this.acceleration * 0.1);
      this.speed = Math.min(this.maxSpeed, this.speed + accelerationFactor);
      
      // Track if max speed reached for achievement
      if (this.speed >= this.maxSpeed) {
        this.maxSpeedReached = true;
      }
    }
    
    // Cập nhật thống kê hiệu suất
    this.totalSpeed += this.speed;
    if (this.speed > this.highestSpeed) {
      this.highestSpeed = this.speed;
    }
    
    // Kiểm tra vượt
    if (room && oldRank !== null) {
      const newRank = room.getPlayerRank(this.playerId);
      if (newRank < oldRank) {
        // Đã vượt ít nhất 1 người
        this.overtakes += (oldRank - newRank);
      }
    }
    
    // Process effects duration
    for (let i = this.effects.length - 1; i >= 0; i--) {
      this.effects[i].duration--;
      if (this.effects[i].duration <= 0) {
        // If it was a weather effect ending, reapply base stats
        if (this.effects[i].type === "weather") {
          this.applyCustomizationStats(); // Reset to base stats
        }
        this.effects.splice(i, 1);
      }
    }
    
    // Update skill cooldown
    if (this.skill.cooldownRemaining > 0) {
      this.skill.cooldownRemaining--;
    }
  }

  useSkill(room) {
    try {
      // Kiểm tra skill có tồn tại không
      if (!this.skill) {
        return "Xe không có kỹ năng";
      }
      
      // Kiểm tra cooldown
      if (this.skill.cooldownRemaining > 0) {
        return `Kỹ năng ${this.skill.displayName || "kỹ năng"} đang hồi (còn ${this.skill.cooldownRemaining} lượt)`;
      }
      
      // Track skill usage for achievements
      this.skillsUsed++;
      
      if (this.raceMetrics) {
        this.raceMetrics.skillsUsedThisRace = (this.raceMetrics.skillsUsedThisRace || 0) + 1;
      }
      
      // Kiểm tra hàm xử lý kỹ năng
      if (typeof this.skill.handler !== 'function') {
        // Xử lý mặc định nếu không có hàm handler
        const boost = Math.floor(Math.random() * 3) + 1;
        this.position += boost;
        this.speed = Math.min(this.maxSpeed, this.speed + 0.5);
        
        // Thiết lập cooldown
        this.skill.cooldownRemaining = this.skill.cooldown || 3;
        
        return `🚀 ${this.name} sử dụng kỹ năng cơ bản, tăng tốc thêm ${boost} đơn vị!`;
      }
      
      // Sử dụng kỹ năng
      const result = this.skill.handler(this, room);
      
      // Thiết lập cooldown
      this.skill.cooldownRemaining = this.skill.cooldown;
      
      return result;
    } catch (error) {
      console.error("Lỗi khi sử dụng kỹ năng:", error.message);
      
      // Fallback nếu có lỗi
      this.position += 1;
      if (this.skill) {
        this.skill.cooldownRemaining = this.skill.cooldown || 3;
      }
      
      return `${this.name} cố gắng sử dụng kỹ năng nhưng không thành công`;
    }
  }

  // Kiểm tra va chạm với chướng ngại vật
  checkObstacleCollisions(room) {
    const collisions = [];
    
    // Kiểm tra từng chướng ngại vật
    for (let i = room.obstacles.length - 1; i >= 0; i--) {
      const obstacle = room.obstacles[i];
      
      if (Math.abs(this.position - obstacle.position) < 1) {
        // Va chạm với chướng ngại vật!
        if (obstacle.type === "trap" && obstacle.placedBy !== this.playerId) {
          // Nếu không có shield và va phải trap
          if (!this.effects.some(e => e.type === "shield")) {
            // Handling affects how well car responds to obstacles
            const damageReduction = this.handling * 0.1;
            this.speed = Math.max(1, this.speed - (1 - damageReduction));
            this.health -= Math.round(20 * (1 - damageReduction));
            
            collisions.push({
              type: "trap",
              message: `🔥 ${this.name} va phải bẫy!`
            });
          } else {
            collisions.push({
              type: "shield_block",
              message: `🛡️ ${this.name} được shield bảo vệ khỏi bẫy!`
            });
          }
          
          // Xóa chướng ngại vật sau khi va chạm
          room.obstacles.splice(i, 1);
        }
      }
    }
    
    return collisions;
  }

  getBotMove(room) {
    if (!this.isBot) return null;
    
    // Get bot settings
    const settings = this.botSettings || BOT_DIFFICULTIES.normal;
    
    // Advanced bot AI based on difficulty
    const strategicMoves = ["right", "boost", "right", "right", "jump"];
    
    // Check if there are obstacles ahead and try to avoid them
    const obstaclesAhead = room.obstacles.filter(o => 
      o.position > this.position && 
      o.position < this.position + 3 && // Look 3 spaces ahead
      o.placedBy !== this.playerId
    );
    
    // If obstacles ahead and bot difficulty is high enough to "see" them
    if (obstaclesAhead.length > 0 && settings.reactionTime <= 1) {
      // Smart bots try to jump over or avoid obstacles
      return "jump";
    }
    
    // Bot uses skill based on skill chance from difficulty
    if (this.skill.cooldownRemaining === 0 && Math.random() < settings.skillChance) {
      return "skill";
    }
    
    // Bot uses boost more often at higher difficulties
    if (Math.random() < settings.skillChance / 2) {
      return "boost";
    }
    
    // Bot sometimes uses brake to control speed at higher difficulties
    if (Math.random() < 0.1 && settings.reactionTime <= 2) {
      return "brake";
    }
    
    // Default movement
    const randomIndex = Math.floor(Math.random() * strategicMoves.length);
    return strategicMoves[randomIndex];
  }
  
  // Get win bonus XP based on car stats and race conditions
  getWinXP(room) {
    let xp = 100; // Base XP for winning
    
    // Bonus for difficult weather
    if (room.currentWeather && room.currentWeather !== 'clear') {
      xp += 25;
    }
    
    // Bonus for number of opponents
    xp += (room.players.length - 1) * 15;
    
    // Bonus for bots at higher difficulties
    const expertBots = room.players.filter(p => 
      p.isBot && p.botSettings && p.botSettings.name === "Chuyên gia"
    ).length;
    
    xp += expertBots * 30;
    
    return xp;
  }
  
  // Generate detailed info for the car
  getInfo() {
    try {
      // Calculate effective stats with customizations
      const effectiveStats = {
        maxSpeed: (this.maxSpeed || 3).toFixed(1),
        acceleration: (this.acceleration || 0.5).toFixed(1),
        handling: (this.handling || 1.0).toFixed(1),
        braking: (this.braking || 1.0).toFixed(1),
        boostPower: (this.boostPower || 1.0).toFixed(1)
      };
      
      // Tạo object customization an toàn với kiểm tra tồn tại của các thuộc tính
      const customization = {};
      
      // Kiểm tra và thêm các thuộc tính tùy chỉnh
      if (this.customization) {
        // Thêm màu sắc
        customization.color = this.customization.color?.name || "Mặc định";
        customization.decal = this.customization.decal?.name || "Không có";
        customization.wheels = this.customization.wheels?.name || "Tiêu chuẩn";
        
        // Thêm các thuộc tính tùy chọn khác nếu có
        if (this.customization.booster) {
          customization.booster = this.customization.booster.name;
        }
        
        if (this.customization.engine) {
          customization.engine = this.customization.engine.name;
        }
        
        if (this.customization.spoiler) {
          customization.spoiler = this.customization.spoiler.name;
        }
        
        if (this.customization.nitro) {
          customization.nitro = this.customization.nitro.name;
        }
      } else {
        customization.color = "Mặc định";
        customization.decal = "Không có";
        customization.wheels = "Tiêu chuẩn";
      }
      
      return {
        name: this.name,
        position: this.position,
        speed: this.speed,
        health: this.health,
        effects: this.effects || [],
        skill: {
          name: this.skill?.displayName || "Kỹ năng cơ bản",
          cooldown: this.skill?.cooldown || 3,
          cooldownRemaining: this.skill?.cooldownRemaining || 0
        },
        isBot: this.isBot,
        botDifficulty: this.isBot ? (this.botSettings?.name || "Thường") : null,
        customization: customization,
        stats: effectiveStats
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin xe:", error.message);
      // Trả về thông tin đơn giản nếu có lỗi
      return {
        name: this.name || "Unknown",
        position: this.position || 0,
        speed: this.speed || 1,
        health: this.health || 100,
        isBot: this.isBot || false,
        customization: { color: "Mặc định" }
      };
    }
  }
}

// Tournament class
class Tournament {
  constructor(id, name, creatorId, format = 'elimination', maxPlayers = 8) {
    this.id = id;
    this.name = name;
    this.creatorId = creatorId;
    this.format = format; // 'elimination' or 'league'
    this.maxPlayers = maxPlayers;
    this.players = []; // List of player IDs
    this.matches = []; // Match structure
    this.standings = []; // Rankings
    this.status = 'registration'; // registration, ongoing, completed
    this.createdAt = new Date();
    this.currentRound = 0;
    this.activeMatches = []; // Currently running matches
  }
  
  addPlayer(playerId, playerName) {
    if (this.status !== 'registration') return false;
    if (this.players.length >= this.maxPlayers) return false;
    if (this.players.some(p => p.id === playerId)) return false;
    
    this.players.push({
      id: playerId,
      name: playerName,
      wins: 0,
      losses: 0,
      points: 0
    });
    
    return true;
  }
  
  removePlayer(playerId) {
    if (this.status !== 'registration') return false;
    const initialLength = this.players.length;
    this.players = this.players.filter(p => p.id !== playerId);
    return initialLength !== this.players.length;
  }
  
  start() {
    if (this.status !== 'registration' || this.players.length < 2) return false;
    
    this.status = 'ongoing';
    
    // Initialize tournament structure based on format
    if (this.format === 'elimination') {
      this.initializeEliminationBracket();
    } else if (this.format === 'league') {
      this.initializeLeagueMatches();
    }
    
    return true;
  }
  
  initializeEliminationBracket() {
    // Shuffle players for random seeding
    this.players = this.shuffleArray([...this.players]);
    
    // Create first round matches
    this.currentRound = 1;
    const matches = [];
    
    // If odd number of players, give one a bye
    const playerCount = this.players.length;
    const matchCount = Math.floor(playerCount / 2);
    
    for (let i = 0; i < matchCount; i++) {
      matches.push({
        id: `R1-M${i+1}`,
        round: 1,
        player1: this.players[i * 2].id,
        player2: this.players[i * 2 + 1].id,
        winner: null,
        status: 'pending'
      });
    }
    
    // Handle bye if needed
    if (playerCount % 2 !== 0) {
      const byePlayer = this.players[playerCount - 1];
      matches.push({
        id: `R1-M${matchCount+1}`,
        round: 1,
        player1: byePlayer.id,
        player2: null, // Bye
        winner: byePlayer.id, // Auto-win
        status: 'completed'
      });
      
      // Update player stats
      byePlayer.wins += 1;
      byePlayer.points += 3;
    }
    
    this.matches = matches;
  }
  
  initializeLeagueMatches() {
    // In league format, everyone plays against everyone else
    this.currentRound = 1;
    const matches = [];
    let matchId = 1;
    
    for (let i = 0; i < this.players.length; i++) {
      for (let j = i + 1; j < this.players.length; j++) {
        matches.push({
          id: `M${matchId++}`,
          round: 1, // All matches are same round in league
          player1: this.players[i].id,
          player2: this.players[j].id,
          winner: null,
          status: 'pending'
        });
      }
    }
    
    this.matches = matches;
  }
  
  recordMatchResult(matchId, winnerId) {
    const match = this.matches.find(m => m.id === matchId);
    if (!match || match.status === 'completed') return false;
    
    // Ensure winner is one of the match participants
    if (winnerId !== match.player1 && winnerId !== match.player2) return false;
    
    // Update match result
    match.winner = winnerId;
    match.status = 'completed';
    
    // Update player stats
    const winner = this.players.find(p => p.id === winnerId);
    const loserId = winnerId === match.player1 ? match.player2 : match.player1;
    const loser = this.players.find(p => p.id === loserId);
    
    if (winner) {
      winner.wins += 1;
      winner.points += 3;
    }
    
    if (loser) {
      loser.losses += 1;
    }
    
    // Check if all matches in current round are completed
    if (this.format === 'elimination') {
      const roundMatches = this.matches.filter(m => m.round === this.currentRound);
      const allCompleted = roundMatches.every(m => m.status === 'completed');
      
      if (allCompleted) {
        // Create next round matches
        this.advanceToNextRound();
      }
    }
    
    // Check if tournament is completed
    this.checkTournamentCompletion();
    
    return true;
  }
  
  advanceToNextRound() {
    const currentRoundMatches = this.matches.filter(m => m.round === this.currentRound);
    const winners = currentRoundMatches.map(m => m.winner).filter(Boolean);
    
    if (winners.length <= 1) {
      // Tournament is over or invalid state
      return;
    }
    
    // Create next round matches
    this.currentRound++;
    const newMatches = [];
    
    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        newMatches.push({
          id: `R${this.currentRound}-M${Math.floor(i/2) + 1}`,
          round: this.currentRound,
          player1: winners[i],
          player2: winners[i+1],
          winner: null,
          status: 'pending'
        });
      } else {
        // Odd number of winners, give one a bye
        newMatches.push({
          id: `R${this.currentRound}-M${Math.floor(i/2) + 1}`,
          round: this.currentRound,
          player1: winners[i],
          player2: null,
          winner: winners[i],
          status: 'completed'
        });
        
        // Update player stats for bye
        const byePlayer = this.players.find(p => p.id === winners[i]);
        if (byePlayer) {
          byePlayer.wins += 1;
          byePlayer.points += 3;
        }
      }
    }
    
    this.matches = this.matches.concat(newMatches);
  }
  
  checkTournamentCompletion() {
    // For elimination, tournament is complete when we have only one undefeated player
    if (this.format === 'elimination') {
      // Check if we've reached the final
      const finalMatch = this.matches.find(m => 
        m.round === this.currentRound && 
        !this.matches.some(otherMatch => otherMatch.round > m.round)
      );
      
      if (finalMatch && finalMatch.status === 'completed') {
        this.status = 'completed';
        // Update standings
        this.updateFinalStandings();
        return true;
      }
    } 
    // For league, tournament is complete when all matches are completed
    else if (this.format === 'league') {
      const allCompleted = this.matches.every(m => m.status === 'completed');
      if (allCompleted) {
        this.status = 'completed';
        // Update standings
        this.updateFinalStandings();
        return true;
      }
    }
    
    return false;
  }
  
  updateFinalStandings() {
    // Sort players by points, then wins
    this.standings = [...this.players].sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      if (a.wins !== b.wins) return b.wins - a.wins;
      return b.losses - a.losses; // fewer losses is better
    });
    
    // Award season points for tournament performance
    for (let i = 0; i < this.standings.length && i < 3; i++) {
      const player = this.standings[i];
      // Add to player's progression data
      if (playerProgression.has(player.id)) {
        const progression = playerProgression.get(player.id);
        const seasonPoints = [100, 75, 50][i]; // 1st, 2nd, 3rd place points
        progression.seasonPoints += seasonPoints;
        
        // Update tournament wins achievement tracking
        progression.tournamentWins = (progression.tournamentWins || 0) + (i === 0 ? 1 : 0);
        
        // Grant XP
        progression.xp += seasonPoints;
        
        // Save updated progression
        playerProgression.set(player.id, progression);
        
        // Check for new achievements
        checkAndAwardAchievements(player.id);
      }
    }
  }
  
  shuffleArray(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  getStandings() {
    if (this.status === 'completed') {
      return this.standings;
    }
    
    // For ongoing tournaments, calculate current standings
    return [...this.players].sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      if (a.wins !== b.wins) return b.wins - a.wins;
      return b.losses - a.losses;
    });
  }
  
  getRemainingMatches() {
    return this.matches.filter(m => m.status === 'pending');
  }
  
  getBracketDisplay() {
    // For elimination tournaments, display the bracket
    if (this.format !== 'elimination') return null;
    
    // Organize matches by round
    const rounds = {};
    for (const match of this.matches) {
      if (!rounds[match.round]) rounds[match.round] = [];
      rounds[match.round].push(match);
    }
    
    // Generate bracket text
    let bracketText = `🏆 ${this.name} - Bracket:\n\n`;
    
    for (let round = 1; round <= this.currentRound; round++) {
      bracketText += `Round ${round}:\n`;
      
      if (rounds[round]) {
        for (const match of rounds[round]) {
          const player1 = this.players.find(p => p.id === match.player1)?.name || 'Unknown';
          const player2 = match.player2 ? (this.players.find(p => p.id === match.player2)?.name || 'Unknown') : 'BYE';
          
          if (match.status === 'completed') {
            const winner = this.players.find(p => p.id === match.winner)?.name || 'Unknown';
            bracketText += `  ${player1} vs ${player2} ➔ ${winner} wins!\n`;
          } else {
            bracketText += `  ${player1} vs ${player2} (pending)\n`;
          }
        }
      }
      
      bracketText += '\n';
    }
    
    return bracketText;
  }
}

// Game room class
class GameRoom {
  constructor(threadId, maxPlayers = MAX_PLAYERS, options = {}) {
    this.threadId = threadId;
    this.players = []; // Array of Car objects
    this.started = false;
    this.obstacles = [];
    this.turn = 0;
    this.lastMessageId = null;
    this.maxPlayers = maxPlayers; // Số lượng người chơi tối đa
    this.creator = null; // ID của người tạo phòng
    this.stopVotes = new Set(); // Danh sách người vote stop
    
    // Thông tin cho đua nhiều vòng (multi-lap)
    this.lapProgress = []; // Số vòng đã hoàn thành của mỗi người chơi (index tương ứng với this.players)
    this.lapTimes = []; // Thời gian hoàn thành mỗi vòng đua (số lượt)
    this.fastestLapPlayer = null; // Người chơi có vòng đua nhanh nhất
    this.fastestLapTime = null; // Thời gian vòng đua nhanh nhất
    
    // Race configuration options
    this.options = {
      botDifficulty: options.botDifficulty || 'normal',
      weatherEnabled: options.weatherEnabled !== undefined ? options.weatherEnabled : true,
      trackType: options.trackType || this.getRandomTrackType(),
      tournamentMatch: options.tournamentMatch || null, // Set if this is part of a tournament
      laps: options.laps || 1, // Number of laps to complete race (1-5)
      driftMode: options.driftMode || false, // Chế độ drift (trượt)
      obstacleCount: options.obstacleCount || 5, // Số lượng chướng ngại vật
      seasonPoints: options.seasonPoints || true // Whether to award season points
    };
    
    // Dynamic weather system
    this.currentWeather = 'clear'; // Start with clear weather
    this.weatherChangeChance = 0.2; // 20% chance per turn to change weather
    this.lastWeatherChange = 0;
    this.lapProgress = Array(maxPlayers).fill(0); // Track laps for each player
    
    // Race statistics for achievements and XP
    this.raceStats = {
      startTime: null,
      positions: {}, // Track position changes for comeback achievements
      lastPlace: null
    };
  }

  getRandomTrackType() {
    const trackTypes = [
      "city", "desert", "mountain", "space", "beach", "snow"
    ];
    return trackTypes[Math.floor(Math.random() * trackTypes.length)];
  }
  
  getRandomWeather(currentTrack) {
    // Different probabilities based on track type
    const weatherWeights = {
      city: { clear: 0.4, rainy: 0.3, foggy: 0.2, night: 0.1 },
      desert: { clear: 0.3, sunny: 0.4, sandstorm: 0.2, night: 0.1 },
      mountain: { clear: 0.3, foggy: 0.3, snowy: 0.3, night: 0.1 },
      space: { clear: 0.6, night: 0.4 },
      beach: { clear: 0.5, sunny: 0.3, rainy: 0.1, night: 0.1 },
      snow: { clear: 0.2, snowy: 0.5, foggy: 0.2, night: 0.1 }
    };
    
    // Get weights for current track
    const weights = weatherWeights[currentTrack] || 
                    { clear: 0.6, rainy: 0.1, foggy: 0.1, sunny: 0.1, night: 0.1 };
    
    // Convert weights to ranges
    const weatherOptions = Object.keys(weights);
    const ranges = [];
    let cumulative = 0;
    
    for (const weather of weatherOptions) {
      cumulative += weights[weather];
      ranges.push({ weather, value: cumulative });
    }
    
    // Generate random value and find corresponding weather
    const rand = Math.random();
    for (const range of ranges) {
      if (rand <= range.value) return range.weather;
    }
    
    return 'clear'; // Default fallback
  }

  setCreator(playerId) {
    this.creator = playerId;
  }

  addPlayer(playerId, name) {
    if (this.players.length >= this.maxPlayers) return false;
    if (this.players.some(p => p.playerId === playerId)) return false;
    
    try {
      // Create player car with progression-based customization
      const newCar = new Car(playerId, name || `Player ${this.players.length + 1}`);
      
      // If player has progression data, apply car customizations
      const playerData = getOrCreatePlayerProgression(playerId, name);
      if (playerData) {
        // Apply car customizations based on player's level
        this.applyPlayerCustomizations(newCar, playerData);
      }
      
      this.players.push(newCar);
      
      // Nếu chưa có người tạo phòng, người đầu tiên tham gia sẽ là chủ phòng
      if (!this.creator) {
        this.setCreator(playerId);
      }
      
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm người chơi:", error.message);
      return false;
    }
  }
  
  applyPlayerCustomizations(car, progression) {
    try {
      // Apply customizations based on player's saved preferences and level
      if (!progression.car) return;
      
      const playerLevel = progression.level || 1;
      
      // Apply color if unlocked
      if (progression.car.color && CAR_CUSTOMIZATIONS.colors) {
        const colorItem = CAR_CUSTOMIZATIONS.colors.find(c => c.id === progression.car.color);
        if (colorItem && playerLevel >= colorItem.unlockLevel) {
          car.setCustomization('color', progression.car.color);
        }
      }
      
      // Mapping của các loại phụ tùng trong constants
      const customizationMap = {
        'decal': 'decals',
        'wheels': 'wheels',
        'spoiler': 'spoilers',
        'nitro': 'nitros'
      };
      
      // Apply other customizations if unlocked
      for (const [part, collectionName] of Object.entries(customizationMap)) {
        if (progression.car[part] && CAR_CUSTOMIZATIONS[collectionName]) {
          const partItem = CAR_CUSTOMIZATIONS[collectionName].find(p => p.id === progression.car[part]);
          if (partItem && playerLevel >= partItem.unlockLevel) {
            car.setCustomization(part, progression.car[part]);
          }
        }
      }
      
      // Xử lý các trường hợp đặc biệt như booster và engine
      // (có thể thay thế booster = nitro, engine = không có)
      if (progression.car.booster && CAR_CUSTOMIZATIONS.nitros) {
        const boosterItem = CAR_CUSTOMIZATIONS.nitros.find(p => p.id === progression.car.booster);
        if (boosterItem && playerLevel >= boosterItem.unlockLevel) {
          car.setCustomization('nitro', progression.car.booster);
        }
      }
      
      // Apply stats to the car
      car.applyCustomizationStats();
    } catch (error) {
      console.error("Lỗi khi áp dụng tùy chỉnh cho xe:", error.message);
    }
  }

  addBot(difficulty = null) {
    if (this.players.length >= this.maxPlayers) return false;
    
    try {
      // Use specified difficulty or room default
      const botDifficulty = difficulty || this.options.botDifficulty;
      
      const botId = `bot-${Date.now()}`;
      const botName = `Bot ${this.players.filter(p => p.isBot).length + 1}`;
      
      // Create bot with specified difficulty
      const botCar = new Car(botId, botName, true, botDifficulty);
      
      // Apply customizations based on difficulty
      if (botDifficulty === 'hard' || botDifficulty === 'expert') {
        // Higher difficulty bots get better cars
        botCar.setCustomization('color', 'red');
        botCar.setCustomization('decal', 'flames');
        botCar.setCustomization('wheels', 'racing');
        
        // Thay booster bằng nitro nếu có
        if (CAR_CUSTOMIZATIONS.nitros) {
          const nitroPro = CAR_CUSTOMIZATIONS.nitros.find(n => n.id === 'pro' || n.id === 'advanced');
          if (nitroPro) {
            botCar.setCustomization('nitro', nitroPro.id);
          }
        }
        
        // Áp dụng spoiler nếu có
        if (CAR_CUSTOMIZATIONS.spoilers) {
          const spoiler = CAR_CUSTOMIZATIONS.spoilers.find(s => s.id !== 'none');
          if (spoiler) {
            botCar.setCustomization('spoiler', spoiler.id);
          }
        }
      }
      
      this.players.push(botCar);
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm bot:", error.message);
      return false;
    }
  }

  removePlayer(playerId) {
    const initialLength = this.players.length;
    const isCreator = this.creator === playerId;
    
    this.players = this.players.filter(player => player.playerId !== playerId);
    
    // Nếu người tạo phòng rời đi, chọn người mới làm chủ phòng
    if (isCreator && this.players.length > 0) {
      const nonBotPlayers = this.players.filter(p => !p.isBot);
      if (nonBotPlayers.length > 0) {
        this.setCreator(nonBotPlayers[0].playerId);
      }
    }
    
    // Xóa vote stop của người rời phòng
    this.stopVotes.delete(playerId);
    
    return initialLength !== this.players.length;
  }

  start() {
    if (this.players.length === 0) return false;
    
    this.started = true;
    this.raceStats.startTime = new Date();
    
    // Apply initial weather effects to cars if weather is enabled
    if (this.options.weatherEnabled && this.currentWeather !== 'clear') {
      for (const player of this.players) {
        player.applyWeatherEffects(this.currentWeather);
      }
    }
    
    // Initialize lap tracking (for multi-lap races)
    this.lapProgress = this.players.map(() => 0);
    
    return true;
  }
  
  updateWeather() {
    // Only update weather if enabled and not too soon after last change
    if (!this.options.weatherEnabled || this.turn - this.lastWeatherChange < 3) {
      return false;
    }
    
    // Random chance to change weather
    if (Math.random() < this.weatherChangeChance) {
      // Get new weather, ensuring it's different from current
      let newWeather;
      do {
        newWeather = this.getRandomWeather(this.options.trackType);
      } while (newWeather === this.currentWeather);
      
      // Update weather and apply effects
      this.currentWeather = newWeather;
      this.lastWeatherChange = this.turn;
      
      // Apply weather effects to all cars
      for (const player of this.players) {
        player.applyWeatherEffects(this.currentWeather);
      }
      
      return true;
    }
    
    return false;
  }

  voteStop(playerId) {
    // Chỉ có thể vote stop khi đã bắt đầu
    if (!this.started) return false;
    
    this.stopVotes.add(playerId);
    
    // Kiểm tra xem đã có >= 50% số người chơi đồng ý dừng chưa
    const humanPlayers = this.players.filter(p => !p.isBot).length;
    return this.stopVotes.size >= Math.ceil(humanPlayers / 2);
  }

  isFinished() {
    // For multi-lap races, check if any player has completed all laps
    if (this.options.laps > 1) {
      return this.players.some((player, index) => {
        // When a player crosses the finish line
        if (player.position >= TRACK_LENGTH) {
          // Increment lap counter
          this.lapProgress[index]++;
          
          // Reset position for next lap
          if (this.lapProgress[index] < this.options.laps) {
            player.position = 0;
            return false;
          }
          
          return this.lapProgress[index] >= this.options.laps;
        }
        return false;
      });
    }
    
    // Single lap race - standard finish condition
    return this.players.some(player => player.position >= TRACK_LENGTH);
  }

  getWinner() {
    // For multi-lap races
    if (this.options.laps > 1) {
      const winnerIndex = this.lapProgress.findIndex(laps => laps >= this.options.laps);
      if (winnerIndex !== -1) {
        return this.players[winnerIndex];
      }
      return null;
    }
    
    // Single lap race
    return this.players.find(player => player.position >= TRACK_LENGTH);
  }
  
  // Track positions for comeback achievement and lap records
  updatePositionTracking() {
    // Sort players by position
    const sortedPlayers = [...this.players].sort((a, b) => b.position - a.position);
    
    // Record position for each player
    for (let i = 0; i < sortedPlayers.length; i++) {
      const player = sortedPlayers[i];
      const playerIndex = this.players.indexOf(player);
      
      if (!this.raceStats.positions[player.playerId]) {
        this.raceStats.positions[player.playerId] = [];
      }
      
      // Record position (1-based)
      this.raceStats.positions[player.playerId].push(i + 1);
      
      // Check if player was in last place
      if (i === sortedPlayers.length - 1) {
        this.raceStats.lastPlace = player.playerId;
      }
      
      // Track lap completion for multi-lap races
      if (this.options.laps > 1 && player.position >= TRACK_LENGTH) {
        // Khi người chơi hoàn thành một vòng đua
        const currentLap = this.lapProgress[playerIndex];
        
        // Tính thời gian vòng đua
        const lapStartTurn = currentLap === 0 ? 0 : this.lapTimes.reduce((sum, times) => sum + (times[playerIndex] || 0), 0);
        const lapTime = this.turn - lapStartTurn;
        
        // Lưu thông tin vòng đua
        if (!this.lapTimes[currentLap]) {
          this.lapTimes[currentLap] = [];
        }
        this.lapTimes[currentLap][playerIndex] = lapTime;
        
        // Kiểm tra vòng đua nhanh nhất
        if (!this.fastestLapTime || lapTime < this.fastestLapTime) {
          this.fastestLapTime = lapTime;
          this.fastestLapPlayer = player.playerId;
          
          // Thông báo vòng đua nhanh nhất
          return {
            type: "fastestLap",
            player: player.name,
            lapTime: lapTime,
            lap: currentLap + 1
          };
        }
        
        // Tăng số vòng đua đã hoàn thành
        this.lapProgress[playerIndex]++;
        
        // Đặt lại vị trí cho vòng đua tiếp theo
        if (this.lapProgress[playerIndex] < this.options.laps) {
          player.position = 0;
          
          // Thông báo hoàn thành vòng đua
          return {
            type: "lapCompleted",
            player: player.name,
            lap: this.lapProgress[playerIndex],
            totalLaps: this.options.laps
          };
        }
      }
    }
    
    // Không có sự kiện vòng đua đặc biệt
    return null;
  }
  
  // Handle win effects, including achievements, XP, and stats
  handleRaceCompletion(winner) {
    if (!winner) return;
    
    try {
      // Prepare race statistics summary for all players
      const raceStats = this.generateRaceStats();
      
      // Only record progression stats for human players
      if (!winner.isBot) {
        // Check if player had a comeback (was last at some point)
        const hadComeback = this.raceStats.lastPlace === winner.playerId;
        winner.hadComeback = winner.hadComeback || hadComeback;
        
        // Get player progression using function from module
        const progression = getOrCreatePlayerProgression(winner.playerId, winner.name);
        if (progression) {
          // Initialize weatherWins if needed
          if (!progression.weatherWins) progression.weatherWins = {};
          
          // Record win in this weather
          progression.weatherWins[this.currentWeather] = true;
          
          // Award XP
          const xpGained = winner.getWinXP(this);
          progression.xp += xpGained;
          
          // Update win streak
          progression.streak = (progression.streak || 0) + 1;
          winner.streak = progression.streak;
          
          // Check for level up
          const previousLevel = progression.level || 1;
          progression.level = this.calculateLevel(progression.xp);
          
          // Get newly unlocked items
          const unlockedItems = this.getNewlyUnlockedItems(previousLevel, progression.level);
          
          // Apply stat updates
          if (!progression.stats) progression.stats = { 
            wins: 0, 
            races: 0, 
            bestTime: null,
            fastestLaps: {},
            totalOvertakes: 0,
            skillsUsed: 0,
            highestSpeed: 0
          };
          
          progression.stats.wins++;
          progression.stats.races++;
          
          // Track best time
          const raceTime = this.turn;
          if (!progression.stats.bestTime || raceTime < progression.stats.bestTime) {
            progression.stats.bestTime = raceTime;
          }
          
          // Track fastest lap if this player set one
          if (this.fastestLapPlayer === winner.playerId && this.fastestLapTime) {
            const trackKey = this.options.trackType || 'default';
            if (!progression.stats.fastestLaps[trackKey] || 
                this.fastestLapTime < progression.stats.fastestLaps[trackKey]) {
              progression.stats.fastestLaps[trackKey] = this.fastestLapTime;
            }
          }
          
          // Add other race stats
          progression.stats.totalOvertakes = (progression.stats.totalOvertakes || 0) + winner.overtakes;
          progression.stats.skillsUsed = (progression.stats.skillsUsed || 0) + winner.skillsUsed;
          
          // Track highest speed ever reached
          if (winner.highestSpeed > (progression.stats.highestSpeed || 0)) {
            progression.stats.highestSpeed = winner.highestSpeed;
          }
          
          // Award season points if enabled
          if (this.options.seasonPoints) {
            progression.seasonPoints = (progression.seasonPoints || 0) + 50;
          }
          
          // Lưu dữ liệu của người chơi
          savePlayerData();
          
          // Tournament match handling
          if (this.options.tournamentMatch) {
            const { tournamentId, matchId } = this.options.tournamentMatch;
            const tournament = tournaments.get(tournamentId);
            
            if (tournament) {
              tournament.recordMatchResult(matchId, winner.playerId);
            }
          }
          
          // Check for achievements
          checkAndAwardAchievements(winner.playerId);
          
          // Return win summary with detailed race stats
          return {
            xpGained,
            levelUp: previousLevel !== progression.level,
            newLevel: progression.level,
            unlockedItems,
            seasonPoints: progression.seasonPoints,
            streak: progression.streak,
            raceStats: raceStats
          };
        }
      }
      
      // Return race stats even for bot winners
      return { raceStats };
    } catch (error) {
      console.error("Lỗi khi xử lý kết thúc đua:", error.message);
      return { error: true, message: "Đã xảy ra lỗi khi xử lý kết quả đua" };
    }
  }
  
  // Generate detailed race statistics for all players
  generateRaceStats() {
    // Sort players by final position
    const finalRanking = [...this.players].sort((a, b) => {
      // Multi-lap races sort by lap progress first
      if (this.options.laps > 1) {
        const aLap = this.lapProgress[this.players.indexOf(a)] || 0;
        const bLap = this.lapProgress[this.players.indexOf(b)] || 0;
        if (aLap !== bLap) return bLap - aLap;
      }
      // Then by position on track
      return b.position - a.position;
    });
    
    // Generate stats for each player
    const playerStats = finalRanking.map((player, index) => {
      const playerIndex = this.players.indexOf(player);
      
      // Calculate average speed
      const avgSpeed = player.totalSpeed / Math.max(1, this.turn);
      
      // Get lap times if available
      const lapTimes = [];
      if (this.options.laps > 1) {
        for (let i = 0; i < Math.min(this.lapProgress[playerIndex], this.options.laps); i++) {
          if (this.lapTimes[i] && this.lapTimes[i][playerIndex]) {
            lapTimes.push(this.lapTimes[i][playerIndex]);
          }
        }
      }
      
      // Determine if this player set the fastest lap
      const hadFastestLap = this.fastestLapPlayer === player.playerId;
      
      return {
        name: player.name,
        isBot: player.isBot,
        rank: index + 1,
        lapProgress: this.options.laps > 1 ? this.lapProgress[playerIndex] : 0,
        averageSpeed: avgSpeed.toFixed(1),
        highestSpeed: player.highestSpeed.toFixed(1),
        overtakes: player.overtakes,
        skillsUsed: player.skillsUsed,
        boostTime: player.boostTime,
        lapTimes: lapTimes,
        fastestLap: hadFastestLap ? this.fastestLapTime : null,
        raceCompleted: this.options.laps > 1 
          ? this.lapProgress[playerIndex] >= this.options.laps
          : player.position >= TRACK_LENGTH
      };
    });
    
    // Complete race summary
    return {
      trackType: this.options.trackType,
      weather: this.currentWeather,
      totalTurns: this.turn,
      laps: this.options.laps,
      players: playerStats,
      fastestLap: this.fastestLapTime ? {
        player: this.players.find(p => p.playerId === this.fastestLapPlayer)?.name || 'Unknown',
        time: this.fastestLapTime
      } : null
    };
  }
  
  calculateLevel(xp) {
    // Find the highest level that the player has enough XP for
    for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= XP_LEVELS[i].xpNeeded) {
        return XP_LEVELS[i].level;
      }
    }
    return 1; // Default level
  }
  
  getNewlyUnlockedItems(oldLevel, newLevel) {
    if (oldLevel >= newLevel) return [];
    
    const unlockedItems = [];
    
    // Find all items unlocked between old and new levels
    for (const category in CAR_CUSTOMIZATIONS) {
      for (const item of CAR_CUSTOMIZATIONS[category]) {
        if (item.unlockLevel > oldLevel && item.unlockLevel <= newLevel) {
          unlockedItems.push({
            type: category,
            id: item.id,
            name: item.name
          });
        }
      }
    }
    
    return unlockedItems;
  }

  processBotMoves() {
    const botMoves = [];
    const botSkillUses = [];
    
    for (const player of this.players) {
      if (player.isBot) {
        const move = player.getBotMove(this);
        
        if (move === "skill") {
          const skillResult = player.useSkill(this);
          botSkillUses.push({player: player.name, skillResult});
          
          // Sau khi dùng skill, bot vẫn di chuyển bình thường
          const normalMove = player.getBotMove(this);
          if (normalMove && normalMove !== "skill") {
            player.move(normalMove, this);
            botMoves.push({player: player.name, move: normalMove});
          }
        } else if (move) {
          player.move(move, this);
          botMoves.push({player: player.name, move});
        }
        
        // Kiểm tra va chạm với chướng ngại vật
        player.checkObstacleCollisions(this);
      }
    }
    
    return { moves: botMoves, skillUses: botSkillUses };
  }
  
  getPlayerInfo(playerId) {
    const player = this.players.find(p => p.playerId === playerId);
    if (!player) return null;
    
    return player.getInfo();
  }
  
  // Lấy thứ hạng của người chơi trong đường đua (1 là cao nhất)
  getPlayerRank(playerId) {
    const player = this.players.find(p => p.playerId === playerId);
    if (!player) return null;
    
    // Sắp xếp người chơi theo vị trí
    const sortedPlayers = [...this.players].sort((a, b) => b.position - a.position);
    
    // Tìm vị trí của người chơi trong danh sách đã sắp xếp (thứ hạng)
    return sortedPlayers.findIndex(p => p.playerId === playerId) + 1;
  }
  
  // Cập nhật vị trí theo dõi cho mọi người chơi
  updatePositionTracking() {
    // Sắp xếp người chơi theo vị trí
    const sortedPlayers = [...this.players].sort((a, b) => b.position - a.position);
    
    // Cập nhật vị trí cho mỗi người chơi
    for (let i = 0; i < sortedPlayers.length; i++) {
      const player = sortedPlayers[i];
      // Ghi lại vị trí hiện tại để phát hiện sự thay đổi vị trí
      player.raceMetrics.positionHistory.push(i + 1);
      
      // Kiểm tra sự kiện "comeback" - bắt đầu ở vị trí cuối và vượt lên trên
      if (player.raceMetrics.positionHistory.length > 5 &&
          player.raceMetrics.positionHistory[0] === sortedPlayers.length &&
          (i + 1) <= Math.ceil(sortedPlayers.length / 2)) {
        player.hadComeback = true;
      }
    }
  }
  
  getAllPlayersInfo() {
    return this.players.map(player => player.getInfo());
  }
  
  // Get information about current race and room
  getRaceInfo() {
    // Sort players by position
    const sortedPlayers = [...this.players].sort((a, b) => b.position - a.position);
    
    // Tính thông tin vòng đua nhanh nhất
    let fastestLapInfo = null;
    if (this.fastestLapPlayer) {
      const fastestPlayer = this.players.find(p => p.playerId === this.fastestLapPlayer);
      if (fastestPlayer) {
        fastestLapInfo = {
          player: fastestPlayer.name,
          time: this.fastestLapTime,
          isBot: fastestPlayer.isBot
        };
      }
    }
    
    return {
      // Thông tin chung về đường đua
      track: this.options.trackType,
      weather: this.currentWeather,
      weatherIcon: WEATHER_TYPES[this.currentWeather]?.icon || "☀️",
      turn: this.turn,
      laps: this.options.laps,
      lapProgress: this.lapProgress,
      
      // Thông tin thời tiết và điều kiện đua
      driftMode: this.options.driftMode,
      obstacleCount: this.obstacles.length,
      weatherCondition: WEATHER_TYPES[this.currentWeather]?.description || "Trời quang đãng",
      
      // Thông tin vòng đua nhanh nhất
      fastestLap: fastestLapInfo,
      
      // Danh sách người chơi và thông tin chi tiết
      players: sortedPlayers.map((player, index) => {
        const playerIndex = this.players.indexOf(player);
        
        return {
          name: player.name,
          position: player.position,
          lap: this.lapProgress[playerIndex],
          rank: index + 1,
          isBot: player.isBot,
          
          // Thông tin hiệu suất chi tiết
          stats: {
            currentSpeed: player.speed.toFixed(1),
            highestSpeed: player.highestSpeed.toFixed(1),
            averageSpeed: player.totalSpeed > 0 ? (player.totalSpeed / this.turn).toFixed(1) : "0.0",
            overtakes: player.overtakes,
            boostTime: player.boostTime,
            skillsUsed: player.skillsUsed
          },
          
          // Thông tin kỹ năng
          skill: {
            name: player.skill.displayName,
            ready: player.skill.cooldownRemaining === 0
          },
          
          // Trạng thái và hiệu ứng
          effects: player.effects.map(e => e.type),
          health: player.health
        };
      })
    };
  }
}

// Game state
const rooms = new Map(); // threadID -> GameRoom

// Track theme backgrounds
const TRACK_THEMES = {
  city: {
    bg: "#3A3B3C",
    lane: "#666666",
    divider: "#FFCC00",
    objects: (ctx, y, x) => {
      if (x % 5 === 0 && x < TRACK_LENGTH - 5) {
        // Building
        ctx.fillStyle = "#888888";
        ctx.fillRect(x * CELL_WIDTH + 5, y - 15, 10, 15);
        
        // Windows
        ctx.fillStyle = "#FFFF99";
        ctx.fillRect(x * CELL_WIDTH + 7, y - 13, 2, 2);
        ctx.fillRect(x * CELL_WIDTH + 11, y - 13, 2, 2);
        ctx.fillRect(x * CELL_WIDTH + 7, y - 9, 2, 2);
        ctx.fillRect(x * CELL_WIDTH + 11, y - 9, 2, 2);
      }
    }
  },
  desert: {
    bg: "#E2B06E",
    lane: "#D2956B",
    divider: "#C17F5C",
    objects: (ctx, y, x) => {
      if (x % 7 === 0 && x < TRACK_LENGTH - 3) {
        // Cactus
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(x * CELL_WIDTH + 5, y - 10, 5, 10);
        ctx.fillRect(x * CELL_WIDTH + 2, y - 7, 5, 3);
      }
    }
  },
  mountain: {
    bg: "#817979",
    lane: "#5D4037",
    divider: "#3E2723",
    objects: (ctx, y, x) => {
      if (x % 8 === 0 && x < TRACK_LENGTH - 4) {
        // Mountain peak
        ctx.fillStyle = "#9E9E9E";
        ctx.beginPath();
        ctx.moveTo(x * CELL_WIDTH, y);
        ctx.lineTo(x * CELL_WIDTH + 20, y);
        ctx.lineTo(x * CELL_WIDTH + 10, y - 15);
        ctx.closePath();
        ctx.fill();
        
        // Snow cap
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(x * CELL_WIDTH + 5, y - 5);
        ctx.lineTo(x * CELL_WIDTH + 15, y - 5);
        ctx.lineTo(x * CELL_WIDTH + 10, y - 15);
        ctx.closePath();
        ctx.fill();
      }
    }
  },
  space: {
    bg: "#000033",
    lane: "#000066",
    divider: "#4D4DFF",
    objects: (ctx, y, x) => {
      if (x % 3 === 0 && x < TRACK_LENGTH) {
        // Stars
        ctx.fillStyle = "#FFFFFF";
        const starSize = Math.random() < 0.3 ? 2 : 1;
        ctx.fillRect(x * CELL_WIDTH + Math.random() * 20, 
                    y - 20 + Math.random() * 20, 
                    starSize, starSize);
      }
      
      if (x % 15 === 0 && x < TRACK_LENGTH - 6) {
        // Planet
        ctx.fillStyle = ["#FF9800", "#E91E63", "#9C27B0"][Math.floor(Math.random() * 3)];
        ctx.beginPath();
        ctx.arc(x * CELL_WIDTH + 10, y - 15, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  beach: {
    bg: "#87CEEB",
    lane: "#F4A460",
    divider: "#D2B48C",
    objects: (ctx, y, x) => {
      if (x % 10 === 0 && x < TRACK_LENGTH - 3) {
        // Palm tree
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(x * CELL_WIDTH + 8, y - 15, 4, 15);
        
        // Leaves
        ctx.fillStyle = "#2E8B57";
        ctx.beginPath();
        ctx.moveTo(x * CELL_WIDTH + 10, y - 15);
        ctx.lineTo(x * CELL_WIDTH + 15, y - 22);
        ctx.lineTo(x * CELL_WIDTH + 5, y - 22);
        ctx.closePath();
        ctx.fill();
      }
    }
  },
  snow: {
    bg: "#E0F7FA",
    lane: "#FFFFFF",
    divider: "#B0BEC5",
    objects: (ctx, y, x) => {
      if (x % 12 === 0 && x < TRACK_LENGTH - 3) {
        // Snow man
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x * CELL_WIDTH + 10, y - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x * CELL_WIDTH + 10, y - 17, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes and buttons
        ctx.fillStyle = "#000000";
        ctx.fillRect(x * CELL_WIDTH + 8, y - 18, 1, 1);
        ctx.fillRect(x * CELL_WIDTH + 12, y - 18, 1, 1);
        ctx.fillRect(x * CELL_WIDTH + 10, y - 10, 1, 1);
        ctx.fillRect(x * CELL_WIDTH + 10, y - 8, 1, 1);
      }
      
      // Occasional snowflakes
      if (Math.random() < 0.05) {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x * CELL_WIDTH + Math.random() * CELL_WIDTH, 
                y - Math.random() * 30, 
                1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
};

// Helper functions
function drawCarShape(ctx, x, y, color, effects = [], customization = null) {
  // Save original ctx state
  ctx.save();
  
  // Apply low-framerate animation for "shaking" effect
  const effectsWithShake = ["emp", "crash", "collision"];
  if (effects.some(e => effectsWithShake.includes(e.type))) {
    const shakeAmount = 1.5;
    const xShake = Math.random() * shakeAmount * 2 - shakeAmount;
    const yShake = Math.random() * shakeAmount * 2 - shakeAmount;
    x += xShake;
    y += yShake;
  }
  
  // Draw Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(x + 10, y + 18, 12, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Base car shape
  ctx.fillStyle = color;
  
  // Create a more car-like shape instead of just a rectangle
  ctx.beginPath();
  ctx.moveTo(x, y + 5); // Front bottom
  ctx.lineTo(x + 18, y + 5); // Back bottom
  ctx.lineTo(x + 18, y + 10); // Back top
  ctx.lineTo(x + 14, y + 14); // Rear window
  ctx.lineTo(x + 8, y + 14); // Middle roof
  ctx.lineTo(x + 4, y + 10); // Front window
  ctx.closePath();
  ctx.fill();
  
  // Hood and trunk lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 10);
  ctx.lineTo(x + 4, y + 5);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 14);
  ctx.lineTo(x + 14, y + 5);
  ctx.stroke();
  
  // Wheels with custom color/design
  const wheelsColor = customization?.wheels?.color || "#000000";
  
  // Front wheel with visual design (rims)
  ctx.fillStyle = wheelsColor;
  ctx.beginPath();
  ctx.arc(x + 4, y + 16, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Back wheel with visual design
  ctx.beginPath();
  ctx.arc(x + 16, y + 16, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Wheel details (rims)
  ctx.fillStyle = "rgba(200, 200, 200, 0.8)";
  ctx.beginPath();
  ctx.arc(x + 4, y + 16, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x + 16, y + 16, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Windows
  ctx.fillStyle = "#ADD8E6";
  
  // Front windshield
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 10);
  ctx.lineTo(x + 8, y + 14);
  ctx.lineTo(x + 5, y + 14);
  ctx.lineTo(x + 4, y + 10);
  ctx.fill();
  
  // Back windshield
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 14);
  ctx.lineTo(x + 11, y + 14);
  ctx.lineTo(x + 14, y + 10);
  ctx.fill();
  
  // Side windows
  ctx.fillRect(x + 8, y + 10, 3, 4); // Side window
  
  // Headlights
  ctx.fillStyle = "#FFFF00";
  ctx.fillRect(x, y + 7, 1, 2); // Front light
  
  // Taillights
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x + 18, y + 7, 1, 2); // Back light
  
  // Car Booster (if customized)
  if (customization?.booster?.id && customization.booster.id !== 'none') {
    ctx.fillStyle = "#444444";
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 8);
    ctx.lineTo(x + 22, y + 7);
    ctx.lineTo(x + 22, y + 10);
    ctx.lineTo(x + 18, y + 9);
    ctx.closePath();
    ctx.fill();
  }
  
  // Apply decal if customized
  if (customization?.decal?.id && customization.decal.id !== 'none') {
    // Racing stripe
    if (customization.decal.id === 'racing_stripe') {
      ctx.fillStyle = customization.decal.color || "#FFFFFF";
      ctx.fillRect(x + 8, y + 5, 3, 9);
    } 
    // Flames
    else if (customization.decal.id === 'flames') {
      const flameColor = customization.decal.color || "#FF4500";
      ctx.fillStyle = flameColor;
      
      // Flame pattern
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 5); // Start at hood
      ctx.lineTo(x + 5, y + 3); // Up
      ctx.lineTo(x + 6, y + 5); // Down
      ctx.lineTo(x + 7, y + 2); // Up higher
      ctx.lineTo(x + 8, y + 5); // Down
      ctx.lineTo(x + 10, y + 3); // Up
      ctx.lineTo(x + 11, y + 5); // Back to base
      ctx.fill();
    }
    // Logo/number
    else if (customization.decal.id === 'number') {
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(x + 10, y + 9, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Number
      ctx.fillStyle = "#000000";
      ctx.font = "bold 4px Arial";
      ctx.textAlign = "center";
      ctx.fillText("1", x + 10, y + 10.5);
      ctx.textAlign = "left"; // Reset
    }
  }
  
  // EFFECTS SECTION
  
  // Boost/nitro effect
  if (effects.some(e => e.type === "boost" || e.type === "nitro")) {
    // Define flame colors
    const flameColors = ["#FF3D00", "#FF9100", "#FFEA00"];
    
    // Draw multiple flame shapes
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = flameColors[i % flameColors.length];
      
      // Randomize flame shape slightly
      const flameLength = 10 + Math.random() * 5;
      const flameWidth = 3 + Math.random() * 2;
      
      // Draw flame
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 7 + i * 2);  // Starting point
      ctx.lineTo(x - 4 - flameLength, y + 7 - flameWidth + i * 2); // Top point
      ctx.lineTo(x - 4 - flameLength * 0.7, y + 9 + i * 0.5); // Middle point
      ctx.lineTo(x - 4 - flameLength, y + 11 + flameWidth + i * 2); // Bottom point
      ctx.lineTo(x - 4, y + 9 + i * 2); // End point
      ctx.closePath();
      ctx.fill();
    }
    
    // Add some smoke particles
    ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
    for (let i = 0; i < 5; i++) {
      const smokeX = x - 15 - Math.random() * 10;
      const smokeY = y + 5 + Math.random() * 10;
      const smokeSize = 1 + Math.random() * 3;
      
      ctx.beginPath();
      ctx.arc(smokeX, smokeY, smokeSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Jump effect
  if (effects.some(e => e.type === "jump")) {
    // Car is higher when jumping
    y -= 5;
    
    // Larger shadow showing car is in the air
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 25, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Air movement lines
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([1, 1]);
    
    // Draw multiple air lines
    for (let i = 0; i < 3; i++) {
      const lineY = y + 8 + i * 3;
      ctx.beginPath();
      ctx.moveTo(x + 3, lineY);
      ctx.lineTo(x - 3, lineY);
      ctx.stroke();
    }
    
    ctx.setLineDash([]); // Reset line style
  }
  
  // Shield effect
  if (effects.some(e => e.type === "shield")) {
    // Animated shield bubble (pulsing)
    const pulse = 1 + Math.sin(Date.now() / 200) * 0.1;
    const radius = 15 * pulse;
    
    // Outer shield boundary
    ctx.strokeStyle = "#4FC3F7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner shield glow
    const gradient = ctx.createRadialGradient(
      x + 10, y + 10, 5,
      x + 10, y + 10, radius
    );
    gradient.addColorStop(0, "rgba(79, 195, 247, 0.1)");
    gradient.addColorStop(0.7, "rgba(79, 195, 247, 0.15)");
    gradient.addColorStop(1, "rgba(79, 195, 247, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight points around shield
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const dotX = x + 10 + Math.cos(angle) * radius;
      const dotY = y + 10 + Math.sin(angle) * radius;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // EMP effect
  if (effects.some(e => e.type === "emp")) {
    // Electric particles around the car
    ctx.strokeStyle = "#FFD600";
    ctx.lineWidth = 1;
    
    // Multiple lightning bolts
    for (let i = 0; i < 4; i++) {
      const startX = x + 5 + Math.random() * 10;
      const startY = y + 5 + Math.random() * 10;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Create zigzag pattern
      for (let j = 0; j < 3; j++) {
        const zigX = startX + (Math.random() * 10 - 5);
        const zigY = startY + (Math.random() * 10 - 5);
        ctx.lineTo(zigX, zigY);
      }
      
      ctx.stroke();
    }
    
    // Add electric glow
    ctx.fillStyle = "rgba(255, 214, 0, 0.2)";
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Slowed/brake effect
  if (effects.some(e => e.type === "slow" || e.type === "brake")) {
    // Brake lights effect
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x + 18, y + 7, 1, 2);
    
    // Brake tracks
    ctx.strokeStyle = "rgba(30, 30, 30, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 1]);
    
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 17);
    ctx.lineTo(x + 4 - 10, y + 17);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 17);
    ctx.lineTo(x + 16 - 10, y + 17);
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset dash
  }
  
  // Trap/damage effect
  if (effects.some(e => e.type === "trap" || e.type === "damage")) {
    // Smoke effect
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
    
    for (let i = 0; i < 5; i++) {
      const smokeX = x + 5 + Math.random() * 10;
      const smokeY = y + 2 + Math.random() * 5;
      const smokeSize = 1 + Math.random() * 2;
      
      ctx.beginPath();
      ctx.arc(smokeX, smokeY, smokeSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Damage marks on car
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 0.5;
    
    // Random scratch marks
    for (let i = 0; i < 3; i++) {
      const scratchX = x + 5 + Math.random() * 10;
      const scratchY = y + 5 + Math.random() * 7;
      
      ctx.beginPath();
      ctx.moveTo(scratchX, scratchY);
      ctx.lineTo(scratchX + 3, scratchY + 2);
      ctx.stroke();
    }
  }
  
  // Restore original context state
  ctx.restore();
}

function drawObstacle(ctx, x, y, type) {
  if (type === "trap") {
    // Fire trap
    const flameHeight = 10;
    
    // Flames
    ctx.fillStyle = "#FF5722";
    ctx.beginPath();
    ctx.moveTo(x, y + 20); // Left base
    ctx.lineTo(x + 5, y + 20 - flameHeight * 0.7); // First peak
    ctx.lineTo(x + 10, y + 20); // Middle valley
    ctx.lineTo(x + 15, y + 20 - flameHeight); // Highest peak
    ctx.lineTo(x + 20, y + 20); // Right base
    ctx.closePath();
    ctx.fill();
    
    // Inner flame (yellow)
    ctx.fillStyle = "#FFC107";
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 20);
    ctx.lineTo(x + 10, y + 20 - flameHeight * 0.5);
    ctx.lineTo(x + 15, y + 20);
    ctx.closePath();
    ctx.fill();
  }
}

function generateRaceCanvas(room) {
  const canvas = createCanvas(CANVAS_WIDTH, room.players.length * LANE_HEIGHT + 100); // More space for info
  const ctx = canvas.getContext("2d");
  
  // Get track theme
  const theme = TRACK_THEMES[room.options?.trackType || room.trackType] || TRACK_THEMES.city;
  
  // Background
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Apply weather visual effects to the canvas
  applyWeatherEffects(ctx, canvas.width, canvas.height, room.currentWeather);
  
  // Enhanced header with more info
  drawRaceHeader(ctx, room);
  
  // Draw track lanes
  for (let i = 0; i < room.players.length; i++) {
    const laneY = i * LANE_HEIGHT + 60; // More space at top for weather info
    
    // Lane background
    ctx.fillStyle = theme.lane;
    ctx.fillRect(0, laneY, TRACK_LENGTH * CELL_WIDTH, LANE_HEIGHT);
    
    // Lane divider
    ctx.strokeStyle = theme.divider;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]); // Dashed line
    ctx.beginPath();
    ctx.moveTo(0, laneY + LANE_HEIGHT / 2);
    ctx.lineTo(TRACK_LENGTH * CELL_WIDTH, laneY + LANE_HEIGHT / 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset to solid line
    
    // Add themed objects to track
    for (let x = 0; x < TRACK_LENGTH; x += 1) {
      theme.objects(ctx, laneY, x);
    }
    
    // Draw lap markers for multi-lap races
    if (room.options && room.options.laps > 1) {
      const lapMarkerX = 10;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 10px Arial";
      const currentLap = room.lapProgress ? (room.lapProgress[i] + 1) : 1;
      ctx.fillText(`Lap ${currentLap}/${room.options.laps}`, lapMarkerX, laneY + 12);
    }
  }
  
  // Draw finish line (checkered flag pattern)
  const finishX = TRACK_LENGTH * CELL_WIDTH;
  for (let i = 0; i < room.players.length; i++) {
    const y = i * LANE_HEIGHT + 60;
    
    // Checkered pattern
    for (let j = 0; j < LANE_HEIGHT; j += 5) {
      const isBlack = (j % 10) === 0;
      ctx.fillStyle = isBlack ? "#000000" : "#FFFFFF";
      ctx.fillRect(finishX, y + j, 5, 5);
      
      ctx.fillStyle = !isBlack ? "#000000" : "#FFFFFF";
      ctx.fillRect(finishX + 5, y + j, 5, 5);
    }
    
    // Finish line pole
    ctx.fillStyle = "#DDDDDD";
    ctx.fillRect(finishX + 10, y - 30, 3, 30 + LANE_HEIGHT);
    
    // Finish flag at top
    if (i === 0) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(finishX + 10, y - 40, 20, 15);
      
      // Checkered pattern on flag
      ctx.fillStyle = "#FFFFFF";
      for (let fx = 0; fx < 4; fx++) {
        for (let fy = 0; fy < 3; fy++) {
          if ((fx + fy) % 2 === 0) {
            ctx.fillRect(finishX + 10 + fx * 5, y - 40 + fy * 5, 5, 5);
          }
        }
      }
    }
  }
  
  // Draw obstacles
  for (const obstacle of room.obstacles) {
    const obstacleX = obstacle.position * CELL_WIDTH;
    
    // Find appropriate lane Y position (middle of track if can't find)
    let obstacleY = 60;
    if (obstacle.placedBy) {
      const playerIndex = room.players.findIndex(p => p.playerId === obstacle.placedBy);
      if (playerIndex >= 0) {
        obstacleY = playerIndex * LANE_HEIGHT + 60;
      }
    }
    
    drawObstacle(ctx, obstacleX, obstacleY, obstacle.type);
  }
  
  // Get players sorted by position
  const rankedPlayers = [...room.players].sort((a, b) => b.position - a.position);
  
  // Draw cars and player info
  for (let i = 0; i < room.players.length; i++) {
    const player = room.players[i];
    const y = i * LANE_HEIGHT + 60;
    const carX = player.position * CELL_WIDTH;
    
    // Get player's rank (position in race)
    const rank = rankedPlayers.findIndex(p => p.playerId === player.playerId) + 1;
    
    // Draw car with effects and customization
    drawCarShape(ctx, carX, y + 5, player.color, player.effects, player.customization);
    
    // Player rank indicator
    drawRankIndicator(ctx, carX, y - 15, rank);
    
    // Player status info
    const isBot = player.isBot ? "🤖 " : "";
    const botDifficulty = player.isBot && player.botSettings ? 
      ` (${player.botSettings.name})` : "";
    const speedIndicator = "⚡".repeat(Math.ceil(player.speed));
    
    // Skill indicator with advanced display
    const skillReady = player.skill.cooldownRemaining === 0 ? 
      "✅" : `🕒${player.skill.cooldownRemaining}`;
    const skillInfo = `${player.skill.displayName} ${skillReady}`;
    
    // Customization indicator
    let customizationIcons = "";
    if (player.customization) {
      if (player.customization.decal && player.customization.decal.id !== 'none') 
        customizationIcons += "🎨";
      if (player.customization.wheels && player.customization.wheels.id !== 'standard') 
        customizationIcons += "🛞";
      if (player.customization.booster && player.customization.booster.id !== 'none') 
        customizationIcons += "🔋";
      if (player.customization.engine && player.customization.engine.id !== 'standard') 
        customizationIcons += "⚙️";
    }
    
    // Health bar
    const healthWidth = 50;
    const healthHeight = 5;
    const healthX = carX - 15;
    const healthY = y - 7;
    
    // Health background
    ctx.fillStyle = "#444444";
    ctx.fillRect(healthX, healthY, healthWidth, healthHeight);
    
    // Health value
    const healthValue = Math.max(0, player.health);
    const healthColor = 
      healthValue > 70 ? "#4CAF50" :  // Green
      healthValue > 40 ? "#FFC107" :  // Yellow
      "#F44336";                     // Red
    
    ctx.fillStyle = healthColor;
    ctx.fillRect(healthX, healthY, (healthValue / 100) * healthWidth, healthHeight);
    
    // Player name and info
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 12px Arial";
    ctx.fillText(`${isBot}${player.name}${botDifficulty}`, 5, y + 12);
    
    ctx.font = "11px Arial";
    ctx.fillText(`${speedIndicator} ${skillInfo} ${customizationIcons}`, 5, y + 25);
    
    // Show last move with enhanced visual
    if (player.lastMove) {
      let moveIcon = "";
      let moveColor = "#FFFFFF";
      
      switch(player.lastMove) {
        case "right": 
          moveIcon = "➡️"; 
          moveColor = "#4CAF50";
          break;
        case "left": 
          moveIcon = "⬅️"; 
          moveColor = "#2196F3";
          break;
        case "boost": 
          moveIcon = "🚀"; 
          moveColor = "#FF9800";
          break;
        case "brake": 
          moveIcon = "🛑"; 
          moveColor = "#F44336";
          break;
        case "jump": 
          moveIcon = "⤴️"; 
          moveColor = "#9C27B0";
          break;
        case "skill": 
          moveIcon = "⚡"; 
          moveColor = "#FFEB3B";
          break;
        default: 
          moveIcon = player.lastMove;
      }
      
      // Draw move icon with background bubble
      ctx.fillStyle = moveColor;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(carX + 22, y + 8, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12px Arial";
      ctx.fillText(moveIcon, carX + 17, y + 12);
    }
  }
  
  return canvas;
}

// Helper function to draw weather effects
function applyWeatherEffects(ctx, width, height, weather) {
  if (!weather || !WEATHER_TYPES[weather]) return;
  
  const weatherInfo = WEATHER_TYPES[weather];
  
  switch(weather) {
    case 'rainy':
      // Draw rain drops
      ctx.fillStyle = "rgba(120, 190, 255, 0.6)";
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const length = 5 + Math.random() * 10;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 1, y + length);
        ctx.stroke();
      }
      
      // Add blue tint to the entire canvas
      ctx.fillStyle = "rgba(0, 0, 150, 0.1)";
      ctx.fillRect(0, 0, width, height);
      break;
      
    case 'foggy':
      // Foggy overlay
      ctx.fillStyle = "rgba(200, 200, 200, 0.4)";
      ctx.fillRect(0, 0, width, height);
      
      // Patchy fog
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 30 + Math.random() * 100;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'sandstorm':
      // Sandy color overlay
      ctx.fillStyle = "rgba(210, 180, 140, 0.3)";
      ctx.fillRect(0, 0, width, height);
      
      // Sand particles
      ctx.fillStyle = "rgba(194, 178, 128, 0.7)";
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 1 + Math.random() * 2;
        
        ctx.fillRect(x, y, size, size);
      }
      break;
      
    case 'snowy':
      // Light blue tint
      ctx.fillStyle = "rgba(200, 220, 255, 0.2)";
      ctx.fillRect(0, 0, width, height);
      
      // Snowflakes
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 1 + Math.random() * 3;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'sunny':
      // Yellow tint
      ctx.fillStyle = "rgba(255, 235, 59, 0.1)";
      ctx.fillRect(0, 0, width, height);
      
      // Sun glare
      const gradient = ctx.createRadialGradient(width/2, 50, 10, width/2, 50, 300);
      gradient.addColorStop(0, "rgba(255, 255, 200, 0.6)");
      gradient.addColorStop(1, "rgba(255, 255, 200, 0)");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      break;
      
    case 'night':
      // Dark blue overlay
      ctx.fillStyle = "rgba(0, 0, 50, 0.4)";
      ctx.fillRect(0, 0, width, height);
      
      // Stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * 100; // Stars only at top
        const size = 1 + Math.random() * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
  }
  
  // Add weather icon and name at top
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px Arial";
  ctx.fillText(`${weatherInfo.icon} ${weatherInfo.name}: ${weatherInfo.description}`, 10, 45);
}

// Helper function to draw race header with real-time leaderboard
function drawRaceHeader(ctx, room) {
  // Background for header
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, ctx.canvas.width, 50);
  
  // Title and track info
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 16px Arial";
  
  // Track type and turn info
  const trackType = room.options?.trackType || room.trackType;
  const lapInfo = room.options && room.options.laps > 1 ? 
    `(${Math.min(...room.lapProgress) + 1}/${room.options.laps} Laps)` : "";
  
  ctx.fillText(`🏁 Race Turn ${room.turn} - ${trackType.toUpperCase()} TRACK ${lapInfo}`, 10, 25);
  
  // Weather info if enabled
  if (room.options?.weatherEnabled && room.currentWeather) {
    const weatherInfo = WEATHER_TYPES[room.currentWeather];
    ctx.fillStyle = "#DDDDDD";
    ctx.font = "14px Arial";
    ctx.fillText(`${weatherInfo.icon} ${weatherInfo.name}`, 10, 45);
  }
  
  // Tournament info if available
  if (room.options && room.options.tournamentMatch) {
    ctx.fillStyle = "#FFD700"; // Gold color
    ctx.font = "12px Arial";
    ctx.fillText(`🏆 Tournament Match`, ctx.canvas.width - 150, 25);
  }
  
  // Draw real-time leaderboard on the right side
  drawLeaderboard(ctx, room);
}

// Helper function to draw real-time leaderboard
function drawLeaderboard(ctx, room) {
  // Sort players by position (or lap progress in multi-lap races)
  const rankedPlayers = [...room.players].sort((a, b) => {
    if (room.options && room.options.laps > 1) {
      // Sort by lap first, then position
      const aLap = room.lapProgress[room.players.indexOf(a)] || 0;
      const bLap = room.lapProgress[room.players.indexOf(b)] || 0;
      if (aLap !== bLap) return bLap - aLap;
    }
    return b.position - a.position;
  });
  
  // Draw leaderboard background
  const leaderboardWidth = 180;
  const leaderboardHeight = Math.min(5, rankedPlayers.length) * 25 + 30;
  const startX = ctx.canvas.width - leaderboardWidth - 10;
  const startY = 10;
  
  // Semi-transparent background
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(startX, startY, leaderboardWidth, leaderboardHeight);
  
  // Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px Arial";
  ctx.fillText("🏆 BẢNG XẾP HẠNG", startX + 10, startY + 20);
  
  // Draw player ranks
  for (let i = 0; i < Math.min(5, rankedPlayers.length); i++) {
    const player = rankedPlayers[i];
    const playerY = startY + 30 + i * 25;
    
    // Rank indicator
    const rankColors = {
      0: "#FFD700", // Gold
      1: "#C0C0C0", // Silver
      2: "#CD7F32", // Bronze
      default: "#FFFFFF" // White
    };
    
    // Background highlight for current user
    if (player.playerId === room.creator) {
      ctx.fillStyle = "rgba(0, 100, 255, 0.3)";
      ctx.fillRect(startX + 5, playerY - 15, leaderboardWidth - 10, 22);
    }
    
    // Draw rank circle
    const rankColor = rankColors[i] || rankColors.default;
    ctx.fillStyle = rankColor;
    ctx.beginPath();
    ctx.arc(startX + 15, playerY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw rank number
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText((i + 1).toString(), startX + 15, playerY + 3);
    ctx.textAlign = "left";
    
    // Draw player name (shortened if too long)
    const displayName = player.name.length > 12 ? player.name.substring(0, 10) + "..." : player.name;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Arial";
    
    // Bot indicator
    const botIndicator = player.isBot ? "🤖 " : "";
    
    // Position or lap info
    let positionInfo = "";
    if (room.options && room.options.laps > 1) {
      const lap = room.lapProgress[room.players.indexOf(player)] + 1;
      positionInfo = `L${lap}: ${Math.floor(player.position)}`;
    } else {
      positionInfo = `${Math.floor(player.position)}/${TRACK_LENGTH}`;
    }
    
    ctx.fillText(`${botIndicator}${displayName}`, startX + 30, playerY + 4);
    ctx.fillText(positionInfo, startX + leaderboardWidth - 45, playerY + 4);
  }
}

// Helper function to draw player rank
function drawRankIndicator(ctx, x, y, rank) {
  // Different colors for different ranks
  const rankColors = {
    1: "#FFD700", // Gold
    2: "#C0C0C0", // Silver
    3: "#CD7F32", // Bronze
    default: "#FFFFFF" // White
  };
  
  const color = rankColors[rank] || rankColors.default;
  
  // Draw circle with rank
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + 10, y, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw rank number
  ctx.fillStyle = "#000000";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(rank.toString(), x + 10, y + 3);
  ctx.textAlign = "left"; // Reset alignment
}

// Hàm tạo hình ảnh kết quả cuộc đua
function generateRaceResultsCanvas(raceStats) {
  // Canvas size based on player count
  const playerCount = raceStats.players.length;
  const width = 600;
  const height = Math.max(400, 150 + playerCount * 60);
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#1a2a3a');
  bgGradient.addColorStop(1, '#0a1a2a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Title bar with track info
  const trackNames = {
    city: 'Thành Phố',
    desert: 'Sa Mạc',
    mountain: 'Núi',
    space: 'Vũ Trụ',
    beach: 'Bãi Biển',
    snow: 'Tuyết'
  };
  
  const weatherInfo = WEATHER_TYPES[raceStats.weather];
  const weatherIcon = weatherInfo?.icon || '☀️';
  const weatherName = weatherInfo?.name || 'Quang Đãng';
  const trackName = trackNames[raceStats.trackType] || 'Tiêu Chuẩn';
  
  // Draw header with race info
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, width, 80);
  
  // Race title
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('KẾT QUẢ CUỘC ĐUA', width/2, 30);
  
  // Track and weather info
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px Arial';
  ctx.fillText(`Đường đua: ${trackName} | ${weatherIcon} ${weatherName} | ${raceStats.laps > 1 ? `${raceStats.laps} vòng` : '1 vòng'}`, width/2, 55);
  
  // Race stats
  ctx.fillText(`Thời gian: ${raceStats.totalTurns} lượt${raceStats.fastestLap ? ` | Vòng nhanh nhất: ${raceStats.fastestLap.player} (${raceStats.fastestLap.time} lượt)` : ''}`, width/2, 75);
  
  // Draw column headers
  ctx.textAlign = 'left';
  const headerY = 110;
  ctx.fillStyle = '#AAAAAA';
  ctx.font = '12px Arial';
  ctx.fillText('XẾP HẠNG', 20, headerY);
  ctx.fillText('TÊN', 100, headerY);
  ctx.fillText('TỐC ĐỘ TB', 270, headerY);
  ctx.fillText('TỐC ĐỘ CAO', 350, headerY);
  ctx.fillText('VƯỢT', 430, headerY);
  ctx.fillText('KỸ NĂNG', 490, headerY);
  
  // Divider line
  ctx.strokeStyle = '#444444';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(15, headerY + 10);
  ctx.lineTo(width - 15, headerY + 10);
  ctx.stroke();
  
  // Draw each player's stats
  raceStats.players.forEach((player, index) => {
    const rowY = headerY + 40 + (index * 60);
    
    // Background for each row (alternating colors)
    ctx.fillStyle = index % 2 === 0 ? 'rgba(40, 40, 60, 0.3)' : 'rgba(60, 60, 80, 0.3)';
    ctx.fillRect(15, rowY - 25, width - 30, 50);
    
    // Highlight for top 3
    if (player.rank <= 3) {
      const highlightColors = ['rgba(255, 215, 0, 0.3)', 'rgba(192, 192, 192, 0.3)', 'rgba(205, 127, 50, 0.3)'];
      ctx.fillStyle = highlightColors[player.rank - 1];
      ctx.fillRect(15, rowY - 25, width - 30, 50);
    }
    
    // Medal for rank
    const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    const medalIcons = ['🥇', '🥈', '🥉'];
    
    if (player.rank <= 3) {
      ctx.font = '24px Arial';
      ctx.fillText(medalIcons[player.rank - 1], 20, rowY);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`${player.rank}`, 25, rowY);
    }
    
    // Player name with bot indicator if needed
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    const botIcon = player.isBot ? '🤖 ' : '';
    ctx.fillText(`${botIcon}${player.name}`, 100, rowY);
    
    // Completion status
    if (player.raceCompleted) {
      ctx.fillStyle = '#76FF03';
      ctx.font = '12px Arial';
      ctx.fillText('Hoàn thành', 100, rowY + 20);
    } else {
      ctx.fillStyle = '#FFA000';
      ctx.fillText('Chưa hoàn thành', 100, rowY + 20);
    }
    
    // Lap info for multi-lap races
    if (raceStats.laps > 1) {
      ctx.fillStyle = '#29B6F6';
      ctx.fillText(`Hoàn thành ${player.lapProgress}/${raceStats.laps} vòng`, 210, rowY + 20);
    }
    
    // Performance stats
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    
    // Average speed with colored indicator
    const avgSpeed = parseFloat(player.averageSpeed);
    let speedColor;
    if (avgSpeed >= 3.0) speedColor = '#76FF03'; // Fast - green
    else if (avgSpeed >= 2.0) speedColor = '#FFEB3B'; // Medium - yellow
    else speedColor = '#FB8C00'; // Slow - orange
    
    ctx.fillStyle = speedColor;
    ctx.fillText(`${player.averageSpeed}`, 270, rowY);
    
    // Highest speed
    ctx.fillStyle = '#FF3D00';
    ctx.fillText(`${player.highestSpeed}`, 350, rowY);
    
    // Overtakes
    if (player.overtakes > 0) {
      ctx.fillStyle = '#64DD17';
      ctx.fillText(`+${player.overtakes}`, 430, rowY);
    } else {
      ctx.fillStyle = '#9E9E9E';
      ctx.fillText(`0`, 430, rowY);
    }
    
    // Skills used
    if (player.skillsUsed > 0) {
      ctx.fillStyle = '#FFAB00';
      ctx.fillText(`${player.skillsUsed}`, 490, rowY);
    } else {
      ctx.fillStyle = '#9E9E9E';
      ctx.fillText(`0`, 490, rowY);
    }
    
    // Fastest lap indicator
    if (player.fastestLap) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`⏱️ Vòng nhanh nhất: ${player.fastestLap} lượt`, 250, rowY + 20);
    }
  });
  
  return canvas;
}

// Hiển thị bản đồ tiến trình đua tổng thể
function drawRaceProgress(ctx, room, x, y, width, height) {
  // Background
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(x, y, width, height);
  
  // Border
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
  
  // Get track theme
  const trackTheme = TRACK_THEMES[room.options?.trackType || room.trackType] || TRACK_THEMES.city;
  
  // Finish line
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(x + width - 3, y, 3, height);
  
  // Lap markers for multi-lap races
  if (room.options && room.options.laps > 1) {
    const lapInterval = width / room.options.laps;
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = "#FFCC00";
    
    for (let i = 1; i < room.options.laps; i++) {
      const lapX = x + (lapInterval * i);
      ctx.beginPath();
      ctx.moveTo(lapX, y);
      ctx.lineTo(lapX, y + height);
      ctx.stroke();
    }
    ctx.setLineDash([]); // Reset to solid line
  }
  
  // Draw player positions
  for (let i = 0; i < room.players.length; i++) {
    const player = room.players[i];
    const playerIndex = room.players.indexOf(player);
    
    // Calculate player position on track 
    // For multi-lap races, consider completed laps + current position
    let totalProgress = 0;
    if (room.options && room.options.laps > 1) {
      const completedLaps = room.lapProgress[playerIndex] || 0;
      const currentLapProgress = player.position / TRACK_LENGTH;
      totalProgress = (completedLaps + currentLapProgress) / room.options.laps;
    } else {
      totalProgress = player.position / TRACK_LENGTH;
    }
    
    // Position within mini-map
    const playerX = x + (width * totalProgress);
    
    // Get player rank for color coding
    const rank = room.getPlayerRank(player.playerId);
    
    // Color based on rank
    const rankColors = {
      1: "#FFD700", // Gold
      2: "#C0C0C0", // Silver
      3: "#CD7F32", // Bronze
      default: "#FFFFFF" // White
    };
    
    // Draw player marker
    ctx.fillStyle = rankColors[rank] || rankColors.default;
    
    // Different marker style based on player type
    if (player.isBot) {
      // Square for bots
      ctx.fillRect(playerX - 3, y + height/2 - 3, 6, 6);
    } else {
      // Circle for human players
      ctx.beginPath();
      ctx.arc(playerX, y + height/2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Highlight current player
    if (player.playerId === room.creator) {
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(playerX, y + height/2, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw mini rank
    ctx.font = "8px Arial";
    ctx.fillText(rank.toString(), playerX - 2, y + height - 3);
  }
}

// Hiển thị bản đồ đường đua chi tiết
function drawRaceMiniMap(ctx, room, x, y, width, height) {
  // Get track theme
  const trackTheme = TRACK_THEMES[room.options?.trackType || room.trackType] || TRACK_THEMES.city;
  
  // Create gradient background matching track theme
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, trackTheme.bg);
  gradient.addColorStop(1, adjustColor(trackTheme.bg, -20)); // Slightly darker at bottom
  
  // Background for mini map
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  
  // Track lane
  ctx.fillStyle = trackTheme.lane;
  ctx.fillRect(x, y + 20, width, height - 40);
  
  // Lane dividers
  ctx.strokeStyle = trackTheme.divider;
  ctx.setLineDash([10, 5]);
  ctx.lineWidth = 2;
  
  // Draw lane dividers
  for (let i = 1; i < 3; i++) {
    const laneY = y + 20 + ((height - 40) / 3) * i;
    ctx.beginPath();
    ctx.moveTo(x, laneY);
    ctx.lineTo(x + width, laneY);
    ctx.stroke();
  }
  ctx.setLineDash([]); // Reset line style
  
  // Draw finish line
  const finishX = x + width - 10;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(finishX, y + 20, 5, height - 40);
  
  // Draw checkered pattern on finish line
  for (let i = 0; i < height - 40; i += 10) {
    if (i % 20 === 0) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(finishX, y + 20 + i, 5, 10);
    }
  }
  
  // Lap markers for multi-lap races
  if (room.options && room.options.laps > 1) {
    const lapInterval = width / room.options.laps;
    
    for (let i = 1; i < room.options.laps; i++) {
      const lapX = x + (lapInterval * i);
      
      // Lap marker
      ctx.strokeStyle = "#FFCC00";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(lapX, y + 20);
      ctx.lineTo(lapX, y + height - 20);
      ctx.stroke();
      ctx.setLineDash([]); // Reset
      
      // Lap number
      ctx.fillStyle = "#FFCC00";
      ctx.font = "10px Arial";
      ctx.fillText(`Lap ${i+1}`, lapX - 15, y + 15);
    }
  }
  
  // Draw track theme objects
  for (let i = 0; i < 5; i++) {
    const objectX = x + (width / 5) * i + 50;
    trackTheme.objects(ctx, y + 15, Math.floor(objectX / CELL_WIDTH));
  }
  
  // Draw obstacles
  for (const obstacle of room.obstacles) {
    // Map obstacle position to mini-map
    const obstacleX = x + (obstacle.position / TRACK_LENGTH) * width;
    const laneHeight = (height - 40) / 3;
    const laneY = y + 20 + obstacle.lane * laneHeight + (laneHeight / 2);
    
    // Draw obstacle
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(obstacleX, laneY, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Sort players by position for z-order
  const sortedPlayers = [...room.players].sort((a, b) => a.position - b.position);
  
  // Draw players on mini-map
  for (let i = 0; i < sortedPlayers.length; i++) {
    const player = sortedPlayers[i];
    const playerIndex = room.players.indexOf(player);
    
    // Map to lanes (distribute evenly)
    const lane = i % 3;
    const laneHeight = (height - 40) / 3;
    const laneY = y + 20 + lane * laneHeight + (laneHeight / 2);
    
    // Calculate player position on track 
    let playerPosition = player.position;
    
    // For multi-lap races, just show current lap position
    // (we already have lap indicators)
    if (room.options && room.options.laps > 1) {
      // Get completed laps for visual offset
      const completedLaps = room.lapProgress[playerIndex] || 0;
      
      // Apply visual offset based on completed laps
      const lapVisualOffset = (completedLaps * width) / room.options.laps;
      
      // Map position within current lap
      const currentLapProgress = player.position / TRACK_LENGTH;
      const currentLapWidth = width / room.options.laps;
      
      // Calculate final position on minimap
      playerPosition = x + lapVisualOffset + (currentLapProgress * currentLapWidth);
    } else {
      // Single lap race - simple mapping
      playerPosition = x + (player.position / TRACK_LENGTH) * width;
    }
    
    // Cap position to stay within map
    playerPosition = Math.min(playerPosition, x + width - 10);
    
    // Get player rank for color
    const rank = room.getPlayerRank(player.playerId);
    
    // Color based on rank
    const rankColors = {
      1: "#FFD700", // Gold
      2: "#C0C0C0", // Silver
      3: "#CD7F32", // Bronze
      default: "#FFFFFF" // White
    };
    
    // Draw player car on minimap
    ctx.fillStyle = player.color;
    ctx.fillRect(playerPosition - 8, laneY - 3, 16, 6);
    
    // Draw player name
    ctx.fillStyle = rankColors[rank] || rankColors.default;
    ctx.font = "9px Arial";
    
    // Display name with bot indicator
    const botIcon = player.isBot ? "🤖" : "";
    const displayName = `${rank}.${botIcon}${player.name.substring(0, 6)}`;
    
    ctx.fillText(displayName, playerPosition - 15, laneY - 7);
    
    // Draw player speed
    ctx.fillStyle = "#80D8FF";
    ctx.font = "8px Arial";
    ctx.fillText(`${player.speed.toFixed(1)}`, playerPosition - 5, laneY + 11);
    
    // Current player indicator
    if (player.playerId === room.creator) {
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(playerPosition - 10, laneY - 5, 20, 10);
    }
    
    // Draw effects
    if (player.effects.length > 0) {
      const effect = player.effects[0]; // Just show first effect
      let effectIcon = "⚡";
      
      if (effect.type === "boost") effectIcon = "🔥";
      else if (effect.type === "shield") effectIcon = "🛡️";
      else if (effect.type === "emp") effectIcon = "⚡";
      else if (effect.type === "jump") effectIcon = "⤴️";
      
      ctx.font = "10px Arial";
      ctx.fillText(effectIcon, playerPosition + 10, laneY - 7);
    }
  }
  
  // Title for mini-map
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("ĐƯỜNG ĐUA", x + width/2, y + 12);
  ctx.textAlign = "left"; // Reset
}

// Helper function to adjust color brightness
function adjustColor(hexColor, percent) {
  // Remove # if present
  hexColor = hexColor.replace("#", "");
  
  // Convert to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  // Adjust brightness
  const adjustR = Math.max(0, Math.min(255, r + percent));
  const adjustG = Math.max(0, Math.min(255, g + percent));
  const adjustB = Math.max(0, Math.min(255, b + percent));
  
  // Convert back to hex
  return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
}

async function getPlayerName(api, userId) {
  try {
    const user = await api.getUserInfo(userId);
    return user[userId].name || userId;
  } catch (error) {
    return userId; // Fallback to ID if name can't be fetched
  }
}

// Main module functions
// Helper functions for tournament data
function saveTournamentData() {
  try {
    // Save tournaments only
    const tournamentsObj = {};
    for (const [id, tournament] of tournaments.entries()) {
      tournamentsObj[id] = tournament;
    }
    
    fs.writeFileSync(__dirname + '/cache/pcar_tournaments.json', JSON.stringify(tournamentsObj, null, 2));
    
    // Use module savePlayerData for player data
    savePlayerData();
  } catch (error) {
    console.error("Không thể lưu dữ liệu giải đấu:", error);
  }
}

function loadTournamentData() {
  try {
    // Load tournaments only
    if (fs.existsSync(__dirname + '/cache/pcar_tournaments.json')) {
      const data = fs.readFileSync(__dirname + '/cache/pcar_tournaments.json', 'utf8');
      const tournamentsObj = JSON.parse(data);
      
      // Convert to Map
      for (const [id, tournament] of Object.entries(tournamentsObj)) {
        tournaments.set(id, tournament);
      }
    }
  } catch (error) {
    console.error("Không thể tải dữ liệu giải đấu:", error);
  }
}

// Tournament functions
// Các hàm tiến trình người chơi đã được import ở trên (getOrCreatePlayerProgression, checkAndAwardAchievements, calculateLevel, getNewlyUnlockedItems, hasAchievement, getSeasonLeaderboard)

// Create a new tournament
function createTournament(name, creatorId, format = 'elimination', maxPlayers = 8) {
  const id = Date.now().toString();
  const tournament = new Tournament(id, name, creatorId, format, maxPlayers);
  tournaments.set(id, tournament);
  savePlayerData();
  return tournament;
}

// Get list of active tournaments
function getActiveTournaments() {
  const activeTournaments = [];
  for (const [id, tournament] of tournaments.entries()) {
    if (tournament.status !== 'completed') {
      activeTournaments.push({
        id,
        name: tournament.name,
        status: tournament.status,
        format: tournament.format,
        playerCount: tournament.players.length,
        maxPlayers: tournament.maxPlayers,
        creator: tournament.creatorId
      });
    }
  }
  return activeTournaments;
}

// Draw tournament bracket image
function drawTournamentBracket(tournament) {
  // Only for elimination tournaments
  if (tournament.format !== 'elimination') return null;
  
  // Create canvas
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext("2d");
  
  // Background
  ctx.fillStyle = "#1E1E1E";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 24px Arial";
  ctx.fillText(`${tournament.name} - Giải Đấu`, 20, 40);
  
  // Organize matches by round
  const rounds = {};
  for (const match of tournament.matches) {
    if (!rounds[match.round]) rounds[match.round] = [];
    rounds[match.round].push(match);
  }
  
  // Calculate layout
  const maxRounds = Math.max(...Object.keys(rounds).map(Number));
  const columnWidth = 700 / (maxRounds + 1);
  const startX = 50;
  
  // Draw each round
  for (let round = 1; round <= maxRounds; round++) {
    const roundX = startX + (round - 1) * columnWidth;
    const matches = rounds[round] || [];
    
    // Round header
    ctx.fillStyle = "#AAAAAA";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`Round ${round}`, roundX, 80);
    
    // Draw matches
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const yPos = 120 + i * 100;
      
      // Match box
      ctx.fillStyle = match.status === 'completed' ? "#2A5A8C" : "#444444";
      ctx.fillRect(roundX, yPos, columnWidth - 20, 80);
      
      // Player names
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "14px Arial";
      
      const player1 = tournament.players.find(p => p.id === match.player1)?.name || 'Unknown';
      const player2 = match.player2 ? 
        (tournament.players.find(p => p.id === match.player2)?.name || 'Unknown') :
        'BYE';
      
      ctx.fillText(player1, roundX + 10, yPos + 25);
      ctx.fillText(player2, roundX + 10, yPos + 55);
      
      // Result indicator
      if (match.status === 'completed') {
        const winner = tournament.players.find(p => p.id === match.winner)?.name;
        const p1Won = match.winner === match.player1;
        const p2Won = match.winner === match.player2;
        
        ctx.fillStyle = "#FFCC00";
        ctx.beginPath();
        if (p1Won) {
          ctx.moveTo(roundX + 2, yPos + 20);
          ctx.lineTo(roundX + 8, yPos + 20);
        } else if (p2Won) {
          ctx.moveTo(roundX + 2, yPos + 50);
          ctx.lineTo(roundX + 8, yPos + 50);
        }
        ctx.stroke();
      }
      
      // Connection to next round
      if (round < maxRounds) {
        ctx.strokeStyle = "#777777";
        ctx.beginPath();
        ctx.moveTo(roundX + columnWidth - 20, yPos + 40);
        ctx.lineTo(roundX + columnWidth - 10, yPos + 40);
        
        // If match has even index, connect down, else connect up
        const nextYPos = 120 + Math.floor(i/2) * 100 + 40;
        if (i % 2 === 0) {
          ctx.lineTo(roundX + columnWidth - 10, nextYPos);
        } else {
          ctx.lineTo(roundX + columnWidth - 10, nextYPos);
        }
        ctx.stroke();
      }
    }
  }
  
  return canvas;
}

// Tải dữ liệu người chơi khi module được tải
loadPlayerData && loadPlayerData();
loadTournamentData && loadTournamentData();

module.exports.run = async function ({ event, api, args }) {
  const { threadID, senderID, messageID } = event;
  const command = args[0];

 if (!command) {
  return api.sendMessage(
    "🏎️ Trò chơi đua xe - pcar\n\n" +
    "🎮 Lệnh phòng:\n" +
    "- create [số người] [tuỳ chọn]: Tạo phòng\n" +
    "- join: Tham gia phòng\n" +
    "- addbot [độ khó]: Thêm bot\n" +
    "- start [số vòng]: Bắt đầu đua\n" +
    "- leave: Rời phòng\n" +
    "- status: Xem trạng thái\n" +
    "- stop: Dừng cuộc đua\n\n" +
    
    "🏆 Lệnh giải đấu:\n" +
    "- tournament create [tên] [loại]: Tạo giải đấu\n" +
    "- tournament join [ID]: Tham gia giải đấu\n" +
    "- tournament status: Xem tình trạng\n" +
    "- leaderboard: Xem bảng xếp hạng\n\n" +
    
    "🚗 Tùy chỉnh xe:\n" +
    "- profile: Xem thông tin\n" +
    "- garage: Tùy chỉnh xe\n" +
    "- customize [phần] [ID]: Tùy chỉnh xe\n" +
    "- achievements: Xem thành tích\n\n" +
    
    "ℹ️ Thông tin người chơi:\n" +
    "- info [người chơi]: Xem thông tin\n" +
    "- top: Xem bảng xếp hạng\n\n" +
    
    "🎯 Lệnh điều khiển (khi đua):\n" +
    "- right: Đi tới\n" +
    "- left: Lùi lại\n" +
    "- boost: Tăng tốc\n" +
    "- brake: Giảm tốc\n" +
    "- jump: Nhảy\n" +
    "- skill: Sử dụng kỹ năng\n\n" +
    
    "📱 Liên hệ:\n" +
    "GitHub: github.com/Kenne400k\n" +
    "Zalo: zalo.me/0786888655\n" +
    "Facebook: fb.com/pcoder090",
    threadID, messageID
  );
}


  switch (command.toLowerCase()) {
    case "create":
      if (rooms.has(threadID)) {
        return api.sendMessage("Đã có phòng trong nhóm này rồi. Dùng 'pcar join' để tham gia.", threadID, messageID);
      }
      
      // Log tham số cho mục đích debug
      console.log(`Tạo phòng với tham số: ${JSON.stringify(args)}`);
      
      // Khởi tạo options
      const options = {
        weatherEnabled: true // Mặc định bật thời tiết
      };
      
      // Ánh xạ số map đến loại đường đua
      const mapNumbers = {
        "1": "city",
        "2": "desert",
        "3": "mountain",
        "4": "space",
        "5": "beach",
        "6": "snow"
      };
      
      // Lấy số map từ args[1]
      const mapNumber = args[1];
      if (mapNumber && mapNumbers[mapNumber]) {
        options.trackType = mapNumbers[mapNumber];
        console.log(`Đã chọn map: ${options.trackType}`);
      } else {
        // Nếu không có số map hợp lệ, hiển thị danh sách để chọn
        return api.sendMessage(
          "🏎️ Tạo phòng đua xe - Chọn Map:\n\n" +
          "Sử dụng: pcar create [số map] [số người chơi]\n\n" +
          "Danh sách maps:\n" +
          "1. 🏙️ Thành phố (City)\n" +
          "2. 🏜️ Sa mạc (Desert)\n" +
          "3. ⛰️ Núi (Mountain)\n" +
          "4. 🌌 Không gian (Space)\n" +
          "5. 🏖️ Bãi biển (Beach)\n" +
          "6. ❄️ Tuyết (Snow)\n\n" +
          "Ví dụ: pcar create 2 3 (Tạo phòng map Desert với 3 người chơi)",
          threadID, messageID
        );
      }
      
      // Kiểm tra tham số số lượng người chơi từ args[2]
      let maxPlayers = MAX_PLAYERS;
      const playerCount = args[2];
      if (playerCount && !isNaN(parseInt(playerCount))) {
        const requestedPlayers = parseInt(playerCount);
        console.log(`Yêu cầu số người chơi: ${requestedPlayers}`);
        if (requestedPlayers >= 2 && requestedPlayers <= 10) {
          maxPlayers = requestedPlayers;
        } else {
          return api.sendMessage(
            "Số người chơi phải từ 2-10. Vui lòng thử lại với số người hợp lệ.", 
            threadID, messageID
          );
        }
      }
      
      // Các tùy chỉnh khác nếu có
      const weatherOption = args.find(arg => 
        ["weather", "noweather", "weatheron", "weatheroff"].includes(arg?.toLowerCase())
      );
      if (weatherOption) {
        options.weatherEnabled = !["noweather", "weatheroff"].includes(weatherOption.toLowerCase());
      }
      
      try {
        const playerName = await getPlayerName(api, senderID);
        console.log(`Tên người chơi: ${playerName}`);
        
        // Lấy tiến trình người chơi để áp dụng tùy chỉnh xe
        // Kiểm tra xem module progression đã được import đúng cách chưa
        console.log("Module progression:", Object.keys(progression));
        const playerProgData = getOrCreatePlayerProgression(senderID, playerName);
        
        // Tạo phòng mới
        console.log(`Tạo phòng với: threadID=${threadID}, maxPlayers=${maxPlayers}, options=${JSON.stringify(options)}`);
        const newRoom = new GameRoom(threadID, maxPlayers, options);
        
        // Thêm người chơi vào phòng
        newRoom.addPlayer(senderID, playerName);
        rooms.set(threadID, newRoom);
        
        // Tạo thông báo tùy chỉnh
        let additionalInfo = "";
        if (options.botDifficulty) {
          additionalInfo += `- Bot difficulty: ${BOT_DIFFICULTIES[options.botDifficulty].name}\n`;
        }
        if (options.weatherEnabled !== undefined) {
          additionalInfo += `- Thời tiết động: ${options.weatherEnabled ? "Bật" : "Tắt"}\n`;
        }
        
        // Thông tin về màu sắc xe đã tùy chỉnh
        if (playerProgData.car?.color) {
          additionalInfo += `- Màu xe của bạn: ${playerProgData.car.color}\n`;
        }
        
        // Thông báo thành công
        const trackTypeDisplay = options.trackType ? options.trackType.toUpperCase() : 
                              (newRoom.trackType ? newRoom.trackType.toUpperCase() : "MẶC ĐỊNH");
        
        return api.sendMessage(
          `🏎️ Đã tạo phòng đua xe thành công (tối đa ${maxPlayers} người)!\n` +
          `Loại đường đua: ${trackTypeDisplay}\n` +
          (additionalInfo ? additionalInfo : "") +
          "- Dùng 'pcar join' để tham gia\n" +
          "- Dùng 'pcar addbot' để thêm bot\n" +
          "- Dùng 'pcar customize' để tùy chỉnh xe\n" +
          "- Dùng 'pcar start' để bắt đầu đua", 
          threadID, messageID
        );
      } catch (error) {
        console.error("Lỗi khi tạo phòng:", error);
        return api.sendMessage(
          "Đã xảy ra lỗi khi tạo phòng. Vui lòng thử lại sau.\nLỗi: " + error.message,
          threadID, messageID
        );
      }

    case "join":
      if (!rooms.has(threadID)) {
        return api.sendMessage("Chưa có phòng nào. Dùng 'pcar create' để tạo phòng mới.", threadID, messageID);
      }
      
      const room = rooms.get(threadID);
      if (room.started) {
        return api.sendMessage("Cuộc đua đã bắt đầu, không thể tham gia.", threadID, messageID);
      }
      
      const joinName = await getPlayerName(api, senderID);
      if (room.addPlayer(senderID, joinName)) {
        return api.sendMessage(
          `${joinName} đã tham gia phòng đua xe!\n` +
          `Số người chơi hiện tại: ${room.players.length}/${room.maxPlayers}\n` +
          `Kỹ năng của bạn: ${room.players.find(p => p.playerId === senderID).skill.displayName}`,
          threadID, messageID
        );
      } else {
        return api.sendMessage("Bạn đã tham gia phòng này rồi hoặc phòng đã đầy.", threadID, messageID);
      }

    case "addbot":
      if (!rooms.has(threadID)) {
        return api.sendMessage("Chưa có phòng nào. Dùng 'pcar create' để tạo phòng mới.", threadID, messageID);
      }
      
      const botRoom = rooms.get(threadID);
      if (botRoom.started) {
        return api.sendMessage("Cuộc đua đã bắt đầu, không thể thêm bot.", threadID, messageID);
      }
      
      if (botRoom.addBot()) {
        const latestBot = botRoom.players[botRoom.players.length - 1];
        return api.sendMessage(
          `Đã thêm bot vào phòng đua xe!\n` +
          `Bot: ${latestBot.name} với kỹ năng ${latestBot.skill.displayName}\n` +
          `Số người chơi hiện tại: ${botRoom.players.length}/${botRoom.maxPlayers}`, 
          threadID, messageID
        );
      } else {
        return api.sendMessage("Không thể thêm bot. Phòng có thể đã đầy.", threadID, messageID);
      }

    case "leave":
      if (!rooms.has(threadID)) {
        return api.sendMessage("Không có phòng nào để rời.", threadID, messageID);
      }
      
      const leaveRoom = rooms.get(threadID);
      
      // Cho phép rời phòng ngay cả khi đã bắt đầu cuộc đua
      if (leaveRoom.removePlayer(senderID)) {
        if (leaveRoom.players.length === 0) {
          rooms.delete(threadID);
          return api.sendMessage("Bạn đã rời phòng. Phòng đã bị xóa vì không còn người chơi.", threadID, messageID);
        }
        
        // Nếu người chơi rời đi trong khi đua
        if (leaveRoom.started) {
          return api.sendMessage(
            `Bạn đã rời khỏi cuộc đua.\n` +
            `${leaveRoom.creator === senderID ? 'Người chơi mới sẽ trở thành chủ phòng.' : ''}`,
            threadID, messageID
          );
        } else {
          return api.sendMessage("Bạn đã rời phòng đua xe.", threadID, messageID);
        }
      } else {
        return api.sendMessage("Bạn không có trong phòng này.", threadID, messageID);
      }
      
    // === Chức năng hồ sơ người chơi ===
    case "profile":
      try {
        const playerName = await getPlayerName(api, senderID);
        const playerData = getOrCreatePlayerProgression(senderID, playerName);
        
        // Tính toán cấp độ và XP tiếp theo
        const currentLevel = playerData.level || 1;
        const currentXP = playerData.xp || 0;
        
        // Tìm cấp độ tiếp theo
        let nextLevel = null;
        let nextLevelXP = null;
        
        for (let i = 0; i < XP_LEVELS.length; i++) {
          if (XP_LEVELS[i].level > currentLevel) {
            nextLevel = XP_LEVELS[i].level;
            nextLevelXP = XP_LEVELS[i].xpNeeded;
            break;
          }
        }
        
        // Tính phần trăm tiến độ đến cấp tiếp theo
        let progressPercent = 0;
        if (nextLevelXP) {
          const prevLevelXP = XP_LEVELS.find(l => l.level === currentLevel)?.xpNeeded || 0;
          const xpNeeded = nextLevelXP - prevLevelXP;
          const xpEarned = currentXP - prevLevelXP;
          progressPercent = Math.floor((xpEarned / xpNeeded) * 100);
        } else {
          // Đã đạt cấp độ tối đa
          progressPercent = 100;
        }
        
        // Tạo thanh tiến trình
        const progressBarLength = 20;
        const filledBars = Math.floor((progressPercent / 100) * progressBarLength);
        const progressBar = "▰".repeat(filledBars) + "▱".repeat(progressBarLength - filledBars);
        
        // Thống kê thành tích
        const achievementCount = playerData.achievements?.length || 0;
        const totalAchievements = ACHIEVEMENTS.length;
        
        // Thống kê trận đấu
        const raceStats = playerData.stats || { wins: 0, races: 0, bestTime: null };
        const winRate = raceStats.races > 0 ? Math.floor((raceStats.wins / raceStats.races) * 100) : 0;
        
        // Thông tin xe yêu thích
        let carInfo = "";
        if (playerData.car) {
          const colorName = CAR_CUSTOMIZATIONS.colors.find(c => c.id === playerData.car.color)?.name || "Mặc định";
          const decalName = CAR_CUSTOMIZATIONS.decals.find(d => d.id === playerData.car.decal)?.name || "Không có";
          const wheelsName = CAR_CUSTOMIZATIONS.wheels.find(w => w.id === playerData.car.wheels)?.name || "Tiêu chuẩn";
          const spoilerName = CAR_CUSTOMIZATIONS.spoilers.find(s => s.id === playerData.car.spoiler)?.name || "Không có";
          const nitroName = CAR_CUSTOMIZATIONS.nitros.find(n => n.id === playerData.car.nitro)?.name || "Không có";
          
          carInfo = `🚗 Xe của bạn:
- Màu sắc: ${colorName}
- Decal: ${decalName}
- Bánh xe: ${wheelsName}
- Cánh gió: ${spoilerName}
- Nitro: ${nitroName}`;
        }
        
        // Tạo tin nhắn hồ sơ
        const profileMessage = `📝 HỒ SƠ NGƯỜI CHƠI: ${playerName}

🏆 Cấp độ: ${currentLevel} (${currentXP} XP)
${nextLevel ? `🔜 Cấp tiếp theo: ${nextLevel} (cần ${nextLevelXP} XP)` : '🔝 Đã đạt cấp độ tối đa!'}
📊 Tiến trình: ${progressBar} ${progressPercent}%

🏁 Thống kê đua xe:
- Số trận đã đua: ${raceStats.races}
- Số trận thắng: ${raceStats.wins}
- Tỷ lệ thắng: ${winRate}%
- Thời gian tốt nhất: ${raceStats.bestTime ? raceStats.bestTime + 's' : 'Chưa có'}

🎯 Thành tích: ${achievementCount}/${totalAchievements}
💯 Điểm mùa giải: ${playerData.seasonPoints || 0}

${carInfo}

💡 Dùng 'pcar garage' để xem và tùy chỉnh xe
💡 Dùng 'pcar achievements' để xem danh sách thành tích`;

        return api.sendMessage(profileMessage, threadID, messageID);
      } catch (error) {
        console.error("Lỗi khi hiển thị hồ sơ:", error);
        return api.sendMessage("Đã xảy ra lỗi khi hiển thị hồ sơ. Vui lòng thử lại sau.", threadID, messageID);
      }
      
    // === Chức năng garage - xem và tùy chỉnh xe ===
    case "garage":
      try {
        const playerName = await getPlayerName(api, senderID);
        const playerData = getOrCreatePlayerProgression(senderID, playerName);
        
        // Lấy cấp độ để kiểm tra các tùy chỉnh đã mở khóa
        const playerLevel = playerData.level || 1;
        
        // Thiết lập mặc định nếu chưa có
        if (!playerData.car) {
          playerData.car = {
            color: "red",  // Mặc định
            decal: "none",
            wheels: "standard",
            spoiler: "none",
            nitro: "none"
          };
          savePlayerData();
        }
        
        // Xây dựng thông tin phương tiện hiện tại
        const currentColor = CAR_CUSTOMIZATIONS.colors.find(c => c.id === playerData.car.color) || CAR_CUSTOMIZATIONS.colors[0];
        const currentDecal = CAR_CUSTOMIZATIONS.decals.find(d => d.id === playerData.car.decal) || CAR_CUSTOMIZATIONS.decals[0];
        const currentWheels = CAR_CUSTOMIZATIONS.wheels.find(w => w.id === playerData.car.wheels) || CAR_CUSTOMIZATIONS.wheels[0];
        const currentSpoiler = CAR_CUSTOMIZATIONS.spoilers.find(s => s.id === playerData.car.spoiler) || CAR_CUSTOMIZATIONS.spoilers[0];
        const currentNitro = CAR_CUSTOMIZATIONS.nitros.find(n => n.id === playerData.car.nitro) || CAR_CUSTOMIZATIONS.nitros[0];
        
        // Tính toán chỉ số xe dựa trên tùy chỉnh hiện tại
        let speed = 3; // Chỉ số cơ bản
        let acceleration = 0.5;
        let handling = 1.0;
        
        // Cộng thêm chỉ số từ các tùy chỉnh
        if (currentDecal.stats?.speed) speed += currentDecal.stats.speed;
        if (currentWheels.stats?.speed) speed += currentWheels.stats.speed;
        if (currentSpoiler.stats?.speed) speed += currentSpoiler.stats.speed;
        
        if (currentDecal.stats?.acceleration) acceleration += currentDecal.stats.acceleration;
        if (currentWheels.stats?.acceleration) acceleration += currentWheels.stats.acceleration;
        if (currentNitro.stats?.acceleration) acceleration += currentNitro.stats.acceleration;
        
        if (currentDecal.stats?.handling) handling += currentDecal.stats.handling;
        if (currentWheels.stats?.handling) handling += currentWheels.stats.handling;
        if (currentSpoiler.stats?.handling) handling += currentSpoiler.stats.handling;
        
        // Tạo tin nhắn garage
        const garageMessage = `🚗 GARAGE XE: ${playerName}

📊 Thông số xe hiện tại:
- Tốc độ: ${speed.toFixed(1)}
- Tăng tốc: ${acceleration.toFixed(1)}
- Điều khiển: ${handling.toFixed(1)}

👉 Tùy chỉnh hiện tại:
- Màu sắc: ${currentColor.name}
- Decal: ${currentDecal.name}
- Bánh xe: ${currentWheels.name}
- Cánh gió: ${currentSpoiler.name}
- Nitro: ${currentNitro.name}

✅ Tùy chỉnh có sẵn cho cấp độ ${playerLevel} của bạn:
- Màu sắc: ${CAR_CUSTOMIZATIONS.colors.filter(c => c.unlockLevel <= playerLevel).map(c => c.name).join(', ')}
- Decal: ${CAR_CUSTOMIZATIONS.decals.filter(d => d.unlockLevel <= playerLevel).map(d => d.name).join(', ')}
- Bánh xe: ${CAR_CUSTOMIZATIONS.wheels.filter(w => w.unlockLevel <= playerLevel).map(w => w.name).join(', ')}
- Cánh gió: ${CAR_CUSTOMIZATIONS.spoilers.filter(s => s.unlockLevel <= playerLevel).map(s => s.name).join(', ')}
- Nitro: ${CAR_CUSTOMIZATIONS.nitros.filter(n => n.unlockLevel <= playerLevel).map(n => n.name).join(', ')}

💡 Sử dụng 'pcar customize [phần] [ID]' để tùy chỉnh xe
Ví dụ: pcar customize color blue | pcar customize wheels racing

🔓 Đạt thêm cấp độ để mở khóa nhiều tùy chỉnh hơn!`;

        return api.sendMessage(garageMessage, threadID, messageID);
      } catch (error) {
        console.error("Lỗi khi hiển thị garage:", error);
        return api.sendMessage("Đã xảy ra lỗi khi hiển thị garage. Vui lòng thử lại sau.", threadID, messageID);
      }
      
    // === Chức năng tùy chỉnh phần xe cụ thể ===
    case "customize":
      try {
        // Kiểm tra tham số
        if (!args[1] || !args[2]) {
          return api.sendMessage(
            "⚠️ Thiếu tham số! Sử dụng: pcar customize [phần] [ID]\n" +
            "Các phần có thể tùy chỉnh: color, decal, wheels, spoiler, nitro\n" +
            "Sử dụng 'pcar garage' để xem các tùy chọn có sẵn.",
            threadID, messageID
          );
        }
        
        const playerName = await getPlayerName(api, senderID);
        const playerData = getOrCreatePlayerProgression(senderID, playerName);
        const playerLevel = playerData.level || 1;
        
        // Thiết lập mặc định nếu chưa có
        if (!playerData.car) {
          playerData.car = {
            color: "red",
            decal: "none",
            wheels: "standard",
            spoiler: "none",
            nitro: "none"
          };
        }
        
        const part = args[1].toLowerCase();
        const itemId = args[2].toLowerCase();
        
        // Kiểm tra loại phần tùy chỉnh hợp lệ
        const validParts = ["color", "decal", "wheels", "spoiler", "nitro"];
        if (!validParts.includes(part)) {
          return api.sendMessage(
            `⚠️ Loại phần '${part}' không hợp lệ!\n` +
            "Các phần có thể tùy chỉnh: color, decal, wheels, spoiler, nitro",
            threadID, messageID
          );
        }
        
        // Ánh xạ tên phần đến key trong CAR_CUSTOMIZATIONS
        const partMapping = {
          color: "colors",
          decal: "decals",
          wheels: "wheels",
          spoiler: "spoilers",
          nitro: "nitros"
        };
        
        const customizationKey = partMapping[part];
        
        // Tìm vật phẩm trong danh sách tùy chỉnh
        const item = CAR_CUSTOMIZATIONS[customizationKey].find(i => i.id === itemId);
        if (!item) {
          return api.sendMessage(
            `⚠️ Không tìm thấy ID '${itemId}' cho ${part}!\n` +
            `Hãy dùng 'pcar garage' để xem danh sách các ID có sẵn.`,
            threadID, messageID
          );
        }
        
        // Kiểm tra xem người chơi đã đạt cấp độ yêu cầu chưa
        if (item.unlockLevel > playerLevel) {
          return api.sendMessage(
            `⚠️ Bạn cần đạt cấp độ ${item.unlockLevel} để mở khóa ${item.name}!\n` +
            `Cấp độ hiện tại của bạn: ${playerLevel}`,
            threadID, messageID
          );
        }
        
        // Áp dụng tùy chỉnh
        playerData.car[part] = itemId;
        savePlayerData();
        
        // Hiển thị thông báo thành công với thông tin về chỉ số
        let statsInfo = "";
        if (item.stats) {
          statsInfo = "\nLợi ích:";
          if (item.stats.speed) statsInfo += `\n- Tốc độ: ${item.stats.speed > 0 ? '+' : ''}${item.stats.speed}`;
          if (item.stats.acceleration) statsInfo += `\n- Tăng tốc: ${item.stats.acceleration > 0 ? '+' : ''}${item.stats.acceleration}`;
          if (item.stats.handling) statsInfo += `\n- Điều khiển: ${item.stats.handling > 0 ? '+' : ''}${item.stats.handling}`;
        }
        
        return api.sendMessage(
          `✅ Đã tùy chỉnh thành công ${part} thành '${item.name}'!${statsInfo}\n\n` +
          "Sử dụng 'pcar garage' để xem xe của bạn.",
          threadID, messageID
        );
      } catch (error) {
        console.error("Lỗi khi tùy chỉnh xe:", error);
        return api.sendMessage("Đã xảy ra lỗi khi tùy chỉnh xe. Vui lòng thử lại sau.", threadID, messageID);
      }
      
    // === Chức năng xem danh sách thành tích ===
    case "achievements":
      try {
        const playerName = await getPlayerName(api, senderID);
        const playerData = getOrCreatePlayerProgression(senderID, playerName);
        
        // Lấy danh sách thành tích đã đạt được
        const unlockedAchievements = playerData.achievements || [];
        
        // Tạo tin nhắn danh sách thành tích
        let achievementMessage = `🏆 THÀNH TÍCH: ${playerName}\n\n`;
        
        // Chia thành tích thành đã mở khóa và chưa mở khóa
        achievementMessage += "✅ Đã mở khóa:\n";
        let hasUnlocked = false;
        
        for (const achievement of ACHIEVEMENTS) {
          if (unlockedAchievements.includes(achievement.id)) {
            hasUnlocked = true;
            achievementMessage += `${achievement.icon} ${achievement.name}: ${achievement.description} (+${achievement.xpReward} XP)\n`;
          }
        }
        
        if (!hasUnlocked) {
          achievementMessage += "Chưa có thành tích nào được mở khóa.\n";
        }
        
        achievementMessage += "\n🔒 Chưa mở khóa:\n";
        let hasLocked = false;
        
        for (const achievement of ACHIEVEMENTS) {
          if (!unlockedAchievements.includes(achievement.id)) {
            hasLocked = true;
            achievementMessage += `${achievement.icon} ${achievement.name}: ${achievement.description} (+${achievement.xpReward} XP)\n`;
          }
        }
        
        if (!hasLocked) {
          achievementMessage += "Bạn đã mở khóa tất cả thành tích! Chúc mừng!\n";
        }
        
        achievementMessage += "\n💡 Tiếp tục chơi để mở khóa thêm thành tích và nhận phần thưởng!";
        
        return api.sendMessage(achievementMessage, threadID, messageID);
      } catch (error) {
        console.error("Lỗi khi hiển thị thành tích:", error);
        return api.sendMessage("Đã xảy ra lỗi khi hiển thị thành tích. Vui lòng thử lại sau.", threadID, messageID);
      }

    case "start":
      if (!rooms.has(threadID)) {
        return api.sendMessage("Không có phòng nào để bắt đầu. Dùng 'pcar create' trước.", threadID, messageID);
      }
      
      const startRoom = rooms.get(threadID);
      if (startRoom.started) {
        return api.sendMessage("Cuộc đua đã bắt đầu rồi.", threadID, messageID);
      }
      
      if (startRoom.players.length < 1) {
        return api.sendMessage("Cần ít nhất 1 người chơi để bắt đầu đua.", threadID, messageID);
      }
      
      // Kiểm tra số vòng đua
      if (args[1] && !isNaN(parseInt(args[1]))) {
        const laps = parseInt(args[1]);
        if (laps > 0 && laps <= 5) {
          startRoom.options.laps = laps;
        } else {
          return api.sendMessage("Số vòng đua phải từ 1-5.", threadID, messageID);
        }
      }
      
      if (startRoom.start()) {
        // Nếu thời tiết được bật, khởi tạo thời tiết ngẫu nhiên
        if (startRoom.options.weatherEnabled) {
          startRoom.currentWeather = startRoom.getRandomWeather(startRoom.options.trackType || startRoom.trackType);
          
          // Áp dụng hiệu ứng thời tiết lên xe
          for (const player of startRoom.players) {
            player.applyWeatherEffects(startRoom.currentWeather);
          }
        }
        
        // Generate initial race image
        const canvas = generateRaceCanvas(startRoom);
        const filePath = __dirname + "/cache/race_" + threadID + ".png";
        const writeStream = fs.createWriteStream(filePath);
        const stream = canvas.createPNGStream();
        stream.pipe(writeStream);
        
        writeStream.on('finish', () => {
          // Chuẩn bị thông tin cuộc đua
          const trackType = startRoom.options?.trackType || startRoom.trackType;
          
          // Thông tin thời tiết
          let weatherInfo = "";
          if (startRoom.options.weatherEnabled && startRoom.currentWeather) {
            const weather = WEATHER_TYPES[startRoom.currentWeather];
            weatherInfo = `\n${weather.icon} Thời tiết: ${weather.name} - ${weather.description}`;
          }
          
          // Thông tin số vòng
          const lapInfo = startRoom.options.laps > 1 ? 
            `\n🔄 Số vòng đua: ${startRoom.options.laps}` : "";
          
          // Danh sách người chơi
          let playerList = "\n\n👥 Danh sách người chơi:";
          startRoom.players.forEach((player, index) => {
            const isBot = player.isBot ? "🤖 " : "";
            const botLevel = player.isBot && player.botSettings ? 
              `(${player.botSettings.name})` : "";
            const carInfo = player.customization?.color ? 
              ` - Xe màu ${player.customization.color}` : "";
            
            playerList += `\n${index + 1}. ${isBot}${player.name} ${botLevel}${carInfo}`;
            playerList += `\n   Kỹ năng: ${player.skill.displayName}`;
          });
          
          api.sendMessage(
            {
              body: `🏁 **CUỘC ĐUA BẮT ĐẦU** 🏁\n` +
          `🏎️ **Đường đua**: ${trackType.toUpperCase()} ${weatherInfo} ${lapInfo}\n\n` +
          `👥 **Người chơi**: ${playerList.join(", ")}\n\n` + // Danh sách người chơi
          `📢 **Cách điều khiển**:\n` +
          `➡️ **right**: Di chuyển về phía trước\n` +
          `⬅️ **left**: Lùi lại\n` +
          `⚡ **boost**: Tăng tốc (x2)\n` +
          `⏹️ **brake**: Phanh\n` +
          `⛷️ **jump**: Nhảy qua chướng ngại vật\n` +
          `🎮 **skill**: Sử dụng kỹ năng đặc biệt\n\n` +
          `👉 **Reply để bắt đầu di chuyển!**`,
              attachment: fs.createReadStream(filePath)
            },
            threadID,
            (err, info) => {
              if (err) return console.error(err);
              
              startRoom.lastMessageId = info.messageID;
              // Set up reply handler
              global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: senderID
              });
            }
          );
        });
      } else {
        return api.sendMessage("Không thể bắt đầu cuộc đua.", threadID, messageID);
      }
      break;

    case "stop":
      if (!rooms.has(threadID)) {
        return api.sendMessage("Không có phòng đua xe nào để dừng.", threadID, messageID);
      }
      
      const stopRoom = rooms.get(threadID);
      if (!stopRoom.started) {
        return api.sendMessage("Cuộc đua chưa bắt đầu, không cần dừng lại.", threadID, messageID);
      }
      
      if (!stopRoom.players.some(p => p.playerId === senderID)) {
        return api.sendMessage("Bạn không tham gia cuộc đua này nên không thể vote dừng.", threadID, messageID);
      }
      
      const shouldStop = stopRoom.voteStop(senderID);
      const humanPlayers = stopRoom.players.filter(p => !p.isBot).length;
      const voteCount = stopRoom.stopVotes.size;
      
      if (shouldStop) {
        // Đủ số vote, dừng cuộc đua
        const canvas = generateRaceCanvas(stopRoom);
        const filePath = __dirname + "/cache/race_stop_" + threadID + ".png";
        const writeStream = fs.createWriteStream(filePath);
        const stream = canvas.createPNGStream();
        stream.pipe(writeStream);
        
        writeStream.on('finish', () => {
          api.sendMessage(
            {
              body: "🛑 CUỘC ĐUA ĐÃ DỪNG THEO YÊU CẦU SỐ ĐÔNG!\n" +
                    `${voteCount}/${humanPlayers} người chơi đã vote dừng.`,
              attachment: fs.createReadStream(filePath)
            },
            threadID
          );
          
          // Xóa phòng
          rooms.delete(threadID);
        });
      } else {
        // Chưa đủ số vote
        return api.sendMessage(
          `Bạn đã vote dừng cuộc đua. Hiện có ${voteCount}/${humanPlayers} vote.\n` +
          `Cần thêm ${Math.ceil(humanPlayers / 2) - voteCount} vote để dừng cuộc đua.`,
          threadID, messageID
        );
      }
      break;

    case "status":
      if (!rooms.has(threadID)) {
        return api.sendMessage("Chưa có phòng đua xe nào trong nhóm này.", threadID, messageID);
      }
      
      const statusRoom = rooms.get(threadID);
      let playerList = "";
      statusRoom.players.forEach((player, index) => {
        const skillStatus = player.skill.cooldownRemaining > 0 ? 
          `(cooldown: ${player.skill.cooldownRemaining})` : 
          "(sẵn sàng)";
        
        playerList += `${index + 1}. ${player.name}${player.isBot ? ' 🤖' : ''}\n` +
                      `   Kỹ năng: ${player.skill.displayName} ${skillStatus}\n`;
      });
      
      return api.sendMessage(
        `🏎️ Trạng thái phòng đua xe:\n` +
        `- Đường đua: ${statusRoom.trackType.toUpperCase()}\n` +
        `- Số người chơi: ${statusRoom.players.length}/${statusRoom.maxPlayers}\n` +
        `- Đã bắt đầu: ${statusRoom.started ? 'Có' : 'Chưa'}\n` +
        `- Chủ phòng: ${statusRoom.creator ? (statusRoom.players.find(p => p.playerId === statusRoom.creator)?.name || "Không xác định") : "Không có"}\n\n` +
        `Danh sách người chơi:\n${playerList}`,
        threadID, messageID
      );

    case "info":
      if (!rooms.has(threadID)) {
        return api.sendMessage("Chưa có phòng đua xe nào trong nhóm này.", threadID, messageID);
      }
      
      const infoRoom = rooms.get(threadID);
      let targetId = senderID; // Mặc định xem thông tin của chính mình
      
      // Nếu nhắn tên người khác
      if (args[1]) {
        const targetName = args.slice(1).join(" ").toLowerCase();
        const foundPlayer = infoRoom.players.find(p => 
          p.name.toLowerCase().includes(targetName)
        );
        
        if (foundPlayer) {
          targetId = foundPlayer.playerId;
        } else {
          return api.sendMessage(`Không tìm thấy người chơi có tên '${args.slice(1).join(" ")}'`, threadID, messageID);
        }
      }
      
      const playerInfo = infoRoom.getPlayerInfo(targetId);
      if (!playerInfo) {
        return api.sendMessage("Không tìm thấy thông tin người chơi.", threadID, messageID);
      }
      
      // Lấy thống kê (nếu có)
      const stats = playerStats.get(targetId) || { wins: 0, races: 0, bestTime: null };
      
      return api.sendMessage(
        `📊 Thông tin người chơi: ${playerInfo.name}\n` +
        `- Vị trí: ${playerInfo.position}/${TRACK_LENGTH}\n` +
        `- Tốc độ: ${playerInfo.speed.toFixed(1)} (${playerInfo.effects.some(e => e.type === "boost") ? 'đang boost' : 'bình thường'})\n` +
        `- Máu: ${playerInfo.health}/100\n` +
        `- Kỹ năng: ${playerInfo.skill.name}\n` +
        `- Cooldown: ${playerInfo.skill.cooldownRemaining > 0 ? `còn ${playerInfo.skill.cooldownRemaining} lượt` : 'sẵn sàng'}\n\n` +
        `📈 Thống kê:\n` +
        `- Số cuộc đua đã tham gia: ${stats.races}\n` +
        `- Số lần thắng: ${stats.wins}\n` +
        `- Tỷ lệ thắng: ${stats.races > 0 ? Math.round((stats.wins / stats.races) * 100) + '%' : 'N/A'}`,
        threadID, messageID
      );

    case "top":
      // Hiển thị bảng xếp hạng
      if (playerStats.size === 0) {
        return api.sendMessage("Chưa có dữ liệu thống kê nào.", threadID, messageID);
      }
      
      // Chuyển Map thành mảng để sắp xếp
      const allStats = [...playerStats.entries()].map(([id, stats]) => ({
        id,
        ...stats
      }));
      
      // Sắp xếp theo số lần thắng
      allStats.sort((a, b) => b.wins - a.wins);
      
      // Lấy top 10
      const top10 = allStats.slice(0, 10);
      
      let topList = "🏆 BẢNG XẾP HẠNG ĐUA XE 🏆\n\n";
      
      for (let i = 0; i < top10.length; i++) {
        const player = top10[i];
        const playerName = player.name || `Người chơi ${player.id.substring(0, 8)}`;
        
        topList += `${i + 1}. ${playerName}\n` +
                   `   Thắng: ${player.wins}, Đua: ${player.races}, Tỷ lệ: ${player.races > 0 ? Math.round((player.wins / player.races) * 100) + '%' : 'N/A'}\n`;
      }
      
      return api.sendMessage(topList, threadID, messageID);

    default:
      return api.sendMessage(
        "Lệnh không hợp lệ. Sử dụng 'pcar' để xem hướng dẫn.", 
        threadID, messageID
      );
  }
};

module.exports.handleReply = async function ({ event, api, handleReply }) {
  const { threadID, senderID, body, messageID } = event;
  
  // Xử lý tương tác khi tạo phòng
  if (handleReply.type === "createRoomSelectMap") {
    // Kiểm tra nếu đã có phòng rồi
    if (rooms.has(threadID)) {
      return api.sendMessage("Đã có phòng trong nhóm này rồi. Dùng 'pcar join' để tham gia.", threadID, messageID);
    }
    
    const mapNumbers = {
      "1": "city",
      "2": "desert",
      "3": "mountain",
      "4": "space",
      "5": "beach",
      "6": "snow"
    };
    
    // Kiểm tra lựa chọn map
    if (!mapNumbers[body]) {
      return api.sendMessage("Lựa chọn map không hợp lệ. Vui lòng chọn số từ 1-6.", threadID, messageID);
    }
    
    const trackType = mapNumbers[body];
    const trackEmojis = {
      "city": "🏙️",
      "desert": "🏜️",
      "mountain": "⛰️",
      "space": "🌌",
      "beach": "🏖️",
      "snow": "❄️"
    };
    
    // Hỏi số lượng người chơi tối đa
    api.sendMessage(
      `${trackEmojis[trackType]} Bạn đã chọn map ${trackType.toUpperCase()}!\n\n` +
      `Vui lòng chọn số người chơi tối đa (2-10):`,
      threadID,
      (err, info) => {
        if (err) return console.error(err);
        
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "createRoomSelectPlayers",
          trackType: trackType
        });
      }
    );
    
    return;
  }
  
  // Xử lý lựa chọn số người chơi tối đa
  if (handleReply.type === "createRoomSelectPlayers") {
    // Kiểm tra nếu đã có phòng rồi
    if (rooms.has(threadID)) {
      return api.sendMessage("Đã có phòng trong nhóm này rồi. Dùng 'pcar join' để tham gia.", threadID, messageID);
    }
    
    // Kiểm tra số người chơi hợp lệ
    const maxPlayers = parseInt(body);
    if (isNaN(maxPlayers) || maxPlayers < 2 || maxPlayers > 10) {
      return api.sendMessage("Số người chơi phải từ 2-10. Vui lòng nhập lại.", threadID, messageID);
    }
    
    try {
      // Tạo options cho phòng
      const options = {
        trackType: handleReply.trackType,
        weatherEnabled: true // Mặc định bật thời tiết
      };
      
      // Tạo phòng mới
      const playerName = await getPlayerName(api, senderID);
      
      // Lấy tiến trình người chơi
      const progression = getOrCreatePlayerProgression(senderID, playerName);
      
      console.log(`Đang tạo phòng với ${maxPlayers} người chơi tối đa, track: ${handleReply.trackType}`);
      
      const newRoom = new GameRoom(threadID, maxPlayers, options);
      newRoom.setCreator(senderID); // Đảm bảo người tạo phòng được đặt làm chủ phòng
      newRoom.addPlayer(senderID, playerName);
      rooms.set(threadID, newRoom);
      
      // Tạo thông báo với thông tin tùy chỉnh xe của người chơi
      let carInfo = "";
      if (progression.car && progression.car.color) {
        // Tránh truy cập CAR_CUSTOMIZATIONS trực tiếp vì có thể không tồn tại trong scope này
        carInfo = `\n- Màu xe của bạn: ${progression.car.color}`;
      }
      
      return api.sendMessage(
        `🏎️ Đã tạo phòng đua xe thành công!\n` +
        `- Map: ${options.trackType.toUpperCase()}\n` +
        `- Số người tối đa: ${maxPlayers}\n` +
        `- Thời tiết động: Bật${carInfo}\n\n` +
        `- Dùng 'pcar join' để mời người khác tham gia\n` +
        `- Dùng 'pcar addbot' để thêm bot\n` +
        `- Dùng 'pcar customize' để tùy chỉnh xe\n` +
        `- Dùng 'pcar start' để bắt đầu đua`,
        threadID, 
        messageID
      );
    } catch (error) {
      console.error("Lỗi khi tạo phòng:", error);
      return api.sendMessage(
        `⚠️ Đã xảy ra lỗi khi tạo phòng: ${error.message}\nVui lòng thử lại.`,
        threadID,
        messageID
      );
    }
  }
  
  // Xử lý nếu đang trong cuộc đua
  if (!rooms.has(threadID)) return;
  
  const room = rooms.get(threadID);
  if (!room.started) return;
  
  // Check if reply is a valid command
  const validCommands = ["right", "left", "boost", "brake", "jump", "skill"];
  const command = body.toLowerCase();
  
  if (!validCommands.includes(command)) {
    return api.sendMessage(
      "Lệnh không hợp lệ! Sử dụng: right, left, boost, brake, jump, skill", 
      threadID, 
      messageID
    );
  }
  
  // Find player in room
  const player = room.players.find(p => p.playerId === senderID);
  if (!player) {
    return api.sendMessage("Bạn không tham gia cuộc đua này.", threadID, messageID);
  }
  
  // Khởi tạo biến để theo dõi các sự kiện trong lượt
  let eventMessages = [];
  let skillUsed = false;
  
  // Xử lý dùng kỹ năng
  if (command === "skill") {
    const skillResult = player.useSkill(room);
    skillUsed = true;
    eventMessages.push(`👑 ${player.name}: ${skillResult}`);
  } else {
    // Apply player move
    player.move(command);
  }
  
  // Kiểm tra va chạm với chướng ngại vật
  const collisions = player.checkObstacleCollisions(room);
  if (collisions.length > 0) {
    eventMessages.push(...collisions.map(c => c.message));
  }
  
  // Process bot moves
  const botResult = room.processBotMoves();
  const botMoves = botResult.moves;
  const botSkillUses = botResult.skillUses;
  
  let botActionsText = "";
  if (botMoves.length > 0 || botSkillUses.length > 0) {
    botActionsText = "\n\n🤖 Các BOT đã di chuyển:";
    
    // Hiển thị các lần sử dụng skill của bot
    if (botSkillUses.length > 0) {
      botSkillUses.forEach(skill => {
        botActionsText += `\n- ${skill.player}: ${skill.skillResult}`;
      });
    }
    
    // Hiển thị các di chuyển của bot
    if (botMoves.length > 0) {
      botMoves.forEach(move => {
        botActionsText += `\n- ${move.player}: ${move.move}`;
      });
    }
  }
  
  // Increment turn
  room.turn++;
  
  // Check for winner
  if (room.isFinished()) {
    const winner = room.getWinner();
    
    // Cập nhật thống kê người chơi
    if (!winner.isBot) {
      // Tăng số lần thắng cho người thắng
      if (!playerStats.has(winner.playerId)) {
        playerStats.set(winner.playerId, {
          name: winner.name,
          wins: 0,
          races: 0,
          bestTime: null
        });
      }
      
      const stats = playerStats.get(winner.playerId);
      stats.wins++;
      stats.races++;
      if (!stats.bestTime || room.turn < stats.bestTime) {
        stats.bestTime = room.turn;
      }
      stats.name = winner.name; // Cập nhật tên mới nhất
      
      // Cập nhật thống kê cho các người chơi khác
      for (const player of room.players) {
        if (!player.isBot && player.playerId !== winner.playerId) {
          if (!playerStats.has(player.playerId)) {
            playerStats.set(player.playerId, {
              name: player.name,
              wins: 0,
              races: 1,
              bestTime: null
            });
          } else {
            const otherStats = playerStats.get(player.playerId);
            otherStats.races++;
            otherStats.name = player.name; // Cập nhật tên mới nhất
          }
        }
      }
      
      // Lưu thống kê
      savePlayerStats();
    }
    
    // Generate final race image
    const canvas = generateRaceCanvas(room);
    const filePath = __dirname + "/cache/race_final_" + threadID + ".png";
    
    const writeStream = fs.createWriteStream(filePath);
    const stream = canvas.createPNGStream();
    stream.pipe(writeStream);
    
    writeStream.on('finish', () => {
      // Chuẩn bị thông tin người thắng cuộc
      let winnerText = `🏆 CUỘC ĐUA KẾT THÚC! 🏆\n\n${winner.isBot ? "Bot" : "Người chơi"} ${winner.name} đã về đích đầu tiên sau ${room.turn} lượt!`;
      
      // Hiển thị thông tin chi tiết về người thắng
      const winnerDetails = [];
      
      // Thông tin kỹ năng
      if (winner.skill) {
        winnerDetails.push(`Kỹ năng: ${winner.skill.displayName}`);
      }
      
      // Tốc độ trung bình
      const avgSpeed = (winner.totalSpeed / room.turn).toFixed(1);
      winnerDetails.push(`Tốc độ trung bình: ${avgSpeed}`);
      
      // Thông tin tùy chỉnh xe 
      if (winner.customization) {
        let customStr = "Xe tùy chỉnh:";
        if (winner.customization.color) {
          customStr += ` Màu ${winner.customization.color}`;
        }
        if (winner.customization.decal && winner.customization.decal.id !== 'none') {
          customStr += `, Decal ${winner.customization.decal.id}`;
        }
        winnerDetails.push(customStr);
      }
      
      // Thêm thông tin chi tiết vào tin nhắn
      if (winnerDetails.length > 0) {
        winnerText += "\n* " + winnerDetails.join("\n* ");
      }
      
      // Kiểm tra và cập nhật kỷ lục cá nhân nếu là người thật
      let newRecordText = "";
      if (!winner.isBot) {
        // Lấy thông tin tiến trình của người chơi
        const progression = getOrCreatePlayerProgression(winner.playerId, winner.name);
        
        // Cập nhật số lượt thắng
        progression.stats.wins = (progression.stats.wins || 0) + 1;
        progression.stats.races = (progression.stats.races || 0) + 1;
        
        // Kiểm tra kỷ lục thời gian
        if (!progression.stats.bestTime || room.turn < progression.stats.bestTime) {
          progression.stats.bestTime = room.turn;
          newRecordText = `\n🎯 KỶ LỤC MỚI! ${winner.name} đã phá kỷ lục cá nhân với ${room.turn} lượt!`;
        }
        
        // Cập nhật XP
        const oldLevel = calculateLevel(progression.xp || 0);
        const xpGain = winner.getWinXP(room);
        progression.xp = (progression.xp || 0) + xpGain;
        const newLevel = calculateLevel(progression.xp);
        
        newRecordText += `\n💫 +${xpGain}XP`;
        
        // Kiểm tra lên cấp
        if (newLevel > oldLevel) {
          newRecordText += `\n🌟 LEVEL UP! ${winner.name} đã lên cấp ${newLevel}!`;
          
          // Kiểm tra vật phẩm mở khóa mới
          try {
            const newItems = getNewlyUnlockedItems(oldLevel, newLevel);
            if (newItems && newItems.length > 0) {
              newRecordText += `\n🎁 Đã mở khóa: ${newItems.map(i => i.name || i.id).join(', ')}`;
            }
          } catch (error) {
            console.error("Lỗi khi lấy vật phẩm mở khóa:", error);
            newRecordText += `\n🎁 Đã mở khóa vật phẩm mới! (Lên cấp ${newLevel})`;
          }
        }
        
        // Lưu thông tin người chơi
        savePlayerData();
      }
      
      // Hiển thị thông tin xếp hạng của các người chơi khác
      const sortedPlayers = [...room.players].sort((a, b) => b.position - a.position);
      winnerText += "\n\n📊 KẾT QUẢ CUỐI CÙNG:";
      for (let i = 0; i < sortedPlayers.length; i++) {
        const p = sortedPlayers[i];
        const rankEmojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        const rankEmoji = i < rankEmojis.length ? rankEmojis[i] : `${i+1}.`;
        
        // Highlight cho người thắng
        const isWinner = p.playerId === winner.playerId;
        const playerDisplay = isWinner ? `💫 ${p.name}${p.isBot ? ' 🤖' : ''}` : `${p.name}${p.isBot ? ' 🤖' : ''}`;
        
        // Thêm thông tin vị trí và tốc độ
        const avgPlayerSpeed = (p.totalSpeed / room.turn).toFixed(1);
        winnerText += `\n${rankEmoji} ${playerDisplay} - Vị trí: ${Math.round(p.position)}/${TRACK_LENGTH} (Tốc độ TB: ${avgPlayerSpeed})`;
      }
      
      // Thêm thông tin kỷ lục và cấp độ
      if (newRecordText) {
        winnerText += `\n\n${newRecordText}`;
      }
      
      // Thêm lời nhắc cuối cùng
      winnerText += "\n\n🎮 Dùng 'pcar create' để tạo cuộc đua mới!";
      winnerText += "\n🏆 Dùng 'pcar top' để xem bảng xếp hạng.";
      
      api.sendMessage(
        {
          body: winnerText,
          attachment: fs.createReadStream(filePath)
        },
        threadID
      );
      
      // Clean up
      rooms.delete(threadID);
    });
    
    return;
  }
  
  // Generate updated race image
  const canvas = generateRaceCanvas(room);
  const filePath = __dirname + "/cache/race_" + threadID + ".png";
  
  const writeStream = fs.createWriteStream(filePath);
  const stream = canvas.createPNGStream();
  stream.pipe(writeStream);
  
  writeStream.on('finish', () => {
    // Tạo nội dung tin nhắn
    let messageBody = `🏎️ Lượt ${room.turn}:`;
    
    if (skillUsed) {
      messageBody += `\n${player.name} đã sử dụng kỹ năng!`;
    } else {
      messageBody += `\n${player.name} đã di chuyển: ${command}`;
    }
    
    // Thêm thông tin sự kiện trong lượt
    if (eventMessages.length > 0) {
      messageBody += "\n\n📢 Sự kiện:";
      eventMessages.forEach(msg => {
        messageBody += `\n${msg}`;
      });
    }
    
    // Thêm thông tin di chuyển của bot
    messageBody += botActionsText;
    
    // Thêm hướng dẫn cho lượt tiếp theo
    messageBody += "\n\n⚡ Reply để tiếp tục!";
    messageBody += "\n- Di chuyển: right, left, boost, brake, jump";
    messageBody += "\n- Dùng kỹ năng đặc biệt: skill";
    
    api.sendMessage(
      {
        body: messageBody,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      (err, info) => {
        if (err) return console.error(err);
        
        // Update last message ID and set up new reply handler
        room.lastMessageId = info.messageID;
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID
        });
      }
    );
  });
};
