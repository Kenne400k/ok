const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports.config = {
  name: "Tường",
  version: "6.0.0",
  hasPermssion: 0,
  credits: "Nguyễn Trương Thiện Phát (Tường AI GenZ, Gemini-YouTube cực xịn)",
  description: "AI Gemini cực thông minh, biết tìm link video/mp3 Youtube qua Gemini, tải, gửi file, cảm xúc, minigame, học, profile cá nhân hóa, training, phản hồi ảnh, hội thoại tự nhiên.",
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
    "Tường training on/off"
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

module.exports.onLoad = async () => {
  const dataPath = path.join(__dirname, "../../data");
  const userDataPath = path.join(dataPath, "tuong_users.json");
  const trainingDataPath = path.join(dataPath, "tuong_training.json");
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  if (!fs.existsSync(userDataPath)) fs.writeFileSync(userDataPath, JSON.stringify({}));
  if (!fs.existsSync(trainingDataPath)) fs.writeFileSync(trainingDataPath, JSON.stringify([]));
  global.tuongData = {
    users: JSON.parse(fs.readFileSync(userDataPath)),
    training: JSON.parse(fs.readFileSync(trainingDataPath)),
    trainingSessions: new Map()
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
};

function randomArr(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
const EMOTICONS = {
  vui: "😆", buồn: "😢", tức: "😡", ngáo: "😵", yêu: "😍", "bình thường": "🙂", "ngại": "😳", "cà khịa": "😏", "tự tin": "😎", "đang yêu": "💘", "hào hứng": "🤩"
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
    } catch (err) {
      reject(err);
    }
  });
}

// ==== XỬ LÝ VIDEO/MP3 TỪ LINK YOUTUBE GEMINI GỢI Ý ====
async function handleGeminiMedia(api, threadID, messageID, senderID, geminiPrompt) {
  // 1. Gửi prompt sang Gemini, bảo nó chỉ trả về các link YouTube/mp3 liên quan
  const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
  const geminiSysPrompt = `${geminiPrompt}
Nếu có thể, chỉ trả lời bằng 1 hoặc nhiều link video YouTube hoặc mp3, mỗi link trên một dòng riêng. Nếu có mp3 hoặc link nhạc hãy ưu tiên gửi.
Nếu không có link hãy trả lời "Không tìm thấy video nào phù hợp."`;

  let geminiResp;
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
      {
        contents: [{ role: "user", parts: [{ text: geminiSysPrompt }] }],
        generationConfig: { temperature: 0.77, topP: 0.98, maxOutputTokens: 400 }
      }
    );
    geminiResp = (res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
  } catch {
    return api.sendMessage("Tường đang lag, thử lại sau nhé!", threadID, messageID);
  }

  if (!geminiResp || /không tìm thấy video/i.test(geminiResp)) {
    return api.sendMessage("Không tìm được video nào hợp lý.", threadID, messageID);
  }

  // 2. Tìm link YouTube/mp3 trong phản hồi Gemini
  const ytLinks = [];
  const mp3Links = [];
  // Youtube link regex:
  const ytRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/gi;
  const mp3Regex = /(https?:\/\/[^\s]+\.mp3)/gi;
  let match;
  while ((match = ytRegex.exec(geminiResp)) !== null) ytLinks.push(match[0]);
  while ((match = mp3Regex.exec(geminiResp)) !== null) mp3Links.push(match[0]);
  let links = mp3Links.concat(ytLinks);

  if (links.length === 0) return api.sendMessage("Không tìm được link nào từ Gemini!", threadID, messageID);

  // 3. Gửi danh sách link cho user chọn tải dạng file hoặc mở dạng web
  let msg = "🔗 Tường tìm được những link này:\n";
  links.forEach((link, i) => {
    msg += `${i+1}. ${link}\n`;
  });
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
  const userDataPath = path.join(__dirname, "../../data/tuong_users.json");
  const trainingDataPath = path.join(__dirname, "../../data/tuong_training.json");
  let userData = global.tuongData.users;

  // === PROFILE, EMOTION, FRIEND SYSTEM, AUTO CREATE IF MISSING ===
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
    // Nếu là mp3 link ngoài => gửi file luôn
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
    // Nếu là link youtube
    if (/(youtube\.com|youtu\.be)/i.test(link)) {
      // Hỏi tải video hay mp3 (nếu chưa xác định)
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

  // ==== XỬ LÝ LỆNH "TƯỜNG ƠI MỞ VIDEO..." HOẶC GỢI Ý MP3/VIDEO ====
  if (/tường.*(mở|phát|play|cho|gửi|share|bật|chuyển|lấy|tải).*?(video|clip|mp3|audio|nhạc|bài|bản|track)/i.test(body.toLowerCase())) {
    let cleaned = body.replace(/tường\s*ơi/gi, "").replace(/tường/gi, "").trim();
    let prompt = cleaned;
    // Nếu user chỉ nói chung chung thì hỏi lại
    if (!prompt || prompt.length < 6) prompt = "Gợi ý cho mình một video hoặc mp3 trending, hoặc chủ đề hot trên YouTube.";
    return handleGeminiMedia(api, threadID, messageID, senderID, prompt);
  }

  // ==== CÁC CHỨC NĂNG KHÁC (profile, minigame, cảm xúc, hội thoại, ... như code trước) ====
  // ... (giữ lại nguyên phần xử lý profile, minigame, cảm xúc, meme, streak, hội thoại, học câu, training, auto reply ... từ code trước - bỏ đi phần youtube cũ để tránh lỗi)
};

module.exports.run = async function({ api, event, args }) {
  return this.handleEvent({ api, event, args });
};
