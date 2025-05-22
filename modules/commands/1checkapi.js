const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "checkapi",
  version: "1.2.0",
  hasPermssion: 2,
  credits: "Thiện Phát",
  description: "Chọn file JSON trong /api để kiểm tra link ảnh",
  commandCategory: "tools",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  const dirPath = path.join(__dirname, "./../../api/");
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith(".json"));

  if (files.length === 0)
    return api.sendMessage("❌ Không có file JSON nào trong thư mục /api/", event.threadID);

  let msg = "📂 Danh sách file JSON:\n";
  files.forEach((f, i) => (msg += `${i + 1}. ${f}\n`));
  msg += "\n📩 Reply số hoặc tên file để kiểm tra.";

  api.sendMessage(msg, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      files,
      dirPath,
    });
  });
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  let choice = event.body.trim();
  let filename;

  if (!isNaN(choice)) {
    const index = parseInt(choice) - 1;
    if (index < 0 || index >= handleReply.files.length)
      return api.sendMessage("❌ Số không hợp lệ!", event.threadID);
    filename = handleReply.files[index];
  } else {
    if (!handleReply.files.includes(choice))
      return api.sendMessage("❌ Tên file không tồn tại!", event.threadID);
    filename = choice;
  }

  const filePath = path.join(handleReply.dirPath, filename);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const img = data.image || data.img || data.url || null;

    if (!img) return api.sendMessage(`❓ Không tìm thấy ảnh trong file ${filename}`, event.threadID);

    const res = await axios.get(img, { timeout: 5000 });
    const status = res.status === 200 ? "✅ Ảnh hoạt động!" : `⚠️ Lỗi mã HTTP ${res.status}`;
    return api.sendMessage(`${status}\n📄 File: ${filename}\n🔗 Link: ${img}`, event.threadID);
  } catch (err) {
    return api.sendMessage(`❌ Lỗi xử lý file:\n${err.message}`, event.threadID);
  }
};
