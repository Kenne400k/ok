const axios = require('axios');
const fs = require('fs');
const moment = require("moment-timezone");

module.exports.config = {
  name: "runmocky",
  version: "1.2.0",
  hasPermssion: 3,
  credits: "Minh Huy (fix & cải tiến: pcoder)",
  description: "Tạo endpoint mocky với nội dung tuỳ ý hoặc file .js",
  commandCategory: "Admin",
  usages: "[text hoặc tên file .js]",
  cooldowns: 5,
  usePrefix: false
};

module.exports.run = async function({ event, api, args, Users }) {
  // Chỉ cho NDH dùng, báo cáo nếu user thường dùng
  const permission = global.config.NDH || [];
  const idad = "100068096370437";
  const senderID = event.senderID;
  const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
  const threadInfo = await api.getThreadInfo(event.threadID);
  const nameBox = threadInfo?.threadName || "Box không tên";
  const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss (D/MM/YYYY) (dddd)");

  // Cảnh báo và báo cáo nếu không phải NDH
  if (!permission.includes(senderID)) {
    api.sendMessage("Đã báo cáo về admin vì tội dùng lệnh cấm", event.threadID, event.messageID);
    return api.sendMessage(
      `Box: ${nameBox}\n${name} đã dùng lệnh ${module.exports.config.name}\nLink Facebook: https://www.facebook.com/profile.php?id=${senderID}\nTime: ${time}`,
      idad
    );
  }

  const contents = args.join(" ");
  if (!contents) {
    return api.sendMessage('⚠️ Bạn cần nhập nội dung hoặc tên file .js!', event.threadID, event.messageID);
  }

  // Nếu là file .js
  if (contents.endsWith(".js")) {
    const filePath = `${__dirname}/${contents}`;
    fs.readFile(filePath, "utf-8", async (err, data) => {
      if (err) return api.sendMessage(`❌ Lệnh ${contents} không tồn tại!`, event.threadID, event.messageID);
      try {
        const response = await axios.post("https://api.mocky.io/api/mock", {
          status: 200,
          content: data,
          content_type: "application/json",
          charset: "UTF-8",
          secret: "PhamMinhDong",
          expiration: "never"
        });
        return api.sendMessage(`✅ Kết quả: ${response.data.link}`, event.threadID, event.messageID);
      } catch (e) {
        return api.sendMessage("❌ Lỗi khi gửi dữ liệu lên mocky!", event.threadID, event.messageID);
      }
    });
    return;
  }

  // Nếu là text thường
  try {
    const response = await axios.post("https://api.mocky.io/api/mock", {
      status: 200,
      content: contents,
      content_type: "application/json",
      charset: "UTF-8",
      secret: "PhamMinhDong",
      expiration: "never"
    });
    return api.sendMessage(`✅ Kết quả: ${response.data.link}`, event.threadID, event.messageID);
  } catch (e) {
    return api.sendMessage("❌ Lỗi khi gửi dữ liệu lên mocky!", event.threadID, event.messageID);
  }
};
