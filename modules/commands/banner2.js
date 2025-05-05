module.exports.config = {
  name: "banner2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hanaku",
  description: "just a banner",
  commandCategory: "Tạo ảnh",
  usages: "banner2 + ID | text1 | text2 | text3 | text4",
  cooldowns: 0
};
module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
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
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
} 
module.exports.run = async function({ api, args, event, Users, permssion, Currencies }) {
  try{
  const owo = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[0];

    if(owo == "random" || owo == "Random" || owo == "ngẫu nhiên"){
      var id = Math.floor(Math.random() * 848) + 1
    } else {
      var id = owo
    }
      const name = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[1];
          const subname = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[2];
  const lines = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[3];
      const title = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[4];
   const fs = require('fs-extra');
    const { loadImage, createCanvas } = require("canvas");
    const Canvas = require('canvas');
    const axios = require('axios');
   const lengthchar = (await axios.get('https://docs-api.nguyenhaidang.ml/taoanhdep/data')).data
    const request = require('request');
    const path = require('path');
    let pathImg = __dirname + `/tad/avatar_11134231.png`;
    let pathLine = __dirname + `/tad/avatar_11121231.png`;
    let pathAva = __dirname + `/tad/avatar_3dsc12311.png`;
    let pathIcon = __dirname + `/tad/avatar_3ds23c12311.png`;
    let pathIconIG = __dirname + `/tad/sssss.png`;
    let pathIcongithub = __dirname + `/tad/owo.png`;
    let line = __dirname + `/tad/12341o.png`;
    let line1 = (await axios.get(encodeURI(`https://imgur.com/g2xNV2C.png`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(line, Buffer.from(line1, "utf-8"));
    let background = (await axios.get(encodeURI(`https://imgur.com/qBMs0FN.png`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
    let avtAnime = (
      await axios.get(encodeURI(`${lengthchar[id].imgAnime}`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
    if (!fs.existsSync(__dirname +
      `/tad/phenomicon.ttf`)) {
      let getfont = (await axios.get(`https://github.com/J-JRT/font/raw/mainV2/phenomicon.ttf`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `/tad/phenomicon.ttf`, Buffer.from(getfont, "utf-8"));
    };
    if (!fs.existsSync(__dirname +
      `/tad/SVN-Big Noodle Titling.otf`)) {
      let getfon2t = (await axios.get(`https://github.com/J-JRT/font/raw/mainV2/SVN-Big%20Noodle%20Titling.otf`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `/tad/SVN-Big Noodle Titling.otf`, Buffer.from(getfon2t, "utf-8"));
    };
    if (!fs.existsSync(__dirname +
      `/tad/EBGaramond-VariableFont_wght.ttf`)) {
      let getfon2t = (await axios.get(`https://github.com/J-JRT/font/raw/mainV2/EBGaramond-VariableFont_wght.ttf`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `/tad/EBGaramond-VariableFont_wght.ttf`, Buffer.from(getfon2t, "utf-8"));
    }
    let icon3 = (await axios.get(encodeURI(`https://imgur.com/38Ws4qZ.png`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathIcongithub, Buffer.from(icon3, "utf-8"));
    let liness = (await axios.get(encodeURI(`https://imgur.com/UxQ5Z0u.png`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathLine, Buffer.from(liness, "utf-8"));
    let icon = (await axios.get(encodeURI(`https://imgur.com/zmMas6s.png`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathIcon, Buffer.from(icon, "utf-8"));
    let icon2 = (await axios.get(encodeURI(`https://imgur.com/QsJPESz.png`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathIconIG, Buffer.from(icon2, "utf-8"));
    let l1 = await loadImage(pathAva);
    let a = await loadImage(pathImg);
    let p = await loadImage(pathLine);
    let g = await loadImage(pathIcon);
    let l = await loadImage(line);
    let r = await loadImage(pathIconIG);
    let o = await loadImage(pathIcongithub);
    let canvas = createCanvas(a.width, a.height);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(l1, -100, -70, 1000, 1000);
    ctx.beginPath();
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(p, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = lengthchar[id].colorBg
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.drawImage(g, 1153, 690, 50, 50);
    ctx.drawImage(r, 1209, 692, 50, 50);
    ctx.drawImage(o, 1255, 680, 75, 75);
    Canvas.registerFont(__dirname + `/tad/phenomicon.ttf`, {
      family: "phenomicon"
    });
    ctx.textAlign = "start";
    ctx.strokeStyle = lengthchar[id].colorBg;
    ctx.filter = "brightness(90%) contrast(110%)";
    ctx.font = "150px phenomicon";
    ctx.fillText(name, 790, 390);
    ctx.restore();
    ctx.save();
    ////
    ctx.textAlign = "start";
    ctx.fillStyle = lengthchar[id].colorBg;
    ctx.font = "70px phenomicon"
    ctx.fillText(subname, 1200, 450)
    Canvas.registerFont(__dirname + `/tad/EBGaramond-VariableFont_wght.ttf`, {
      family: "BGaramond-VariableFont_wght"
    });
    ctx.font = "30px BGaramond-VariableFont_wght"
    ctx.fillStyle = "#aaf0d1";
    const abc = await this.wrapText(ctx, lines, 750);
    ctx.fillText(abc.join('\n'), 790, 550)
    ////
    Canvas.registerFont(__dirname + `/tad/SVN-Big Noodle Titling.otf`, {
      family: "time"
    });
    ctx.textAlign = "start";
    ctx.fillStyle = "#ffff";
    ctx.font = "35px time"
    ctx.fillText(title, 790, 730)
    ctx.textAlign = "start";
    ctx.fillStyle = "#ffff";
    ctx.font = "35px time"
    ctx.fillText("@J-JRT", 1340, 730)
    ctx.globalAlpha = 0.5
    ctx.drawImage(l, 0, 0, l.width, l.height);
    ctx.save()
    ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  return api.sendMessage({
    body: "",
    attachment: fs.createReadStream(pathImg)
  },
    event.threadID,
    () => fs.unlinkSync(pathImg),
    fs.unlinkSync(pathAva),
    fs.unlinkSync(pathLine),
    fs.unlinkSync(pathIconIG),    
    fs.unlinkSync(pathIcongithub),
    fs.unlinkSync(line),
    event.messageID
  );
  } catch(e){
    console.log(e)
    return api.sendMessage("Liên Hệ https://www.facebook.com/dhp.hphong.profile/ để biết thêm chi tiết")
  } 
}