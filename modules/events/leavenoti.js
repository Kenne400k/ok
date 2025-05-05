module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "HĐGN",//Mod by H.Thanh
	description: "Thông báo Bot hoặc người rời khỏi nhóm có random gif/ảnh/video",
	dependencies: {
	  "fs-extra": "",
	  "path": ""
	}
  };
  
  module.exports.onLoad = function () {
	  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  };
  
  module.exports.run = async function ({ api, event, Users }) {
	  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
	  const { threadID } = event;
	  const moment = require("moment-timezone");
	  const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:s");
	  const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
	  const fullYear = global.client.getTime("fullYear");
  
	  const getData = await Users.getData(event.logMessageData.leftParticipantFbId);
	  const name = getData.name || "Người dùng";
	  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "𝑟𝑜̛̀𝑖" : "𝑏𝑖̣ 𝑞𝑢𝑎̉𝑛 𝑙𝑖́ đ𝑢𝑜̂̉𝑖";
	  
	  let msg = `[⚜️]→ 𝑇𝑎̣𝑚 𝑏𝑖𝑒̣̂𝑡 {name} đã {type} 𝑘ℎ𝑜̉𝑖 𝑛ℎ𝑜́𝑚 !!!\n[🔎]→ 𝑈𝑟𝑙 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘: m.me/{iduser}\n[🤖]→ 𝐶𝑎̉𝑚 𝑜̛𝑛 𝑐𝑎̣̂𝑢 {name} đ𝑎̃ đ𝑜̂̀𝑛𝑔 ℎ𝑎̀𝑛ℎ 𝑐𝑢̀𝑛𝑔 𝑐ℎ𝑢́𝑛𝑔 𝑡𝑜̂𝑖 𝑡𝑟𝑜𝑛𝑔 𝑡ℎ𝑜̛̀𝑖 𝑔𝑖𝑎𝑛 𝑞𝑢𝑎\n◆━━━━━━━━━━━━━◆\n[❤️‍🔥]→ 𝑇ℎ𝑜̛̀𝑖 𝑔𝑖𝑎𝑛 𝑜𝑢𝑡 𝑛ℎ𝑜́𝑚: 𝑏𝑢𝑜̂̉𝑖 {session} || {time}\n[👉]→ 𝑁𝑔𝑎̀𝑦 𝑟𝑎: {fullYear}`;
  
	  msg = msg.replace(/{iduser}/g, event.logMessageData.leftParticipantFbId)
			   .replace(/{name}/g, name)
			   .replace(/{type}/g, type)
			   .replace(/{session}/g, hours <= 10 ? "𝑠𝑎́𝑛𝑔" : hours <= 12 ? "𝑡𝑟𝑢̛𝑎" : hours <= 18 ? "𝑐ℎ𝑖𝑒̂̀𝑢" : "𝑡𝑜̂́𝑖")
			   .replace(/{fullYear}/g, fullYear)
			   .replace(/{time}/g, time);
  
	  let formPush = { body: msg, attachment: global.khanhdayr.splice(0, 1) };
  
	  return api.sendMessage(formPush, threadID);
  };
  