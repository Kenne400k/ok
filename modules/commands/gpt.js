const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "gpt",
    version: "8.8",
    hasPermission: 0,
    credits: "ex ★ machina",
    description: "ChatGPT 4.0",
    commandCategory: "noprefix",
    usages: "noprefix",
    cooldowns: 3,
};

module.exports.handleEvent = async function({ api, event }) {
    if (!(event.body.indexOf("Gpt") === 0 || event.body.indexOf("gpt") === 0)) return;
    const args = event.body.split(/\s+/);
    args.shift();
    if (args.length === 0) {
        api.sendMessage("🤖 𝐂𝐡𝐚𝐭𝐆𝐏𝐓 𝟒.𝟎 đ𝐮̛𝐨̛̣𝐜 𝐡𝐮𝐚̂́𝐧 𝐥𝐮𝐲𝐞̣̂𝐧 𝐛𝐨̛̉𝐢 𝐎𝐩𝐞𝐧𝐀𝐈.\n🔍 Đ𝐞̂̉ 𝐬𝐮̛̉ 𝐝𝐮̣𝐧𝐠: [𝐆𝐩𝐭 / 𝐠𝐩𝐭] [𝐢𝐧𝐩𝐮𝐭]\n👉 Ví dụ hãy nhắn: Gpt ý nghĩa của cuộc sống", event.threadID, event.messageID);
        return; 
    }
    try {
        api.sendMessage("🗨️ | Đ𝐚𝐧𝐠 𝐤𝐡𝐨̛̉𝐢 𝐭𝐚̣𝐨 𝐯𝐚̆𝐧 𝐛𝐚̉𝐧, 𝐯𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐜𝐡𝐨̛̀ ...", event.threadID, event.messageID);
        const prompt = args.join(" ");
        const response = await axios.get(`https://subhatde.id.vn/gpt?q${encodeURIComponent(prompt)}`);
        if (response.data && response.data.content) {
            const currentTimePH = moment().tz('Asia/Ho_Chi_Minh').format('hh:mm:ss A');
            api.sendMessage(`🎓 ℂ𝕙𝕒𝕥𝔾ℙ𝕋 𝟜.𝟘\n\n🖋️ 𝐇𝐨̉𝐢: '${prompt}'\n\n𝐓𝐫𝐚̉ 𝐋𝐨̛̀𝐢: ${response.data.content}\n\n⏰ 𝐓𝐢𝐦𝐞: ${currentTimePH}`, event.threadID, event.messageID);
        } else {
            api.sendMessage("🔍 Đ𝐚̃ 𝐱𝐚̉𝐲 𝐫𝐚 𝐥𝐨̂̃𝐢, 𝐯𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐤𝐢𝐞̂̉𝐦 𝐭𝐫𝐚 𝐂𝐡𝐚𝐭𝐆𝐏𝐓 𝐀𝐏𝐈 𝐜𝐮̉𝐚 𝐛𝐚̣𝐧 𝐯𝐚̀ 𝐭𝐡𝐮̛̉ 𝐥𝐚̣𝐢", event.threadID);
        }
    } catch (error) {
        api.sendMessage("🔍 Đ𝐚̃ 𝐱𝐚̉𝐲 𝐫𝐚 𝐥𝐨̂̃𝐢 𝐤𝐞̂́𝐭 𝐧𝐨̂́𝐢 𝐯𝐨̛́𝐢 𝐂𝐡𝐚𝐭𝐆𝐏𝐓 𝐀𝐏𝐈.", event.threadID); 
        console.error("🚫 𝐋𝐨̂̃𝐢 𝐩𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢:", error);
    }
};

module.exports.run = async function({ api, event }) {};