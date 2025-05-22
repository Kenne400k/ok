const ZingMp3 = require("zingmp3-api");

module.exports.config = {
  name: "zing",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "pcoder",
  description: "Tìm kiếm và gửi thông tin nhạc Zing MP3 theo tên",
  commandCategory: "music",
  usages: "[tên bài hát]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const query = args.join(" ");
  if (!query) return api.sendMessage("Vui lòng nhập tên bài hát cần tìm!", event.threadID, event.messageID);

  try {
    const res = await ZingMp3.search(query);
    if (!res || !res.data || !res.data.songs || !res.data.songs.length)
      return api.sendMessage("Không tìm thấy bài hát nào phù hợp.", event.threadID, event.messageID);

    const [song] = res.data.songs;
    const info = await ZingMp3.getFullInfo(song.encodeId);

    // Chuẩn bị nội dung gửi
    let msg = `🎶 𝗕𝗮̀𝗶 𝗵𝗮́𝘁: ${song.title}\n`;
    msg += `👤 𝗖𝗮 𝘀𝗶̃: ${song.artistsNames}\n`;
    msg += `🕒 𝗧𝗵𝗼̛̀𝗶 𝗹𝘂̛𝗼̛̣𝗻𝗴: ${(song.duration/60).toFixed(2)} phút\n`;
    msg += `🔗 𝗟𝗶𝗻𝗸: https://zingmp3.vn/bai-hat/${song.title.replace(/\s/g,"-")}/${song.encodeId}.html\n`;
    msg += `\n→ Reply 'audio' để nhận file nhạc mp3 (nếu có)!`;

    // Gửi info nhạc
    api.sendMessage(msg, event.threadID, (err, infoMsg) => {
      // Lắng nghe reply để gửi file mp3
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: infoMsg.messageID,
        author: event.senderID,
        encodeId: song.encodeId
      });
    }, event.messageID);
  } catch (e) {
    console.log(e);
    api.sendMessage("Có lỗi xảy ra, thử lại sau!", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async ({ event, api, handleReply }) => {
  if (event.senderID != handleReply.author) return;
  if (event.body.toLowerCase() !== "audio") return;

  try {
    const info = await require("zingmp3-api").getFullInfo(handleReply.encodeId);
    if (!info || !info.streaming || !info.streaming["128"]) 
      return api.sendMessage("Không lấy được file mp3 của bài hát này!", event.threadID, event.messageID);

    const axios = require("axios");
    const fs = require("fs-extra");
    const path = __dirname + `/cache/${handleReply.encodeId}.mp3`;

    const res = await axios.get(info.streaming["128"], { responseType: "stream" });
    const writer = fs.createWriteStream(path);
    res.data.pipe(writer);
    writer.on("finish", () => {
      api.sendMessage({
        body: `Đây là file mp3 của bạn!`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    });
    writer.on("error", () => api.sendMessage("Lỗi khi tải file mp3.", event.threadID, event.messageID));
  } catch (e) {
    console.log(e);
    api.sendMessage("Có lỗi khi gửi file mp3!", event.threadID, event.messageID);
  }
};