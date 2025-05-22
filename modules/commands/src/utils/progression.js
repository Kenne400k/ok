/**
 * Hệ thống tiến trình và thành tựu của người chơi
 */
const fs = require('fs');
const path = require('path');
const db = require('./databaseManager');

// Các biến để lưu tiến trình người chơi trong bộ nhớ
let playerProgression = new Map(); // playerId -> { xp, level, achievements, car, seasonPoints, ... }
let playerStats = new Map(); // playerId -> { wins, races, bestTime }

// Các cấp độ và XP cần thiết
const XP_LEVELS = [
  { level: 1, xpNeeded: 0 },
  { level: 2, xpNeeded: 100 },
  { level: 3, xpNeeded: 250 },
  { level: 4, xpNeeded: 500 },
  { level: 5, xpNeeded: 900 },
  { level: 6, xpNeeded: 1500 },
  { level: 7, xpNeeded: 2300 },
  { level: 8, xpNeeded: 3500 },
  { level: 9, xpNeeded: 5000 },
  { level: 10, xpNeeded: 7000 },
  { level: 11, xpNeeded: 9500 },
  { level: 12, xpNeeded: 12500 },
  { level: 13, xpNeeded: 16000 },
  { level: 14, xpNeeded: 20000 },
  { level: 15, xpNeeded: 25000 },
  { level: 16, xpNeeded: 30000 },
  { level: 17, xpNeeded: 36000 },
  { level: 18, xpNeeded: 43000 },
  { level: 19, xpNeeded: 51000 },
  { level: 20, xpNeeded: 60000 },
  { level: 21, xpNeeded: 70000 },
  { level: 22, xpNeeded: 85000 },
  { level: 23, xpNeeded: 100000 },
  { level: 24, xpNeeded: 120000 },
  { level: 25, xpNeeded: 150000 }
];

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

// Lưu dữ liệu người chơi vào database
function savePlayerData() {
  try {
    // Lưu vào database
    db.saveAllPlayerData(playerProgression, playerStats);
    return true;
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu người chơi:", error);
    return false;
  }
}

// Tải dữ liệu người chơi từ database
function loadPlayerData() {
  try {
    // Tải từ database
    const data = db.loadAllPlayerData();
    playerProgression = data.progression;
    playerStats = data.stats;
    return true;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu người chơi:", error);
    // Khởi tạo Maps trống nếu có lỗi
    playerProgression = new Map();
    playerStats = new Map();
    return false;
  }
}

// Lấy hoặc tạo tiến trình người chơi
function getOrCreatePlayerProgression(playerId, playerName) {
  if (!playerProgression.has(playerId)) {
    // Tạo đối tượng mới cho người chơi mới
    playerProgression.set(playerId, {
      name: playerName,
      xp: 0,
      level: 1,
      achievements: [],
      car: {
        color: null,
        decal: null,
        wheels: null,
        spoiler: null,
        nitro: null
      },
      seasonPoints: 0,
      stats: {
        wins: 0,
        races: 0,
        bestTime: null
      }
    });
    
    // Lưu ngay khi tạo người chơi mới
    savePlayerData();
  } else {
    // Cập nhật tên người chơi mỗi khi họ xuất hiện
    const progression = playerProgression.get(playerId);
    progression.name = playerName;
  }
  
  return playerProgression.get(playerId);
}

// Kiểm tra và trao thành tựu
function checkAndAwardAchievements(playerId) {
  const progression = playerProgression.get(playerId);
  if (!progression) return { newAchievements: [] };
  
  const newAchievements = [];
  
  // Kiểm tra từng thành tựu
  for (const achievement of ACHIEVEMENTS) {
    // Bỏ qua thành tựu đã đạt được
    if (progression.achievements && progression.achievements.includes(achievement.id)) {
      continue;
    }
    
    // Kiểm tra điều kiện
    if (achievement.condition(progression)) {
      console.log(`Người chơi ${progression.name} đã đạt được thành tựu: ${achievement.name}`);
      
      // Award achievement
      if (!progression.achievements) progression.achievements = [];
      progression.achievements.push(achievement.id);
      
      // Award XP
      progression.xp += achievement.xpReward;
      
      // Track for notification
      newAchievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        xpReward: achievement.xpReward,
        icon: achievement.icon
      });
      
      // Lưu thành tựu vào database
      db.addAchievement(playerId, achievement.id);
    }
  }
  
  // Check for level up
  const previousLevel = progression.level || 1;
  const newLevel = calculateLevel(progression.xp);
  
  if (newLevel > previousLevel) {
    progression.level = newLevel;
    
    // Get newly unlocked items
    const unlockedItems = getNewlyUnlockedItems(previousLevel, newLevel);
    if (unlockedItems && unlockedItems.length > 0) {
      if (!progression.unlockedItems) progression.unlockedItems = [];
      progression.unlockedItems = progression.unlockedItems.concat(unlockedItems);
      
      // Lưu các vật phẩm mở khóa vào database
      for (const item of unlockedItems) {
        db.addUnlockedItem(playerId, item.type, item.id);
      }
    }
  }
  
  // Save if changed
  if (newAchievements.length > 0 || newLevel > previousLevel) {
    savePlayerData();
  }
  
  return {
    newAchievements,
    levelUp: newLevel > previousLevel,
    newLevel,
    unlockedItems: newLevel > previousLevel ? getNewlyUnlockedItems(previousLevel, newLevel) : []
  };
}

// Calculate player level from XP
function calculateLevel(xp) {
  // Find the highest level that the player has enough XP for
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].xpNeeded) {
      return XP_LEVELS[i].level;
    }
  }
  return 1; // Default level
}

// Get items newly unlocked between oldLevel and newLevel
function getNewlyUnlockedItems(oldLevel, newLevel) {
  if (oldLevel >= newLevel) return [];
  
  const unlockedItems = [];
  
  try {
    // Find all items unlocked between old and new levels
    for (const category in CAR_CUSTOMIZATIONS) {
      for (const item of CAR_CUSTOMIZATIONS[category]) {
        if (item.unlockLevel > oldLevel && item.unlockLevel <= newLevel) {
          unlockedItems.push({
            type: category,
            id: item.id,
            name: item.name,
            stats: item.stats || {}
          });
        }
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy vật phẩm mở khóa:', error);
  }
  
  return unlockedItems;
}

// Check if player has the given achievement
function hasAchievement(playerId, achievementId) {
  const progression = playerProgression.get(playerId);
  if (!progression || !progression.achievements) return false;
  
  return progression.achievements.includes(achievementId);
}

// Get season leaderboard
function getSeasonLeaderboard(limit = 10) {
  return db.getSeasonLeaderboard(limit);
}

// Hàm xuất module
module.exports = {
  loadPlayerData,
  savePlayerData,
  getOrCreatePlayerProgression,
  checkAndAwardAchievements,
  calculateLevel,
  getNewlyUnlockedItems,
  hasAchievement,
  getSeasonLeaderboard,
  ACHIEVEMENTS,
  XP_LEVELS
};