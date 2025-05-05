const fs = require('fs-extra');
const pathFile = __dirname + '/hethong/autoseen.txt';
if (!fs.existsSync(pathFile))
	fs.writeFileSync(pathFile, 'false');

module.exports.config = {
	name: "autoseen",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "NTKhang",
	description: "Bật/tắt tự động seen khi có tin nhắn mới",
	commandCategory: "ADMIN",
	usages: "on/off",
	cooldowns: 5
};

module.exports.handleEvent = async ({ api, event, args }) => {
	const isEnable = fs.readFileSync(pathFile, 'utf-8');
	if (isEnable == 'true')
		api.markAsReadAll(() => {});
};

module.exports. run = async ({ api, event, args }) => {
	const permission = ["100000895922054"];
			if (!permission.includes(event.senderID)) return api.sendMessage("[ 𝗗𝗘𝗩 𝗠𝗢𝗗𝗘 ] Lệnh này chỉ dành cho 𝗡𝗵𝗮̀ 𝗣𝗵𝗮́𝘁 𝗧𝗿𝗶𝗲̂̉𝗻 💻", event.threadID, event.messageID);
	try {
	if (args[0] == 'on') {
		fs.writeFileSync(pathFile, 'true');
		api.sendMessage('Đã bật chế độ tự động seen khi có tin nhắn mới', event.threadID, event.messageID);
	}
	else if (args[0] == 'off') {
		fs.writeFileSync(pathFile, 'false');
		api.sendMessage('Đã tắt chế độ tự động seen khi có tin nhắn mới', event.threadID, event.messageID);
	}
	else {
		api.sendMessage('Sai cú pháp', event.threadID, event.messageID);
	}
	}
	catch(e) {
		console.log(e);
	}
};