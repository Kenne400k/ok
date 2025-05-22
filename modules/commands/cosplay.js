const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "cosplay",	
  version: "4.0.0", 
  hasPermssion: 0,
  Rent: 2,
  credits: "pcoder",
  description: "Random ảnh cosplay, mỗi lần gửi từ 1-6 ảnh, không kèm thông tin liên hệ", 
  commandCategory: "Random Ảnh",
  usages: "",
  cooldowns: 60000
};

module.exports.run = async ({ api, event }) => {
  // Đọc JSON chứa link ảnh
  let imageLinks;
  try {
    imageLinks = require('./../../lekhanh/datajson/cosplay.json');
    if (!Array.isArray(imageLinks) || imageLinks.length === 0) throw new Error();
  } catch {
    return api.sendMessage("Không thể đọc file cosplay.json!", event.threadID, event.messageID);
  }

  // Số lượng ảnh random (1-6, không trùng lặp)
  const maxImages = Math.min(6, imageLinks.length);
  const numImages = Math.floor(Math.random() * maxImages) + 1;
  const shuffled = imageLinks.sort(() => 0.5 - Math.random());
  const selectedLinks = shuffled.slice(0, numImages);

  // Tải ảnh về cache (chỉ gửi ảnh tải thành công)
  const cacheDir = path.join(__dirname, "cache_cosplay");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  let attachments = [];
  for (let i = 0; i < selectedLinks.length; i++) {
    const url = selectedLinks[i];
    const filePath = path.join(cacheDir, `cosplay_${event.threadID}_${event.messageID}_${i}_${Date.now()}.jpg`);
    try {
      const response = await axios.get(url, { responseType: "stream", timeout: 15000 });
      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
      attachments.push(fs.createReadStream(filePath));
    } catch {
      // Bỏ qua ảnh lỗi
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }

  if (attachments.length === 0) {
    return api.sendMessage("Không tải được ảnh nào. Có thể link lỗi hoặc hết quota.", event.threadID, event.messageID);
  }

  api.sendMessage({
    body: `Tha hồ ngắm =)))`,
    attachment: attachments
  }, event.threadID, () => {
    // Xóa file cache sau khi gửi
    for (let att of attachments) {
      if (att.path && fs.existsSync(att.path)) fs.unlinkSync(att.path);
    }
  }, event.messageID);
};