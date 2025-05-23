const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "Tường",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Nguyễn Trương Thiện Phát (Tường AI GenZ, YouTube cực xịn)",
  description: "Trợ lý Gemini AI, gửi/chuyển video, mp3 YouTube, cảm xúc, minigame, học, profile cá nhân hóa, training, auto phản hồi ảnh, cực chất.",
  commandCategory: "ai",
  usages: [
    "Tường [tin nhắn]",
    "Tường gửi nhạc [tên bài]",
    "Tường gửi video [từ khóa]",
    "Tường mp3 [tên bài]",
    "Tường video [từ khóa]",
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

// ==== INIT DATA FOLDER & FILES ====
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

  // Dọn temp mỗi 30 phút, xóa file >1h
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

// ==== YOUTUBE UTILS INLINE (KHÔNG PHỤ THUỘC FILE NGOÀI) ====
// Sử dụng ytdl-core để lấy video/audio từ YouTube
const ytdl = require("@distube/ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);

async function searchYouTube(query) {
  // Dùng YouTube Data API v3 hoặc fallback sang web scraping đơn giản nếu không có key
  // Ưu tiên dùng YouTube Data API nếu có
  const apiKey = process.env.YT_API_KEY || "";
  if (apiKey) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;
      const res = await axios.get(url);
      if (res.data.items && res.data.items.length > 0) {
        const item = res.data.items[0];
        return {
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.high?.url || ""
        };
      }
    } catch (e) {
      // fallback
    }
  }
  // Fallback: Scrape YouTube search results page (chống block, rất đơn giản)
  try {
    const res = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, { headers: { "User-Agent": "Mozilla/5.0" } });
    const match = res.data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    const titleMatch = res.data.match(/"title":{"runs":\[{"text":"([^"]+)"}/);
    return {
      videoId: match ? match[1] : null,
      title: titleMatch ? titleMatch[1] : query,
      thumbnail: `https://i.ytimg.com/vi/${match ? match[1] : ""}/hqdefault.jpg`
    };
  } catch {
    return null;
  }
}

async function downloadYouTubeVideo(videoId, type, outPath) {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "mp3") {
        const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: "audioonly" });
        ffmpeg(stream)
          .audioBitrate(128)
          .format("mp3")
          .save(outPath)
          .on("end", () => resolve(outPath))
          .on("error", reject);
      } else {
        const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { quality: "highestvideo" });
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

  // ==== XỬ LÝ YÊU CẦU GỬI VIDEO/MP3 YOUTUBE CỰC XỊN ====
  const lowerBody = body.toLowerCase();
  const matchVideo = lowerBody.match(/tường (gửi|cho|cho xin|gửi tui|lấy|tải|send)?\s*(video|clip|mp4)?\s*(mp3|audio|nhạc)?\s*(bài|bản|của|về|)?\s*(.+)/i);
  if (
    lowerBody.startsWith("tường gửi video")
    || lowerBody.startsWith("tường gửi mp3")
    || lowerBody.startsWith("tường mp3")
    || lowerBody.startsWith("tường video")
    || lowerBody.startsWith("tường cho clip")
    || lowerBody.startsWith("tường cho xin mp3")
    || lowerBody.startsWith("tường tải video")
    || lowerBody.startsWith("tường tải mp3")
    || lowerBody.startsWith("tường gửi nhạc")
    || (matchVideo && matchVideo[5])
  ) {
    let query = "";
    let type = "mp4";
    if (lowerBody.includes("mp3") || lowerBody.includes("audio") || lowerBody.includes("nhạc")) type = "mp3";
    if (matchVideo && matchVideo[5]) query = matchVideo[5];
    else query = body.replace(/tường.*?(gửi|cho|cho xin|gửi tui|lấy|tải|send)?\s*(video|clip|mp4|mp3|audio|nhạc)?/i, "").trim();

    if (!query) return api.sendMessage("Bạn muốn tìm video/nhạc gì? Gõ đầy đủ nhé!", threadID, messageID);

    // Tìm video
    api.sendMessage("Đợi Tường tìm video trên YouTube cho bạn ...", threadID, async (err, info) => {
      try {
        const search = await searchYouTube(query);
        if (!search || !search.videoId) return api.sendMessage("Không tìm thấy video nào hợp lệ 😥", threadID, messageID);

        // Gửi info trước, hỏi người dùng xác nhận tải dạng gì
        let msg = `🎬 Tìm được: ${search.title}\nhttps://youtu.be/${search.videoId}\nBạn muốn nhận file dưới dạng gì?\n1. Video (reply: video)\n2. Mp3 (reply: mp3)\n\n(Vui lòng reply vào tin nhắn này!)`;
        const thumbPath = path.join(__dirname, "temp", `${search.videoId}.jpg`);
        try {
          const imgResp = await axios.get(search.thumbnail, { responseType: "arraybuffer" });
          fs.writeFileSync(thumbPath, Buffer.from(imgResp.data, "binary"));
        } catch { /* ignore */ }
        api.sendMessage({ body: msg, attachment: fs.existsSync(thumbPath) ? fs.createReadStream(thumbPath) : null }, threadID, (err, replyMsg) => {
          if (!replyMsg) return;
          global.ytDownloadRequests.set(replyMsg.messageID, {
            videoId: search.videoId,
            title: search.title,
            requestedBy: senderID,
            type,
            timestamp: Date.now()
          });
        }, messageID);
      } catch (e) {
        return api.sendMessage("Không tìm được video hoặc lỗi hệ thống 😢", threadID, messageID);
      }
    });
    return;
  }

  // ==== XỬ LÝ REPLY ĐỂ GỬI VIDEO/MP3 ====
  if (type === "message_reply" && global.ytDownloadRequests && global.ytDownloadRequests.has(messageReply?.messageID)) {
    const request = global.ytDownloadRequests.get(messageReply.messageID);
    if (!request || (Date.now() - request.timestamp > 10 * 60 * 1000)) {
      global.ytDownloadRequests.delete(messageReply.messageID);
      return api.sendMessage("Yêu cầu tải xuống đã hết hạn. Vui lòng yêu cầu lại.", threadID, messageID);
    }
    if (senderID !== request.requestedBy) return; // Chỉ cho người yêu cầu tải

    let replyType = "mp4";
    if (/mp3|audio|nhạc/.test(body.toLowerCase())) replyType = "mp3";
    if (/video|mp4|clip/.test(body.toLowerCase())) replyType = "mp4";

    const outName = `${request.videoId}_${Date.now()}.${replyType === "mp3" ? "mp3" : "mp4"}`;
    const outPath = path.join(__dirname, "temp", outName);
    api.sendMessage("Đang tải & xử lý file, đợi xíu nha ...", threadID, async () => {
      try {
        await downloadYouTubeVideo(request.videoId, replyType, outPath);
        const stats = fs.statSync(outPath);
        if (stats.size > 90 * 1024 * 1024) { // 90mb FB limit
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

  // ==== EMOTION UPDATE ====
  if (/tường (update )?cảm xúc:/.test(body.toLowerCase())) {
    let emo = body.split(":").slice(1).join(":").trim();
    userData[threadID][senderID].profile.emotionalState = emo;
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    return api.sendMessage(
      `Đã cập nhật cảm xúc cho bạn: ${emo} ${getEmo(emo)}`, threadID, messageID
    );
  }

  // ==== PROFILE VIEW ====
  if (/tường profile/.test(body.toLowerCase())) {
    const profile = userData[threadID][senderID].profile;
    let msg = `=== 🧑‍💻 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗧𝘂̛𝗼̛̀𝗻𝗴 𝗔𝗜 ===\n`;
    msg += `• Tên: ${profile.name}\n`;
    msg += `• Điểm: ${profile.points}\n`;
    msg += `• Chuỗi ngày: ${profile.streak} 🔥\n`;
    msg += `• Tính cách: ${profile.personality}\n`;
    msg += `• Cảm xúc hiện tại: ${profile.emotionalState} ${getEmo(profile.emotionalState)}\n`;
    msg += `• Tham gia từ: ${new Date(profile.joinTime).toLocaleString("vi-VN")}\n`;
    msg += `• Mối quan hệ với Tường: ${userData[threadID][senderID].relationship}\n`;
    msg += `• Số lần tương tác: ${userData[threadID][senderID].journal.length}\n`;
    return api.sendMessage(msg, threadID, messageID);
  }

  // ==== MINIGAME: đoán số ====
  if (/tường chơi đoán số/.test(body.toLowerCase())) {
    const answer = Math.floor(Math.random() * 10) + 1;
    userData[threadID][senderID].gameGuess = answer;
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    return api.sendMessage("Tường đã nghĩ ra 1 số từ 1-10, đoán thử đi (reply số)! Nếu đúng được cộng điểm.", threadID, messageID);
  }
  if (userData[threadID][senderID].gameGuess && /^\d+$/.test(body.trim()) && Number(body) >= 1 && Number(body) <= 10) {
    const ans = Number(body);
    if (ans === userData[threadID][senderID].gameGuess) {
      userData[threadID][senderID].profile.points += 7;
      delete userData[threadID][senderID].gameGuess;
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage(randomArr([
        "Trời ơi đúng rồi luôn! +7 điểm cho bạn nha 😘",
        "Đỉnh luôn, đoán trúng rồi! Tường cộng điểm cho bạn đó.",
        "Đoán hay quá, đúng số! Bạn pro thật."
      ]), threadID, messageID);
    } else {
      userData[threadID][senderID].profile.points -= 2;
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage("Sai rồi, thử lại đi! (Bị trừ 2 điểm 😜)", threadID, messageID);
    }
  }

  // ==== IMAGE REACTION GENZ ====
  if (attachments && attachments.length > 0 && attachments.some(att => att.type === "photo" || att.type === "animated_image")) {
    if (userData[threadID] && Math.random() < 0.49) {
      try {
        const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
        let userGender = userData[threadID][senderID].profile.gender || (Math.random() > 0.5 ? "female" : "male");
        let userRelationship = userData[threadID][senderID].relationship || "bạn thân";
        let userName = userData[threadID][senderID].profile.name || "Bạn";
        const prompt = `Bạn là Tường (AI GenZ). Phản hồi cực hài, cực ngầu, khi bạn thân (${userGender}) gửi ảnh cho bạn (${userRelationship}). Phản hồi dưới 18 từ, không prefix, GenZ vibe.`;
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
          { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.98, topP: 0.99, maxOutputTokens: 60 } }
        );
        let reactionMessage = (response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Ảnh gì mà dễ thương thế!").trim();
        userData[threadID][senderID].journal.push({ type: "imageReaction", botResponse: reactionMessage, timestamp: Date.now() });
        userData[threadID][senderID].lastInteraction = Date.now();
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
        api.sendMessage(reactionMessage, threadID, messageID);
      } catch {}
    }
  }

  // ==== REPLY TO BOT MESSAGE, DUY TRÌ MẠCH HỘI THOẠI ====
  if (type === "message_reply" && messageReply && messageReply.senderID === api.getCurrentUserID()) {
    try {
      const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
      const user = userData[threadID][senderID];
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
    // Resetdata, training mode, học câu
    let user = userData[threadID][senderID];
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
        lastMessageDay: (new Date()).toLocaleDateString("vi-VN")
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
