module.exports.config = {
  name: "logo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ARAXY XD",
  description: "Tạo logo block",
  commandCategory: "Tạo ảnh",
  usages: "logo (Tên Chính) | (Tên Phụ) | (Màu tên chính) | (Màu tên phụ)",
  cooldowns: 5
};
module.exports.run = async ({ event,
    api,
    global,
    Config,
    logger,
    Threads,
    Users,
    args,
    body,
    is }) => {
  try {
const fs = require('fs-extra');
    const { loadImage, createCanvas } = require("canvas");
    const request = require('request');
    const path = require('path');
    const axios = require('axios');
    const Canvas = require('canvas');
    let pathImg = __dirname + `/tad/avatar_1_2.png`;
        var ag = args.join(" ").split(' | ');
        var text1 = ag[0],
            text2 = ag[1],
            text3 = ag[2],
            text4 = ag[3];
        let background = (await axios.get(encodeURI(`https://lh3.googleusercontent.com/-fJXKeIC8E2w/YY-PQO_pOzI/AAAAAAAA0rg/clQv41eetT0e3d1LZS6lgxuZ8ARbnzuywCNcBGAsYHQ/s0/Logo-block.png`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
    if (!fs.existsSync(__dirname +
      `/tad/SVN-Revolution.ttf`)) {
      let getfont = (await axios.get(`https://github.com/hanakuUwU/font/blob/main/SVN-Revolution.ttf?raw=true`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `/tad/SVN-Revolution.ttf`, Buffer.from(getfont, "utf-8"));
    };
    let a = await loadImage(pathImg);
    let canvas = createCanvas(a.width, a.height);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.save();

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";

    ctx.drawImage(a, 0, 0, canvas.width, canvas.height);

    ctx.save();
    Canvas.registerFont(__dirname + `/tad/SVN-Revolution.ttf`, {
      family: "SVN-Revolution"
    });
    ctx.textAlign = "center";
    ctx.font = "300px SVN-Revolution";
    ctx.fillText(text2, canvas.width / 2, 1450);
    ctx.restore();

    ctx.save();
    Canvas.registerFont(__dirname + `/tad/SVN-Revolution.ttf`, {
      family: "SVN-Revolution"
    });
    ctx.textAlign = "center";
    ctx.font = "100px SVN-Revolution";
    ctx.fillText(text1, canvas.width / 2, 1650);
    ctx.restore();

    ctx.restore();

    ctx.globalCompositeOperation = "destination-over";
    var gradient2 = ctx.createLinearGradient(0, 0, 0, 2000);
    gradient2.addColorStop(0, `${text3}`);
    gradient2.addColorStop(1, `${text4}`);
    ctx.fillStyle = gradient2;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage({
        body: `Ảnh của bạn đây`,
        attachment: fs.createReadStream(pathImg)
      },
        event.threadID,
        () => 
        fs.removeSync(pathImg),
        event.messageID
      );
  } catch (e){
    api.sendMessage('Lỗi Rồi', event.threadID, event.messageID)
  }
}