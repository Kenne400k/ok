const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports.config = {
  name: "Tường",
  version: "9.0.0",
  hasPermssion: 0,
  credits: "Nguyễn Trương Thiện Phát (Tường AI GenZ, Kenne400k tối ưu, YouTube, meme, dịch, thời tiết, minigame, nhắc hẹn, profile, cực xịn)",
  description: "Tường AI: Gửi video/mp3 YouTube (không quota, không key), cảm xúc, minigame, dịch, meme, thời tiết, quote, nhắc hẹn, profile cá nhân hóa, training, phản hồi ảnh, cực an toàn, không lỗi.",
  commandCategory: "ai",
  usages: [
    "Tường gửi video [từ khóa]",
    "Tường gửi mp3 [tên bài]",
    "Tường mp3 [tên bài]",
    "Tường video [từ khóa]",
    "Tường cho xin video của [ca sĩ]",
    "Tường gửi nhạc của [ai]",
    "Tường chơi đoán số",
    "Tường profile",
    "Tường cảm xúc: [cảm xúc]",
    "Tường quote",
    "Tường dịch en: tôi yêu bạn",
    "Tường thời tiết Sài Gòn",
    "Tường nhắc đi ngủ lúc 23:30"
  ],
  cooldowns: 2,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "@distube/ytdl-core": "",
    "fluent-ffmpeg": "",
    "ffmpeg-static": ""
  }
};

const tempDir = path.join(__dirname, "temp");
const dataPath = path.join(__dirname, "../../data");
const userDataPath = path.join(dataPath, "tuong_users.json");
const trainingDataPath = path.join(dataPath, "tuong_training.json");
const reminderPath = path.join(dataPath, "tuong_reminders.json");

// Tạo folder/file nếu chưa có
module.exports.onLoad = async () => {
  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  if (!fs.existsSync(userDataPath)) fs.writeFileSync(userDataPath, JSON.stringify({}));
  if (!fs.existsSync(trainingDataPath)) fs.writeFileSync(trainingDataPath, JSON.stringify([]));
  if (!fs.existsSync(reminderPath)) fs.writeFileSync(reminderPath, JSON.stringify([]));
  global.tuongData = {
    users: JSON.parse(fs.readFileSync(userDataPath)),
    training: JSON.parse(fs.readFileSync(trainingDataPath)),
    trainingSessions: new Map(),
    reminders: JSON.parse(fs.readFileSync(reminderPath))
  };
  setInterval(() => {
    try {
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > 60 * 60 * 1000) fs.unlinkSync(filePath);
      });
    } catch {}
  }, 30 * 60 * 1000);
  setInterval(() => handleReminders(), 30 * 1000);
};

function randomArr(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
const EMOTICONS = {
  vui: "😆", buồn: "😢", tức: "😡", ngáo: "😵", yêu: "😍", "bình thường": "🙂", "ngại": "😳", "cà khịa": "😏", "tự tin": "😎", "đang yêu": "💘", "hào hứng": "🤩", "meme": "😂"
};
function getEmo(state) {
  for (const [k, v] of Object.entries(EMOTICONS)) if ((state || "").toLowerCase().includes(k)) return v;
  return "🤖";
}

// YouTube search cực nhẹ, không quota, không cần API KEY, không giới hạn
async function searchYouTubeVideoId(query) {
  try {
    const res = await axios.get("https://www.youtube.com/results", {
      params: { search_query: query },
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const match = res.data.match(/"videoId":"([\w-]{11})"/);
    if (match && match[1]) return match[1];
    return null;
  } catch {
    return null;
  }
}

// Gửi mp3/mp4 từ YouTube, không lưu lâu
async function sendYouTubeMedia({ api, threadID, messageID, query, type }) {
  const videoId = await searchYouTubeVideoId(query);
  if (!videoId) return api.sendMessage("Không tìm thấy video hợp lệ trên YouTube!", threadID, messageID);
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const fileExt = type === "mp3" ? "mp3" : "mp4";
  const outPath = path.join(tempDir, `yt_${videoId}_${Date.now()}.${fileExt}`);
  api.sendMessage(`🔎 Đang tải ${type === "mp3" ? "nhạc" : "video"}: ${url}\n⏳ Đợi Tường xíu nhé...`, threadID, async () => {
    try {
      if (type === "mp3") {
        const stream = ytdl(url, { filter: "audioonly" });
        await new Promise((resolve, reject) => {
          ffmpeg(stream)
            .audioBitrate(128)
            .format("mp3")
            .save(outPath)
            .on("end", resolve)
            .on("error", reject);
        });
      } else {
        const stream = ytdl(url, { quality: "highestvideo" });
        await new Promise((resolve, reject) => {
          ffmpeg(stream)
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('mp4')
            .save(outPath)
            .on("end", resolve)
            .on("error", reject);
        });
      }
      const stats = fs.statSync(outPath);
      if (stats.size > 90 * 1024 * 1024) {
        fs.unlinkSync(outPath);
        return api.sendMessage("File quá lớn không thể gửi qua Messenger. Hãy thử video ngắn hơn!", threadID, messageID);
      }
      await api.sendMessage({
        body: `Tường gửi bạn ${type === "mp3" ? "mp3" : "video"} YouTube nè!\n${url}`,
        attachment: fs.createReadStream(outPath)
      }, threadID, () => {
        try { fs.unlinkSync(outPath); } catch {}
      }, messageID);
    } catch {
      try { fs.unlinkSync(outPath); } catch {}
      api.sendMessage("Tải/gửi file thất bại hoặc bị lỗi mạng!", threadID, messageID);
    }
  }, messageID);
}

// Dịch thuật Google Translate unofficial
async function translateText(text, lang) {
  try {
    const res = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`
    );
    return res.data[0].map(i => i[0]).join("");
  } catch {
    return "Không dịch được nội dung!";
  }
}

// Quote API
async function getQuote() {
  try {
    const res = await axios.get("https://api.quotable.io/random?maxLength=80");
    return `"${res.data.content}"\n— ${res.data.author}`;
  } catch {
    return randomArr([
      "Đời là bể khổ, qua được bể khổ là qua đời.",
      "Học không chơi đánh rơi tuổi trẻ, chơi không học... chơi tiếp.",
      "Cố gắng lên, đời còn dài, drama còn nhiều!"
    ]);
  }
}

// Thời tiết Open-Meteo
async function getWeather(location) {
  try {
    const geo = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
    if (!geo.data[0]) return null;
    const { lat, lon, display_name } = geo.data[0];
    const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    if (!res.data.current_weather) return null;
    const w = res.data.current_weather;
    return {
      location: display_name,
      temp: w.temperature,
      wind: w.windspeed,
      code: w.weathercode,
      desc: weatherVN(w.weathercode)
    };
  } catch { return null; }
}
function weatherVN(code) {
  const map = {
    0: "Trời quang đãng",
    1: "Trời ít mây",
    2: "Trời có mây",
    3: "Trời âm u",
    45: "Sương mù",
    48: "Sương mù đông",
    51: "Mưa phùn nhẹ",
    53: "Mưa phùn",
    55: "Mưa phùn dày",
    56: "Mưa phùn đóng băng nhẹ",
    57: "Mưa phùn đóng băng",
    61: "Mưa nhẹ",
    63: "Mưa vừa",
    65: "Mưa lớn",
    66: "Mưa đóng băng nhẹ",
    67: "Mưa đóng băng mạnh",
    71: "Tuyết nhẹ",
    73: "Tuyết vừa",
    75: "Tuyết dày",
    77: "Tuyết đá",
    80: "Mưa rào nhẹ",
    81: "Mưa rào vừa",
    82: "Mưa rào mạnh",
    85: "Mưa tuyết nhẹ",
    86: "Mưa tuyết mạnh",
    95: "Dông",
    96: "Dông, mưa đá nhẹ",
    99: "Dông, mưa đá mạnh"
  };
  return map[code] || "Không rõ";
}

// Nhắc hẹn
async function handleReminders(api = null) {
  let reminders = [];
  try { reminders = JSON.parse(fs.readFileSync(reminderPath)); } catch {}
  const now = Date.now();
  for (let i = reminders.length - 1; i >= 0; i--) {
    const rem = reminders[i];
    if (rem.time <= now) {
      if (api)
        api.sendMessage(`⏰ Nhắc bạn: ${rem.content}`, rem.threadID, rem.messageID || null);
      reminders.splice(i, 1);
    }
  }
  fs.writeFileSync(reminderPath, JSON.stringify(reminders, null, 2));
  global.tuongData.reminders = reminders;
}

// ==== MAIN HANDLE EVENT ====
module.exports.handleEvent = async function({ api, event }) {
  if (event.senderID === api.getCurrentUserID() || (!event.body && !event.attachments)) return;
  const { threadID, messageID, senderID, body = "", type, messageReply, attachments } = event;
  let userData = global.tuongData.users;

  // ==== PROFILE/STREAK/AUTO CREATE ====
  if (!userData[threadID]) userData[threadID] = {};
  if (!userData[threadID][senderID]) {
    userData[threadID][senderID] = {
      profile: {
        name: "Bạn",
        pronouns: "bạn",
        personality: "hài hước, ngáo, thân thiện",
        emotionalState: "bình thường",
        gender: "unknown",
        points: 0,
        joinTime: Date.now(),
        streak: 0
      },
      journal: [],
      relationship: "bạn thân",
      conversationStyle: "genz",
      preferredLanguage: "Vietnamese",
      lastInteraction: Date.now(),
      lastMessageDay: (new Date()).toLocaleDateString("vi-VN")
    };
    try {
      const userInfo = await api.getUserInfo(senderID);
      if (userInfo && userInfo[senderID]) userData[threadID][senderID].profile.name = userInfo[senderID].name || "Bạn";
    } catch {}
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
  }
  let today = (new Date()).toLocaleDateString("vi-VN");
  let user = userData[threadID][senderID];
  if (user.lastMessageDay !== today) {
    user.profile.streak = (user.profile.streak || 0) + 1;
    user.lastMessageDay = today;
    user.profile.points += 2;
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    api.sendMessage(`🔥 Điểm danh thành công! Chuỗi ngày hoạt động liên tục: ${user.profile.streak} ngày (+2 điểm)`, threadID, messageID);
    return;
  }

  // ==== VIDEO YOUTUBE NGAY LẬP TỨC ====
  if (/(gửi|cho|lấy|tải|send|mở|phát|share|bật|chuyển)\s*(video|clip|mp4)[^\n]*$/i.test(body) || body.toLowerCase().startsWith("tường video") || body.toLowerCase().startsWith("tường gửi video") || body.toLowerCase().startsWith("tường cho video") || body.toLowerCase().startsWith("tường cho xin video")) {
    let query = body.replace(/tường\s*(gửi|cho|lấy|tải|send|mở|phát|share|bật|chuyển)?\s*(video|clip|mp4)?/i, "").trim();
    if (!query) return api.sendMessage("Bạn muốn tìm video gì trên YouTube?", threadID, messageID);
    return sendYouTubeMedia({ api, threadID, messageID, query, type: "mp4" });
  }
  // ==== MP3 YOUTUBE NGAY LẬP TỨC ====
  if (/(gửi|cho|lấy|tải|send|mở|phát|share|bật|chuyển)\s*(mp3|audio|nhạc|bài|track)[^\n]*$/i.test(body) || body.toLowerCase().startsWith("tường mp3") || body.toLowerCase().startsWith("tường gửi mp3") || body.toLowerCase().startsWith("tường cho mp3") || body.toLowerCase().startsWith("tường gửi nhạc")) {
    let query = body.replace(/tường\s*(gửi|cho|lấy|tải|send|mở|phát|share|bật|chuyển)?\s*(mp3|audio|nhạc|bài|track)?/i, "").trim();
    if (!query) return api.sendMessage("Bạn muốn nghe nhạc/bài gì trên YouTube?", threadID, messageID);
    return sendYouTubeMedia({ api, threadID, messageID, query, type: "mp3" });
  }

  // ==== DỊCH THUẬT ====
  if (/tường dịch ([a-z\-]+):/i.test(body.toLowerCase())) {
    const match = body.match(/tường dịch ([a-z\-]+):(.+)/i);
    if (match) {
      let lang = match[1].toLowerCase();
      let text = match[2].trim();
      let result = await translateText(text, lang);
      return api.sendMessage(`Bản dịch sang [${lang}]:\n${result}`, threadID, messageID);
    }
  }

  // ==== QUOTE ====
  if (/tường quote/i.test(body.toLowerCase())) {
    let quote = await getQuote();
    return api.sendMessage(`🌸 Quote cho bạn:\n${quote}`, threadID, messageID);
  }

  // ==== WEATHER ====
  if (/tường thời tiết/i.test(body.toLowerCase())) {
    let match = body.match(/tường thời tiết (.+)/i);
    let location = match ? match[1].trim() : "Hà Nội";
    let w = await getWeather(location);
    if (!w) return api.sendMessage("Không lấy được thông tin thời tiết!", threadID, messageID);
    return api.sendMessage(`🌤 Thời tiết tại ${w.location}:\n• ${w.desc}\n• Nhiệt độ: ${w.temp}°C\n• Gió: ${w.wind} km/h`, threadID, messageID);
  }

  // ==== NHẮC HẸN ====
  if (/tường nhắc (.+) lúc (\d{1,2}:\d{2})/i.test(body.toLowerCase())) {
    const match = body.match(/tường nhắc (.+) lúc (\d{1,2}:\d{2})/i);
    if (match) {
      let content = match[1].trim();
      let [h, m] = match[2].split(":").map(Number);
      let now = new Date();
      let remindTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0).getTime();
      if (remindTime < Date.now()) remindTime += 24 * 60 * 60 * 1000;
      let reminders = [];
      try { reminders = JSON.parse(fs.readFileSync(reminderPath)); } catch {}
      reminders.push({ content, time: remindTime, threadID, messageID });
      fs.writeFileSync(reminderPath, JSON.stringify(reminders, null, 2));
      global.tuongData.reminders = reminders;
      return api.sendMessage(`Nhắc "${content}" vào lúc ${match[2]} đã được đặt!`, threadID, messageID);
    }
  }

  // ==== EMOTION UPDATE ====
  if (/tường (update )?cảm xúc:/.test(body.toLowerCase())) {
    let emo = body.split(":").slice(1).join(":").trim();
    user.profile.emotionalState = emo;
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    return api.sendMessage(`Đã cập nhật cảm xúc cho bạn: ${emo} ${getEmo(emo)}`, threadID, messageID);
  }
  // ==== PROFILE ====
  if (/tường profile/.test(body.toLowerCase())) {
    let msg = `=== 🧑‍💻 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗧𝘂̛𝗼̛̀𝗻𝗴 𝗔𝗜 ===\n`;
    msg += `• Tên: ${user.profile.name}\n• Điểm: ${user.profile.points}\n• Chuỗi ngày: ${user.profile.streak} 🔥\n• Tính cách: ${user.profile.personality}\n• Cảm xúc hiện tại: ${user.profile.emotionalState} ${getEmo(user.profile.emotionalState)}\n• Tham gia từ: ${new Date(user.profile.joinTime).toLocaleString("vi-VN")}\n• Mối quan hệ: ${user.relationship}\n• Số lần tương tác: ${user.journal.length}`;
    return api.sendMessage(msg, threadID, messageID);
  }

  // ==== MINIGAME: đoán số ====
  if (/tường chơi đoán số/.test(body.toLowerCase())) {
    const answer = Math.floor(Math.random() * 10) + 1;
    user.gameGuess = answer;
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    return api.sendMessage("Tường đã nghĩ ra 1 số từ 1-10, đoán thử đi (reply số)! Nếu đúng được cộng điểm.", threadID, messageID);
  }
  if (user.gameGuess && /^\d+$/.test(body.trim()) && Number(body) >= 1 && Number(body) <= 10) {
    const ans = Number(body);
    if (ans === user.gameGuess) {
      user.profile.points += 7;
      delete user.gameGuess;
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage(randomArr([
        "Trời ơi đúng rồi luôn! +7 điểm cho bạn nha 😘",
        "Đỉnh luôn, đoán trúng rồi! Tường cộng điểm cho bạn đó.",
        "Đoán hay quá, đúng số! Bạn pro thật."
      ]), threadID, messageID);
    } else {
      user.profile.points -= 2;
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage("Sai rồi, thử lại đi! (Bị trừ 2 điểm 😜)", threadID, messageID);
    }
  }

  // ==== IMAGE REACTION ====
  if (attachments && attachments.length > 0 && attachments.some(att => att.type === "photo" || att.type === "animated_image")) {
    if (userData[threadID] && Math.random() < 0.49) {
      try {
        let userGender = user.profile.gender || (Math.random() > 0.5 ? "female" : "male");
        let userRelationship = user.relationship || "bạn thân";
        let react = randomArr([
          "Ảnh gì mà cute vậy trời 😆",
          "Ảnh này mà crush thấy chắc say nắng luôn",
          "Coi chừng bị lộ hàng nha 😏",
          "Up story liền đi bạn ơi!",
          "Ơ kìa ai đẹp thế này?",
          "Ảnh này mà làm avatar là nổi luôn đó!"
        ]);
        user.journal.push({ type: "imageReaction", botResponse: react, timestamp: Date.now() });
        user.lastInteraction = Date.now();
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
        api.sendMessage(react, threadID, messageID);
      } catch {}
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  return this.handleEvent({ api, event, args });
};
