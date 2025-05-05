module.exports.config = {
    name: "google",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie",
    description: "Tìm kiếm hình ảnh",
    commandCategory: "game",
    usages: "[Text]",
    cooldowns: 0,
};
module.exports.run = async function({ api, event, args }) {
const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const keySearch = args.join(" ");
if(keySearch.includes("-") == false) return api.sendMessage('Vui lòng nhập theo định dạng: từ khóa cần tìm kiếm - số ảnh cần tìm\nVD: /google anime - 10', event.threadID, event.messageID)
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
    const numberSearch = keySearch.split("-").pop() || 6
    const res = await axios.get(`https://api-nodejs.miraiofficials123.repl.co/google/img?text=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }
    api.sendMessage({
        attachment: imgData,
        body: '=== [ 𝗚𝗼𝗼𝗴𝗹𝗲 ] ====\n━━━━━━━━━━━━━━━━━━\n→' + numberSearch + ' 𝗞𝗲̂́𝘁 𝗾𝘂𝗮̉ 𝘁𝗶̀𝗺 𝗸𝗶𝗲̂́𝗺 𝗰𝘂̉𝗮 𝘁𝘂̛̀ 𝗸𝗵𝗼́𝗮: ' + keySearchs
    }, event.threadID, event.messageID)
    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`)
    }
};