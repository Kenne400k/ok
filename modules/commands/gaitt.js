const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "gaitt",
  version: "1.1.0",
  hasPermission: 0,
  credits: "tnt (fix by pcoder)", //api die hay sống ????
  description: "Random video gái  TikTok, kèm info",
  commandCategory: "Tiện ích",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const cachePath = path.join(__dirname, "cache");
  const videoPath = path.join(cachePath, "tkvd.mp4");

  try {
    // Tạo thư mục cache nếu chưa có
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    const res = await axios.get("https://gaitiktok.onrender.com/random?apikey=randomtnt");
    if (!res.data || !res.data.data || !res.data.data.play) {
      return api.sendMessage("API trả về dữ liệu không hợp lệ.", event.threadID, event.messageID);
    }

    const {
      play,
      author = {},
      digg_count = 0,
      comment_count = 0,
      play_count = 0,
      share_count = 0,
      download_count = 0,
      title = "Không rõ",
      duration = "Không rõ",
      region = "Không rõ"
    } = res.data.data;

    // Thông báo trước khi tải video
    api.sendMessage("⏳ Đang tải video, vui lòng chờ...", event.threadID, event.messageID);

    // Tải video về cache, kiểm tra file thực sự tồn tại và > 0 bytes
    request(encodeURI(play))
      .on("error", (e) => {
        api.sendMessage("Không thể tải video từ link!", event.threadID, event.messageID);
      })
      .pipe(fs.createWriteStream(videoPath))
      .on("close", () => {
        fs.stat(videoPath, (err, stats) => {
          if (err || !stats || stats.size === 0) {
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            return api.sendMessage("Video lỗi hoặc không tồn tại!", event.threadID, event.messageID);
          }
          api.sendMessage({
            body: 
`┏━━━━━━━━━━━━━━━━━━━━┓
┣➤📺 Random gái tiktok
┣➤🌐 Quốc gia: ${region}
┣➤📝 Tiêu đề: ${title}
┣➤🔍 Tên kênh: ${author.nickname || "Ẩn"}
┣➤😽 ID người dùng: ${author.unique_id || "Ẩn"}
┣➤❤ Lượt tim: ${digg_count}
┣➤💬 Bình luận: ${comment_count}
┣➤👁‍🗨 Lượt xem: ${play_count}
┣➤📎 Chia sẻ: ${share_count}
┣➤👉 Lượt tải: ${download_count}
┣➤⏰ Thời gian: ${duration} s
┗━━━━━━━━━━━━━━━━━━━━┛`,
            attachment: fs.createReadStream(videoPath)
          }, event.threadID, () => {
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
          }, event.messageID);
        });
      });

  } catch (err) {
    console.error(err);
    api.sendMessage("Đã xảy ra lỗi...", event.threadID, event.messageID);
  }
};