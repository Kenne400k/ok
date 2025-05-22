const fs = require("fs");
const path = require("path");

// Xác định đường dẫn config.json (dựa trên vị trí thực tế bạn mô tả)
const configPath = path.resolve(__dirname, "../../config.json");
// Đọc ADMINBOT từ config.json
let adminID = "";
try {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (Array.isArray(config.ADMINBOT)) {
    // Lấy phần tử đầu tiên không rỗng
    adminID = config.ADMINBOT.find(id => id && id.trim() !== "") || "";
  }
} catch (e) {
  console.error("Không thể đọc ADMINBOT từ config.json:", e);
  adminID = "";
}

const nickname_ad = "🔥 𝘼𝙙𝙢𝙞𝙣 𝘽𝙤𝙩 🔥";
let status = true;

module.exports.config = {
  name: 'antibdad',
  version: '0.0.1',
  hasPermssion: 2,
  credits: 'DC-Nam (fix by Kenne400k)',
  description: 'Tự đổi bd admin',
  commandCategory: 'Admin',
  usages: '[]',
  cooldowns: 3
};

module.exports.handleEvent = async o => {
  let {
    threadID: tid,
    messageID: mid,
    senderID: sid,
    isGroup,
  } = o.event;

  if (sid == o.api.getCurrentUserID() || !isGroup || !status || !adminID) return;

  let thread = await o.Threads.getData(tid) || {};
  let info = thread.threadInfo;
  if (!info) return;

  let nickname = info.nicknames?.[adminID];
  if (nickname !== nickname_ad) {
    try {
      await o.api.changeNickname(nickname_ad, tid, adminID);
    } catch (e) {
      // Không cần báo lỗi, có thể không đủ quyền
    }
  }
};

module.exports.run = () => {};