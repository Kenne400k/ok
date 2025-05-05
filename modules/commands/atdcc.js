const axios = require("axios");
const moment = require("moment-timezone");

const linkapi = "https://apitntxtrick.onlitegix.com/capcut";

module.exports = {
		config: {
				name: "atdcc",
				version: "1.0.0",
				hasPermssion: 0,
				credits: "hphong",
				description: "Down CapCut",
				commandCategory: "Tiện ích",
				usages: "",
				cooldowns: 5
		},

		run: ({ api, event, args }) => {},    
		handleEvent: async ({ api, event }) => {
				const { body, senderID } = event;
				const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");

				if (!body || (!body.includes('https://www.capcut.com/template-detail/') && !body.includes('https://www.capcut.com/t/')) || senderID === api.getCurrentUserID() || senderID === '') return;

				try {
						const { title, description, usage, video } = (await axios.get(`${linkapi}?url=${body}`)).data;
						const stream = (await axios.get(video, { responseType: "stream" })).data;

						api.sendMessage({
								body: `[ 𝐀𝐔𝐓𝐎𝐃𝐎𝐖𝐍 𝐂𝐀𝐏𝐂𝐔𝐓 ]\n──────────────────\n⩺ 𝐓𝐢𝐞̂𝐮 đ𝐞̂̀: ${title}\n⩺ 𝐌𝐨̂ 𝐭𝐚̉: ${description}\n⩺ 𝐋𝐮̛𝐨̛̣𝐭 𝐝𝐮̀𝐧𝐠: ${usage}\n⩺ 𝐓𝐢𝐦𝐞: ${gio}\n⩺ 𝐓𝐮̛̣ đ𝐨̣̂𝐧𝐠 𝐭𝐚̉𝐢 𝐯𝐢𝐝𝐞𝐨 𝐭𝐮̛̀ 𝐂𝐚𝐩𝐂𝐮𝐭
`,
								attachment: stream
						}, event.threadID, event.messageID);
				} catch (error) {
						console.error(error);
				}
		}
};