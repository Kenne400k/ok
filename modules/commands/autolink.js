module.exports.config = {
	name: "autolink",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "dtai",
	description: "tự động gửi link về cho admin",
	commandCategory: "Tiện ích",
	usages: "",
	cooldowns: 5
};
module.exports.run = async function({ api , event , args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
    console.log('Hello, world !');
};
module.exports.handleEvent = async function({ api , event , Users }) {
    const { body , senderID , threadID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
  const fs = require("fs-extra");
    try {
        if (body === undefined || !body.includes('repl.co/') || senderID == api.getCurrentUserID() || senderID == '') return;
      if (body === undefined || !body.includes('replit.com/@') || senderID == api.getCurrentUserID() || senderID == '') return;
      if (body === undefined || !body.includes('run.mocky.io') || senderID == api.getCurrentUserID() || senderID == '') return;
      if (body === undefined || !body.includes('https://pastebin.com/raw/') || senderID == api.getCurrentUserID() || senderID == '') return;
        var name = await Users.getNameUser(event.senderID);
        var nameBox = global.data.threadInfo.get(event.threadID).threadName || "❌𝐓𝐞̂𝐧 𝐛𝐨𝐱 𝐤𝐡𝐨̂𝐧𝐠 𝐭𝐨̂̀𝐧 𝐭𝐚̣𝐢";
        api.sendMessage(`📥=== [ 𝗔𝗨𝗧𝗢 𝗟𝗜𝗡𝗞 𝗪𝗘𝗕 ] ===📥
━━━━━━━━━━━━━━━
⏰ 𝗩𝗮̀𝗼 𝗹𝘂́𝗰: ${time}
👥 𝗡𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: ${name}
🌍 𝗡𝗵𝗼́𝗺: ${nameBox}
🌸 𝗩𝘂̛̀𝗮 𝗴𝘂̛̉𝗶 𝗺𝗼̣̂𝘁 𝗻𝗼̣̂𝗶 𝗱𝘂𝗻𝗴 𝗰𝗼́ 𝗰𝗵𝘂̛́𝗮 𝗹𝗶𝗻𝗸
💬 𝗡𝗼̣̂𝗶 𝗱𝘂𝗻𝗴 𝗰𝗵𝘂̛́𝗮 𝗹𝗶𝗻𝗸: ${body}`,
'100038740121428');
// api.sendMessage(`📥=== [ 𝗔𝗨𝗧𝗢 𝗟𝗜𝗡𝗞 𝗪𝗘𝗕 ] ===📥
// ━━━━━━━━━━━━━━━━
// ⏰ 𝗩𝗮̀𝗼 𝗹𝘂́𝗰: ${dtai}\n📇 𝗡𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: ${name}\n⚠️ 𝗩𝘂̛̀𝗮 𝗰𝗼́ 𝗴𝘂̛̉𝗶 𝟭 𝗹𝗶𝗻𝗸\n🤖 𝗕𝗼𝘁 𝘀𝗲̃ 𝗴𝘂̛̉𝗶 𝘃𝗲̂̀ 𝗰𝗵𝗼 𝗮𝗱𝗺𝗶𝗻 𝗵𝘂́𝗽`, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(`${e}`, '100038740121428');
    }
};