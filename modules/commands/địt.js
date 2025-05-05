const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "địt",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MAVERICK",
  description: "Địt người bạn tag",
  commandCategory: "Hành động",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://i.postimg.cc/Dygq68rh/659-fucked.gif",
"https://i.postimg.cc/NjjRzBDH/729-toon-porn.gif",
"https://i.postimg.cc/TPygT0Z2/845-tifa.gif",
"https://i.postimg.cc/L4VYKGnB/marie-rose-dead-or-alive-001.gif",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
   var callback = () => api.sendMessage({body:`${tag}` + ` hãy để anh địt tung lồn em nha.`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/ditnhau.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ditnhau.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/ditnhau.gif")).on("close",() => callback());
   }