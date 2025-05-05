const u = ["https://imgur.com/WoD5OoQ.png","https://imgur.com/x0QrTlQ.png"]
const f = ["https://imgur.com/28aiYVA.png","https://imgur.com/vCO8LPL.png","https://imgur.com/OGxx1I4.png","https://imgur.com/S9igFa6.png"]
const g = ["https://imgur.com/R1Nc9Lz.png","https://imgur.com/yd0svOU.png","https://imgur.com/0MXw7eG.png","https://imgur.com/HYeoGia.png","https://imgur.com/KlLrw0y.png","https://imgur.com/B42txfi.png","https://imgur.com/JkunRCG.png","https://imgur.com/yHueKan.png","https://imgur.com/z2RpozR.png"]
const h = ["https://imgur.com/WspyTeK.png","https://imgur.com/2sGb8UV.png","https://imgur.com/YvuMkJ0.png","https://imgur.com/NF8nB3U.png","https://imgur.com/388n5TF.png","https://imgur.com/WcWC8z8.png","https://imgur.com/2sCe8GO.png","https://imgur.com/eDYbG9F.png","https://imgur.com/4n8FlLJ.png","https://imgur.com/rGV8aYs.png"]
const s = ["https://imgur.com/Dkco1Xz.png","https://imgur.com/Tmpw6me.png","https://imgur.com/C2HKEHu.png","https://imgur.com/BAEKMdK.png","https://imgur.com/LIH4YYl.png","https://imgur.com/vWE3V9T.png","https://imgur.com/nJ2qpiY.png","https://imgur.com/duis8N4.png","https://imgur.com/i3QC0eV.png","https://imgur.com/V7ji4IG.png","https://imgur.com/lAXMleJ.png","https://imgur.com/jYBBTuf.png","https://imgur.com/s0oBwea.png","https://imgur.com/nwJbpwR.png","https://imgur.com/jwVRzrk.png","https://imgur.com/tr5JHav.png","https://imgur.com/pSxLPtt.png","https://imgur.com/hsZ8GHY.png","https://imgur.com/Jb8lxQn.png","https://imgur.com/RqjgA57.png"]
 const w = ["https://imgur.com/ky7Iu2t.png","https://imgur.com/1zZcchN.png","https://imgur.com/EidGfcr.png","https://imgur.com/Kmt9Hiz.png","https://imgur.com/wYimMMU.png","https://imgur.com/kKBLKIg.png","https://imgur.com/BSoFwWi.png","https://imgur.com/0eOJSp7.png","https://imgur.com/UlUnVdU.png","https://imgur.com/PQRrAOt.png","https://imgur.com/GhUBZnz.png"]
module.exports.config = {
  name: "lq",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hanaku UwuU",
  description: "banner",
  commandCategory: "Tạo ảnh",
  usages: "",
  cooldowns: 5
};
module.exports.run = async function({ api, args, event, permssion }) {
  const axios = require('axios');
  var i = args.join(" ");

  if (!i && event.type == 'message_reply') {
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0)
            return api.sendMessage('Bạn cần phải reply một ảnh', event.threadID);
        if (event.messageReply.attachments.length > 1)  return api.sendMessage('Vui lòng chỉ reply một ảnh!', event.threadID, eventmessageID);
        if (event.messageReply.attachments[0].type != 'photo')
            return api.sendMessage('Vui lòng chỉ reply ảnh!', event.threadID, event.messageID);

        i = event.messageReply.attachments[0].url;
    } else if (!i) {
        i = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    } else {
        if (i.indexOf('http') == -1) {
            i = 'https://' + i;
        }
    }
    return api.sendMessage('Reply tin nhắn để nhập tên nhân vật của bạn', event.threadID, (err, info) => {
        global.client.handleReply.push({
            step: 1,
            name: this.config.name,
            messageID: info.messageID,
            anh: i ,
            author: event.senderID
        })
    }, event.messageID);
  }
  module.exports.handleReply = async function({ api, event, args, handleReply, client, __GLOBAL, Threads, Users, Currencies }) {
    try{
     let pathImg = __dirname + `/lq/avatar_1111231.png`;
    let pathAva = __dirname + `/lq/avatar_3dsc11.png`;
    let pathBS = __dirname + `/lq/avatar_3ssssc11.png`;
    let pathtop = __dirname + `/lq/avatar_3sscxssc11.png`;
    let paththaku = __dirname + `/lq/avatar_3oxsscxssc11.png`;
    let pathtph = __dirname + `/lq/avatar_xv3oxsscxssc11.png`;
    let pathx = __dirname + `/lq/avas_123456`
    const { threadID, messageID, senderID } = event
    const fs = require('fs-extra');
    const { loadImage, createCanvas } = require("canvas");
    const request = require('request');
    const path = require('path');
    const axios = require('axios');
    const Canvas = require('canvas');
    if (!fs.existsSync(__dirname +
      `/lq/ArialUnicodeMS.ttf`)) {
      let getfont = (await axios.get(`https://github.com/hanakuUwU/font/blob/main/ArialUnicodeMS.ttf?raw=true`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `/lq/ArialUnicodeMS.ttf`, Buffer.from(getfont, "utf-8"));
    };
  if (event.senderID != handleReply.author) return api.sendMessage("chọn con cặc 😏😏 (bot said : ơ quê 😗😗)", event.threadID, event.messageID); 
  if (handleReply.step == 1) {
     api.unsendMessage(handleReply.messageID);
     //ảnh 1 là ct ảnh 2 là chiến tướng -_-
     var x = [];
     for(let e = 0; e < u.length; e++){
      const t = (await axios.get(`${u[e]}`, {
        responseType: "stream"
      })).data;
    x.push(t)
     }
     var msg = ({
      body: `bạn chọn tên nhân vật của mình là ${event.body}, reply tin nhắn này để chọn khung rank cho bản thân`,
      attachment: x
     })
      return api.sendMessage(msg, threadID, function(err, info) {
        return global.client.handleReply.push({
           step: 2,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: event.body,
            author: event.senderID
        })
      }, messageID);
  }
  else if(handleReply.step == 2){
    if(isNaN(event.body)) return
    api.unsendMessage(handleReply.messageID);
     var l = [];
     for(let e = 0; e < f.length; e++){
      const t = (await axios.get(`${f[e]}`, {
        responseType: "stream"
      })).data;
    ;l.push(t)
     }
     var msg = ({
      body: `bạn chọn tên khung của mình là ${event.body == 1 ? "Cao Thủ" : "Chiến Tướng"}, reply tin nhắn này để chọn tri kỷ`,
      attachment: l
     })
      return api.sendMessage(msg, threadID, function(err, info) {
        return global.client.handleReply.push({
           step: 3,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: event.body,
            author: event.senderID
        })
      }, messageID);
  }
    else if(handleReply.step == 3){
       if(isNaN(event.body)) return
    api.unsendMessage(handleReply.messageID);
     var l = [];
     for(let e = 0; e < g.length; e++){
      const t = (await axios.get(`${g[e]}`, {
        responseType: "stream"
      })).data;
    ;l.push(t)
     }
     var msg = ({
      body: `bạn chọn tên tri kỷ của mình là ${event.body == 1 ? "Anh Em" : event.body == "2" ? "Bạn Bè" : event.body == "3" ? "Cặp Đôi" : event.body == "4" ? "Chị Em" : "không xác định" }, reply tin nhắn này để chọn thông thạo mà bạn muốn`,
      attachment: l
     })
      return api.sendMessage(msg, threadID, function(err, info) {
        return global.client.handleReply.push({
           step: 4,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: event.body,
            author: event.senderID
        })
      }, messageID);
  }
  else if(handleReply.step == 4){
     if(isNaN(event.body)) return
    api.unsendMessage(handleReply.messageID);
     var l = [];
     for(let e = 0; e < h.length; e++){
      const t = (await axios.get(`${h[e]}`, {
        responseType: "stream"
      })).data;
    ;l.push(t)
     }
     var msg = ({
      body: `bạn chọn kỹ năng của mình là ${event.body == 1 ? "Bậc D" : event.body == "2" ? "Bậc C" : event.body == "3" ? "Bậc B" : event.body == "4" ? "Bậc A" : event.body == "5" ? "Bậc S" : event.body == "6" ? "Top Vùng" : event.body == "7" ? "Top Miền" : event.body == "8" ? "Top Việt Nam" : "Top 1"}, reply tin nhắn này để chọn bỗ trợ`,
      attachment: l
     })
      return api.sendMessage(msg, threadID, function(err, info) {
        return global.client.handleReply.push({
           step: 5,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: event.body,
            author: event.senderID
        })
      }, messageID);
  }
   else if(handleReply.step == 5){
     if(isNaN(event.body)) return
    api.unsendMessage(handleReply.messageID);
     var l = [];
     for(let e = 0; e < s.length; e++){
      const t = (await axios.get(`${s[e]}`, {
        responseType: "stream"
      })).data;
    l.push(t)
     }
     var msg = ({
      body: `bạn chọn tên bổ trợ của mình là ${event.body == 1 ? "Bộc Phá" : event.body == "2" ? "Cấm Trụ" : event.body == "3" ? "Cấp Cứu" : event.body == "4" ? "Gầm Thét" : event.body == "5" ? "Ngất Ngư" : event.body == "6" ? "Suy Nhược" : event.body == "7" ? "Thanh Tẩy" : event.body == "8" ? "Tốc Biến" : event.body == "9" ? "Tốc Hành" : "Trừng Trị"}, reply tin nhắn này để chọn bậc skin mà bạn muốn`,
      attachment: l
     })
      return api.sendMessage(msg, threadID, function(err, info) {
        return global.client.handleReply.push({
           step: 6,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: handleReply.kynang,
            botro: event.body,
            author: event.senderID
        })
      }, messageID);
  }
     else if(handleReply.step == 6){
       if(isNaN(event.body)) return
    api.unsendMessage(handleReply.messageID);
     var l = [];
     for(let e = 0; e < w.length; e++){
      const t = (await axios.get(`${w[e]}`, {
        responseType: "stream"
      })).data;
      l.push(t)
     }
     var msg = ({
      body: `Bạn đã chọn cho mình bậc skin stt ${event.body}, reply tin nhắn này để chọn phù hiệu`,
      attachment: l
     })
      return api.sendMessage(msg, threadID, function(err, info) {
        return global.client.handleReply.push({
           step: 7,
            name: "lq",
           messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: handleReply.kynang,
            botro: handleReply.botro,
            bacsk: event.body,
            author: event.senderID
        })
      }, messageID);
  }
       else if(handleReply.step == 7){

    api.unsendMessage(handleReply.messageID);
      return api.sendMessage("Reply tin nhắn này để nhập tên tướng", threadID, function(err, info) {
        return global.client.handleReply.push({
           step: 8,
            name: "lq",
           messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: handleReply.kynang,
            botro: handleReply.botro,
            bacsk: handleReply.bacsk,
            phuhieu: event.body,
            author: event.senderID
        })
      }, messageID);
  }
       else if(handleReply.step == 8){

    api.unsendMessage(handleReply.messageID);
      return api.sendMessage("Reply tin nhắn này để nhập tên tướng", threadID, function(err, info) {
        return global.client.handleReply.push({
           step: 9,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: handleReply.kynang,
            botro: handleReply.botro,
            bacsk: handleReply.bacsk,
            phuhieu: handleReply.phuhieu,
            tentuong: event.body,
            author: event.senderID,
        })
      }, messageID);
  }
  else if(handleReply.step == 9){
    api.unsendMessage(handleReply.messageID);
      let background = (await axios.get(encodeURI(`${u[handleReply.khung - 1]}`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
      let ava = (await axios.get(encodeURI(`${handleReply.anh}`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAva, Buffer.from(ava, "utf-8"));
    let bacsk123 = (await axios.get(encodeURI(`${s[handleReply.bacsk - 1]}`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathx, Buffer.from(bacsk123, "utf-8"));
    let botro123 = (await axios.get(encodeURI(`${h[handleReply.botro - 1]}`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathBS, Buffer.from(botro123, "utf-8"));
    let bactop123 = (await axios.get(encodeURI(`${g[handleReply.kynang - 1 ] }`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathtop, Buffer.from(bactop123, "utf-8"));
    let phu1hieu1232 = (await axios.get(encodeURI(`${w[handleReply.phuhieu - 1]}`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(paththaku, Buffer.from(phu1hieu1232, "utf-8"));
    let banbe = (await axios.get(encodeURI(`${f[handleReply.triky - 1 ]}`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathtph, Buffer.from(banbe, "utf-8"));
    let a = await loadImage(pathImg);
    let az = await loadImage(pathtop);
    let a2 = await loadImage(pathBS);
    let a3 = await loadImage(pathx);
    let a4 = await loadImage(pathtph);
    let a5 = await loadImage(paththaku);
    let a6 = await loadImage(pathAva);
    let canvas = createCanvas(a.width, a.height);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Canvas.registerFont(__dirname + `/lq/ArialUnicodeMS.ttf`, {
      family: "Arial"
    });
    ctx.drawImage(a6, 0, 0, 720, 890);
    ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
    var btw = 128;
    ctx.drawImage(a2, canvas.width / 2 - btw / 2, 905, btw, btw);
    ctx.drawImage(az, 15, 10, az.width, az.height);
    ctx.drawImage(a4, 108, 930, 90 * 27 / 24, 90);
    ctx.drawImage(a5, 473, 897, 143, 143);
    ctx.save();
    var a3scale = 2
    ctx.drawImage(a3, canvas.width / 2 - a3.width * a3scale / 2, 510, a3.width * a3scale, a3.height * a3scale);
    ctx.restore();
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#f7ecb4"
    ctx.font = "50px Arial";
    ctx.fillText(handleReply.ten, canvas.width / 2, 857);
    ctx.restore();
    ctx.save();
    ctx.textAlign = "center";
    ctx.shadowColor = "black";
    ctx.fillStyle = "#5d9af6"
    ctx.font = "50px Arial";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.strokeText(handleReply.tentuong, canvas.width / 2, 770);
    ctx.fillText(handleReply.tentuong, canvas.width / 2, 770);
    ctx.restore();
    ctx.save();
    ctx.textAlign = "center";
    ctx.shadowColor = "black";
    ctx.fillStyle = "#f7ecb4"
    ctx.font = "50px Arial";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.strokeText(event.body, canvas.width / 2, 700);
    ctx.fillText(event.body, canvas.width / 2, 700);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage({
        body: `Ảnh của mày đây gà`,
        attachment: fs.createReadStream(pathImg)
      },
        event.threadID,
        () => 
        fs.removeSync(pathImg),
        fs.removeSync(pathAva),
        fs.removeSync(pathBS),
        fs.removeSync(pathtop),
        fs.removeSync(paththaku),
        fs.removeSync(pathx),
        fs.removeSync(pathtph),
        event.messageID
      );
  }
  } catch(e){
    console.log(e)
  }
            }