const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "choigay",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kaneki",
  description: "Chơi gay người bạn tag",
  commandCategory: "Lệnh 18+",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://i.postimg.cc/1RYH1ggK/izxeqykfmf081.gif",
"https://i.postimg.cc/qv2XKj1m/tumblr-m5tt38-Yq-XQ1ry3ufgo1-500.gif",
"https://i.postimg.cc/MT3yw4GG/tumblr-os6u0e4-Lj-R1w9f0jko2-r1-500.gif",
"https://i.postimg.cc/2yPhbZhR/tumblr-os6u0e4-Lj-R1w9f0jko6-r1-500.gif",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
   var callback = () => api.sendMessage({body:`${tag}` + ` 𝗔𝗻𝗵 𝗻𝗮̆̀𝗺 𝘁𝗿𝗲̂𝗻 𝗲𝗺 𝘁𝗵𝗶̀ 𝗻𝗮̆̀𝗺 𝗱𝘂̛𝗼̛́𝗶, 𝟮 𝗰𝗵𝘂́𝗻𝗴 𝗺𝗶̀𝗻𝗵 𝗰𝗵𝗼̛𝗶 𝗴𝗮𝘆 𝘁𝗵𝗶̀ 𝗰𝗼́ 𝗴𝗶̀ 𝗹𝗮̀ 𝘀𝗮𝗶 🌈`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/choigay.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/choigay.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/choigay.gif")).on("close",() => callback());
}