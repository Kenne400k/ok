const request = require("request");
const fs = require("fs");

module.exports.config = {
  name: "dỗi",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Vdang",
  description: "ngỏ lời",
  commandCategory: "Hành Động",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  var mention = Object.keys(event.mentions);
  if (mention.length === 0) return api.sendMessage("Vui lòng tag 1 người", event.threadID, event.messageID);

  let tag = event.mentions[mention[0]].replace("@", "");
  let userID = mention[0];
  
  // Đổi biệt danh người bị tag
  api.changeNickname(`𝑨𝒏𝒉 𝑫𝒂́𝒎 𝑪𝒂̆́𝒎 𝑺𝒖̛̀𝒏𝒈 𝑻𝒐̂𝒊 ಥ_ಥ`, event.threadID, userID, (err) => {
    if (err) {
      return api.sendMessage("Không thể đổi biệt danh.", event.threadID);
    }

    // Sau khi đổi biệt danh, chia sẻ liên hệ
    api.shareContact("Đồ tồi! Tao không ngờ mày là con người như vậy ToT", userID, event.threadID);
  });
};
