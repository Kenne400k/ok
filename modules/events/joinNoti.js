module.exports.config = {
	name: "joinNoti",
	eventType: ["log:subscribe"],
	version: "2.0.00",
	credits: "hphong",
	description: "Thông báo bot hoặc người vào nhóm có random gif/ảnh/video",
	dependencies: {
	  "fs-extra": "",
	  "path": ""
	}
  };
  
  module.exports.onLoad = function () {
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  };
  
  module.exports.run = async function ({ api, event, Users }) {
	const { threadID } = event;
	const moment = require("moment-timezone");
	const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:s");
	const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
	const fullYear = global.client.getTime("fullYear");
  
	const getData = await Users.getData(event.author);
	const nameAuthor = getData.name || "link join";
  
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
	  api.changeNickname(`『 ${global.config.PREFIX} 』⪼ ${global.config.BOTNAME || "Bot Team TienDat"}`, threadID, api.getCurrentUserID());
	  return api.sendMessage({
		body: `Vincent  😘\n----------------------\nĐã Kết nối Nối Thành Công ✅\n----------------------\nVui lòng sử dụng lệnh: .menu để biết toàn bộ số lệnh trong hệ thống.\nCảm ơn đã sử dụng bot của vanhung\nAdmin FB : https://www.facebook.com/erendayyyy`,
		attachment: global.khanhdayr.splice(0, 1)
	  }, threadID);
	} else {
	  try {
		const { threadName, participantIDs } = await api.getThreadInfo(threadID);
		const threadData = global.data.threadData.get(parseInt(threadID)) || {};
		
		let mentions = [], nameArray = [], iduser = [];
		for (let user of event.logMessageData.addedParticipants) {
		  nameArray.push(user.fullName);
		  iduser.push(user.userFbId.toString());
		  mentions.push({ tag: user.fullName, id: user.userFbId });
		}
  
		let msg = threadData.customJoin || `[⚜️]→ Hi {type} {name}.\n[✌️]→ 𝐶ℎ𝑎̀𝑜 𝑚𝑢̛̀𝑛𝑔 {type} đ𝑎̃ đ𝑒̂́𝑛 𝑣𝑜̛́𝑖 {threadName}.\n[🔎]→ 𝑈𝑟𝑙 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘: m.me/{iduser}\n[❗]→ 𝑇𝑢̛̀ 𝑛𝑎𝑦 {name} 𝑠𝑒̃ 𝑙𝑎̀ 𝑡ℎ𝑎̀𝑛ℎ 𝑣𝑖𝑒̂𝑛 𝑚𝑜̛́𝑖 𝑐𝑢̉𝑎 𝑛ℎ𝑜́𝑚 {threadName}.\n[❤️]→ 𝐶ℎ𝑢́𝑐 {type} 𝑐𝑜́ 𝑚𝑜̣̂𝑡 𝑏𝑢𝑜̂̉𝑖 {session} || {time} 𝑣𝑢𝑖 𝑣𝑒̉.\n[👉]→ 𝑁𝑔𝑎̀𝑦 𝑣𝑎̀𝑜: {fullYear}.\n[🧸]→ 𝑁𝑔𝑢̛𝑜̛̀𝑖 𝑡ℎ𝑒̂𝑚: {author}`;
  
		msg = msg.replace(/{iduser}/g, iduser.join(', '))
				 .replace(/{name}/g, nameArray.join(', '))
				 .replace(/{type}/g, (nameArray.length > 1) ? '𝒄𝒂́𝒄 𝒃ạ𝒏' : '𝒃ạ𝒏')
				 .replace(/{threadName}/g, threadName)
				 .replace(/{session}/g, hours <= 10 ? "𝑠𝑎́𝑛𝑔" : hours <= 12 ? "𝑡𝑟𝑢̛𝑎" : hours <= 18 ? "𝑐ℎ𝑖𝑒̂̀𝑢" : "𝑡𝑜̂́𝑖")
				 .replace(/{fullYear}/g, fullYear)
				 .replace(/{author}/g, nameAuthor)
				 .replace(/{time}/g, time);
  
		let formPush = { body: msg, mentions, attachment: global.khanhdayr.splice(0, 1) };
  
		return api.sendMessage(formPush, threadID);
	  } catch (e) {
		console.error(e);
	  }
	}
  };
  