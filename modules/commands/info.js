module.exports.config = {
  name: "info",
  version: "3.0.1",
  hasPermssion: 0,
  credits: "Deku mod by Niio-team & Mr.ben",
  description: "Lấy thông tin người dùng Facebook",
  commandCategory: "Tìm kiếm",
  cooldowns: 0,
};

const axios = require("axios");
const fs = require("fs");

// 🔥 Gắn token mới vào đây
const token = "EAAGNO4a7r2wBOwuDZCTr7QfhA9vyqHEEHKDkpWKt0PBbtnaA35UCBDWLcryaSrSYnJKmwrQEkaJICqeLqg5sv67Nspz12FRfIfQ4QjXcJRpUD4ZBMFuUAJkXrtoZA4j0iswAEA0OjgsWphufF2fDIumZCt77Q1OMoKPhS2yf28qqVTVA6eiIGJSy0Nj4NoZBLhAZDZD";

module.exports.run = async function ({ api, event, args }) {
  let id = event.senderID;
  if (Object.keys(event.mentions).length > 0) {
    id = Object.keys(event.mentions)[0];
  } else if (args[0]) {
    id = args[0];
  }

  try {
    api.sendMessage("🔄 Đang lấy thông tin...", event.threadID, event.messageID);

    const resp = await axios.get(
      `https://graph.facebook.com/${id}?fields=id,name,gender,link,username,birthday,is_verified,quotes,first_name,subscribers.limit(0)&access_token=${token}`
    );
    
    const data = resp.data;
    const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=${token}`;

    let infoText = `👤 Tên: ${data.name}\n`;
    infoText += `👀 Giới tính: ${data.gender === "male" ? "Nam" : "Nữ"}\n`;
    infoText += `🆔 UID: ${data.id}\n`;
    infoText += `🔗 Link Facebook: ${data.link}\n`;
    infoText += `📛 Username: ${data.username || "Không có"}\n`;
    infoText += `🎂 Ngày sinh: ${data.birthday || "Không có"}\n`;
    infoText += `✔️ Đã xác minh: ${data.is_verified ? "Có" : "Không"}\n`;
    infoText += `📢 Lượt theo dõi: ${data.subscribers?.summary?.total_count || "Không có"}\n`;
    infoText += `💬 Quotes: ${data.quotes || "Không có"}`;

    let pathImg = __dirname + `/cache/info_avatar.png`;
    let img = await axios.get(avatar, { responseType: "arraybuffer" });
    fs.writeFileSync(pathImg, Buffer.from(img.data, "utf-8"));

    return api.sendMessage(
      { body: infoText, attachment: fs.createReadStream(pathImg) },
      event.threadID,
      () => fs.unlinkSync(pathImg)
    );
  } catch (e) {
    return api.sendMessage("❌ Lỗi khi lấy thông tin! Có thể token đã hết hạn hoặc sai quyền truy cập.", event.threadID);
  }
};
