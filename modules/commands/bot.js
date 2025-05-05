const chalk = require('chalk');
module.exports.config = {
  name: "bot",
  version: "0.0.1",
  hasPermssion: 1,
  credits: "Adonis",
  description: "xem thông tin về bot",
  commandCategory: "Box Chat",
  usages: "",
  cooldowns: 0
};

const totalPath = __dirname + '/cache/totalChat.json';
const _24hours = 86400000;
const fs = require("fs-extra");
function handleByte(byte) {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let i = 0, usage = parseInt(byte, 10) || 0;

  while(usage >= 1024 && ++i){
    usage = usage/1024;
  }

  return(usage.toFixed(usage < 10 && i > 0 ? 1 : 0) + ' ' + units[i]);
}

function handleOS(ping) {
  var os = require("os");
  var cpus = os.cpus();
  var speed, chips;
  for (var i of cpus) chips = i.model, speed = i.speed;
  if (cpus == undefined) return;
  else return msg = 
  `📌 Ping: ${Date.now() - ping}ms.\n\n`;

}
module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'cache', 'data.json');
    if (!existsSync(path)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}
 console.log(chalk.bold.hex("# 00FF00").bold("--SUCCESFULLY LOADED THE BOT COMMAND--"));
module.exports.run = async function({ api, args, event, Users,handleReply,permssion }) {
  const moment = require("moment-timezone");
  const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH");
    var phut = moment.tz("Asia/Ho_Chi_Minh").format("mm");
    var giay = moment.tz("Asia/Ho_Chi_Minh").format("ss");
  const axios = require("axios")
  const fs = require('fs-extra');
  const request = require('request')
  const picture = (await axios.get(`https://i.imgur.com/npIjPeb.gif`, { responseType: "stream"})).data
  const { threadID, messageID, senderID } = event;
   return api.sendMessage({body: "======= [ 𝐀𝐃𝐌𝐈𝐍 ] =======\n𝟭. 𝗫𝗲𝗺 𝘁𝗵𝗼̂𝗻𝗴 𝘁𝗶𝗻 𝗔𝗱𝗺𝗶𝗻 💳\n𝟮. 𝗫𝗲𝗺 𝘁𝗵𝗼̂𝗻𝗴 𝘁𝗶𝗻 𝘃𝗲̂̀ 𝗕𝗼𝘁 👾\n𝟯. 𝗟𝗼𝗴𝗼𝘂𝘁 𝘁𝗮̀𝗶 𝗸𝗵𝗼𝗮̉𝗻 🖥\n𝟰. 𝗥𝗲𝗹𝗼𝗮𝗱 𝗖𝗼𝗻𝗳𝗶𝗴 ♻️\n𝟱. 𝗥𝗲𝘀𝘁𝗮𝗿𝘁 𝗹𝗮̣𝗶 𝗯𝗼𝘁 🎀\n====[ 𝐐𝐔𝐀̉𝐍 𝐓𝐑𝐈̣ 𝐕𝐈𝐄̂𝐍 ]====\n𝟲. 𝗢𝗻/𝗢𝗳𝗳 𝘁𝗵𝗼̂𝗻𝗴 𝗯𝗮́𝗼 𝗥𝗮𝗻𝗸𝘂𝗽 💌\n𝟳. 𝗢𝗻/𝗢𝗳𝗳 𝗺𝗼𝗱𝗲 𝗤𝗧𝗩 𝗢𝗻𝗹𝘆 🎐\n𝟴\. 𝗢𝗻/𝗢𝗳𝗳 𝗺𝗼𝗱𝗲 𝗔𝗻𝘁𝗶 𝗝𝗼𝗶𝗻 🚫\n𝟵. 𝗢𝗻/𝗢𝗳𝗳 𝗖𝗵𝗼̂́𝗻𝗴 𝗰𝘂̛𝗼̛́𝗽 𝗯𝗼𝘅 🔰\n𝟭𝟬. 𝗢𝗻/𝗢𝗳𝗳 𝗖𝗵𝗼̂́𝗻𝗴 𝗼𝘂𝘁 𝗰𝗵𝘂̀𝗮 🛡\n=====[ 𝐍𝐠𝐮̛𝐨̛̀𝐢 𝐃𝐮̀𝐧𝐠 ]=====\n𝟭𝟭.𝗫𝗲𝗺 𝗹𝗶𝘀𝘁 𝗔𝗱𝗺𝗶𝗻 𝗕𝗼𝘁 🤖\n𝟭𝟮. 𝗫𝗲𝗺 𝗹𝗶𝘀𝘁 𝗾𝘂𝗮̉𝗻 𝘁𝗿𝗶̣ 𝘃𝗶𝗲̂𝗻 𝗯𝗼𝘅 📌\n𝟭𝟯. 𝗫𝗲𝗺 𝘁𝗵𝗼̂𝗻𝗴 𝘁𝗶𝗻 𝗕𝗼𝘅 📱\n---------------------------\n💟 𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐭𝐡𝐞𝐨 𝐬𝐨̂́ 𝐦𝐚̀ 𝐛𝐚̣𝐧 𝐜𝐡𝐨̣𝐧\n",attachment: (picture)
        }, threadID, (error, info) => {
            global.client.handleReply.push({
               name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "choosee",
            })
        }, event.messageID)
}
module.exports.handleReply = async function({
  args, event, Users,Threads, api, handleReply, permssion
}) {
  const { threadID, messageID, senderID } = event;
  switch (handleReply.type) {
    case "choosee": {
      switch (event.body) {
        case "2": {
     const moment = require("moment-timezone");
    const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH");
    var phut = moment.tz("Asia/Ho_Chi_Minh").format("mm");
    var giay = moment.tz("Asia/Ho_Chi_Minh").format("ss");
    const namebot = config.BOTNAME
    const PREFIX = config.PREFIX
    const admin = config.ADMINBOT
    const ndh = config.NDH
    const { commands } = global.client;
    const threadSetting = (await Threads.getData(String(event.threadID))).data || 
    {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX 
    : global.config.PREFIX;
    var ping = Date.now();

    var threadInfo = await api.getThreadInfo(event.threadID);
    var time = process.uptime(),
        hours = Math.floor(time / (60 * 60)),
        minutes = Math.floor((time % (60 * 60)) / 60),
        seconds = Math.floor(time % 60);
   var severInfo = handleOS(ping);
   var msg =`⏰ 𝐁𝐚̂𝐲 𝐠𝐢𝐨̛̀ 𝐥𝐚̀: ${gio} 𝐠𝐢𝐨̛̀ ${phut} 𝐩𝐡𝐮́𝐭 ${giay} 𝐠𝐢𝐚̂𝐲\n👾 𝐓𝐞̂𝐧 𝐁𝐨𝐭: ${namebot}\n⏱ 𝐁𝐨𝐭 𝐡𝐢𝐞̣̂𝐧 𝐨𝐧𝐥𝐢𝐧𝐞:${hours < 10 ? (hours > 0 ? " 0" + hours + " 𝐠𝐢𝐨̛̀" : 
   "") : (hours > 0 ? " " + hours + " 𝐠𝐢𝐨̛̀" : "")} ${minutes < 10 ? (minutes > 0 ? " 0"  + minutes + " 𝐩𝐡𝐮́𝐭" : "") : (minutes > 0 ? " " + minutes + " 𝐩𝐡𝐮́𝐭" : 
 "")}${seconds < 10 ? (seconds > 0 ? " 0" + seconds + " 𝐠𝐢𝐚̂𝐲." : "") : (seconds > 0 ? " " + 
 seconds + " 𝐠𝐢𝐚̂𝐲." : "")}\n----------------------------\n` +
  `👨‍👨‍👧‍👦 𝐓𝐨̂̉𝐧𝐠 𝐍𝐡𝐨́𝐦: ${global.data.allThreadID.length} 𝐧𝐡𝐨́𝐦.\n👥 𝐓𝐨̂̉𝐧𝐠 𝐍𝐠𝐮̛𝐨̛̀𝐢 𝐃𝐮̀𝐧𝐠: ${global.data.allUserID.length} 𝐧𝐠𝐮̛𝐨̛̀𝐢.\n👑 𝐀𝐝𝐦𝐢𝐧 𝐁𝐨𝐭: ${admin.length}.\n👤 𝐍𝐠𝐮̛𝐨̛̀𝐢 𝐡𝐨̂̃ 𝐭𝐫𝐨̛̣ 𝐁𝐨𝐭: ${ndh.length}.\n` + 
`📝 𝐓𝐨̂̉𝐧𝐠 𝐒𝐨̂́ 𝐋𝐞̣̂𝐧𝐡: ${commands.size }\n----------------------------\n`+`🖥 𝐏𝐫𝐞𝐟𝐢𝐱 𝐡𝐞̣̂ 𝐭𝐡𝐨̂́𝐧𝐠: ${PREFIX}\n📲 𝐏𝐫𝐞𝐟𝐢𝐱 𝐁𝐨𝐱: ${prefix}\n${severInfo ? severInfo : `📌 𝐏𝐢𝐧𝐠: 
${Date.now() - ping}ms.\n\n`}`
    return api.sendMessage(msg, event.threadID)
}break;
          case "1": {
          const moment = require("moment-timezone");
    const request = require("request")
    var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
    if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
    let totalChat = JSON.parse(fs.readFileSync(totalPath));
    let threadInfo = await api.getThreadInfo(event.threadID);
    let timeByMS = Date.now();

    var memLength = threadInfo.participantIDs.length;
    let threadMem = threadInfo.participantIDs.length;
    var nameMen = [];
    var gendernam = [];
    var gendernu = [];
    var nope = [];
    for (let z in threadInfo.userInfo) {
      var gioitinhone = threadInfo.userInfo[z].gender;
      var nName = threadInfo.userInfo[z].name;
      if (gioitinhone == "MALE") {
        gendernam.push(z + gioitinhone)
      } else if (gioitinhone == "FEMALE") {
        gendernu.push(gioitinhone)
      } else {
        nope.push(nName)
      }
    };
    var nam = gendernam.length;
    var nu = gendernu.length;
    let qtv = threadInfo.adminIDs.length;
    let sl = threadInfo.messageCount;
    let u = threadInfo.nicknames;
    let icon = threadInfo.emoji;

    let threadName = threadInfo.threadName;
    let id = threadInfo.threadID;
    let sex = threadInfo.approvalMode;
    var pd = sex == false ? '𝐭𝐚̆́𝐭' : sex == true ? '𝐛𝐚̣̂𝐭' : 'Kh';


    if (!totalChat[event.threadID]) {
      totalChat[event.threadID] = {
        time: timeByMS,
        count: sl,
        ytd: 0
      }
      fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
    }

    let mdtt = "𝗖𝗵𝘂̛𝗮 𝗰𝗼́ 𝘁𝗵𝗼̂́𝗻𝗴 𝗸𝗲̂";
    let preCount = totalChat[event.threadID].count || 0;
    let ytd = totalChat[event.threadID].ytd || 0;
    let hnay = (ytd != 0) ? (sl - preCount) : "𝗖𝗵𝘂̛𝗮 𝗰𝗼́ 𝘁𝗵𝗼̂́𝗻𝗴 𝗸𝗲̂";
    let hqua = (ytd != 0) ? ytd : "𝗖𝗵𝘂̛𝗮 𝗰𝗼́ 𝘁𝗵𝗼̂́𝗻𝗴 𝗸𝗲̂";
    if (timeByMS - totalChat[event.threadID].time > _24hours) {
      if (timeByMS - totalChat[event.threadID].time > (_24hours * 2)) {
        totalChat[event.threadID].count = sl;
        totalChat[event.threadID].time = timeByMS - _24hours;
        totalChat[event.threadID].ytd = sl - preCount;
        fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
      }
      getHour = Math.ceil((timeByMS - totalChat[event.threadID].time - _24hours) / 3600000);
      if (ytd == 0) mdtt = 100;
      else mdtt = ((((hnay) / ((hqua / 24) * getHour))) * 100).toFixed(0);
      mdtt += "%";
    }
    api.unsendMessage(handleReply.messageID);
    var callback = () =>
      api.sendMessage({
        body: ` 𝐀𝐃𝐌𝐈𝐍 𝐁𝐎𝐓 `,
    attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => 
    fs.unlinkSync(__dirname + "/cache/1.png"));  
      return request(
        encodeURI(`https://www.facebook.com/100076346311876/posts/pfbid0c5erpCDPfQoNBDCeS2CjtgENNgepSp5Gvg9VBqeXHchHV3KP1NP5X6k4Phvkpxftl/?app=fbl`)).pipe(
fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
  }break;
        case "13": {
          const moment = require("moment-timezone");
    const request = require("request")
    var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
    if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
    let totalChat = JSON.parse(fs.readFileSync(totalPath));
    let threadInfo = await api.getThreadInfo(event.threadID);
    let timeByMS = Date.now();

    var memLength = threadInfo.participantIDs.length;
    let threadMem = threadInfo.participantIDs.length;
    var nameMen = [];
    var gendernam = [];
    var gendernu = [];
    var nope = [];
    for (let z in threadInfo.userInfo) {
      var gioitinhone = threadInfo.userInfo[z].gender;
      var nName = threadInfo.userInfo[z].name;
      if (gioitinhone == "MALE") {
        gendernam.push(z + gioitinhone)
      } else if (gioitinhone == "FEMALE") {
        gendernu.push(gioitinhone)
      } else {
        nope.push(nName)
      }
    };
    var nam = gendernam.length;
    var nu = gendernu.length;
    let qtv = threadInfo.adminIDs.length;
    let sl = threadInfo.messageCount;
    let u = threadInfo.nicknames;
    let icon = threadInfo.emoji;

    let threadName = threadInfo.threadName;
    let id = threadInfo.threadID;
    let sex = threadInfo.approvalMode;
    var pd = sex == false ? '𝐭𝐚̆́𝐭' : sex == true ? '𝐛𝐚̣̂𝐭' : 'Kh';


    if (!totalChat[event.threadID]) {
      totalChat[event.threadID] = {
        time: timeByMS,
        count: sl,
        ytd: 0
      }
      fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
    }

    let mdtt = "𝗖𝗵𝘂̛𝗮 𝗰𝗼́ 𝘁𝗵𝗼̂́𝗻𝗴 𝗸𝗲̂";
    let preCount = totalChat[event.threadID].count || 0;
    let ytd = totalChat[event.threadID].ytd || 0;
    let hnay = (ytd != 0) ? (sl - preCount) : "𝗖𝗵𝘂̛𝗮 𝗰𝗼́ 𝘁𝗵𝗼̂́𝗻𝗴 𝗸𝗲̂";
    let hqua = (ytd != 0) ? ytd : "𝗖𝗵𝘂̛𝗮 𝗰𝗼́ 𝘁𝗵𝗼̂́𝗻𝗴 𝗸𝗲̂";
    if (timeByMS - totalChat[event.threadID].time > _24hours) {
      if (timeByMS - totalChat[event.threadID].time > (_24hours * 2)) {
        totalChat[event.threadID].count = sl;
        totalChat[event.threadID].time = timeByMS - _24hours;
        totalChat[event.threadID].ytd = sl - preCount;
        fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
      }
      getHour = Math.ceil((timeByMS - totalChat[event.threadID].time - _24hours) / 3600000);
      if (ytd == 0) mdtt = 100;
      else mdtt = ((((hnay) / ((hqua / 24) * getHour))) * 100).toFixed(0);
      mdtt += "%";
    }
    api.unsendMessage(handleReply.messageID);
    var callback = () =>
      api.sendMessage({
        body: `⭐️ 𝐁𝐨𝐱: ${threadName}\n🎮 𝐈𝐃 𝐁𝐨𝐱: ${id}\n📱 𝐏𝐡𝐞̂ 𝐝𝐮𝐲𝐞̣̂𝐭: ${pd}\n🐰 𝐄𝐦𝐨𝐣𝐢: ${icon}\n📌 𝐓𝐡𝐨̂𝐧𝐠 𝐭𝐢𝐧: ${threadMem} 𝐭𝐡𝐚̀𝐧𝐡 𝐯𝐢𝐞̂𝐧\n𝐒𝐨̂́ 𝐭𝐯 𝐧𝐚𝐦 🧑‍🦰: ${nam} 𝐭𝐡𝐚̀𝐧𝐡 𝐯𝐢𝐞̂𝐧\n𝐒𝐨̂́ 𝐭𝐯 𝐧𝐮̛̃ 👩‍🦰: ${nu} 𝐭𝐡𝐚̀𝐧𝐡 𝐯𝐢𝐞̂𝐧\n🕵️‍♂️ 𝐆𝐨̂̀𝐦 ${qtv} 𝐪𝐮𝐚̉𝐧 𝐭𝐫𝐢̣ 𝐯𝐢𝐞̂𝐧\n💬 𝐓𝐨̂̉𝐧𝐠: ${sl} 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧\n📈 𝐌𝐮̛́𝐜 𝐭𝐮̛𝐨̛𝐧𝐠 𝐭𝐚́𝐜: ${mdtt}\n🌟 𝐓𝐨̂̉𝐧𝐠 𝐬𝐨̂́ 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐡𝐨̂𝐦 𝐪𝐮𝐚: ${hqua}\n🌟 𝐓𝐨̂̉𝐧𝐠 𝐬𝐨̂́ 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐡𝐨̂𝐦 𝐧𝐚𝐲: ${hnay}\n      === 「${timeNow}」 ===`,
        attachment: fs.createReadStream(__dirname + '/cache/box.png')
      },
        threadID,
        () => fs.unlinkSync(__dirname + '/cache/box.png')
      );
    return request(encodeURI(`${threadInfo.imageSrc}`))
      .pipe(fs.createWriteStream(__dirname + '/cache/box.png'))
      .on('close', () => callback());
  }break;
        case "3": {
   const listAdmin = global.config.ADMINBOT[0];
    if (senderID != listAdmin) return api.sendMessage("𝗖𝘂́𝘁 𝗺𝗲̣ 𝗺𝗮̀𝘆 𝗻𝗵𝗮𝗻𝗵, 𝗽𝗵𝗮́ 𝗰𝗼𝗻 𝗰𝗮̣̆𝗰 👊", threadID, messageID);
api.sendMessage("𝐒𝐢𝐠𝐧 𝐨𝐮𝐭 𝐨𝐟 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤...",event.threadID,event.messageID)
api.logout()
        }break;
          //// reload config///
        case "4": {
          const listAdmin = global.config.ADMINBOT[0];
    if (senderID != listAdmin) return api.sendMessage("𝗖𝘂́𝘁 𝗺𝗲̣ 𝗺𝗮̀𝘆 𝗻𝗵𝗮𝗻𝗵, 𝗽𝗵𝗮́ 𝗰𝗼𝗻 𝗰𝗮̣̆𝗰 👊", threadID, messageID);
          delete require.cache[require.resolve(global.client.configPath)];
global.config = require(global.client.configPath);
return api.sendMessage("𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐫𝐞𝐥𝐨𝐚𝐝𝐞𝐝 𝐜𝐨𝐧𝐟𝐢𝐠.𝐣𝐬𝐨𝐧", event.threadID, event.messageID);    
}break;
          ///// end

          /// admin only ///
        case "5": {
          if (event.senderID != 1091264685) return api.sendMessage(`» 𝐌𝐚̀𝐲 𝐓𝐮𝐨̂̉𝐢 𝐂𝐚̣̆𝐜 𝐆𝐢̀ 𝐌𝐚̀ 𝐗𝐚̀𝐢 😏`, event.threadID, event.messageID)
           const { threadID, messageID } = event;
  return api.sendMessage(`𝗥𝗲𝘀𝘁𝗮𝗿𝘁 𝗹𝗮̣𝗶 𝗯𝗼𝘁 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 💋`, threadID, () => process.exit(1));
        }break;
          ///end

          //admin box only
        case "7": {
        const { writeFileSync } = global.nodemodule["fs-extra"];
        const { resolve } = require("path");
        const pathData = resolve(__dirname, 'cache', 'data.json');
        const database = require(pathData);
        const { adminbox } = database;  
        if (adminbox[threadID] == true) {
            adminbox[threadID] = false;
            api.sendMessage("[ 𝐌𝐎𝐃𝐄 ] » 𝐓𝐚̆́𝐭 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐦𝐨𝐝𝐞 𝐪𝐮𝐚̉𝐧 𝐭𝐫𝐢̣ 𝐯𝐢𝐞̂𝐧 𝐨𝐧𝐥𝐲 𝐜𝐡𝐢̉ 𝐪𝐮𝐚̉𝐧 𝐭𝐫𝐢̣ 𝐯𝐢𝐞̂𝐧 𝐦𝐨̛́𝐢 𝐜𝐨́ 𝐭𝐡𝐞̂̉ 𝐬𝐮̛̉ 𝐝𝐮̣𝐧𝐠 𝐛𝐨𝐭 🎀", threadID, messageID);
        } else {
            api.sendMessage("[ 𝐌𝐎𝐃𝐄 ] » 𝐁𝐚̣̂𝐭 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐦𝐨𝐝𝐞 𝐪𝐮𝐚̉𝐧 𝐭𝐫𝐢̣ 𝐯𝐢𝐞̂𝐧 𝐨𝐧𝐥𝐲 𝐜𝐡𝐢̉ 𝐪𝐮𝐚̉𝐧 𝐭𝐫𝐢̣ 𝐯𝐢𝐞̂𝐧 𝐦𝐨̛́𝐢 𝐜𝐨́ 𝐭𝐡𝐞̂̉ 𝐬𝐮̛̉ 𝐝𝐮̣𝐧𝐠 𝐛𝐨𝐭 🎀", threadID, messageID);
            adminbox[threadID] = true;
        }
        writeFileSync(pathData, JSON.stringify(database, null, 4));
    }break;
        ////end

        case "6": {
            const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;

  if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
  else data["rankup"] = false;
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`𝗞𝗶́𝗰𝗵 𝗵𝗼𝗮̣𝘁 ${(data["rankup"] == true) ? "𝐛𝐚̣̂𝐭" : "𝐭𝐚̆́𝐭"} 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝘁𝗵𝗼̂𝗻𝗴 𝗯𝗮́𝗼 𝗿𝗮𝗻𝗸𝘂𝗽 ✔️`, event.threadID);
                break;
              }
        case "8": {
            const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
      return api.sendMessage('» 𝐁𝐨𝐭 𝐜𝐚̂̀𝐧 𝐪𝐮𝐲𝐞̂̀𝐧 𝐪𝐮𝐚̉𝐧 𝐭𝐫𝐢̣ 𝐯𝐢𝐞̂𝐧 𝐧𝐡𝐨́𝐦 💕', event.threadID, event.messageID);
    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data.newMember == "undefined" || data.newMember == false) data.newMember = true;
    else data.newMember = false;
    await Threads.setData(event.threadID, { data });
      global.data.threadData.set(parseInt(event.threadID), data);
    return api.sendMessage(`𝗞𝗶́𝗰𝗵 𝗵𝗼𝗮̣𝘁 ${(data.newMember == true) ? "𝐛𝐚̣̂𝐭" : "𝐭𝐚̆́𝐭"} 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐜𝐚̂́𝐦 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐝𝐮̀𝐧𝐠 𝐯𝐚̀𝐨 𝐛𝐨𝐱 ✔️`, event.threadID, event.messageID);
}break;
        case "9": {
            const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
      return api.sendMessage('» 𝐁𝐨𝐭 𝐜𝐚̂̀𝐧 𝐪𝐮𝐲𝐞̂̀𝐧 𝐪𝐮𝐚̉𝐧 𝐭𝐫𝐢̣ 𝐯𝐢𝐞̂𝐧 𝐧𝐡𝐨́𝐦 💕', event.threadID, event.messageID);
    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["guard"] == "guard" || data["guard"] == false) data["guard"] = true;
    else data["guard"] = false;
    await Threads.setData(event.threadID, { data });
      global.data.threadData.set(parseInt(event.threadID), data);
    return api.sendMessage(`𝗞𝗶́𝗰𝗵 𝗵𝗼𝗮̣𝘁 ${(data["guard"] == true) ? "𝐛𝐚̣̂𝐭" : "𝐭𝐚̆́𝐭"} 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝗰𝗵𝗼̂́𝗻𝗴 𝗰𝘂̛𝗼̛́𝗽 𝗯𝗼𝘅 ✔️`, event.threadID, event.messageID);
}break;
        case "10": {
           var info = await api.getThreadInfo(event.threadID);
 let data = (await Threads.getData(event.threadID)).data || {};
 if (typeof data["antiout"] == "undefined" || data["antiout"] == false) data["antiout"] = true;
 else data["antiout"] = false;
 await Threads.setData(event.threadID, { data });
 global.data.threadData.set(parseInt(event.threadID), data);
 return api.sendMessage(`𝗞𝗶́𝗰𝗵 𝗵𝗼𝗮̣𝘁 ${(data["antiout"] == true) ? "𝐛𝐚̣̂𝐭" : "𝐭𝐚̆́𝐭"} 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝗰𝗮̂́𝗺 𝗼𝘂𝘁 𝗰𝗵𝘂̀𝗮 ✔️`, event.threadID);

}break;
        case "11": {
  const { ADMINBOT } = global.config;
   listAdmin = ADMINBOT || config.ADMINBOT ||  [];
    var msg = [];
    for (const idAdmin of listAdmin) {
        if (parseInt(idAdmin)) {
          const name = (await Users.getData(idAdmin)).name
            msg.push(`»  ${name}\nLink: fb.me/${idAdmin} 💌`);              
        }
    }
   return api.sendMessage(`======〘『 𝐀𝐃𝐌𝐈𝐍 』〙======\n${msg.join("\n")}\n`, event.threadID, event.messageID);
}break;
        case "12": {
    var threadInfo = await api.getThreadInfo(event.threadID);
    let qtv = threadInfo.adminIDs.length;
    var listad = '';
    var qtv2 = threadInfo.adminIDs;
    dem = 1;
    for (let i = 0; i < qtv2.length; i++) {
        const info = (await api.getUserInfo(qtv2[i].id));
        const name = info[qtv2[i].id].name;
        listad += '' + `${dem++}` + '. ' + name + '\n';
    }

    api.sendMessage(
        `📜 𝐃𝐚𝐧𝐡 𝐬𝐚́𝐜𝐡 ${qtv} 𝐪𝐮𝐚̉𝐧 𝐭𝐫𝐢̣ 𝐯𝐢𝐞̂𝐧 𝐠𝐨̂̀𝐦:\n${listad}`,event.threadID,event.messageID)

}break;




         }
      }
    }
  }



module.exports.handleEvent = async ({ api, event }) => {
  if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
  let totalChat = JSON.parse(fs.readFileSync(totalPath));
  if (!totalChat[event.threadID]) return;
  if (Date.now() - totalChat[event.threadID].time > (_24hours * 2)) {
    let sl = (await api.getThreadInfo(event.threadID)).messageCount;
    totalChat[event.threadID] = {
      time: Date.now() - _24hours,
      count: sl,
      ytd: sl - totalChat[event.threadID].count
    }
    fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
  }
}
