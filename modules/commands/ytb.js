const fs = require("fs-extra");
const path = require("path");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: 'ytb',
  version: '1.0.1',
  hasPermssion: 0,
  credits: 'pcoder',
  description: 'Phát nhạc hoặc video thông qua link YouTube hoặc từ khoá tìm kiếm',
  commandCategory: 'Tiện ích',
  usages: 'ytb < keyword/url >',
  cooldowns: 5,
  dependencies: {
    'moment-timezone': '',
    'axios': '',
    'fs-extra': '',
    '@distube/ytdl-core': '',
    '@ffmpeg-installer/ffmpeg': '',
    'fluent-ffmpeg': ''
  }
};

const mediaSavePath = path.join(__dirname, 'cache', 'Youtube');
const key = "AIzaSyD16U7WwrIFGOKijx0GR_3hU6p7Ww7JObM";

if (!fs.existsSync(mediaSavePath)) fs.mkdirpSync(mediaSavePath);

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, messageID, body, senderID } = event;
  const { author, videoID, IDs, type: reply_type } = handleReply;
  if (senderID != author) return;

  const currentTime = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');

  async function downloadMedia(videoID, type) {
    const filePath = path.join(mediaSavePath, `${Date.now()}_${senderID}.${type === 'video' ? 'mp4' : 'm4a'}`);
    try {
      if (type == 'video') {
        await new Promise((resolve, reject) => {
          const stream = ytdl(`https://www.youtube.com/watch?v=${videoID}`, { quality: '18' });
          stream.pipe(fs.createWriteStream(filePath))
            .on('error', reject)
            .on('finish', resolve);
        });
      } else {
        ffmpeg.setFfmpegPath(ffmpegPath);
        await new Promise((resolve, reject) => {
          ffmpeg(ytdl(`https://www.youtube.com/watch?v=${videoID}`, { filter: 'audioonly' }))
            .audioCodec("aac")
            .save(filePath)
            .on("error", reject)
            .on("end", resolve);
        });
      }
      return { filePath, error: 0 };
    } catch (e) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return { filePath, error: 1 };
    }
  }

  switch (reply_type) {
    case 'download': {
      const { filePath, error } = await downloadMedia(videoID, body == '1' ? 'video' : 'audio');
      let mediaData = { title: "Không lấy được tiêu đề", duration: "00:00:00" };
      try {
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoID}&key=${key}`);
        const item = res.data.items[0];
        mediaData.title = item.snippet.title;
        mediaData.duration = prettyTime(item.contentDetails.duration);
      } catch {}
      if (error != 0) {
        api.sendMessage('❎ Đã có lỗi xảy ra', threadID, messageID);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } else {
        api.unsendMessage(handleReply.messageID);
        try {
          const size = fs.statSync(filePath).size;
          if ((size > 50 * 1024 * 1024 && body == 1) || (size > 25 * 1024 * 1024 && body == 2)) {
            api.sendMessage('⚠️ Không thể gửi vì kích thước tệp quá lớn', threadID, messageID);
            fs.unlinkSync(filePath);
          } else {
            api.sendMessage({
              body: `[ YOUTUBE DOWNLOAD CONVERT ]\n──────────────────\n📝 Tiêu đề: ${mediaData.title}\n⏳ Thời lượng: ${mediaData.duration}\n⏰ Time: ${currentTime}`,
              attachment: fs.createReadStream(filePath)
            }, threadID, (err) => {
              if (err) api.sendMessage('❎ Đã có lỗi xảy ra', threadID, messageID);
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }, messageID);
          }
        } catch (e) {
          api.sendMessage('❎ Đã có lỗi khi gửi file', threadID, messageID);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      }
      break;
    }
    case 'list': {
      if (isNaN(body) || body < 1 || body > IDs.length) {
        api.sendMessage('⚠️ Vui lòng chọn số từ 1 đến ' + IDs.length, threadID, messageID);
      } else {
        api.unsendMessage(handleReply.messageID);
        const chosenID = IDs[parseInt(body) - 1];
        api.sendMessage(
          '[ YOUTUBE SELECT ]\n──────────────────\n1. Tải video\n2. Tải âm thanh video\n\n📌 Reply (phản hồi) STT để thực hiện yêu cầu',
          threadID,
          (error, info) => {
            if (!error) {
              global.client.handleReply.push({
                type: 'download',
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                videoID: chosenID
              });
            }
          },
          messageID
        );
      }
      break;
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  if (!args.length) return api.sendMessage('❎ Phần tìm kiếm không được để trống', threadID, messageID);

  const input = args.join(' ');
  const urlPattern = /^(http(s)?:\/\/)?((w){3}\.)?youtu(\.be|be)?(\.com)?\/.+/gi;
  const isValidUrl = urlPattern.test(input);

  async function getBasicInfo(keyword) {
    try {
      const { data } = await axios.get(encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${keyword}&type=video&key=${key}`));
      return data.items;
    } catch (e) {
      throw new Error('Lỗi khi tìm kiếm YouTube: ' + e.message);
    }
  }

  try {
    if (isValidUrl) {
      let videoID = input.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      videoID = (videoID[2] !== undefined) ? videoID[2].split(/[^0-9a-z_\-]/i)[0] : videoID[0];
      api.sendMessage(
        '[ YOUTUBE SELECT ]\n──────────────────\n1. Tải video\n2. Tải âm thanh video\n\n📌 Reply (phản hồi) STT để thực hiện yêu cầu',
        threadID,
        (error, info) => {
          if (!error) {
            global.client.handleReply.push({
              type: 'download',
              name: this.config.name,
              messageID: info.messageID,
              author: senderID,
              videoID
            });
          }
        },
        messageID
      );
    } else {
      let IDs = [], msg = '', results = await getBasicInfo(input);
      for (let i = 0; i < results.length; i++) {
        const id = results[i].id.videoId;
        if (id) {
          IDs.push(id);
          let duration = "Không xác định";
          try {
            const res = await axios.get(encodeURI(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${key}`));
            duration = prettyTime(res.data.items[0].contentDetails.duration);
          } catch {}
          msg += `\n──────────────────\n${i + 1}. ${results[i].snippet.title}\n⏳ Thời lượng: ${duration}`;
        }
      }
      msg = `[ YOUTUBE SEARCH ]\n──────────────────\n📝 Có ${IDs.length} kết quả trùng với từ khóa tìm kiếm của bạn:${msg}\n──────────────────\n\n📌 Reply (phản hồi) STT của video muốn tải`;
      api.sendMessage(msg, threadID, (error, info) => {
        if (!error) {
          global.client.handleReply.push({
            type: 'list',
            name: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            IDs
          });
        }
      }, messageID);
    }
  } catch (e) {
    api.sendMessage('❎ Đã xảy ra lỗi:\n' + e, threadID, messageID);
  }
};

function prettyTime(time) {
  // Xử lý ISO 8601 duration (PT#H#M#S)
  let h = 0, m = 0, s = 0;
  time = time.replace('PT', '');
  if (time.includes('H')) {
    h = parseInt(time.split('H')[0]);
    time = time.split('H')[1];
  }
  if (time.includes('M')) {
    m = parseInt(time.split('M')[0]);
    time = time.split('M')[1];
  }
  if (time.includes('S')) {
    s = parseInt(time.split('S')[0]);
  }
  return [h, m, s].map(num => num < 10 ? '0' + num : '' + num).join(':');
}