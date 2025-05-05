module.exports.config = {
    name: "ship",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "",
    description: "share 1 mdl nào đó cho 1 tv trog group",
    commandCategory: "Admin",
    usages: "/share [reply or tag or để trống] + tên mdl muốn share",
    cooldowns: 0,
    dependencies: {
        "pastebin-api": "",
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
  const permission = [`${global.config.ADMINBOT[0]}`];
    if (!permission.includes(event.senderID)) return api.sendMessage( "bạn không có quyên sài lệnh này !",event.threadID, event.messageID);
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
  const picture = (await axios.get(`https://quatangabc.com/vnt_upload/File/Image/share_1.jpg`, { responseType: "stream"})).data;
  const moment = require("moment-timezone");
  const hmm = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
const uid = event.type == 'message_reply' ? event.messageReply.senderID: !!Object.keys(event.mentions)[0] ? Object.keys(event.mentions)[0]: !!args[0] ? args[0]: event.senderID  ;
    const { join, resolve } = require("path");
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }
    if(!text && !name) return api.sendMessage({body: `🌸--「 Share Riêng MDL 」--🌸
◆━━━━━━━━━━━━━━━━━◆
⏰ Thời gian: ${hmm} 
📌 Bạn có thể reply,tag người muốn share`, attachment: (picture)},threadID, messageID);
    //(!text && name) {
        var data = fs.readFile(
          `./modules/commands/${args[0]}.js`,
          "utf-8",
          async (err, data) => {
            if (err) return api.sendMessage({body: `📝==「 𝗦𝗛𝗔𝗥𝗘 𝗥𝗜𝗘̂𝗡𝗚 𝗠𝗗𝗟 」==📝
━━━━━━━━━━━━━━━━━━━━━
⏰ 𝗕𝗮̂𝘆 𝗴𝗶𝗼̛̀ 𝗹𝗮̀: ${hmm} 
𝗜'𝗺 𝘀𝗼𝗿𝘆 𝗺𝗱𝗹 ${args[0]} 𝗺𝗮̀ 𝗯𝗮̣𝗻 𝗰𝗮̂̀𝗻 𝗵𝗶𝗲̣̂𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝗰𝗼́ 𝘁𝗿𝗲̂𝗻 𝗵𝗲̣̂ 𝘁𝗵𝗼̂́𝗻𝗴 𝗰𝘂̉𝗮 ${global.config.BOTNAME}`, attachment: (picture)}, threadID, messageID);
            const { PasteClient } = require('pastebin-api')
            const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
            async function pastepin(name) {
              const url = await client.createPaste({
                code: data,
                expireDate: 'N',
                format: "javascript",
                name: name,
                publicity: 1
              });
              var id = url.split('/')[3]
              return 'https://pastebin.com/raw/' + id
            }
            var link = await pastepin(args[1] || 'noname')
        api.sendMessage(`Vào lúc ${hmm} đã cho thằng này bú lệnh |${args.join("")}|`, threadID, messageID);
            api.sendMessage({body: `${hmm}
Bú này cu: ${link} 
Tên lệnh: ${args.join("")}`,attachment: (picture)}, uid)
          }
        );
        return
}