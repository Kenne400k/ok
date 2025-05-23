const zalgo = require("to-zalgo");

module.exports.config = {
	name: "zalgo",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "NTKhang (fix: Kenne400k Copilot)",
	description: "Chuyển đổi văn bản thành chữ Zalgo siêu dị",
	commandCategory: "game",
	dependencies: { "to-zalgo": "" },
	usages: "zalgo <text>",
	cooldowns: 5
};

module.exports.run = ({ api, event, args }) => {
	if (!args[0]) {
		return api.sendMessage(
			"⚠️ Bạn cần nhập nội dung để chuyển sang chữ Zalgo!\n\nVí dụ: zalgo hello world",
			event.threadID,
			event.messageID
		);
	}
	let input = args.join(" ").trim();
	if (input.length === 0) {
		return api.sendMessage(
			"⚠️ Nội dung không được để trống nhé!",
			event.threadID,
			event.messageID
		);
	}
	let zalgoText = "";
	try {
		zalgoText = zalgo(input);
	} catch (e) {
		return api.sendMessage("❌ Đã xảy ra lỗi khi chuyển đổi chữ!", event.threadID, event.messageID);
	}
	return api.sendMessage(zalgoText, event.threadID, event.messageID);
};
