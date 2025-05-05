module.exports.config = {
  name: "avtdoi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TuanDz",
  description: "Ảnh cho couple",
  commandCategory: "Box chat",
    cooldowns: 2,
};
module.exports.run = async function({ api, event, args }) {
    const axios = require("axios")
    const request = require("request")
    const fs = require("fs-extra")
    const res = await axios.get(`https://apiuwuapi.ducdz999.repl.co/images/ppcouple`);
    var data = res.data.url;
    var msg = [];
    let img1 = `${res.data.url.female}`;
    let img2 = `${res.data.url.male}`;
    let count = res.data.count;

    let imgs1 = (await axios.get(`${img1}`, {
        responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(__dirname + "/cache/img1.png", Buffer.from(imgs1, "utf-8"));
    let imgs2 = (await axios.get(`${img2}`, {
        responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(__dirname + "/cache/img2.png", Buffer.from(imgs2, "utf-8"));
    var allimage = [];
    allimage.push(fs.createReadStream(__dirname + "/cache/img1.png"));
    allimage.push(fs.createReadStream(__dirname + "/cache/img2.png"));
	
    {
        msg += `===『 𝗖𝗢𝗨𝗣𝗟𝗘 𝗖𝗨𝗧𝗘 』===\n\n𝗔̉𝗻𝗵 𝗰𝗵𝗼 𝗰𝗮́𝗰 𝗰𝗮̣̆𝗽 𝘆𝗲̂𝘂 𝗻𝗵𝗮𝘂 𝗻𝗲̀ ❤️\n👑 𝗔𝘂𝘁𝗵𝗼𝗿: ${res.data.author}`
    }
    
    return api.sendMessage({
        body: msg,
        attachment: allimage
    }, event.threadID, event.messageID);
}