module.exports.config = {
	name: "getavt",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "DuyVuong",
	description: "lấy avatar thông qua bot",
	commandCategory: "Tiện ích",
	cooldowns: 0
};

module.exports.run = async function({ api, event, args, Threads }) {
const request = require("request");
const fs = require("fs")
const axios = require("axios")
const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
const mn = this.config.name
if (!args[0]) return api.sendMessage(`『🌎』𝐅𝐁-𝐀𝐕𝐀𝐓𝐀𝐑  『🌎』\n\n『📝』→ ${prefix}${mn} 𝐛𝐨𝐱 𝐥𝐚̀ 𝐠𝐞𝐭 𝐚𝐯𝐭 𝐜𝐮̉𝐚 𝐧𝐡𝐨́𝐦 𝐛𝐚̣𝐧\n\n『📰』→ ${prefix}${mn} 𝐢𝐝 [𝐢𝐝 𝐜𝐚̂̀𝐧 𝐠𝐞𝐭] <𝐠𝐞𝐭 𝐚̉𝐧𝐡 𝐭𝐡𝐞𝐨 𝐮𝐢𝐝 𝐧𝐠𝐮̛𝐨̛̀𝐢 đ𝐨́>\n\n『📰』→ ${prefix}${mn} 𝐥𝐢𝐧𝐤 [𝐥𝐢𝐧𝐤 𝐜𝐚̂̀𝐧 𝐠𝐞𝐭] <𝐠𝐞𝐭 𝐭𝐡𝐞𝐨 𝐥𝐢𝐧𝐤 𝐜𝐮̉𝐚 𝐧𝐠𝐮̛𝐨̛̀𝐢 đ𝐨́>\n\n『📰』→ ${prefix}${mn} 𝐮𝐬𝐞𝐫 <𝐝𝐞̂̉ 𝐭𝐫𝐨̂́𝐧𝐠 𝐥𝐚̀ 𝐠𝐞𝐭 𝐚𝐯𝐚𝐭𝐚𝐫 𝐜𝐮̉𝐚 𝐜𝐡𝐢́𝐧𝐡 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐝𝐮̀𝐧𝐠 𝐥𝐞̣̂𝐧𝐡>\n\n『📰』→ ${prefix}${mn} 𝐮𝐬𝐞𝐫 [@𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐬] <𝐠𝐞𝐭 𝐚𝐯𝐚𝐭𝐚𝐫 𝐧𝐠𝐮̛𝐨̛̀𝐢 đ𝐮̛𝐨̛̣𝐜 𝐭𝐚𝐠>`,event.threadID,event.messageID);
  if (args[0] == "box") {
           if(args[1]){ let threadInfo = await api.getThreadInfo(args[1]);
           let imgg = threadInfo.imageSrc;
       if(!imgg) api.sendMessage(`『📌』→ 𝐀𝐯𝐚𝐭𝐚 𝐜𝐮̉𝐚 𝐛𝐨𝐱 ${threadInfo.threadName} Đ𝐚̂𝐲`,event.threadID,event.messageID);
        else var callback = () => api.sendMessage({body:`『📌』→ 𝐀𝐯𝐚𝐭𝐚 𝐛𝐨𝐱 ${threadInfo.threadName} Đ𝐚̂𝐲`,attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID); 
      return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
             }    
          
            let threadInfo = await api.getThreadInfo(event.threadID);
            let img = threadInfo.imageSrc;
          if(!img) api.sendMessage(`『📌』→ 𝐀𝐯𝐚𝐭𝐚 𝐜𝐮̉𝐚 𝐛𝐨𝐱 ${threadInfo.threadName} Đ𝐚̂𝐲`,event.threadID,event.messageID)
          else  var callback = () => api.sendMessage({body:`『📌』→ 𝐀𝐯𝐚𝐭𝐚 𝐜𝐮̉𝐚 𝐛𝐨𝐱 ${threadInfo.threadName} Đ𝐚̂𝐲`,attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);   
      return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
    
}
else if (args[0] == "id") {
	try {
	var id = args[1];
  if (!id) return api.sendMessage(`『❗』→ 𝐕𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐧𝐡𝐚̣̂𝐩 𝐮𝐢𝐝 𝐜𝐚̂̀𝐧 𝐠𝐞𝐭 𝐚𝐯𝐚𝐭𝐚𝐫.`,event.threadID,event.messageID);
   var callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID);   
   return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
 }
 catch (e) {
 	api.sendMessage(`『❗』→ 𝐊𝐡𝐨̂𝐧𝐠 𝐭𝐡𝐞̂̉ 𝐥𝐚̂́𝐲 𝐚̉𝐧𝐡 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐝𝐮̀𝐧𝐠.`,event.threadID,event.messageID);
 }
}
else if (args[0] == "link") {
var link = args[1];
if (!link) return api.sendMessage(`『❗』→ 𝐕𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐧𝐡𝐚̣̂𝐩 𝐥𝐢𝐧𝐤 𝐜𝐚̂̀𝐧 𝐠𝐞𝐭 𝐚𝐯𝐚𝐭𝐚𝐫.`,event.threadID,event.messageID);
var tool = require("fb-tools");
try {
var id = await tool.findUid(args[1] || event.messageReply.body);
var callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID);   
return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
}
catch(e){
    api.sendMessage("『❗』→ 𝐍𝐠𝐮̛𝐨̛̀𝐢 𝐝𝐮̀𝐧𝐠 𝐤𝐡𝐨̂𝐧𝐠 𝐭𝐨̂̀𝐧 𝐭𝐚̣𝐢.",event.threadID,event.messageID)
}
}
else if(args[0] == "user") {
	if (!args[1]) {
		var id = event.senderID;
		var callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID);   
    return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
	}
	else if (args.join().indexOf('@') !== -1) {
		var mentions = Object.keys(event.mentions)
		var callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID);   
    return request(encodeURI(`https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
	}
	else {
		api.sendMessage(`『❗』→ 𝐒𝐚𝐢 𝐥𝐞̣̂𝐧𝐡. 𝐆𝐡𝐢 ${prefix}${mn} đ𝐞̂̉ 𝐱𝐞𝐦 𝐜𝐚́𝐜 𝐥𝐞̣̂𝐧𝐡 𝐜𝐮̉𝐚 𝐦𝐨𝐝𝐮𝐥𝐞.`,event.threadID,event.messageID);
	}
}
else {
	api.sendMessage(`『❗』→ 𝐒𝐚𝐢 𝐥𝐞̣̂𝐧𝐡. 𝐆𝐡𝐢 ${prefix}${mn} đ𝐞̂̉ 𝐱𝐞𝐦 𝐜𝐚́𝐜 𝐥𝐞̣̂𝐧𝐡 𝐜𝐮̉𝐚 𝐦𝐨𝐝𝐮𝐥𝐞.`,event.threadID,event.messageID);
}
}
