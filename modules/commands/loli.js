 module.exports.config = {
 name: "loli",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "hphong",
 description: "Random ảnh pekora",
 commandCategory: "Random-IMG",
 usages: "loli",
 cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
 const axios = require('axios');
 const request = require('request');
 const fs = require("fs");
 axios.get('https://jrt-api.j-jrt-official.repl.co/loli').then(res => {
 let ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
 let callback = function () {
          api.sendMessage({
            body: `𝐀̉𝐧𝐡 𝐥𝐨𝐥𝐢 𝐜𝐮̛̣𝐜 𝐜𝐮𝐭𝐞𝐞 😍`,
      attachment: fs.createReadStream(__dirname + `/cache/loli.${ext}`)
     }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/loli.${ext}`), event.messageID);
    };
    request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/loli.${ext}`)).on("close", callback);
   })
}