const { Car } = require('./car');
const { TRACK_LENGTH, MAX_PLAYERS, WEATHER_TYPES, XP_LEVELS, BOT_DIFFICULTIES, CAR_CUSTOMIZATIONS } = require('./constants');
const { checkAndAwardAchievements } = require('./progression');

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
    this.lapProgress = []; // Số vòng đã hoàn thành của mỗi người chơi
    
    // Khởi tạo lapProgress với đủ mảng phần tử chứa 0 cho mỗi người chơi
    this.lapProgress = Array(maxPlayers).fill(0); // Track laps for each player
    
    // Race statistics for achievements and XP
    this.raceStats = {
      startTime: null,
      positions: {}, // Track position changes for comeback achievements
      lastPlace: null
    };
    
    // Đảm bảo trackType luôn có giá trị hợp lệ
    if (!this.options.trackType) {
      this.options.trackType = this.getRandomTrackType();
    }
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
    
    // Create player car with progression-based customization
    const newCar = new Car(playerId, name || `Player ${this.players.length + 1}`);
    
    // Tìm dữ liệu tiến trình của người chơi từ module progression
    try {
      const { getOrCreatePlayerProgression } = require('./progression');
      if (typeof getOrCreatePlayerProgression === 'function') {
        const progression = getOrCreatePlayerProgression(playerId, name);
        if (progression) {
          // Apply car customizations based on player's level
          this.applyPlayerCustomizations(newCar, progression);
        }
      }
    } catch (error) {
      console.log("Không thể áp dụng tùy chỉnh xe:", error.message);
    }
    
    this.players.push(newCar);
    
    // Nếu chưa có người tạo phòng, người đầu tiên tham gia sẽ là chủ phòng
    if (!this.creator) {
      this.setCreator(playerId);
    }
    
    return true;
  }
  
  applyPlayerCustomizations(car, progression) {
    // Đảm bảo dữ liệu progression.car tồn tại
    if (!progression.car) return;
    
    // Lấy thông tin CAR_CUSTOMIZATIONS từ module constants
    try {
      // Apply customizations based on player's saved preferences and level
      const playerLevel = progression.level || 1;
      
      // Apply color if unlocked
      if (progression.car.color) {
        const colorItem = CAR_CUSTOMIZATIONS.colors.find(c => c.id === progression.car.color);
        if (colorItem && playerLevel >= colorItem.unlockLevel) {
          car.setCustomization('color', progression.car.color);
        }
      }
      
      // Apply other customizations if unlocked
      const customizationTypes = {
        'decal': 'decals',
        'wheels': 'wheels',
        'spoiler': 'spoilers',
        'nitro': 'nitros'
      };
      
      // Áp dụng từng loại tùy chỉnh
      for (const [part, partPlural] of Object.entries(customizationTypes)) {
        if (progression.car[part]) {
          const partId = progression.car[part];
          if (CAR_CUSTOMIZATIONS[partPlural]) {
            const partItem = CAR_CUSTOMIZATIONS[partPlural].find(p => p.id === partId);
            if (partItem && playerLevel >= partItem.unlockLevel) {
              car.setCustomization(part, partId);
            }
          }
        }
      }
      
      // Apply stats to the car
      car.applyCustomizationStats();
    } catch (error) {
      console.log("Lỗi khi áp dụng tùy chỉnh xe:", error.message);
    }
  }

  addBot(difficulty = null) {
    if (this.players.length >= this.maxPlayers) return false;
    
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
      botCar.setCustomization('booster', 'turbo');
      botCar.setCustomization('engine', 'v8');
    }
    
    this.players.push(botCar);
    return true;
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
    
    // Prepare race statistics summary for all players
    const raceStats = this.generateRaceStats();
    
    // Only record progression stats for human players
    if (!winner.isBot) {
      // Check if player had a comeback (was last at some point)
      const hadComeback = this.raceStats.lastPlace === winner.playerId;
      winner.hadComeback = winner.hadComeback || hadComeback;
      
      // Record weather win for achievements
      if (global.playerProgression && global.playerProgression.has(winner.playerId)) {
        const progression = global.playerProgression.get(winner.playerId);
        
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
        
        // Save progression
        global.playerProgression.set(winner.playerId, progression);
        
        // Tournament match handling
        if (this.options.tournamentMatch) {
          const { tournamentId, matchId } = this.options.tournamentMatch;
          const tournament = global.tournaments.get(tournamentId);
          
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
    for (const category in global.CAR_CUSTOMIZATIONS) {
      for (const item of global.CAR_CUSTOMIZATIONS[category]) {
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

module.exports = { GameRoom };