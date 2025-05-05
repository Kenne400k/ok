module.exports.config = {
  name: "stk",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TuanDz",
  description: "Donate cho admin",
  commandCategory: "Admin",
  usages: "stk",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
  var link = [
"https://i.imgur.com/2JBbSqo.jpeg"
  ];
	  var callback = () => api.sendMessage({body:`💸 === [ 𝐃𝐎𝐍𝐀𝐓𝐄 ] === 💸\n💰 → 𝗧𝗵𝗼̂𝗻𝗴 𝘁𝗶𝗻 𝘁𝗵𝗮𝗻𝗵 𝘁𝗼𝗮́𝗻\n𝗖𝗧𝗞: NGUYEN TRIEU VY \n💳 → 𝗠𝗕 𝗯𝗮𝗻𝗸: 99923082007\n𝗖𝗧𝗞 :NGUYEN TRIEU VY\n 📌 → 𝗕𝗮𝗻𝗸 𝗻𝗵𝗼̛́ 𝗸𝗲̀𝗺 𝗯𝗶𝗹𝗹`,attachment: fs.createReadStream(__dirname + "/cache/5.jpeg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.jpeg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/5.jpeg")).on("close",() => callback());
   };