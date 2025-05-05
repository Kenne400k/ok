module.exports.config = {
    name: "pay",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "Mirai Team mod cực mạnh by kiraUwU",
    description: "Chuyển tiền của bản thân cho ai đó",
    commandCategory: "Tài chính",
    usages: "pay [ reply ]",
    cooldowns: 5,
     };

module.exports.run = async function ({ api, args, event, Currencies, Users }) {
let { threadID, messageID, senderID } = event;
 var info = await api.getUserInfo(event.senderID);
    var userName = info[event.senderID].name;
    var balance = args[0];
const fs = require('fs');
const axios = require('axios');
const moment = require("moment-timezone");
    var time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm");
    var day = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
var content = args.slice(1);
 const { loadImage, createCanvas } = require("canvas");
const data = ["0396049***", "0969592***"];
    var sdt = data[Math.floor(Math.random() * data.length)] 
 if(!fs.existsSync(__dirname+'/cache/SplineSans-Medium.ttf')) { 
      let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=102B8O3_0vTn_zla13wzSzMa-vdTZOCmp&export=download`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+"/cache/SplineSans-Medium.ttf", Buffer.from(getfont, "utf-8"));
    };
    if(!fs.existsSync(__dirname+'/cache/SplineSans.ttf')) { 
      let getfont2 = (await axios.get(`https://drive.google.com/u/0/uc?id=1--V7DANKLsUx57zg8nLD4b5aiPfHcmwD&export=download`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+"/cache/SplineSans.ttf", Buffer.from(getfont2, "utf-8"));
    };

    var codeGD = String(Math.floor(Math.random() * (90000000000 - 1)) + 10000000000)

if(event.type == "message_reply") { 
mention = event.messageReply.senderID
var name = (await Users.getData(mention)).name
if(!isNaN(args[0])) {
        const coins = (parseInt(args[0]*85))/100;
        let balance = (await Currencies.getData(senderID)).money;
        if (coins <= 0) return api.sendMessage('[𝐌𝐎𝐌𝐎] - 𝐂𝐨́ 𝐭𝐡𝐚̆̀𝐧𝐠 𝐭𝐢́𝐧𝐡 𝐛𝐮𝐟𝐟 𝐛𝐚̂̉𝐧 𝐧𝐡𝐮̛𝐧𝐠 𝐦𝐚̀ 𝐛𝐢̣ 𝐟𝐢𝐱 𝐤𝐢̀𝐚 𝐥𝐢𝐮𝐥𝐢𝐮 😼 ',threadID,messageID);
        if (coins > balance) return api.sendMessage('[𝐌𝐎𝐌𝐎] - 𝐒𝐨̂́ 𝐜𝐨𝐢𝐧𝐬 𝐛𝐚̣𝐧 𝐦𝐮𝐨̂́𝐧 𝐜𝐡𝐮𝐲𝐞̂̉𝐧 𝐥𝐨̛́𝐧 𝐡𝐨̛𝐧 𝐬𝐨̂́ 𝐜𝐨𝐢𝐧𝐬 𝐛𝐚̣𝐧 𝐡𝐢𝐞̣̂𝐧 𝐜𝐨́ 💳',threadID,messageID);
        else {
          let path = __dirname + "/cache/pay.png";
    let bg = (await axios.get(`https://i.imgur.com/OUPC4iK.png`, {responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(bg, "utf-8"));
    let bgBase = await loadImage(path);
    let canvas = createCanvas(bgBase.width, bgBase.height);
    let ctx = canvas.getContext("2d");
    const Canvas = global.nodemodule["canvas"];
    ctx.drawImage(bgBase, 0, 0, canvas.width, canvas.height);
    Canvas.registerFont(__dirname+`/cache/SplineSans-Medium.ttf`, {
        family: "SplineSans-Medium"
    });
    Canvas.registerFont(__dirname+`/cache/SplineSans.ttf`, {
        family: "SplineSans"
    });
    ctx.font = "30px SplineSans-Medium";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";
    ctx.fillText('-' + args[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ', 151, 201);
    ctx.font = "25px SplineSans";
    ctx.fillText(`${content}`, 64, 1080);
    ctx.font = "26px SplineSans-Medium";
    ctx.textAlign = "right";
    ctx.fillText(`${userName}`, 547, 816);
    ctx.fillStyle = "#FF00FF";
    ctx.font = "22px SplineSans-Medium";
    ctx.fillText(`+84${sdt}`, 547, 884);
    ctx.font = "22px SplineSans";
    ctx.textAlign = "start";
    ctx.fillText(codeGD, 279, 240);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "right";
    ctx.font = "22px SplineSans-Medium";
    ctx.fillText('15% TAX', 547, 504);
    ctx.fillText('Ví MoMo', 547, 436);
    ctx.fillText(`${time} - ${day}`, 547, 367);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(path, imageBuffer);
          return api.sendMessage(`[𝐌𝐎𝐌𝐎] - 𝐕𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐜𝐡𝐨̛̀ 𝐛𝐨𝐭 𝐬𝐚𝐮 𝐠𝐢𝐚̂𝐲 𝐥𝐚́𝐭 𝐱𝐮̛̉ 𝐥𝐲́ 𝐠𝐢𝐚𝐨 𝐝𝐢̣𝐜𝐡 💸`, event.threadID, async (err, info) => {
      await new Promise(resolve => setTimeout(resolve, 5 * 1000));
       await Currencies.increaseMoney(mention, parseInt(coins));
      Currencies.decreaseMoney(senderID, parseInt(coins));
      api.unsendMessage(info.messageID)
       var msg =  {body: `[𝐌𝐎𝐌𝐎] - Giao dịch thành công`, attachment: fs.createReadStream(path)
    }
   return api.sendMessage(msg,  threadID, async (error, info) => {
    fs.unlinkSync(path),
        messageID
      })
        })
      }
    } else return api.sendMessage('[𝐌𝐎𝐌𝐎] - 𝐕𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐧𝐡𝐚̣̂𝐩 𝐬𝐨̂́ 𝐜𝐨𝐢𝐧𝐬 𝐦𝐮𝐨̂́𝐧 𝐜𝐡𝐮𝐲𝐞̂̉𝐧 💳',threadID,messageID); 
}
}