module.exports.config = {
  name: "mv",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TPK",
  description: "xem ảnh hiện có trên bot",
  commandCategory: "nsfw",
  usages: "mv",
  cooldowns: 2,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
}
module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirMaterial = __dirname + `/cache/`;
    if (!fs.existsSync(dirMaterial + "cache")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "mv.gif")) request("https://i.imgur.com/Fy8ZscG.gif").pipe(fs.createWriteStream(dirMaterial + "mv.gif"));
}

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies,getText}) => {
const fs = require("fs");
   const axios = require('axios');
    const request = require('request');

     if (args.length == 0) return api.sendMessage({body: `==== 𝗗𝗦 𝗩𝗜𝗗𝗘𝗢 ==== \n━━━━━━━━━━━━━━━━━━\n𝟏. 𝗠𝘃 𝗴𝗮́𝗶 ❤️\n𝟐. 𝗠𝘃 𝘁𝗶𝗸𝘁𝗼𝗸 💜\n𝟑. 𝗠𝘃 𝘀𝗲𝘅 💚\n𝟰. 𝗠𝘃 𝘁𝗿𝗮𝗶 💓\n𝟱. 𝗠𝘃 𝗮𝗻𝗶𝗺𝗲 💞\n𝟲. 𝗠𝘃 𝗻𝘂̛̃ 𝗮́𝗼 𝗱𝗮̀𝗶 🍄\n𝟳. 𝗠𝘃 𝗺𝘂𝘀𝗶𝗰 💗\n𝟴. 𝗠𝘃 𝗯𝗮̂̀𝘂 𝘁𝗿𝗼̛̀𝗶 🌸\n𝟵. 𝗠𝘃 𝗱𝗼𝗿𝗮𝗲𝗺𝗼𝗻 🌺━━━━━━━━━━━━━━━━━━\n𝗗𝘂̀𝗻𝗴 /𝗺𝘃 + 𝘁𝗲̂𝗻 ( 𝘃𝗶𝗱𝗲𝗼 𝗯𝗮̣𝗻 𝗺𝘂𝗼̂́𝗻 𝘅𝗲𝗺 )\n
`,attachment: fs.createReadStream(__dirname + `/cache/mv.gif`)}, event.threadID, event.messageID);

     if (args[0] == "gái") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 100) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vdgai').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `💞 𝗩𝗶𝗱𝗲𝗼 𝗴𝗮́𝗶 𝘅𝗶𝗻𝗵 𝗻𝗲̀\n-1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
  if (args[0] == "tiktok") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 1000) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vdgai').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `📱 𝗩𝗶𝗱𝗲𝗼 𝘁𝗶𝗸𝘁𝗼𝗸 𝗻𝗲̀\n -1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
    if (args[0] == "sex") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 1000) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vdsex').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `🎊 𝗩𝗶𝗱𝗲𝗼 𝘀𝗲𝘅 𝗻𝗲̀\n -1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
  if (args[0] == "trai") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 1000) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vdtrai').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `🌺 𝗩𝗶𝗱𝗲𝗼 𝗧𝗿𝗮𝗶 𝗻𝗲̀\n -1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
  if (args[0] == "anime") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 1000) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vdanime').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `🌸 𝗩𝗶𝗱𝗲𝗼 𝗮𝗻𝗶𝗺𝗲 𝗻𝗲̀\n -1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
  if (args[0] == "nuaodai") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 1000) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vdnuaodai').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `🌐 𝗩𝗶𝗱𝗲𝗼 𝗻𝘂̛̃ 𝗮́𝗼 𝗱𝗮̀𝗶 𝗻𝗲̀\n -1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
  if (args[0] == "music") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 1000) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vdmschil').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `🎼 𝗩𝗶𝗱𝗲𝗼 𝗺𝘂𝘀𝗶𝗰 𝗻𝗲̀\n -1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
  if (args[0] == "bautroi") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 1000) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vdbautroi').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `🌄 𝗩𝗶𝗱𝗲𝗼 𝗯𝗮̂̀𝘂 𝘁𝗿𝗼̛̀𝗶 𝗻𝗲̀\n -1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
  if (args[0] == "doremon") {
  var money = (await Currencies.getData(event.senderID)).money
  if (money >= 1000) {
  axios.get('https://Api-TaoTPk.trankhuong2022.repl.co/image/vddoraemon').then(res => {
  var video = res.data.url;
  let callback = function () {
          api.sendMessage({
            body: `📺 𝗩𝗶𝗱𝗲𝗼 𝗱𝗼𝗿𝗮𝗲𝗺𝗼𝗻 𝗻𝗲̀\n -1000 đô💸`,
            attachment: fs.createReadStream(__dirname + `/cache/boobs.mp4`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/boobs.mp4`), event.messageID);
        };
        request(video).pipe(fs.createWriteStream(__dirname + `/cache/boobs.mp4`)).on("close", callback);
        Currencies.setData(event.senderID, options = {money: money - 1000})
      })
  } else return api.sendMessage("Bạn cần 1000 đô",event.threadID,event.messageID);
  }
                                                                                                }