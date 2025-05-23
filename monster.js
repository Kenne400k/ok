const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "monster",
  version: "2.7.0",
  hasPermssion: 0,
  credits: "kz (optimize: pcoder)",
  description: "Game Monster Hunter (quản lý nhân vật, săn quái, shop, túi đồ...)",
  commandCategory: "game",
  usages: "[tag]",
  cooldowns: 0
};

// Đường dẫn thư mục và file
const monsterDir = path.join(__dirname, "monster");
const monsterIndex = path.join(monsterDir, "index.js");
const monsterConfig = path.join(monsterDir, "config.json");

// Code mẫu index.js
const defaultIndex = `const fs = require("fs");
const path = require("path");
// Đường dẫn config
const configPath = path.join(__dirname, "config.json");
// Tạo config mặc định nếu chưa tồn tại hoặc thiếu field
function ensureConfig() {
  const defaultConfig = {
    fix: "https://i.imgur.com/UfQJdEK.jpg",
    monster: "https://i.imgur.com/1DhiB6b.jpg"
  };
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  let userConfig = {};
  try { userConfig = JSON.parse(fs.readFileSync(configPath, "utf8")); }
  catch { userConfig = {}; }
  let changed = false;
  for (let key in defaultConfig) {
    if (!(key in userConfig)) {
      userConfig[key] = defaultConfig[key];
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(configPath, JSON.stringify(userConfig, null, 2));
  return userConfig;
}
ensureConfig();
module.exports = {
  async createCharecter({ Users, api, event }) {
    const uid = event.senderID;
    return api.sendMessage("✅ Đã tạo nhân vật thành công!", event.threadID, event.messageID);
  },
  async getCharacter({ api, event }) {
    return api.sendMessage("📋 Thông tin nhân vật của bạn: ...", event.threadID, event.messageID);
  },
  async getServer({ api, event }) {
    return api.sendMessage("🌐 Server MonsterHunter đang hoạt động tốt!", event.threadID, event.messageID);
  },
  async myItem({ api, event }) {
    return api.sendMessage("🎒 Túi đồ của bạn: ...", event.threadID, event.messageID);
  },
  async match({ api, event }) {
    return api.sendMessage("⚔️ Bạn đã bước vào trận chiến với quái vật!", event.threadID, event.messageID);
  },
  async listLocation({ api, event }) {
    return api.sendMessage("📍 Danh sách bãi săn: ...", event.threadID, event.messageID);
  },
  async getItems({ api, event, type }) {
    return api.sendMessage(\`🛒 Danh sách vật phẩm loại [\${type}]: ...\`, event.threadID, event.messageID);
  },
  async buyItem({ api, event, idItem, Currencies, handleReply }) {
    return api.sendMessage(\`✅ Đã mua vật phẩm ID \${idItem}\`, event.threadID, event.messageID);
  },
  async setItem({ api, event, idItem, handleReply }) {
    return api.sendMessage(\`🎽 Đã trang bị vật phẩm ID \${idItem}\`, event.threadID, event.messageID);
  },
  async increaseDurability({ api, event, Currencies, handleReply }) {
    return api.sendMessage("🛠️ Đã sửa độ bền vũ khí!", event.threadID, event.messageID);
  },
  async setLocationID({ api, event, id, handleReply }) {
    return api.sendMessage(\`📍 Đã chọn bãi săn ID \${id}\`, event.threadID, event.messageID);
  }
};
`;

// Code mẫu config.json
const defaultConfig = {
  fix: "https://i.imgur.com/UfQJdEK.jpg",
  monster: "https://i.imgur.com/1DhiB6b.jpg"
};

// Hàm đảm bảo file/folder tồn tại
function ensureMonsterModule() {
  if (!fs.existsSync(monsterDir)) fs.mkdirSync(monsterDir, { recursive: true });
  if (!fs.existsSync(monsterIndex)) fs.writeFileSync(monsterIndex, defaultIndex, "utf8");
  if (!fs.existsSync(monsterConfig)) fs.writeFileSync(monsterConfig, JSON.stringify(defaultConfig, null, 2));
}
ensureMonsterModule();

module.exports.onLoad = function() {
  try {
    ensureMonsterModule();
    global.monster = require(monsterIndex);
    global.configMonster = require(monsterConfig);
  } catch (e) {
    console.log("[MONSTER] Lỗi load module:", e);
  }
};

module.exports.run = async function({ api, event, args, Users }) {
  try {
    ensureMonsterModule();
    if (!global.monster || !global.configMonster) {
      return api.sendMessage("❌ Không thể load dữ liệu game, hãy kiểm tra lại thư mục monster!", event.threadID, event.messageID);
    }
    const tag = (args[0] || "").toLowerCase();
    switch (tag) {
      case "create": return global.monster.createCharecter({ Users, api, event });
      case "info": return global.monster.getCharacter({ api, event });
      case "status": return global.monster.getServer({ api, event });
      case "shop":
        return api.sendMessage(
          "《 𝐀𝐒𝐓𝐄𝐑𝐀 》\n\n1. Mua vũ khí🗡\n2. Mua thức ăn🍗\n3. Bán quái vật💵\n\n✨Reply theo STT để chọn✨",
          event.threadID,
          (err, info) => {
            if (err) return;
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "listItem"
            });
          },
          event.messageID
        );
      case "bag": return global.monster.myItem({ api, event });
      case "fix":
      case "fixditmemay":
        try {
          const stream = (await axios.get(global.configMonster.fix, { responseType: 'stream' })).data;
          return api.sendMessage({
            body: "Lưu ý: chỉ được sửa độ bền của vũ khí đang sử dụng!\nĐộ bền tối đa 10.000/1 vũ khí",
            attachment: stream
          }, event.threadID, (err, info) => {
            if (err) return;
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "increaseDurability"
            });
          }, event.messageID);
        } catch (err) {
          return api.sendMessage("❌ Không tải được ảnh fix!", event.threadID, event.messageID);
        }
      case "match":
      case "fight":
      case "pvp":
        return global.monster.match({ api, event });
      case "location":
        return global.monster.listLocation({ api, event });
      default: {
        try {
          const stream = (await axios.get(global.configMonster.monster, { responseType: 'stream' })).data;
          return api.sendMessage({
            body:
              "《𝐌𝐎𝐍𝐒𝐓𝐄𝐑 𝐇𝐔𝐍𝐓𝐄𝐑》\n" +
              "Các tag:\n" +
              "1. create: tạo nhân vật\n" +
              "2. info: xem thông số nhân vật\n" +
              "3. shop: mở cửa hàng\n" +
              "4. bag: mở túi đồ để trang bị và sử dụng vật phẩm\n" +
              "5. fix: sửa trang bị\n" +
              "6. match/pvp/fight: săn quái\n" +
              "7. location: chọn bãi săn\n" +
              "8. status: thông tin server\n\n" +
              `Nhập /monster + [tag] để sử dụng\n\n` +
              `Ví dụ: /monster create`,
            attachment: stream
          }, event.threadID, event.messageID);
        } catch (e) {
          return api.sendMessage(
            "《𝐌𝐎𝐍𝐒𝐓𝐄𝐑 𝐇𝐔𝐍𝐓𝐄𝐑》\n" +
            "Các tag:\n" +
            "1. create: tạo nhân vật\n" +
            "2. info: xem thông số nhân vật\n" +
            "3. shop: mở cửa hàng\n" +
            "4. bag: mở túi đồ để trang bị và sử dụng vật phẩm\n" +
            "5. fix: sửa trang bị\n" +
            "6. match/pvp/fight: săn quái\n" +
            "7. location: chọn bãi săn\n" +
            "8. status: thông tin server\n\n" +
            `Nhập /monster + [tag] để sử dụng\n\n` +
            `Ví dụ: /monster create`,
            event.threadID,
            event.messageID
          );
        }
      }
    }
  } catch (e) {
    console.log("[MONSTER] Lỗi xử lý:", e);
    return api.sendMessage("❌ Đã xảy ra lỗi khi thực thi lệnh monster.", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function({ api, event, Currencies, handleReply }) {
  try {
    if (handleReply.author != event.senderID) return;
    switch (handleReply.type) {
      case "listItem":
        return global.monster.getItems({ api, event, type: event.body });
      case "buyItem":
        return global.monster.buyItem({ api, event, idItem: event.body, Currencies, handleReply });
      case "setItem":
        return global.monster.setItem({ api, event, idItem: event.body, handleReply });
      case "increaseDurability":
        return global.monster.increaseDurability({ api, event, Currencies, handleReply });
      case "match":
        return global.monster.match({ api, event, id: event.body });
      case "setLocationID":
        return global.monster.setLocationID({ api, event, id: event.body, handleReply });
      default:
        return;
    }
  } catch (e) {
    console.log("[MONSTER] Lỗi handleReply:", e);
    return api.sendMessage("❌ Đã xảy ra lỗi khi xử lý phản hồi.", event.threadID, event.messageID);
  }
};
