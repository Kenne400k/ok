const fs = require('fs');
const { createCanvas } = require('canvas');

// Import các module
const { Car } = require('./utils/car');
const { GameRoom } = require('./utils/gameRoom');
const { Tournament } = require('./utils/tournament');
const { savePlayerData, loadPlayerData, getOrCreatePlayerProgression, checkAndAwardAchievements } = require('./utils/progression');
const { generateRaceCanvas, generateRaceResultsCanvas } = require('./utils/canvasRenderer');
const { TRACK_LENGTH, LANE_HEIGHT, MAX_PLAYERS, CANVAS_WIDTH, CELL_WIDTH } = require('./utils/constants');

// Global state
const rooms = new Map(); // threadID -> GameRoom
const tournaments = new Map(); // tournamentId -> Tournament
const playerProgression = new Map(); // playerId -> progression data
const playerStats = new Map(); // playerId -> player stats

// Load data when module is first required
loadPlayerData();

// Module configuration as per messenger-bot requirements
module.exports.config = {
  name: "pcar",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Thiện Phát",
  description: "Mini-game đua xe console trên Messenger với các tính năng nâng cao",
  commandCategory: "game",
  usages: "pcar [create|join|start|leave|status|addbot|stop|info|top|profile|garage|customize|tournament|leaderboard|achievements]",
  cooldowns: 0
};

// Auxiliary helper function
async function getPlayerName(api, userId) {
  try {
    const user = await api.getUserInfo(userId);
    return user[userId].name || userId;
  } catch (error) {
    return userId; // Fallback to ID if name can't be fetched
  }
}

// Handle command execution
module.exports.run = async function({ api, event, args }) {
  const { threadID, senderID } = event;
  
  // Load commands from game controller
  const gameController = require('./utils/gameController');
  
  // Basic command parsing
  const command = args[0]?.toLowerCase();
  const subArgs = args.slice(1);
  
  // Get player name for better user experience
  const playerName = await getPlayerName(api, senderID);
  
  // Route command to appropriate handler
  if (gameController.hasCommand(command)) {
    return gameController.executeCommand({
      command,
      args: subArgs,
      api,
      event,
      playerName,
      senderID,
      threadID,
      rooms,
      tournaments,
      playerProgression,
      playerStats
    });
  }
  
  // Default help message if no valid command
  return api.sendMessage(`🏎️ PCar Racing 2.0 - Trò chơi đua xe Messenger

Các lệnh có sẵn:
👉 pcar create - Tạo phòng đua mới
👉 pcar join - Tham gia phòng đua
👉 pcar addbot - Thêm bot vào phòng đua
👉 pcar start - Bắt đầu đua
👉 pcar status - Xem trạng thái phòng đua
👉 pcar info - Xem thông tin người chơi
👉 pcar leave - Rời phòng đua
👉 pcar stop - Kết thúc cuộc đua
👉 pcar profile - Xem hồ sơ cá nhân
👉 pcar garage - Xem garage xe
👉 pcar customize <loại> <id> - Tùy chỉnh xe
👉 pcar tournament - Quản lý giải đấu
👉 pcar leaderboard - Xem bảng xếp hạng
👉 pcar achievements - Xem thành tích

Chế độ đua nhiều vòng (multi-lap) và thống kê hiệu suất đã được cập nhật!`, threadID);
};

// Handle replies (race moves, menu selections, etc.)
module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, senderID, messageID, body } = event;
  
  // Load reply handlers
  const replyHandler = require('./utils/replyHandler');
  
  // Check if there's a valid room for this thread
  const room = rooms.get(threadID);
  if (!room && handleReply.type !== 'create_room' && handleReply.type !== 'tournament_creation') {
    return api.sendMessage("⚠️ Không có phòng đua nào đang hoạt động trong nhóm này!", threadID);
  }
  
  // Route to appropriate reply handler
  if (replyHandler.canHandle(handleReply.type)) {
    return replyHandler.handle({
      type: handleReply.type,
      api,
      event,
      handleReply,
      room,
      senderID,
      threadID,
      messageID,
      body,
      rooms,
      tournaments,
      playerProgression
    });
  }
  
  // Default response if no handler found
  return api.sendMessage("⚠️ Không thể xử lý phản hồi này!", threadID);
};

// Export key objects for other modules to use
module.exports.gameState = {
  rooms,
  tournaments,
  playerProgression,
  playerStats
};