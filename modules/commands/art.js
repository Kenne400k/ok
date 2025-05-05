const axios = require("axios");

module.exports.config = {
	name: "art",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Raiden Bot",
	description: "Chuyển ảnh thành hình vẽ anime",
	commandCategory: "Tiện Ích",
	usages: " [link ảnh] [số]"
		+ "\n art [reply ảnh] [số]",
	cooldowns: 5
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
	const args = event.body.replace(/\s+/g, ' ').trim().split(' ');
	if (handleReply.author != event.senderID) return;
	let imageUrlInPut;
	let type;
	if (["photo", "sticker"].includes(event.attachments[0].type)) {
		imageUrlInPut = event.attachments[0].url;
		type = isNaN(args[0]) ? 1 : Number(args[0]);
	}
	else if (event.body.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
		imageUrlInPut = args[0];
		type = isNaN(args[1]) ? 1 : Number(args[1]);
	}
	else
		return notiNeedImage(api, event);

	modifyImage(api, event, type, imageUrlInPut);
}

module.exports.run = async ({ api, event, args }) => {
	let imageUrlInPut;
	let type;
	if (["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
		imageUrlInPut = event.messageReply.attachments[0].url;
		type = isNaN(args[0]) ? 1 : Number(args[0]);
	}
	else if (args[0].match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
		imageUrlInPut = args[0];
		type = isNaN(args[1]) ? 1 : Number(args[1]);
	}
	else
		return notiNeedImage(api, event);
	modifyImage(api, event, type, imageUrlInPut);
};

function notiNeedImage(api, event) {
	api.sendMessage("Vui lòng reply ảnh hoặc gửi link ảnh!", event.threadID, (err, info) => {
		global.client.handleReply.push({
			name: exports.config.name,
			messageID: info.messageID,
			author: event.senderID
		});
	}, event.messageID);
}


async function modifyImage(api, event, type, imageUrlInPut) {
	let res;
	try {
		res = await axios.get("https://goatbotserver.onrender.com/taoanhdep/art?", {
			params: {
				image: imageUrlInPut,
				type
			}
		});
		// const getImage = await global.utils.getStreamFromURL(res.data.data.effect_img, "imageArt.png");
		const getImage = await axios.get(res.data.data.effect_img, { responseType: "stream" });
		getImage.data.path = Date.now() + ".png";

		api.sendMessage({
			 body: `Hình vẽ anime của bạn đã được tạo thành công`,
			attachment: getImage.data
		}, event.threadID, event.messageID);
	}
	catch (error) {
		const errMessage = error.response.data.message || error.message;
		console.log(error);
		return api.sendMessage(`Đã có lỗi xảy ra, vui lòng thử lại sau!\n${errMessage}`, event.threadID, event.messageID);
	}
}