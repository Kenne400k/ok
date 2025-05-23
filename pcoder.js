const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports.config = {
  name: "Tường",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "Nguyễn Trương Thiện Phát (Tường AI GenZ, Gemini-YouTube, Kenne400k tối ưu)",
  description: "AI Gemini đa tài: mở video/mp3 qua Gemini, tải mọi thể loại, cảm xúc, minigame, học, profile, training, phản hồi ảnh, meme, quote, thời tiết, dịch thuật, nhắc hẹn, cực xịn, siêu an toàn.",
  commandCategory: "ai",
  usages: [
    "Tường ơi mở video buồn của anh",
    "Tường gửi nhạc [tên bài]",
    "Tường gửi video [từ khóa]",
    "Tường mp3 [tên bài]",
    "Tường cảm xúc: [cảm xúc]",
    "Tường chơi đoán số",
    "Tường profile",
    "Tường resetdata",
    "Tường học câu này: [nội dung]",
    "Tường training on/off",
    "Tường quote",
    "Tường dịch [ngôn ngữ]: [nội dung]",
    "Tường thời tiết [địa điểm]",
    "Tường nhắc [nội dung] lúc [giờ]"
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
  global.ytDownloadRequests = new Map();
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

async function downloadYouTube(videoUrl, type, outPath) {
  return new Promise((resolve, reject) => {
    try {
      if (type === "mp3") {
        const stream = ytdl(videoUrl, { filter: "audioonly" });
        ffmpeg(stream)
          .audioBitrate(128)
          .format("mp3")
          .save(outPath)
          .on("end", () => resolve(outPath))
          .on("error", reject);
      } else {
        const stream = ytdl(videoUrl, { quality: "highestvideo" });
        ffmpeg(stream)
          .videoCodec('libx264')
          .audioCodec('aac')
          .format('mp4')
          .save(outPath)
          .on("end", () => resolve(outPath))
          .on("error", reject);
      }
    } catch (err) { reject(err); }
  });
}

// Weather API (Open-Meteo, free, không cần key)
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

// Dịch thuật (Google Translate API free unofficial)
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

// Nhắc hẹn thông minh
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

// ==== VIDEO/MP3 YOUTUBE TỪ GEMINI ====
async function handleGeminiMedia(api, threadID, messageID, senderID, geminiPrompt) {
  const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
  const geminiSysPrompt = `
${geminiPrompt}
Nếu có thể, chỉ trả lời bằng 1 hoặc nhiều link video YouTube hoặc mp3, mỗi link trên một dòng riêng. Nếu có mp3 hoặc link nhạc hãy ưu tiên gửi.
Nếu không có link hãy trả lời "Không tìm thấy video nào phù hợp."
  `.trim();
  let geminiResp;
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
      {
        contents: [{ role: "user", parts: [{ text: geminiSysPrompt }] }],
        generationConfig: { temperature: 0.72, topP: 0.98, maxOutputTokens: 500 }
      }
    );
    geminiResp = (res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
  } catch {
    return api.sendMessage("Tường đang lag, thử lại sau nhé!", threadID, messageID);
  }
  if (!geminiResp || /không tìm thấy video/i.test(geminiResp)) {
    return api.sendMessage("Không tìm được video nào hợp lý.", threadID, messageID);
  }
  const ytLinks = [];
  const mp3Links = [];
  const ytRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/gi;
  const mp3Regex = /(https?:\/\/[^\s]+\.mp3)/gi;
  let match;
  while ((match = ytRegex.exec(geminiResp)) !== null) ytLinks.push(match[0]);
  while ((match = mp3Regex.exec(geminiResp)) !== null) mp3Links.push(match[0]);
  let links = mp3Links.concat(ytLinks);
  if (links.length === 0) return api.sendMessage("Không tìm được link nào từ Gemini!", threadID, messageID);
  let msg = "🔗 Tường tìm được những link này:\n";
  links.forEach((link, i) => { msg += `${i+1}. ${link}\n`; });
  msg += "\n- Reply số thứ tự để tải về (mp3/video nếu là Youtube).\n- Hoặc reply 'mở' + số để nhận link dạng web mở nhanh.";
  api.sendMessage(msg, threadID, (err, replyMsg) => {
    if (!replyMsg) return;
    global.ytDownloadRequests.set(replyMsg.messageID, {
      links, senderID, timestamp: Date.now()
    });
  }, messageID);
}

// ==== MAIN HANDLE EVENT ====
module.exports.handleEvent = async function({ api, event }) {
  if (event.senderID === api.getCurrentUserID() || (!event.body && !event.attachments)) return;
  const { threadID, messageID, senderID, body = "", type, messageReply, attachments } = event;
  let userData = global.tuongData.users;
  // ==== PROFILE, STREAK, AUTO CREATE ====
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

  // ==== REMINDER ====
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
        const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
        let userGender = user.profile.gender || (Math.random() > 0.5 ? "female" : "male");
        let userRelationship = user.relationship || "bạn thân";
        let userName = user.profile.name || "Bạn";
        const prompt = `Bạn là Tường (AI GenZ). Phản hồi cực hài, cực ngầu, khi bạn thân (${userGender}) gửi ảnh cho bạn (${userRelationship}). Phản hồi dưới 18 từ, không prefix, GenZ vibe.`;
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
          { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.98, topP: 0.99, maxOutputTokens: 60 } }
        );
        let reactionMessage = (response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Ảnh gì mà dễ thương thế!").trim();
        user.journal.push({ type: "imageReaction", botResponse: reactionMessage, timestamp: Date.now() });
        user.lastInteraction = Date.now();
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
        api.sendMessage(reactionMessage, threadID, messageID);
      } catch {}
    }
  }

  // ==== VIDEO/MP3 YOUTUBE TỪ GEMINI ====
  if (/tường.*(mở|phát|play|cho|gửi|share|bật|chuyển|lấy|tải).*?(video|clip|mp3|audio|nhạc|bài|bản|track)/i.test(body.toLowerCase())) {
    let cleaned = body.replace(/tường\s*ơi/gi, "").replace(/tường/gi, "").trim();
    let prompt = cleaned;
    if (!prompt || prompt.length < 6) prompt = "Gợi ý cho mình một video hoặc mp3 trending, hoặc chủ đề hot trên YouTube.";
    return handleGeminiMedia(api, threadID, messageID, senderID, prompt);
  }

  // ==== XỬ LÝ REPLY ĐỂ TẢI VIDEO/MP3 TỪ GEMINI LINK ====
  if (type === "message_reply" && global.ytDownloadRequests && global.ytDownloadRequests.has(messageReply?.messageID)) {
    const req = global.ytDownloadRequests.get(messageReply.messageID);
    if (!req || (Date.now() - req.timestamp > 15 * 60 * 1000)) {
      global.ytDownloadRequests.delete(messageReply.messageID);
      return api.sendMessage("Yêu cầu tải/mở đã hết hạn. Gõ lại yêu cầu nhé!", threadID, messageID);
    }
    if (senderID !== req.senderID) return;
    const numMatch = body.trim().match(/^mở\s*(\d+)/i) || body.trim().match(/^(\d+)$/);
    if (!numMatch) return api.sendMessage("Reply số thứ tự hoặc 'mở' + số tương ứng!", threadID, messageID);
    const idx = parseInt(numMatch[1] || numMatch[0]);
    if (isNaN(idx) || idx < 1 || idx > req.links.length) return api.sendMessage("Số thứ tự không hợp lệ!", threadID, messageID);
    const link = req.links[idx-1];
    if (/mở/i.test(body)) {
      return api.sendMessage(`Đây là link bạn yêu cầu: ${link}`, threadID, messageID);
    }
    if (/\.mp3(\?|$)/i.test(link)) {
      const outPath = path.join(__dirname, "temp", `gemini_${Date.now()}.mp3`);
      try {
        const res = await axios.get(link, { responseType: "arraybuffer" });
        fs.writeFileSync(outPath, Buffer.from(res.data, "binary"));
        await api.sendMessage({body: "Gửi bạn mp3 nè!", attachment: fs.createReadStream(outPath)}, threadID, () => {
          try { fs.unlinkSync(outPath); } catch {}
        }, messageID);
      } catch {
        return api.sendMessage("Không tải được file mp3 từ link ngoài!", threadID, messageID);
      }
      global.ytDownloadRequests.delete(messageReply.messageID);
      return;
    }
    if (/(youtube\.com|youtu\.be)/i.test(link)) {
      api.sendMessage("Bạn muốn nhận video hay mp3? (reply: mp3/video)", threadID, (err, subMsg) => {
        if (!subMsg) return;
        global.ytDownloadRequests.set(subMsg.messageID, {
          ytlink: link, senderID, timestamp: Date.now()
        });
      }, messageID);
    }
    global.ytDownloadRequests.delete(messageReply.messageID);
    return;
  }
  // REPLY tiếp theo: nhận xác nhận mp3/video từ link youtube
  if (type === "message_reply" && global.ytDownloadRequests && global.ytDownloadRequests.has(messageReply?.messageID)) {
    const req = global.ytDownloadRequests.get(messageReply.messageID);
    if (!req || !req.ytlink || (Date.now() - req.timestamp > 15 * 60 * 1000)) {
      global.ytDownloadRequests.delete(messageReply.messageID);
      return;
    }
    if (senderID !== req.senderID) return;
    let replyType = /mp3|audio|nhạc/.test(body.toLowerCase()) ? "mp3" : "mp4";
    const outName = `geminilink_${Date.now()}.${replyType}`;
    const outPath = path.join(__dirname, "temp", outName);
    api.sendMessage("Đang tải & xử lý file, đợi xíu nha ...", threadID, async () => {
      try {
        await downloadYouTube(req.ytlink, replyType, outPath);
        const stats = fs.statSync(outPath);
        if (stats.size > 90 * 1024 * 1024) {
          fs.unlinkSync(outPath);
          return api.sendMessage("File quá lớn không thể gửi qua Messenger. Vui lòng chọn video khác/ngắn hơn!", threadID, messageID);
        }
        api.sendMessage({ body: `Gửi bạn file ${replyType === "mp3" ? "mp3" : "video"} nè!`, attachment: fs.createReadStream(outPath) }, threadID, () => {
          try { fs.unlinkSync(outPath); } catch {}
        }, messageID);
      } catch (err) {
        api.sendMessage("Lỗi tải/gửi file. Có thể video đã chặn tải hoặc lỗi hệ thống!", threadID, messageID);
        try { fs.unlinkSync(outPath); } catch {}
      }
    });
    global.ytDownloadRequests.delete(messageReply.messageID);
    return;
  }

  // ==== REPLY TO BOT MESSAGE, DUY TRÌ MẠCH HỘI THOẠI ====
  if (type === "message_reply" && messageReply && messageReply.senderID === api.getCurrentUserID()) {
    try {
      const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
      const systemPrompt = `Bạn là Tường, AI cực thân thiện, siêu GenZ, vui tính, cực ngầu. ${user.profile.name} vừa reply: "${messageReply.body}". Họ nói: "${body}". Hãy tiếp tục hội thoại tự nhiên, nối mạch cũ, không prefix, thêm chút meme/emoji nếu hợp.`;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
        { contents: [{ role: "user", parts: [{ text: systemPrompt }] }], generationConfig: { temperature: 0.85, topP: 0.98, maxOutputTokens: 800 } }
      );
      let aiResponse = (response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tường chưa hiểu ý bạn. Nói lại nha!").trim();
      user.journal.push({
        type: "reply_conversation",
        botPreviousMessage: messageReply.body,
        userReply: body,
        botResponse: aiResponse,
        timestamp: Date.now()
      });
      user.lastInteraction = Date.now();
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage(aiResponse, threadID, messageID);
    } catch (err) {
      return api.sendMessage("Tường không hiểu ý bạn lắm. Nói lại thử nha!", threadID, messageID);
    }
  }

  // ==== TRAINING MODE ====
  const { trainingSessions } = global.tuongData;
  if (trainingSessions.has(threadID) && !body.toLowerCase().includes("tường")) {
    const trainingData = JSON.parse(fs.readFileSync(trainingDataPath));
    trainingData.push({ message: body, senderID, threadID, timestamp: Date.now() });
    fs.writeFileSync(trainingDataPath, JSON.stringify(trainingData, null, 2));
    global.tuongData.training = trainingData;
    return;
  }

  // ==== PHẢN ỨNG KHI BỊ TAG/LIÊN QUAN CODE ====
  const programmingKeywords = [
    "javascript", "python", "java", "c++", "c#", "php", "html", "css", "code", "coding",
    "programming", "developer", "function", "variable", "class", "object", "array", "loop",
    "if else", "api", "database", "sql", "nodejs", "react", "typescript", "framework", "algorithm", "git", "github"
  ];
  const messageContainsTuong = body.toLowerCase().includes("tường");
  const messageStartsWithTuong = body.toLowerCase().startsWith("tường");
  const containsProgrammingKeywords = programmingKeywords.some(keyword => body.toLowerCase().includes(keyword));
  if ((!messageStartsWithTuong && messageContainsTuong) || (containsProgrammingKeywords && Math.random() < 0.55)) {
    let responses = [
      "Ai gọi Tường đấy nhỉ? 👀",
      "Ơ t nghe thấy tên Tường luôn nè!",
      "Bàn gì về Tường thế?",
      "Tường nghe thấy tên rồi đó nha!",
      "Có ai cần Tường giúp gì không?",
      "Ủa đang nói gì về Tường đó?",
      "Tường ở đây, có gì hot?"
    ];
    await api.sendMessage(randomArr(responses), threadID);
    return;
  }

  // ==== HANDLE "TƯỜNG" COMMAND ====
  if (messageContainsTuong) {
    let userMessage = body.toLowerCase().replace(/tường\s*[ơi]?\s*/i, "").trim() || "chào bạn";
    if (userMessage === "resetdata") {
      userData[threadID][senderID] = {
        profile: {
          name: user.profile.name,
          pronouns: "bạn",
          personality: "hài hước, ngáo, thân thiện",
          emotionalState: "bình thường",
          gender: user.profile.gender,
          points: 0,
          joinTime: Date.now(),
          streak: 0
        },
        journal: [],
        relationship: "bạn thân",
        conversationStyle: "genz",
        preferredLanguage: "Vietnamese",
        lastInteraction: Date.now(),
        lastMessageDay: today
      };
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage("Dữ liệu của bạn đã reset! Tường coi như bạn mới toanh nhé, lại làm bạn từ đầu 🤝", threadID, messageID);
    }
    if (userMessage.startsWith("training")) {
      const command = userMessage.split(" ")[1];
      if (command === "on") {
        trainingSessions.set(threadID, true);
        return api.sendMessage("Bật training! Mọi tin nhắn tiếp theo sẽ được lưu lại (trừ khi có từ 'Tường').", threadID, messageID);
      } else if (command === "off") {
        trainingSessions.delete(threadID);
        return api.sendMessage("Đã tắt chế độ training.", threadID, messageID);
      }
    }
    if (userMessage.startsWith("học câu này:")) {
      const content = userMessage.substring("học câu này:".length).trim();
      const trainingData = JSON.parse(fs.readFileSync(trainingDataPath));
      trainingData.push({ message: content, senderID, threadID, timestamp: Date.now() });
      fs.writeFileSync(trainingDataPath, JSON.stringify(trainingData, null, 2));
      global.tuongData.training = trainingData;
      return api.sendMessage("Cảm ơn bạn! Tường đã học được câu này rồi, lưu vào não luôn 😎", threadID, messageID);
    }
    // Tạo prompt hội thoại cực GenZ, vui vẻ, nối mạch, bonus meme
    const recentJournal = user.journal.slice(-6).map(entry => `${entry.userMessage || entry.botPreviousMessage || ""}: ${entry.botResponse || ""}`).join("\n");
    const systemPrompt = `Bạn là Tường AI, GenZ, vui nhộn, cực thân thiện, cực ngầu, biết meme, emoji, không ngại cà khịa. Hãy nói chuyện với ${user.profile.name} (mối quan hệ: ${user.relationship}, cảm xúc: ${user.profile.emotionalState}, streak: ${user.profile.streak}). Tin nhắn gần đây:\n${recentJournal}\nNgười dùng nói: "${userMessage}"\nTrả lời không quá 3 câu, không prefix, chèn emoji/meme nếu hợp, vibe GenZ.`;
    try {
      const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
        { contents: [{ role: "user", parts: [{ text: systemPrompt }] }], generationConfig: { temperature: 0.89, topP: 0.99, maxOutputTokens: 1000 } }
      );
      let aiResponse = (response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tường chưa hiểu ý bạn. Nói lại nha!").trim();
      user.journal.push({ type: "conversation", userMessage, botResponse: aiResponse, timestamp: Date.now() });
      user.lastInteraction = Date.now();
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage(aiResponse, threadID, messageID);
    } catch {
      return api.sendMessage("Sorry, Tường đang lag nhẹ. Thử lại sau nha!", threadID, messageID);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  return this.handleEvent({ api, event, args });
};
