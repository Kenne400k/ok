const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "bucu",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "MAVERICK",
  description: "Bú cu người bạn tag",
  commandCategory: "Hành động",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://i.postimg.cc/4y4FLjSN/blowjob-madoka-higuchi-najar-001.gif",
"https://i.postimg.cc/SQVP2NnX/by-buckethead-porn-gifs-sex-gif.gif",
"https://i.postimg.cc/HsxhQDM6/cartoon-bj-001.gif",
"https://i.postimg.cc/GmTg5FqY/detail.gif",
"https://i.postimg.cc/W3T9zQj6/Nats-Cocksuckers-Gif.gif",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người.", threadID, messageID);
   var callback = () => api.sendMessage({body:`${tag}` + ` mút mạnh mẽ lên em để anh bắn tình trùng tràn mồm em.`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/bucu.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/bucu.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/bucu.gif")).on("close",() => callback());
   }