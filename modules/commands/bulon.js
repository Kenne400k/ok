const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "bulon",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "MAVERICK",
  description: "Bú lồn người bạn tag",
  commandCategory: "Hành động",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
"https://i.postimg.cc/KjLJwR7q/1.gif",
"https://i.postimg.cc/PJkmLKZy/13599182.gif",
"https://i.postimg.cc/y8nnMq9H/54674ada39121def8036f8183aa47c7c.gif",
"https://i.postimg.cc/zfBp5dSR/91fea1737989a057137c3c07df8560cf.gif",
"https://i.postimg.cc/JnXN4Syt/detail.gif",
"https://i.postimg.cc/xdhGQ91W/detail-1.gif",
"https://i.postimg.cc/43mvjYs6/detail-2.gif",
"https://i.postimg.cc/zvnFp454/oVtB5Ze.gif",
"https://i.postimg.cc/DZ4g48Nv/tumblr-m742cbe-Lyr1rat3p6o1-500.gif",
"https://i.postimg.cc/gkWDrcHp/tumblr-mju1prx-Ox-T1rke3fuo1-400.gif",
"https://i.postimg.cc/FHFVgP6n/tumblr-mxten51-GCl1smtpyco1-500.gif",
"https://i.postimg.cc/htCbCLW4/tumblr-n66ny2-AOCN1tck5t9o1-500.gif",
   ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Vui lòng tag 1 người.", threadID, messageID);
   var callback = () => api.sendMessage({body:`${tag}` + ` em ơi em sướng chưa.`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/buslon.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/buslon.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/buslon.gif")).on("close",() => callback());
   }