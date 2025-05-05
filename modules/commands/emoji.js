const fs = require("fs");
module.exports.config = {
    name: "emoji",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "JRT",
    description: "Ghép Icon",
    commandCategory: "Công cụ",
    cooldowns: 5,
    denpendencies: {
        "fs": "",
        "request": "",
        "emoji-unicode": ""
    }
};

const emojiUnicode = require("emoji-unicode");
const { createReadStream, unlinkSync, writeFileSync } = require('fs');

module.exports.run = async function ({ api,event,args }) {
    var axios = require('axios');
        try {
            if (args.length != 2 || !args[0] || !args[1]) return api.sendMessage("[⚜️]➜ Hãy Bấm: emoji 😢 🤣 hoặc emojimix emoji1 emoji2",event.threadID,event.messageID);
                var emoji1 = "u"+emojiUnicode(args[0]),emoji2 = "u"+emojiUnicode(args[1]);
                console.log(emoji1,emoji2)
                    var { data } = await axios.get(`https://www.gstatic.com/android/keyboard/emojikitchen/20201001/${emoji1}/${emoji1}_${emoji2}.png`,{  method: 'GET',  responseType: 'arraybuffer' });
                writeFileSync(__dirname + "/cache/emojimix.png", Buffer.from(data, 'utf-8'));
            return api.sendMessage({ body:"[⚜️]➜ Emoji đã được mix của bạn nè",attachment: createReadStream(__dirname + "/cache/emojimix.png")},event.threadID,event.messgaeID);
        }
    catch (e) {
      console.log(e);
        return api.sendMessage("[⚜️]➜ Lỗi rồi !, hãy thử với icon khác nhé !",event.threadID,event.messgaeID);
    }
}
