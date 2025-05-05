module.exports.config = {
  name: "hi",
  version: "1.0.1",
  hasPermssion: 1,
  credit: "Sam",
  description: "hi gửi tin nhắn chào",
  commandCategory: "QTV BOX",
  usages: "[text]",
  cooldowns: 5
};

global.khanhdayr = global.khanhdayr || [];

module.exports.handleEvent = async ({ event, api, Users }) => {
  let KEY = [ 
    "hello", "hi", "hai", "chào", "chao", "hí", "híí", "hì", "hìì", "lô", "hii", "helo", "hê nhô"
  ];

  if (KEY.includes(event.body.toLowerCase())) {
    let moment = require("moment-timezone");
    let hours = moment.tz('Asia/Ho_Chi_Minh').format('HHmm');
    let greetings = [
      "tốt lành =)",
      "vui vẻ 😄",
      "hạnh phúc ❤",
      "yêu đời 😘"
    ];
    let text = greetings[Math.floor(Math.random() * greetings.length)];
    let session = (
      hours >= 0 && hours <= 400 ? "sáng tinh mơ" : 
      hours > 400 && hours <= 700 ? "sáng sớm" :
      hours > 700 && hours <= 1000 ? "sáng" :
      hours > 1000 && hours <= 1200 ? "trưa" : 
      hours > 1200 && hours <= 1700 ? "chiều" : 
      hours > 1700 && hours <= 1800 ? "chiều tà" : 
      hours > 1800 && hours <= 2100 ? "tối" : 
      "tối muộn"
    );
    
    let name = await Users.getNameUser(event.senderID);
    let attachment = (global.khanhdayr && global.khanhdayr.length > 0) ? global.khanhdayr.splice(0, 1) : [];
    let msg = {
      body: `Xin chào ${name}, chúc bạn một buổi ${session} ${text}`,
      mentions: [{ tag: name, id: event.senderID }],
      attachment: attachment
    };
    
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
    "successText": "thành công"
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success!"
  }
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage("Tính năng này luôn luôn bật!", event.threadID, event.messageID);
};