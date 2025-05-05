const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "ngã",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Vdang",
  description: "ngỏ lời",
  commandCategory: "Hành Động",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.15752-9/446035393_487784217148518_5168602469977561465_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=FGtcqSELOEUQ7kNvgG449oc&_nc_ht=scontent.fsgn2-6.fna&oh=03_Q7cD1QEt-JUllLz2TwPQ1cDM_Tai9Snnd0pbElu3o0Rbk4VkEw&oe=66900479",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
   var callback = () => api.sendMessage({body: `Ôi ngã rồi ${tag} 💟💟`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/yeu.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/yeu.png"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/yeu.png")).on("close",() => callback());
   }