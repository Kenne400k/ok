const { BOT_DIFFICULTIES, CAR_CUSTOMIZATIONS, TRACK_LENGTH, WEATHER_TYPES, SKILLS } = require('./constants');

// Class định nghĩa xe đua
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
    
    // Chọn skill ngẫu nhiên cho xe (sử dụng SKILLS từ constants)
    if (SKILLS && SKILLS.length > 0) {
      const randomSkillIndex = Math.floor(Math.random() * SKILLS.length);
      this.skill = { 
        ...SKILLS[randomSkillIndex],
        cooldownRemaining: 0 
      };
    } else {
      // Fallback nếu không có skills
      this.skill = {
        name: "basic_boost",
        displayName: "🚀 Basic Boost",
        description: "Tăng tốc nhẹ",
        cooldown: 3,
        cooldownRemaining: 0
      };
    }
    
    // Initialize car customizations with defaults (có kiểm tra an toàn)
    this.customization = {
      color: (CAR_CUSTOMIZATIONS.colors && CAR_CUSTOMIZATIONS.colors.length > 0) ? CAR_CUSTOMIZATIONS.colors[0] : { id: "red", name: "Đỏ", value: "#FF0000" },
      decal: (CAR_CUSTOMIZATIONS.decals && CAR_CUSTOMIZATIONS.decals.length > 0) ? CAR_CUSTOMIZATIONS.decals[0] : { id: "none", name: "Không có", value: null },
      wheels: (CAR_CUSTOMIZATIONS.wheels && CAR_CUSTOMIZATIONS.wheels.length > 0) ? CAR_CUSTOMIZATIONS.wheels[0] : { id: "standard", name: "Tiêu chuẩn", value: "standard" },
      spoiler: (CAR_CUSTOMIZATIONS.spoilers && CAR_CUSTOMIZATIONS.spoilers.length > 0) ? CAR_CUSTOMIZATIONS.spoilers[0] : { id: "none", name: "Không có", value: null },
      nitro: (CAR_CUSTOMIZATIONS.nitros && CAR_CUSTOMIZATIONS.nitros.length > 0) ? CAR_CUSTOMIZATIONS.nitros[0] : { id: "none", name: "Không có", value: null }
    };
    
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
    try {
      // Reset to base values
      this.maxSpeed = this.baseMaxSpeed;
      this.acceleration = 0.5;
      this.handling = 1.0;
      this.braking = 1.0;
      this.boostPower = 1.0;
      this.weatherResistance = 1.0;
      
      // Ensure customization object exists
      if (!this.customization) {
        this.customization = {};
        return;
      }
      
      // Apply customization bonuses (với kiểm tra an toàn)
      const partsMapping = {
        'decal': 'decal',
        'wheels': 'wheels',
        'booster': 'booster',
        'spoiler': 'spoiler',
        'nitro': 'nitro',
        'engine': 'engine'
      };
      
      // Lặp qua từng loại phụ tùng và áp dụng nếu có
      for (const [part, mappedKey] of Object.entries(partsMapping)) {
        if (this.customization[part] && this.customization[part].stats) {
          const stats = this.customization[part].stats;
          
          // Áp dụng các thuộc tính với kiểm tra tồn tại
          if (typeof stats.speed === 'number') this.maxSpeed += stats.speed;
          if (typeof stats.acceleration === 'number') this.acceleration += stats.acceleration;
          if (typeof stats.handling === 'number') this.handling += stats.handling;
          if (typeof stats.braking === 'number') this.braking += stats.braking;
          if (typeof stats.boostPower === 'number') this.boostPower += stats.boostPower;
          if (typeof stats.boostDuration === 'number') this.boostDuration = stats.boostDuration;
          if (typeof stats.weatherResistance === 'number') this.weatherResistance += stats.weatherResistance;
        }
      }
      
      // Giới hạn giá trị tối thiểu cho các thuộc tính
      this.maxSpeed = Math.max(1, this.maxSpeed);
      this.acceleration = Math.max(0.1, this.acceleration);
      this.handling = Math.max(0.1, this.handling);
      this.braking = Math.max(0.1, this.braking);
      this.boostPower = Math.max(0.1, this.boostPower);
      this.weatherResistance = Math.max(0, this.weatherResistance);
      
      // Apply bot difficulty modifiers if this is a bot
      if (this.isBot && this.botSettings && typeof this.botSettings.speedMultiplier === 'number') {
        this.maxSpeed *= this.botSettings.speedMultiplier;
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng chỉ số tùy chỉnh xe:", error.message);
      // Đặt về giá trị mặc định nếu có lỗi
      this.maxSpeed = this.baseMaxSpeed;
      this.acceleration = 0.5;
      this.handling = 1.0;
      this.braking = 1.0;
      this.boostPower = 1.0;
      this.weatherResistance = 1.0;
    }
  }
  
  // Set car customization
  setCustomization(type, itemId) {
    try {
      // Ánh xạ type đến key trong CAR_CUSTOMIZATIONS
      const typeMapping = {
        'color': 'colors',
        'decal': 'decals',
        'wheels': 'wheels',
        'spoiler': 'spoilers',
        'nitro': 'nitros',
        'booster': 'boosters',
        'engine': 'engines'
      };
      
      const customizationType = typeMapping[type] || type;
      
      // Kiểm tra an toàn trước khi tìm kiếm
      if (!CAR_CUSTOMIZATIONS || !CAR_CUSTOMIZATIONS[customizationType] || 
          !Array.isArray(CAR_CUSTOMIZATIONS[customizationType])) {
        console.log(`Loại tùy chỉnh không hợp lệ: ${type} -> ${customizationType}`);
        return false;
      }
      
      const item = CAR_CUSTOMIZATIONS[customizationType].find(item => item && item.id === itemId);
      if (!item) {
        console.log(`Không tìm thấy item với ID ${itemId} cho loại ${customizationType}`);
        return false;
      }
      
      // Cập nhật tùy chỉnh
      this.customization[type] = item;
      
      // Nếu là màu sắc, cập nhật luôn thuộc tính color
      if (type === 'color' && item.value) {
        this.color = item.value;
      }
      
      // Tính toán lại chỉ số sau khi thay đổi tùy chỉnh
      this.applyCustomizationStats();
      
      return true;
    } catch (error) {
      console.error(`Lỗi khi tùy chỉnh xe (${type}, ${itemId}):`, error.message);
      return false;
    }
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
    
    try {
      // Sử dụng kỹ năng
      const result = this.skill.handler(this, room);
      
      // Thiết lập cooldown
      this.skill.cooldownRemaining = this.skill.cooldown;
      
      return result;
    } catch (error) {
      console.error("Lỗi khi sử dụng kỹ năng:", error.message);
      
      // Fallback nếu có lỗi
      this.position += 1;
      this.skill.cooldownRemaining = this.skill.cooldown || 3;
      
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
        maxSpeed: this.maxSpeed.toFixed(1),
        acceleration: this.acceleration.toFixed(1),
        handling: this.handling.toFixed(1),
        braking: this.braking.toFixed(1),
        boostPower: this.boostPower.toFixed(1)
      };
      
      // Tạo object customization an toàn với kiểm tra tồn tại của các thuộc tính
      const customization = {
        color: this.customization?.color?.name || "Mặc định",
        decal: this.customization?.decal?.name || "Không có",
        wheels: this.customization?.wheels?.name || "Tiêu chuẩn"
      };
      
      // Thêm các thuộc tính tùy chọn khác nếu có
      if (this.customization?.spoiler) {
        customization.spoiler = this.customization.spoiler.name;
      }
      
      if (this.customization?.nitro) {
        customization.nitro = this.customization.nitro.name;
      }
      
      if (this.customization?.booster) {
        customization.booster = this.customization.booster.name;
      }
      
      if (this.customization?.engine) {
        customization.engine = this.customization.engine.name;
      }
      
      return {
        name: this.name,
        position: this.position,
        speed: this.speed,
        health: this.health,
        effects: this.effects,
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
        name: this.name,
        position: this.position,
        speed: this.speed,
        health: 100,
        customization: { color: "Mặc định" },
        isBot: this.isBot
      };
    }
  }
}

module.exports = { Car };