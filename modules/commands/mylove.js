module.exports.config = {
  name: "mylove",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "TáoTpk",
  description: "Ghép đôi",
  commandCategory: "Tình yêu", 
  usages: "mylove", 
  cooldowns: 2
};
module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}
module.exports.run = async function({ api, event,Threads, Users }) {
        const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
     const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
    const request = require('request');
  const res = await axios.get(`https://jrt-api.nguyenhaidang.ml/love`);
var love = res.data.data;
   const pidusage = await global.nodemodule["pidusage"](process.pid);
  const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
     if (thu == 'Sunday') thu = '𝗖𝗵𝘂̉ 𝗡𝗵𝗮̣̂𝘁'
  if (thu == 'Monday') thu = '𝗧𝗵𝘂̛́ 𝗛𝗮𝗶'
  if (thu == 'Tuesday') thu = '𝗧𝗵𝘂̛́ 𝗕𝗮'
  if (thu == 'Wednesday') thu = '𝗧𝗵𝘂̛́ 𝗧𝘂̛'
  if (thu == "Thursday") thu = '𝗧𝗵𝘂̛́ 𝗡𝗮̆𝗺'
  if (thu == 'Friday') thu = '𝗧𝗵𝘂̛́ 𝗦𝗮́𝘂'
  if (thu == 'Saturday') thu = '𝗧𝗵𝘂̛́ 𝗕𝗮̉𝘆'
  let pathImg = __dirname + "/noprefix/mdl.jpg";
  let pathAvt1 = __dirname + "/cache/Av7.png";
  let pathAvt2 = __dirname + "/cache/7.png";
  var id1 = event.senderID;
        var { participantIDs } =(await Threads.getData(event.threadID)).threadInfo;
        var tle = Math.floor(Math.random() * 101);
        var namee = (await Users.getData(event.senderID)).name
        const botID = api.getCurrentUserID();
        const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
        var id = listUserID[Math.floor(Math.random() * listUserID.length)];
        var name = (await Users.getData(id)).name 
var background = ["https://imgur.com/c7Eppap.png","https://i.imgur.com/4qT6XAd.png"];
    var rd = background[Math.floor(Math.random() * background.length)];

        let getAvtmot = (
    await axios.get( `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,{ responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));
avt1 = await this.circle(pathAvt1);
        let getAvthai = (await axios.get( `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt2, Buffer.from(getAvthai, "utf-8"));
 avt2 = await this.circle(pathAvt2);             
   if (!fs.existsSync(__dirname +
        `/tad/UTMFacebookK&TItali.ttf`)) {
        let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=1lh3U5emvpL4wJvxW_M8LFORc4rargy1s&export=download`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/tad/UTMFacebookK&TItali.ttf`, Buffer.from(getfont, "utf-8"));
   }
  let getbackground = (
    await axios.get(`${rd}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(avt1);
  let baseAvt2 = await loadImage(avt2);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 447, 92, 130, 130);
ctx.drawImage(baseAvt2, 85, 92, 130, 130);
registerFont(__dirname + `/tad/UTMFacebookK&TItali.ttf`, {
      family: "UTM"
    });
    ctx.textAlign = "start";    
    ctx.font = "23px UTM";
    ctx.fillStyle = "#00000";
    ctx.fillText(`${namee}`, 475, 65);
  ctx.font = "23px UTM";
    ctx.fillStyle = "#00000";
    ctx.fillText(`${name}`, 100, 65);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
fs.removeSync(pathAvt2);
        return api.sendMessage({body:`💓=== [ 𝗟𝗼𝘃𝗲 𝗖𝗼𝘂𝗽𝗹𝗲 ] ===💓\n━━━━━━━━━━━━\n [⚜️] 𝗚𝗵𝗲́𝗽 Đ𝗼̂𝗶 𝗧𝗵𝗮̀𝗻𝗵 𝗖𝗼̂𝗻𝗴 [⚜️]\n[❤️]➜ 𝗧𝗲̂𝗻 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻: ${namee}\n[🤍]➜ 𝗧𝗲̂𝗻 𝗰𝘂̉𝗮 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗮̂́𝘆: ${name}\n[🎀]➜ 𝗧𝗶̉ 𝗟𝗲̣̂ 𝗛𝗼̛̣𝗽 Đ𝗼̂𝗶 𝗟𝗮̀:${tle}%\n[⏰]➜ 𝗚𝗵𝗲́𝗽 đ𝗼̂𝗶 𝘃𝗮̀𝗼 𝗹𝘂́𝗰: ${gio} || ${thu}\n━━━━━━━━━━━━\n[💌]➜ 𝗧𝗵𝗶́𝗻𝗵: ${love}`,attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg));
} 
