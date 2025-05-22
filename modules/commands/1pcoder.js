module.exports.config = {
  name: "pcoder",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Nguyễn Trương Thiện Phát (pcoder)",
  description: "An advanced AI assistant powered by Gemini with YouTube integration",
  commandCategory: "ai",
  usages: [
    "pcoder [message]",
    "pcoder ơi gửi video [query]",
    "pcoder ơi gửi tui video [query]",
    "pcoder cho xin mp3 bài [query]",
    "pcoder cho tao nghe nhạc [query]",
    "pcoder video hài đi",
    "pcoder cho clip nhạc remix của [ca sĩ]",
    "pcoder resetdata",
    "pcoder training on/off",
    "pcoder học câu này: [content]",
    "pcoder tử vi [cung hoàng đạo]",
    "pcoder gửi ảnh [tâm trạng]",
    "pcoder chơi [tên mini-game]",
    "pcoder giải thích code: [đoạn code]",
    "pcoder gợi ý project [ngôn ngữ]",
    "pcoder tạo code [mô tả]",
    "pcoder update cảm xúc: [cảm xúc mới]",
    "pcoder thống kê [tên người dùng]"
  ],
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "@distube/ytdl-core": "",
    "fluent-ffmpeg": "",
    "ffmpeg-static": ""
  }
};

module.exports.onLoad = async () => {
  const fs = require("fs-extra");
  const path = require("path");
  
  // Create data directories and files if they don't exist
  const dataPath = path.join(__dirname, "../../data");
  const userDataPath = path.join(dataPath, "pcoder_users.json");
  const trainingDataPath = path.join(dataPath, "pcoder_training.json");
  
  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
  
  // Đảm bảo thư mục tạm tồn tại để lưu video/mp3
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  if (!fs.existsSync(userDataPath)) fs.writeFileSync(userDataPath, JSON.stringify({}));
  if (!fs.existsSync(trainingDataPath)) fs.writeFileSync(trainingDataPath, JSON.stringify([]));
  
  // Initialize global variables
  global.pcoderData = {
    users: JSON.parse(fs.readFileSync(userDataPath)),
    training: JSON.parse(fs.readFileSync(trainingDataPath)),
    trainingSessions: new Map()
  };
  
  // Khởi tạo Map để lưu các yêu cầu tải video/mp3
  global.ytDownloadRequests = new Map();
  
  // Định kỳ dọn dẹp thư mục tạm (xóa các file cũ hơn 1 giờ)
  setInterval(() => {
    try {
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 giờ tính bằng millisecond
      
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;
        
        // Nếu file tồn tại > 1 giờ, xóa đi
        if (fileAge > oneHour) {
          fs.unlinkSync(filePath);
          console.log(`Đã xóa file tạm cũ: ${file}`);
        }
      });
    } catch (error) {
      console.error("Lỗi khi dọn dẹp thư mục tạm:", error);
    }
  }, 30 * 60 * 1000); // Kiểm tra mỗi 30 phút
};

module.exports.handleEvent = async function({ api, event, client }) {
  const fs = require("fs-extra");
  const path = require("path");
  const axios = require("axios");
  
  // Ignore messages from self or empty messages
  if (event.senderID === api.getCurrentUserID() || (!event.body && !event.attachments)) return;
  
  const { threadID, messageID, senderID, body, type, messageReply, attachments } = event;
  
  // Handle user sending images
  if (attachments && attachments.length > 0 && attachments.some(att => att.type === "photo" || att.type === "animated_image")) {
    // Check if this is in a group where we've interacted before
    const userDataPath = path.join(__dirname, "../../data/pcoder_users.json");
    let userData = global.pcoderData.users;
    
    // Only respond if we have a history in this thread
    if (userData[threadID]) {
      // Random chance to respond (40%)
      if (Math.random() < 0.4) {
        try {
          // Use the provided Gemini API key
          const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
          
          // Get user info if available
          let userGender = Math.random() > 0.5 ? "female" : "male"; // Random gender if unknown
          let userRelationship = "bạn thân";
          let userName = "User";
          
          if (userData[threadID] && userData[threadID][senderID]) {
            userName = userData[threadID][senderID].profile.name || "User";
            userRelationship = userData[threadID][senderID].relationship || "bạn thân";
            
            if (userData[threadID][senderID].profile.gender) {
              userGender = userData[threadID][senderID].profile.gender;
            }
          }
          
          // Create prompt for image reaction
          const prompt = `Hãy viết một câu phản hồi ngắn, hài hước, kiểu đùa tinh nghịch khi bạn thân gửi ảnh cho bạn. Phong cách là ${userGender === "female" ? "con gái" : "con trai"} nói chuyện với ${userGender === "female" ? "con trai" : "con gái"} theo kiểu ${userRelationship}.

Chọn một trong các mẫu câu sau và điều chỉnh cho phù hợp, hoặc tạo một câu mới tương tự:
1. "Anh/chị gửi gì vậy? Chồng/Vợ em muốn biết :3"
2. "Ui, ảnh gì mà nóng vậy, để em chuyển cho crush anh/chị xem nha?"
3. "Ảnh đẹp đấy, nhưng chắc anh/chị nghĩ em không biết ảnh này lấy từ Google chứ gì?"
4. "Trời, em chụp màn hình rồi nha, anh/chị chờ đi, để em gửi cho người yêu anh/chị xem"
5. "Ơ xem cái gì mà hot thế này, cho mình xin link nguồn với"
6. "Anh/chị gửi ảnh này cho em làm gì? Muốn em đưa cho người yêu anh/chị à?"

Phản hồi dưới 30 từ, không mở đầu bằng "Phản hồi:" hay bất kỳ prefix nào khác. Không sử dụng dấu ngoặc kép.`;
          
          // Call Gemini API
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
            {
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                maxOutputTokens: 200
              }
            }
          );
          
          // Extract AI response
          let reactionMessage = "Anh gửi gì vậy? Chồng em muốn biết :3";
          
          if (response.data && 
              response.data.candidates && 
              response.data.candidates[0] && 
              response.data.candidates[0].content && 
              response.data.candidates[0].content.parts && 
              response.data.candidates[0].content.parts[0]) {
            reactionMessage = response.data.candidates[0].content.parts[0].text.trim();
          }
          
          // Initialize user data if needed
          if (!userData[threadID][senderID]) {
            userData[threadID][senderID] = {
              profile: {
                name: "User",
                pronouns: "bạn",
                personality: "thân thiện",
                emotionalState: "bình thường",
                gender: userGender
              },
              journal: [],
              relationship: "bạn thân",
              conversationStyle: "thân thiện",
              preferredLanguage: "Vietnamese",
              lastInteraction: Date.now()
            };
            
            // Try to get user name
            try {
              const userInfo = await api.getUserInfo(senderID);
              if (userInfo && userInfo[senderID]) {
                userData[threadID][senderID].profile.name = userInfo[senderID].name || "User";
              }
            } catch (err) {
              console.error("Error fetching user info:", err);
            }
          }
          
          // Update user journal
          if (userData[threadID][senderID]) {
            userData[threadID][senderID].journal.push({
              type: "imageReaction",
              botResponse: reactionMessage,
              timestamp: Date.now()
            });
            
            // Update last interaction time
            userData[threadID][senderID].lastInteraction = Date.now();
          }
          
          // Save updated user data
          fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
          
          // Send reaction
          api.sendMessage(reactionMessage, threadID, messageID);
        } catch (error) {
          console.error("Image Reaction Error:", error);
          // Silent fail - don't send error message for spontaneous responses
        }
      }
    }
  }
  
  // Handle replies to bot's messages
  if (type === "message_reply" && messageReply && messageReply.senderID === api.getCurrentUserID()) {
    // User is replying to bot's message
    const userDataPath = path.join(__dirname, "../../data/pcoder_users.json");
    let userData = global.pcoderData.users;
    
    // Kiểm tra xem có phải yêu cầu tải video/audio không
    if (global.ytDownloadRequests && global.ytDownloadRequests.has(messageReply.messageID)) {
      const lowerBody = body.toLowerCase().trim();
      
      // Check if user is requesting to download media
      if (lowerBody === 'tải video' || lowerBody === 'tải mp3' || 
          lowerBody.includes('download') || lowerBody.includes('tải xuống') ||
          lowerBody.includes('tải về')) {
        
        // Get request details
        const downloadRequest = global.ytDownloadRequests.get(messageReply.messageID);
        
        // Check if request is still valid (less than 10 minutes old)
        if (downloadRequest && (Date.now() - downloadRequest.timestamp < 10 * 60 * 1000)) {
          // Determine content type from user reply or use the original type
          let contentType = downloadRequest.contentType;
          
          if (lowerBody === 'tải video' || lowerBody.includes('video')) {
            contentType = 'video';
          } else if (lowerBody === 'tải mp3' || lowerBody.includes('mp3') || 
                    lowerBody.includes('audio') || lowerBody.includes('nhạc')) {
            contentType = 'audio';
          }
          
          // Import the youtube utils
          const youtubeUtil = require("./youtube-utils");
          
          // Handle the download
          await youtubeUtil.handleMediaDownload(
            api, 
            threadID, 
            messageID, 
            downloadRequest.videoId, 
            downloadRequest.title, 
            contentType
          );
          
          // Remove the request to prevent duplicate downloads
          global.ytDownloadRequests.delete(messageReply.messageID);
          
          // We've handled this reply
          return;
        } else {
          // Request expired
          await api.sendMessage("Yêu cầu tải xuống đã hết hạn. Hãy yêu cầu lại từ đầu nhé!", threadID, messageID);
          
          // Remove the expired request
          if (downloadRequest) {
            global.ytDownloadRequests.delete(messageReply.messageID);
          }
          
          return;
        }
      }
    }
    
    // Initialize thread and user data if needed
    if (!userData[threadID]) {
      userData[threadID] = {};
    }
    
    if (!userData[threadID][senderID]) {
      userData[threadID][senderID] = {
        profile: {
          name: "User",
          pronouns: "bạn",
          personality: "thân thiện",
          emotionalState: "bình thường",
        },
        journal: [],
        relationship: "bạn thân",
        conversationStyle: "nghiêm túc",
        preferredLanguage: "Vietnamese",
        lastInteraction: Date.now()
      };
      
      // Get user name from API
      try {
        const userInfo = await api.getUserInfo(senderID);
        if (userInfo && userInfo[senderID]) {
          userData[threadID][senderID].profile.name = userInfo[senderID].name || "User";
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    }
    
    // Save updated user data
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    
    try {
      // Get current user data for context
      const currentUser = userData[threadID][senderID];
      const userName = currentUser.profile.name;
      
      // Use the provided Gemini API key
      const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
      
      // Create context with previous message that user is replying to
      const systemPrompt = `Bạn là PCoder, một trợ lý AI thông minh và hài hước trong Messenger. 

Người dùng ${userName} đang trả lời tin nhắn của bạn.

Tin nhắn trước đó của bạn: "${messageReply.body}"

Phản hồi của người dùng: "${body}"

Hãy trả lời phù hợp với nội dung cuộc trò chuyện, duy trì tính liên tục và mạch lạc. Đừng bắt đầu lại từ đầu, hãy tiếp tục cuộc hội thoại một cách tự nhiên.`;

      // Call Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
        {
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 800
          }
        }
      );
      
      // Extract AI response
      let aiResponse = "Xin lỗi, mình không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.";
      
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        aiResponse = response.data.candidates[0].content.parts[0].text;
      }
      
      // Update user journal with this interaction
      currentUser.journal.push({
        type: "reply_conversation",
        botPreviousMessage: messageReply.body,
        userReply: body,
        botResponse: aiResponse,
        timestamp: Date.now()
      });
      
      // Update last interaction time
      currentUser.lastInteraction = Date.now();
      
      // Save updated user data
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      
      // Send response to user
      return api.sendMessage(aiResponse, threadID, messageID);
      
    } catch (error) {
      console.error("Reply handling error:", error);
      return api.sendMessage("Mình không hiểu ý bạn lắm. Bạn có thể nói rõ hơn được không?", threadID, messageID);
    }
  }
  const userDataPath = path.join(__dirname, "../../data/pcoder_users.json");
  const trainingDataPath = path.join(__dirname, "../../data/pcoder_training.json");
  
  // Check if training mode is enabled for this thread
  const { trainingSessions } = global.pcoderData;
  
  if (trainingSessions.has(threadID) && !body.toLowerCase().includes("pcoder")) {
    // Add message to training data
    const userMessage = body;
    
    // Load current training data
    const trainingData = JSON.parse(fs.readFileSync(trainingDataPath));
    
    // Add new training data
    trainingData.push({
      message: userMessage,
      senderID,
      threadID,
      timestamp: Date.now()
    });
    
    // Save updated training data
    fs.writeFileSync(trainingDataPath, JSON.stringify(trainingData, null, 2));
    global.pcoderData.training = trainingData;
    
    // Do not reply in training mode
    return;
  }
  
  // Process programming-related messages or messages that refer to PCoder
  const programmingKeywords = ["javascript", "python", "java", "c++", "c#", "php", "html", "css", "code", "coding", "programming", "developer", "function", "variable", "class", "object", "array", "loop", "if else", "api", "database", "sql", "nodejs", "react", "typescript", "framework", "algorithm", "git", "github"];
  
  // Check if the message starts with pcoder, mentions pcoder, or contains programming keywords
  const messageContainsPCoder = body.toLowerCase().includes("pcoder");
  const messageStartsWithPCoder = body.toLowerCase().startsWith("pcoder");
  const containsProgrammingKeywords = programmingKeywords.some(keyword => body.toLowerCase().includes(keyword));
  
  if ((!messageStartsWithPCoder && messageContainsPCoder) || 
      (containsProgrammingKeywords && Math.random() < 0.4)) { // 40% chance to respond to programming topics
    // Phản ứng tự nhiên khi ai đó nhắc đến pcoder nhưng không gọi pcoder
    let responses = [
      "Có ai gọi tao không?",
      "Ủa có ai nhắc tên tao à?",
      "Ơ tao nghe thấy tên của tao này!",
      "Đang bàn gì về tao đấy?",
      "Tao nghe thấy tên tao rồi đấy nhé! Có gì không?",
      "Có ai cần tao giúp gì không?",
      "Ủa đang nói gì về tao đấy?"
    ];
    
    // Random response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await api.sendMessage(randomResponse, threadID);
    return;
  }
  
  // Only process messages that explicitly mention pcoder
  if (messageContainsPCoder) {
    // Process video/audio download requests
    const youtubeUtil = require("./youtube-utils");
    const result = await youtubeUtil.processMediaRequest(body, api, threadID, messageID, senderID);
    
    // If the media request was handled, return
    if (result.handled) {
      return;
    }
    
    // Initialize user data if needed
    let userData = global.pcoderData.users;
    if (!userData[threadID]) {
      userData[threadID] = {};
    }
    
    if (!userData[threadID][senderID]) {
      userData[threadID][senderID] = {
        profile: {
          name: "User",
          pronouns: "bạn",
          personality: "thân thiện",
          emotionalState: "bình thường",
        },
        journal: [],
        relationship: "bạn thân",
        conversationStyle: "nghiêm túc",
        preferredLanguage: "Vietnamese",
        lastInteraction: Date.now()
      };
      
      // Try to get user name
      try {
        const userInfo = await api.getUserInfo(senderID);
        if (userInfo && userInfo[senderID]) {
          userData[threadID][senderID].profile.name = userInfo[senderID].name || "User";
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    }
    
    // Process general AI conversation
    const geminiAPIKey = process.env.GEMINI_API_KEY || "AIzaSyDW0dxS6-Agy6468HfagcUhUKHjo4OSAl8";
    
    try {
      const currentUser = userData[threadID][senderID];
      const userName = currentUser.profile.name;
      const relationship = currentUser.relationship || "bạn thân";
      const emotionalState = currentUser.profile.emotionalState || "bình thường";
      
      // Extract the actual message without the prefix
      let userMessage = body.toLowerCase();
      if (userMessage.includes("pcoder")) {
        userMessage = userMessage.replace(/pcoder\s*[ơi]?\s*/i, "").trim();
        if (!userMessage) userMessage = "chào bạn";
      }
      
      // Check for specific commands
      if (userMessage === "resetdata") {
        // Reset user data
        userData[threadID][senderID] = {
          profile: {
            name: userName,
            pronouns: "bạn",
            personality: "thân thiện",
            emotionalState: "bình thường",
          },
          journal: [],
          relationship: "bạn thân",
          conversationStyle: "nghiêm túc",
          preferredLanguage: "Vietnamese",
          lastInteraction: Date.now()
        };
        
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
        
        return api.sendMessage("Đã reset dữ liệu của bạn thành công! Bây giờ chúng ta là bạn mới!", threadID, messageID);
      }
      
      // Handle training mode toggle
      if (userMessage.toLowerCase().startsWith("training")) {
        const command = userMessage.toLowerCase().split(" ")[1];
        
        if (command === "on") {
          trainingSessions.set(threadID, true);
          return api.sendMessage("Đã bật chế độ training. Mọi tin nhắn tiếp theo sẽ được lưu làm dữ liệu training (trừ khi có chứa từ khóa 'pcoder').", threadID, messageID);
        } else if (command === "off") {
          trainingSessions.delete(threadID);
          return api.sendMessage("Đã tắt chế độ training.", threadID, messageID);
        }
      }
      
      // Handle learning custom responses
      if (userMessage.toLowerCase().startsWith("học câu này:")) {
        const content = userMessage.substring("học câu này:".length).trim();
        
        // Load training data
        const trainingData = JSON.parse(fs.readFileSync(trainingDataPath));
        
        // Add custom training data
        trainingData.push({
          message: content,
          senderID,
          threadID,
          timestamp: Date.now()
        });
        
        // Save updated training data
        fs.writeFileSync(trainingDataPath, JSON.stringify(trainingData, null, 2));
        global.pcoderData.training = trainingData;
        
        return api.sendMessage("Cảm ơn bạn! Mình đã học câu này rồi.", threadID, messageID);
      }
      
      // Process general conversation with Gemini
      // Setup conversation context
      const recentJournal = currentUser.journal
        .slice(-5)
        .map(entry => `${entry.userMessage || entry.botPreviousMessage || ""}: ${entry.botResponse || ""}`)
        .join("\n");
      
      const systemPrompt = `Bạn là PCoder, một trợ lý AI thông minh, hài hước, và thân thiện trong Messenger. Trả lời bằng tiếng Việt một cách tự nhiên như bạn bè. Không dùng kính ngữ "bạn" mà dùng các đại từ thân mật kiểu "tao-mày" vì bạn đang nói chuyện với ${userName} như ${relationship}.

Trạng thái cảm xúc hiện tại của bạn: ${emotionalState}

Tin nhắn gần đây:
${recentJournal}

Người dùng ${userName} nói: "${userMessage}"

Hãy trả lời một cách tự nhiên, thân thiện không quá 3 câu, và đừng bắt đầu câu trả lời bằng "PCoder:" hay bất kỳ prefix nào.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiAPIKey}`,
        {
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1000
          }
        }
      );
      
      let aiResponse = "Xin lỗi, tao không hiểu ý mày lắm. Mày có thể nói rõ hơn được không?";
      
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        aiResponse = response.data.candidates[0].content.parts[0].text;
      }
      
      // Update user journal
      currentUser.journal.push({
        type: "conversation",
        userMessage: userMessage,
        botResponse: aiResponse,
        timestamp: Date.now()
      });
      
      // Update last interaction time
      currentUser.lastInteraction = Date.now();
      
      // Save updated user data
      fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
      
      // Send response to user
      return api.sendMessage(aiResponse, threadID, messageID);
      
    } catch (error) {
      console.error("General conversation error:", error);
      return api.sendMessage("Xin lỗi, mình đang gặp chút vấn đề. Bạn có thể thử lại sau không?", threadID, messageID);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  
  // Simple passthrough to handleEvent
  return this.handleEvent({ api, event, args });
};
