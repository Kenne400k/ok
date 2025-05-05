module.exports.config = {
  name: "banner5",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raiku",
  description: "abcxyz",
  commandCategory: "Tạo ảnh",
  usages: "banner5",
  cooldowns: 5
};
module.exports.wrapText = (ctx, text, maxWidth) => {
return new Promise(resolve => {
  ctx.textAlign = "center";
  if (ctx.measureText(text).width < maxWidth) return resolve([text]);
  if (ctx.measureText('W').width > maxWidth) return resolve(null);
  const words = text.split(' ');
  const lines = [];
  let line = '';
  while (words.length > 0) {
    ctx.textAlign = "center";
    let split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      const temp = words[0];
      words[0] = temp.slice(0, -1);
      if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
      else {
        split = true;
        words.splice(1, 0, temp.slice(-1));
      }
    }
    if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
    else {
      ctx.textAlign = "center";
      lines.push(line.trim());
      line = '';
    }
    if (words.length === 0) lines.push(line.trim());
  }
  ctx.textAlign = "center"
  return resolve(lines);
});
}
module.exports.run = async function ({ api, event, client, args }) {
const text1 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[0] || "TEXT",
  text2 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[1] || "TEXT",
  text3 = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[2] || "TEXT";
  const { loadImage, createCanvas } = require("canvas");
  const fs = require('fs')
  const request = require('request');
  const path = require('path');
  const axios = require('axios');
  const Canvas = require('canvas');
  let pathImg = __dirname + `/abc/avatar_1.png`;
  let background = (await axios.get(encodeURI(`https://imgur.com/Wy6cc05.png`), { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
  if (!fs.existsSync(__dirname +
    `/abc/Catamaran-Regular.ttf`)) {
    let getfont = (await axios.get(`https://github.com/hanakuUwU/font/raw/8af10ff2665cf3d2fa02bb5b8d1859b4d568c8c9/Catamaran-Regular.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/abc/GCatamaran-Regular.ttf`, Buffer.from(getfont, "utf-8"));
  };
  if (!fs.existsSync(__dirname +
    `/abc/Metropolis-Black.ttf`)) {
    let getfont1 = (await axios.get(`https://github.com/hanakuUwU/font/raw/8af10ff2665cf3d2fa02bb5b8d1859b4d568c8c9/Metropolis-Black.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/abc/Metropolis-Black.ttf`, Buffer.from(getfont1, "utf-8"));
  };
  if (!fs.existsSync(__dirname +
    `/abc/UTMAlterGothic.ttf`)) {
    let getfont1 = (await axios.get(`https://github.com/hanakuUwU/font/raw/8af10ff2665cf3d2fa02bb5b8d1859b4d568c8c9/UTMAlterGothic.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/abc/UTMAlterGothic.ttf`, Buffer.from(getfont1, "utf-8"));
  }
    let a = await loadImage(pathImg);
    let canvas = createCanvas(a.width, a.height);
    let ctx = canvas.getContext("2d");
  let canvas2 = createCanvas(a.width, a.height);
  let ctx1 = canvas2.getContext("2d");
  let canvas3 = createCanvas(a.width, a.height);
  let ctx2 = canvas3.getContext("2d");
  ctx.drawImage(a , 0, 0, canvas.width, canvas.height)
Canvas.registerFont(__dirname + `/abc/Metropolis-Black.ttf`, {
  family: "Metropolis-Black"
});
    ctx1.font = "200px Metropolis-Black";
  ctx1.globalAlpha = 0.6
  ctx1.strokeStyle = "#fff"
  ctx1.lineWidth = 3.5
  ctx1.textAlign = "center";
  ctx1.strokeText(text1.toUpperCase(), canvas.width / 2, 400)
 ctx1.restore();
  ctx2.save();
ctx.drawImage(canvas2 , 0, 0, canvas.width, canvas.height)
   Canvas.registerFont(__dirname + `/abc/GCatamaran-Regular.ttf`, {
  family: "GCatamaran-Regular"
});
    ctx2.font = "175px GCatamaran-Regular";
  ctx2.textAlign = "center";
  ctx2.shadowColor = 'white';
  ctx2.shadowBlur = 15;
  ctx2.fillStyle = "#fff"  
  ctx2.fillText(text2.toUpperCase(), canvas.width / 2, 390)
  ctx.drawImage(canvas3 , 0, 0, canvas.width, canvas.height)
   Canvas.registerFont(__dirname + `/abc/UTMAlterGothic.ttf`, {
  family: "UTMAlterGothic"
});
  ctx.font = "95px GCatamaran-Regular";
  ctx.textAlign = "center";
  ctx.shadowColor = 'white';
  ctx.shadowBlur = 5;
  ctx.fillStyle = "#fff"  
  const lines = text3.toUpperCase()
 const abc = await this.wrapText(ctx, lines, 1500);
  ctx.fillText(abc.join('\n'), canvas.width / 2, 490)
 ctx.beginPath();
const imageBuffer = canvas.toBuffer();
fs.writeFileSync(pathImg, imageBuffer);
return api.sendMessage({
  body: "",
  attachment: fs.createReadStream(pathImg)
},
  event.threadID,
  () => fs.unlinkSync(pathImg),
  event.messageID
);
    }