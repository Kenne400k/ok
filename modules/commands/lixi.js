module.exports.config = {
    name: "lixi",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Tạo ảnh lì xì",
    commandCategory: "Thành Viên",
    usages: "lixi",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");

    const dirMaterial = __dirname + `/cache/canvas/`;
    if (!fs.existsSync(dirMaterial + "canvas")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "lixi.png")) request("https://i.imgur.com/VUWRn9N.jpg").pipe(fs.createWriteStream(dirMaterial + "lixi.png"));
}

async function makeImage({ one, two, args, api, event }) { 
    //const stk = args.join(""); 
    
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");
    const jimp = require("jimp");
    const __root = path.resolve(__dirname, "cache", "canvas");

    let lixi_image = await jimp.read(__root + "/lixi.png");
    let pathImg = __root + `/lixi${one}.png`;
    let avatar = __root + `/avt_${one}.png`;
    let qrbank = __root + `/avt_qrcode.png`;

    
    
    let avt = (await axios.get(`https://graph.facebook.com/${one}/picture?width=1500&height=1500&access_token=2712477385668128%7Cb429aeb53369951d411e1cae8e810640`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatar, Buffer.from(avt, 'utf-8'));
    
    let qrcode = (await axios.get(`https://thenamk3.net/api/qr/mbbank.png?stk=808888203&tien=20000&noidung=nemg&ctk=Nguyen%20The%20Nam&apikey=qasFbExc`, { responseType: 'arraybuffer' })).data;
    console.log(stk)
    fs.writeFileSync(qrbank, Buffer.from(qrcode, 'utf-8'));
    
     let circleOne = await jimp.read(await circle(avatar));
    // let circleTwo = await jimp.read(await circle(qrbank));
    // let circleOne = await jimp.read(avatarOne);
    let circleTwo = await jimp.read(qrbank);
    circleTwo.rotate(-10)
    lixi_image.composite(circleOne.resize(150, 150), 226, 79).composite(circleTwo.resize(75, 75), 218, 260);

    let raw = await lixi_image.getBufferAsync("image/png");
    
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatar);
    fs.unlinkSync(qrbank);
    
    return pathImg;
}
async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    var out = (msg) => api.sendMessage(msg, threadID, messageID);
  if (!args.join(" ")) return out("Thiếu Stk");
  if (event.type == "message_reply") stk  = event.messageReply.senderID
else stk = args.join(" ");  
    const mention = Object.keys(event.mentions);
    if (!mention) return api.sendMessage("", threadID, messageID);
    else {
        var one = senderID;
        return makeImage({ one }).then(path => api.sendMessage({ body: "Cháu lớn rồi!", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
    }
}