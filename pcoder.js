const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "tuong",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Nguyễn Trương Thiện Phát",
  description: "Trợ lý AI Gemini siêu cấp, tích hợp cảm xúc, YouTube, mini-game, học từ hội thoại, phản hồi ảnh, tự động training, lưu lịch sử, profile cá nhân hóa, cực xịn.",
  commandCategory: "ai",
  usages: [
    "tuong [message]",
    "tuong gửi nhạc [tên bài]",
    "tuong gửi video [tên clip]",
    "tuong học câu này: [nội dung]",
    "tuong resetdata",
    "tuong training on/off",
    "tuong cảm xúc: [cảm xúc]",
    "tuong thống kê",
    "tuong chơi [mini-game]",
    "tuong giúp tôi với...",
    "tuong giải thích code: [đoạn code]",
    "tuong project [ngôn ngữ]",
    "tuong mp3 [tên bài]",
    "tuong video [từ khóa]",
    "tuong tử vi [cung hoàng đạo]",
    "tuong gửi ảnh [tâm trạng]",
    "tuong profile"
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

// ==== AUTO INITIALIZE DATA FOLDER & FILES ====
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

  // Auto clean temp files older 1h, every 30min
  setInterval(() => {
    try {
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > 60 * 60 * 1000) fs.unlinkSync(filePath);
      });
    } catch (error) {}
  }, 30 * 60 * 1000);
};

function randomArr(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const EMOTICONS = {
  vui: "😆", buồn: "😢", tức: "😡", ngáo: "😵", yêu: "😍", "bình thường": "🙂", "ngại": "😳", "cà khịa": "😏"
};

function getEmo(state) {
  for (const [k, v] of Object.entries(EMOTICONS)) if ((state || "").toLowerCase().includes(k)) return v;
  return "🤖";
}

module.exports.handleEvent = async function({ api, event }) {
  if (event.senderID === api.getCurrentUserID() || (!event.body && !event.attachments)) return;
  const { threadID, messageID, senderID, body = "", type, messageReply, attachments } = event;
  const userDataPath = path.join(__dirname, "../../data/tuong_users.json");
  const trainingDataPath = path.join(__dirname, "../../data/tuong_training.json");
  let userData = global.tuongData.users;

  // === AUTO PROFILE, EMOTION, FRIEND SYSTEM
  if (!userData[threadID]) userData[threadID] = {};
  if (!userData[threadID][senderID]) {
    userData[threadID][senderID] = {
      profile: {
        name: "User",
        pronouns: "bạn",
        personality: "thân thiện vui nhộn",
        emotionalState: "bình thường",
        gender: "unknown",
        points: 0,
        joinTime: Date.now()
      },
      journal: [],
      relationship: "bạn thân",
      conversationStyle: "thân thiện",
      preferredLanguage: "Vietnamese",
      lastInteraction: Date.now()
    };
    try {
      const userInfo = await api.getUserInfo(senderID);
      if (userInfo && userInfo[senderID]) userData[threadID][senderID].profile.name = userInfo[senderID].name || "User";
    } catch {}
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
  }

  // ==== EMOTION UPDATE ====
  if (/tuong (update )?cảm xúc:/.test(body.toLowerCase())) {
    let emo = body.split(":").slice(1).join(":").trim();
    userData[threadID][senderID].profile.emotionalState = emo;
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    return api.sendMessage(
      `Đã cập nhật cảm xúc cho bạn: ${emo} ${getEmo(emo)}`, threadID, messageID
    );
  }

  // ==== PROFILE VIEW ====
  if (/tuong profile/.test(body.toLowerCase())) {
    const profile = userData[threadID][senderID].profile;
    let msg = `=== 👤 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗧𝘂̛𝗼̛̀𝗻𝗴 𝗔𝗜 ===\n`;
    msg += `• Tên: ${profile.name}\n`;
    msg += `• Điểm: ${profile.points}\n`;
    msg += `• Tính cách: ${profile.personality}\n`;
    msg += `• Cảm xúc hiện tại: ${profile.emotionalState} ${getEmo(profile.emotionalState)}\n`;
    msg += `• Tham gia từ: ${new Date(profile.joinTime).toLocaleString("vi-VN")}\n`;
    msg += `• Mối quan hệ với Tường: ${userData[threadID][senderID].relationship}\n`;
    msg += `• Số lần tương tác: ${userData[threadID][senderID].journal.length}\n`;
    return api.sendMessage(msg, threadID, messageID);
  }

  // ==== MINIGAME: đoán số ====
  if (/tuong chơi đoán số/.test(body.toLowerCase())) {
    const answer = Math.floor(Math.random() * 10) + 1;
    userData[threadID][senderID].gameGuess = answer;
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    return api.sendMessage("Tường đã nghĩ ra 1 số từ 1-10, đoán thử đi (reply số)! Nếu đúng được cộng điểm.", threadID, messageID);
  }
  if (userData[threadID][senderID].gameGuess && /^\d+$/.test(body.trim()) && Number(body) >= 1 && Number(body) <= 10) {
    const ans = Number(body);
    if (ans === userData[threadID][senderID].gameGuess) {
      userData[threadID][senderID].profile.points += 5;
      delete userData[threadID][senderID].gameGuess;
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage(randomArr([
        "Trời ơi đúng rồi luôn! +5 điểm cho bạn nha 😘",
        "Đỉnh luôn, đoán trúng rồi! Tường cộng điểm cho bạn đó.",
        "Đoán hay quá, đúng số! Bạn pro thật."
      ]), threadID, messageID);
    } else {
      userData[threadID][senderID].profile.points -= 1;
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage("Sai rồi, thử lại đi! (Bị trừ 1 điểm 😜)", threadID, messageID);
    }
  }

  // ==== IMAGE REACTION ====
  if (attachments && attachments.length > 0 && attachments.some(att => att.type === "photo" || att.type === "animated_image")) {
    if (userData[threadID] && Math.random() < 0.45) {
      try {
        const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
        let userGender = userData[threadID][senderID].profile.gender || (Math.random() > 0.5 ? "female" : "male");
        let userRelationship = userData[threadID][senderID].relationship || "bạn thân";
        let userName = userData[threadID][senderID].profile.name || "User";
        const prompt = `Phản hồi hài hước, thân mật khi bạn thân gửi ảnh cho bạn (vai: ${userGender}, mqh: ${userRelationship}) - tối đa 20 từ, không dùng prefix.`;
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
          { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.93, topP: 0.97, maxOutputTokens: 100 } }
        );
        let reactionMessage = (response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Ảnh gì mà dễ thương thế!").trim();
        userData[threadID][senderID].journal.push({ type: "imageReaction", botResponse: reactionMessage, timestamp: Date.now() });
        userData[threadID][senderID].lastInteraction = Date.now();
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
        api.sendMessage(reactionMessage, threadID, messageID);
      } catch {}
    }
  }

  // ==== REPLY TO BOT MESSAGE ====
  if (type === "message_reply" && messageReply && messageReply.senderID === api.getCurrentUserID()) {
    try {
      const currentUser = userData[threadID][senderID];
      const userName = currentUser.profile.name;
      const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
      const systemPrompt = `Bạn là Tường, trợ lý AI vui tính trên Messenger. ${userName} vừa reply: "${messageReply.body}". Họ nói: "${body}". Hãy tiếp tục hội thoại tự nhiên, nối mạch cũ, không prefix, thân thiện và sinh động.`;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
        { contents: [{ role: "user", parts: [{ text: systemPrompt }] }], generationConfig: { temperature: 0.76, topP: 0.95, maxOutputTokens: 800 } }
      );
      let aiResponse = (response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tường chưa hiểu ý bạn. Nói lại nha!").trim();
      currentUser.journal.push({
        type: "reply_conversation",
        botPreviousMessage: messageReply.body,
        userReply: body,
        botResponse: aiResponse,
        timestamp: Date.now()
      });
      currentUser.lastInteraction = Date.now();
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage(aiResponse, threadID, messageID);
    } catch (err) {
      return api.sendMessage("Tường không hiểu ý bạn lắm. Nói lại thử nha!", threadID, messageID);
    }
  }

  // ==== TRAINING MODE ====
  const { trainingSessions } = global.tuongData;
  if (trainingSessions.has(threadID) && !body.toLowerCase().includes("tuong")) {
    const trainingData = JSON.parse(fs.readFileSync(trainingDataPath));
    trainingData.push({ message: body, senderID, threadID, timestamp: Date.now() });
    fs.writeFileSync(trainingDataPath, JSON.stringify(trainingData, null, 2));
    global.tuongData.training = trainingData;
    return;
  }

  // ==== NATURAL REACTION WHEN TAGGED ====
  const programmingKeywords = [
    "javascript", "python", "java", "c++", "c#", "php", "html", "css", "code", "coding",
    "programming", "developer", "function", "variable", "class", "object", "array", "loop",
    "if else", "api", "database", "sql", "nodejs", "react", "typescript", "framework", "algorithm", "git", "github"
  ];
  const messageContainsTuong = body.toLowerCase().includes("tuong");
  const messageStartsWithTuong = body.toLowerCase().startsWith("tuong");
  const containsProgrammingKeywords = programmingKeywords.some(keyword => body.toLowerCase().includes(keyword));
  if ((!messageStartsWithTuong && messageContainsTuong) || (containsProgrammingKeywords && Math.random() < 0.4)) {
    let responses = [
      "Có ai gọi Tường không nhỉ? 👀",
      "Ủa có ai nhắc tên Tường à?",
      "Ơ Tường nghe thấy tên rồi nè!",
      "Đang bàn gì về Tường vậy?",
      "Tường nghe thấy tên rồi đó nha!",
      "Có ai cần Tường giúp gì không?",
      "Ủa đang nói gì về Tường đó?"
    ];
    await api.sendMessage(randomArr(responses), threadID);
    return;
  }

  // ==== HANDLE "TUONG" COMMAND ====
  if (messageContainsTuong) {
    // Video/audio download requests, modular hoá nếu cần
    try {
      const youtubeUtil = require("./youtube-utils");
      const result = await youtubeUtil.processMediaRequest(body, api, threadID, messageID, senderID);
      if (result.handled) return;
    } catch {}
    // Resetdata, training mode, học câu
    let currentUser = userData[threadID][senderID];
    let userMessage = body.toLowerCase().replace(/tuong\s*[ơi]?\s*/i, "").trim() || "chào bạn";
    if (userMessage === "resetdata") {
      userData[threadID][senderID] = {
        profile: {
          name: currentUser.profile.name,
          pronouns: "bạn",
          personality: "thân thiện vui nhộn",
          emotionalState: "bình thường",
          gender: currentUser.profile.gender,
          points: 0,
          joinTime: Date.now()
        },
        journal: [],
        relationship: "bạn thân",
        conversationStyle: "nghiêm túc",
        preferredLanguage: "Vietnamese",
        lastInteraction: Date.now()
      };
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage("Dữ liệu của bạn đã được reset! Tường coi như bạn mới luôn, chơi lại từ đầu nhé!", threadID, messageID);
    }
    if (userMessage.startsWith("training")) {
      const command = userMessage.split(" ")[1];
      if (command === "on") {
        trainingSessions.set(threadID, true);
        return api.sendMessage("Đã bật chế độ training. Mọi tin nhắn tiếp theo sẽ được lưu làm dữ liệu training (trừ khi có từ 'tuong').", threadID, messageID);
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
      return api.sendMessage("Cảm ơn bạn! Tường đã học được câu này rồi.", threadID, messageID);
    }
    // Tạo prompt hội thoại, cá tính, xịn
    const recentJournal = currentUser.journal.slice(-5).map(entry => `${entry.userMessage || entry.botPreviousMessage || ""}: ${entry.botResponse || ""}`).join("\n");
    const systemPrompt = `Bạn là Tường, trợ lý AI thông minh, vui vẻ, tự tin. Hãy trả lời tiếng Việt thân thiện, dùng đại từ thân mật ("tao-mày" nếu được), nói chuyện với ${currentUser.profile.name}, mối quan hệ: ${currentUser.relationship}. Cảm xúc hiện tại: ${currentUser.profile.emotionalState}. Tin nhắn gần đây:\n${recentJournal}\nNgười dùng ${currentUser.profile.name} nói: "${userMessage}"\nTrả lời không quá 3 câu, không prefix, sinh động, có cảm xúc.`;
    try {
      const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
        { contents: [{ role: "user", parts: [{ text: systemPrompt }] }], generationConfig: { temperature: 0.74, topP: 0.97, maxOutputTokens: 1000 } }
      );
      let aiResponse = (response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tường chưa hiểu ý bạn. Nói lại nha!").trim();
      currentUser.journal.push({ type: "conversation", userMessage, botResponse: aiResponse, timestamp: Date.now() });
      currentUser.lastInteraction = Date.now();
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      return api.sendMessage(aiResponse, threadID, messageID);
    } catch {
      return api.sendMessage("Xin lỗi, Tường đang lỗi nhẹ. Bạn thử lại sau nha!", threadID, messageID);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  return this.handleEvent({ api, event, args });
};
