module.exports.config = {
	name: "text",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "BraSL",
	description: "subgiare",
	commandCategory: "Tiện ích",
	usages: "[Script]",
	cooldowns: 0
	
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {
  const moment = require("moment-timezone");
  const nnl = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
  const fs = global.nodemodule["fs-extra"];
var tesseract = require("tesseract.js")
var language = args[0]
let { messageReply, threadID } = event;
	if (event.type !== "message_reply") return api.sendMessage("❌ Bạn phải reply một ảnh nào đó", event.threadID, event.messageID);
	if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("❌ Bạn phải reply một ảnh nào đó", event.threadID, event.messageID);
	else {
				var shortLink = await global.nodemodule["tinyurl"].shorten(messageReply.attachments[0].url);
tesseract.recognize(
shortLink,
  language,
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log(text);
  api.sendMessage(`📗== [ 𝗧𝗘𝗫𝗧 𝗙𝗥𝗢𝗠 𝗣𝗛𝗢𝗧𝗢𝗦 ] ==📗
⏰ 𝗩𝗮̀𝗼 𝗹𝘂́𝗰: ${nnl}
👍 𝗩𝘂̛̀𝗮 𝗹𝗮̂́𝘆 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝗻𝗼̣̂𝗶 𝗱𝘂𝗻𝗴 𝘁𝘂̛̀ 𝗮̉𝗻𝗵
🌸 𝗧𝗲𝘅𝘁: ${text}`,event.threadID)
})
  }
}