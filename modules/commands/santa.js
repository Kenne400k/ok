module.exports.config = {
    name: "santa",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "tdunguwu mod them api boi m4dh0us3107",
    description: "tạo meme",
    commandCategory: "tạo ảnh",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  const { threadID, messageID } = event;
  const text1 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[0];
      	if (!text1) return api.sendMessage("🌸Cần nhập kí tự để tạo ảnh🌸", threadID, messageID);
var callback = () => api.sendMessage({body:``,attachment: fs.createReadStream(__dirname + "/cache/gg.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/gg.png"),event.messageID);
	 return request(encodeURI(`https://api.willz.repl.co/image/santa?text=${text1}`)).pipe(fs.createWriteStream(__dirname+'/cache/gg.png')).on('close',() => callback());     
}