const axios = require("axios");
const fs = require("fs-extra");
const ytdl = require('@distube/ytdl-core');

module.exports = class {
  static config = {
    name: "atdytb",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "hphong", // cấm thay credit
    description: "Tải video từ YouTube khi phát hiện link",
    commandCategory: "Tiện ích",
    usages: "",
    cooldowns: 5
  };

  static run() {}

  static check_url(url) {
    // Kiểm tra link có phải là link youtube không
    return /^https:\/\/((www)\.)?(youtube|youtu)(pp)*\.(com|be)\//i.test(url);
  }

  static async streamURL(url, type) {
    // Tải file về cache và trả về stream
    const pathFile = `${__dirname}/cache/ytb_${Date.now()}.${type}`;
    const writer = fs.createWriteStream(pathFile);

    const res = await axios.get(url, { responseType: 'stream' });
    res.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Xóa file sau 1 phút
    setTimeout(() => {
      if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
    }, 60 * 1000);

    return fs.createReadStream(pathFile);
  }

  static convertHMS(value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
  }

  static async handleEvent(o) {
    const { threadID: t, messageID: m, body: b } = o.event;
    const send = msg => o.api.sendMessage(msg, t, m);
    const head = t => `[ 𝐀𝐔𝐓𝐎𝐃𝐎𝐖𝐍 ${t} ]\n──────────────────`;

    // Nếu phát hiện link YouTube trong tin nhắn
    if (this.check_url(b)) {
      try {
        const urlMatch = b.match(/https:\/\/[^\s]+/);
        if (!urlMatch || !urlMatch[0]) return;
        const ytbUrl = urlMatch[0];

        // Lấy info video
        const info = await ytdl.getInfo(ytbUrl);
        const detail = info.videoDetails;
        // Tìm format 360p có cả audio
        let format = info.formats.find(f => f.qualityLabel && f.qualityLabel.includes('360p') && f.audioBitrate);

        // Nếu không có 360p thì lấy format mp4 có audio bất kỳ
        if (!format) {
          format = info.formats.find(f => f.hasAudio && f.container === 'mp4');
        }

        if (format) {
          const attachment = await this.streamURL(format.url, 'mp4');
          send({
            body: `${head('𝐘𝐎𝐔𝐓𝐔𝐁𝐄𝐑')}\n⩺  Tiêu Đề: ${detail.title}\n⩺ Thời lượng: ${this.convertHMS(Number(detail.lengthSeconds))}`,
            attachment
          });
        } else {
          send("Không tìm thấy định dạng phù hợp để tải video này!");
        }
      } catch (e) {
        console.error(e);
        send("Có lỗi xảy ra khi tải video, thử lại sau.");
      }
    }
  }
};