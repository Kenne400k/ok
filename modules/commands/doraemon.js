module.exports.config = {
	name: "doraemon",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "hphong",
	description: "video doraemon",
	commandCategory: "video",
	usages: "",
	cooldowns: 0
};
module.exports.run = async ({ api, event }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
	var thơ = (await axios.get("https://confusion-playful-okra.glitch.me/cadao")).data.data;
	axios.get('https://hoanghao.me/api/images/vddoraemon').then(res => {
	let ext = res.data.url.substring(res.data.data.lastIndexOf(".") + 1);
	let callback = function () {
					api.sendMessage({
						body: `『🎀』➝ 𝐒𝐨̂́ 𝐯𝐢𝐝𝐞𝐨 𝐡𝐢𝐞̂̉𝐧 𝐭𝐡𝐢̣: ${res.data.count}\n『⏰』➝ 𝐋𝐢𝐧𝐤: ${res.data.data}\n『🍑』➝ 𝐓𝐡𝐢́𝐧𝐡: ${thơ}`,
						attachment: fs.createReadStream(__dirname + `/cache/doraemon.mp4`)
					}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/doraemon.mp4`), event.messageID);
				};
				request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/doraemon.mp4`)).on("close", callback);
			})
}
