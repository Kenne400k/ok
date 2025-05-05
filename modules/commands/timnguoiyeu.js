module.exports.config = {
	name: "timnguoiyeu",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Gấu",
	description: "quét người dùng",
	commandCategory: "Tình Yêu",
	usages: "",
	cooldowns: 1
};

const axios = require('axios');

module.exports.run = async ({ api, event, args, getText, Users, Currencies }) => {
	const targetID = global.data.allUserID[Math.floor(Math.random() * global.data.allUserID.length)];
	const genderTarget = ["boy", "nam", "trai"].includes((args[0] || '').toLowerCase()) ?
		'MALE' : ['girl', 'gái', 'con gái', 'nữ'].includes((args[1] || '').toLowerCase()) ? 'FEMALE' : 'ALL';
	console
	let data = await getInfo(api, targetID);
	let countLoop = 0;
	if (genderTarget != 'ALL')
		while (genderTarget != data.gender) {
			countLoop++;
			const targetID = global.data.allUserID[Math.floor(Math.random() * global.data.allUserID.length)];
			data = await getInfo(api, targetID);
			if (countLoop == 10)
				return api.sendMessage("Rất tiếc, không tìm thấy người dùng phù hợp với bạn", event.threadID, event.messageID);
		}

	const {
		name,
		gender,
		id,
		url,
		username,
		shortname,
		friend,
		cv,
		mess,
		chucvu,
		block
	} = data;

	const msg = `=== [ 𝗧𝗜̀𝗠 𝗡𝗚𝗨̛𝗢̛̀𝗜 𝗬𝗘̂𝗨 ] ===
━━━━━━━━━━━━━━━━━━\n➝ Sau đây là thông tin của người mà hệ thống đã chọn cho bạn
━━━━━━━━━━━━━━━━━━\n𝗧𝗲̂𝗻: ${name}\n𝗧𝗲̂𝗻 𝗰𝗵𝗶́𝗻𝗵: ${shortname}\n𝗧𝗲̂𝗻 𝗸𝗵𝗮́𝗰: ${username == true ? "không dùng" : username}\n𝗚𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵: ${gender == "MALE" ? "Trai" : "Nữ"}\n𝗨𝗜𝗗: ${id}\n𝗕𝗮̣𝗻 𝗯𝗲̀: ${friend == true ? "Đã kết bạn với bot" : "Chưa kết bạn với bot"}\n𝗧𝗿𝗮̣𝗻𝗴 𝘁𝗵𝗮́𝗶: ${mess == true ? "Đã nhắn với bot" : "chưa nhắn tin với bot"}\n𝗧𝗶𝗻 𝗻𝗵𝗮̆́𝗻: ${block == true ? "Đã chặn tin nhắn bot" : "Không chặn tin nhắn bot"}\n𝗖𝗼̂𝗻𝗴 𝘃𝗶𝗲̣̂𝗰: ${cv == null ? "không có" : cv}\n𝗖𝗵𝘂̛́𝗰 𝘃𝘂̣ : ${chucvu == null ? "Không có" : chucvu}\n 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: ${url} ━━━━━━━━━━━━━━━━━━
𝗛𝗗𝗦𝗗 - 𝗕𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝗱𝘂̀𝗻𝗴 𝘁𝗶𝗺𝗻𝗴𝘂𝗼𝗶𝘆𝗲𝘂 𝗻𝗮𝗺 𝗵𝗼𝗮̣̆𝗰 𝗻𝘂̛̃`;
	const avatar = (await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
		{ responseType: "stream" })).data;
	avatar.path = 'avatar.png';
	return api.sendMessage({ body: msg, attachment: avatar }, event.threadID, event.messageID);
};

async function getInfo(api, userID) {
	const cc = await api.getUserInfoV5(userID);
	const name = cc[0].o0.data.messaging_actors[0].name;
	const gender = cc[0].o0.data.messaging_actors[0].gender;
	const id = cc[0].o0.data.messaging_actors[0].id;
	const url = cc[0].o0.data.messaging_actors[0].url;
	const username = cc[0].o0.data.messaging_actors[0].username;
	const shortname = cc[0].o0.data.messaging_actors[0].short_name;
	const friend = cc[0].o0.data.messaging_actors[0].is_viewer_friend;
	const cv = cc[0].o0.data.messaging_actors[0].work_info;
	const mess = cc[0].o0.data.messaging_actors[0].is_messenger_user;
	const chucvu = cc[0].o0.data.messaging_actors[0].is_employee;
	const block = cc[0].o0.data.messaging_actors[0].is_message_blocked_biewer;
	return {
		name,
		gender,
		id,
		url,
		username,
		shortname,
		friend,
		cv,
		mess,
		chucvu,
		block
	};
    }