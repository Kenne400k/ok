module.exports.config = {
  name: "anhgai",	
  version: "4.0.1", 
  hasPermssion: 0,
  credits: "pcoder",
  description: "Random nhiều ảnh gái siêu vip",
  commandCategory: "Random Ảnh",
  usages: "",
  cooldowns: 0
};

const fs = require("fs-extra");
const path = require("path");
const request = require("request");

module.exports.run = async ({ api, event }) => {
  // Đường dẫn gaivip.json
  const dataPath = path.join(__dirname, "../../lekhanh/datajson/gaivip.json");
  let linkArr;
  try {
    linkArr = require(dataPath);
    if (!Array.isArray(linkArr)) throw new Error("gaivip.json không phải mảng!");
  } catch (e) {
    return api.sendMessage("Không thể đọc file gaivip.json hoặc file sai định dạng!", event.threadID, event.messageID);
  }

  // Tạo folder cache nếu chưa có
  const cacheDir = path.join(__dirname, "cache_anhgai");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // Số lượng ảnh random (max 15, min 1)
  const numImages = Math.floor(Math.random() * 15) + 1;
  let downloadPromises = [];

  // Download ảnh về cache
  for (let i = 0; i < numImages; i++) {
    const imageUrl = linkArr[Math.floor(Math.random() * linkArr.length)].trim();
    const imgFileName = `image_${event.threadID}_${event.messageID}_${i}_${Date.now()}.jpg`;
    const imgPath = path.join(cacheDir, imgFileName);

    // Promise tải ảnh (bỏ qua nếu lỗi)
    const p = new Promise((resolve) => {
      request(imageUrl)
        .on("error", () => resolve(null))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", () => {
          // Kiểm tra file có dung lượng thực sự không
          fs.stat(imgPath, (err, stat) => {
            if (err || !stat || stat.size === 0) {
              if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
              resolve(null);
            } else {
              resolve(imgPath);
            }
          });
        });
    });
    downloadPromises.push(p);
  }

  // Chờ tất cả ảnh download xong
  const imagePaths = (await Promise.all(downloadPromises)).filter(Boolean);

  if (imagePaths.length === 0) {
    return api.sendMessage("Không tải được ảnh nào cả. Có thể tất cả link đã die.", event.threadID, event.messageID);
  }

  // Gửi ảnh
  api.sendMessage({
    body: `Tha hồ ngắm =))) (${imagePaths.length} ảnh)`,
    attachment: imagePaths.map(p => fs.createReadStream(p))
  }, event.threadID, () => {
    // Xóa file sau khi gửi
    for (let imgPath of imagePaths) {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
  }, event.messageID);
};