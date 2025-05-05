const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "xoadau",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TuanDz",
  description: "Xoa đầu người bạn tag",
  commandCategory: "Tình Yêu",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://i.postimg.cc/FFpGKWYN/anime-head-pat-1.gif",
"https://i.postimg.cc/k5WvPfrr/tumblr-0c8250dafba85bb286426ce1c364a1cf-37b7a99b-1280.gif",
"https://i.postimg.cc/wvHcqLH1/tumblr-13717a06189c0af93ea4b58b86accd5a-bc3ce2fe-250.gif",
"https://i.postimg.cc/tJ43Pbsy/tumblr-nom2ap-Cfio1tydz8to2-500.gif",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
   var callback = () => api.sendMessage({body:`${tag}` + ` 𝐍𝐠𝐨𝐚𝐧 𝐥𝐚̆́𝐦 𝐛𝐞́ 𝐢𝐮𝐮 ><`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/xoa.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/xoa.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/xoa.gif")).on("close",() => callback());
   }