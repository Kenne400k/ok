module.exports.config = {
	name: "spamban",
	version: "1.0.0",
	hasPermssion: 0, 
	credits: "NTKhang",//Mod by H.Thanh
	description: "Tự động ban người dùng nếu spam bot ( random ảnh )",
	commandCategory: "Admin",
	usages: "Tự động bị ban",
	cooldowns: 5
};

module.exports.run = ({api, event}) => {
	return api.sendMessage("𝗦𝗣𝗔𝗠𝗕𝗢𝗧 - Bạn sẽ bị ban nếu spam Bot", event.threadID, event.messageID);
};
module.exports.handleEvent = async ({ Users, api, event})=> {
	const fs = require("fs-extra");
	const moment = require("moment-timezone"); 
	let { senderID, messageID, threadID } = event;
	const threadInfo = await api.getThreadInfo(event.threadID)
		var threadName = threadInfo.threadName||"Tên không tồn tại";
	var time = moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY HH:mm:ss");
	const so_lan_spam = 15; // số lần spam, vượt quá sẽ bị ban
	const thoi_gian_spam = 120000; // 60000 millisecond (1 phút)
	const unbanAfter = 1800000; // 600000 millisecond (10 phút) 
	if (!global.client.autoban) global.client.autoban = {};
	if (!global.client.autoban[senderID]) {
		global.client.autoban[senderID] = {
			timeStart: Date.now(),
			number: 0
		}
	};

	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const prefix = threadSetting.PREFIX || global.config.PREFIX;
	if (!event.body || event.body.indexOf(prefix) != 0) return; 
	let dataUser = await Users.getData(senderID) || {};
	let data = dataUser.data || {};

	if ((global.client.autoban[senderID].timeStart + thoi_gian_spam) <= Date.now()) {
		global.client.autoban[senderID] = {
			timeStart: Date.now(),
			number: 0
		}
	}
	else {
		global.client.autoban[senderID].number++;
		if (global.client.autoban[senderID].number >= so_lan_spam) {
			const moment = require("moment-timezone");
			if (data && data.banned == true) return;
			data.banned = true;
			data.reason = `• Spam ${so_lan_spam} lần/${thoi_gian_spam/60000} phút\n• Sẽ tự động gỡ ban sau 30 phút`;
			data.autoban = {
				timeStart: Date.now(),
				unbanAfter
			};
			data.dateAdded = time;
			await Users.setData(senderID, { data });
			global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
			global.client.autoban[senderID] = {
				timeStart: Date.now(),
				number: 0
			};
			api.sendMessage("👤 Tên: " + dataUser.name + "\n🌟 ID: " + senderID + `\n⛔ Bị Cấm Sử Dụng Bot ${unbanAfter/60000} phút với lý do spam bot 10 lần/2 phút\n😤 Hãy nói những lời trăn trối để Bot có thể gỡ ban sau ${Math.floor(unbanAfter/60000)} phút nữa\n⏰ Thời gian: ${time}`, threadID, () => {
					setTimeout(async function() {
						delete data.autoban;
						data.banned = false;
						data.reason = null;
						data.dateAdded = null;
						await Users.setData(senderID, { data });
						global.data.userBanned.delete(senderID);
							api.sendMessage("👨‍✈️ Đã tự động gỡ ban thành công cho " + dataUser.name + "\n📌 Bị ban vào lúc " + time +  ` Không sapm nữa nhé!!!`, threadID); //mod by toàn
				}, unbanAfter);
				});
				for (let idAdmin of global.config.ADMINBOT) {
				api.sendMessage(`◆━BOT THÔNG BÁO━◆\n\n➣ Người Dùng Spam ${so_lan_spam} lần / 2 phút\n• Tên: ${dataUser.name} \n• ID: ${senderID}\n• Tên Nhóm: ${threadName} \n• ID Nhóm: ${threadID}\n• Thời gian: ${time}` ,idAdmin);
			};
		}
	}
};