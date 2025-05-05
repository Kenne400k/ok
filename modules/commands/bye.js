module.exports.config = {
  name: "bye",
  version: "1.0.0",
  hasPermssion: 0,
  credit: "HPHONG-💌💌",
  description: "hi gửi sticker",
  commandCategory: "Hệ Thống",
  usages: "[text]",
  cooldowns: 0
}

module.exports.handleEvent = async ({ event, api, Users }) => {
  let KEY = ["bye", "bai", "off", "byee", "pai", "paii"];
  let thread = global.data.threadData.get(event.threadID) || {};
  
  // Đảm bảo luôn bật "bye"
  thread["bye"] = true;

  if (event.body && KEY.includes(event.body.toLowerCase())) {
    // Debugging - check if event body is recognized
    console.log("Received event:", event.body);  
    
    let moment = require("moment-timezone");
    let hours = moment.tz('Asia/Ho_Chi_Minh').format('HHmm');
    let data2 = ["tốt lành", "vui vẻ"];
    let text = data2[Math.floor(Math.random() * data2.length)];
    
    // Determine the time of day
    let session = (
      hours >= 1 && hours <= 400 ? "sáng tinh mơ" : 
      hours > 400 && hours <= 700 ? "sáng sớm" :
      hours > 700 && hours <= 1000 ? "sáng" :
      hours > 1000 && hours <= 1200 ? "trưa" : 
      hours > 1200 && hours <= 1700 ? "chiều" : 
      hours > 1700 && hours <= 1800 ? "chiều tà" : 
      hours > 1800 && hours <= 2100 ? "tối" : 
      hours > 2100 && hours <= 2400 ? "tối muộn" : 
      "lỗi");
    
    let name = await Users.getNameUser(event.senderID);
    let mentions = [{ tag: name, id: event.senderID }];
    
    // Kiểm tra và lấy tệp đính kèm nếu có
    let attachment = global.khanhdayr && global.khanhdayr.length > 0 ? global.khanhdayr.splice(0, 1) : null;
    console.log("Attachment:", attachment);  // Debugging line to check attachment

    // Build the message object
    let msg = {
      body: `[🥨] → Tạm biệt ${name}\n[💓] → Chúc bạn một buổi ${session} ${text}\n[🌚] → Nhớ quay lại sớm để tương tác với bot nha\n[🌹] → I love ${name}\n[🕰] → Bây giờ là : ${moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || DD/MM/YYYY")}`, 
      mentions,
      attachment: attachment
    };
    
    // Send the message
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
    "successText": "Thành công",
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success!",
  }
};

module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  
  // Bỏ qua việc thay đổi trạng thái "bye", luôn luôn bật
  data["bye"] = true;
  console.log("Bye status:", data["bye"]);  // Debugging line to check status
  
  // Lưu trạng thái mới
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  
  // Phản hồi lệnh
  return api.sendMessage(`${getText("on")} ${getText("successText")}`, threadID, messageID);
};

