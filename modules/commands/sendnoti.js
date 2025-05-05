const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "sendnoti",
    version: "3.0.1",
    hasPermssion: 2,
    credits: "hphong",
    description: "send tin nhắn + video từ admin ",
    commandCategory: "Tiện ích",
    usages: "[msg]",
    cooldowns: 5,
}

let atmDir = [];

const getAtm = (atm, body) => new Promise(async (resolve) => {
    let msg = {}, attachment = [];
    msg.body = body;
    for(let eachAtm of atm) {
        await new Promise(async (resolve) => {
            try {
                let response =  await request.get(eachAtm.url),
                    pathName = response.uri.pathname,
                    ext = pathName.substring(pathName.lastIndexOf(".") + 1),
                    path = __dirname + `/cache/${eachAtm.filename}.${ext}`
                response
                    .pipe(fs.createWriteStream(path))
                    .on("close", () => {
                        attachment.push(fs.createReadStream(path));
                        atmDir.push(path);
                        resolve();
                    })
            } catch(e) { console.log(e); }
        })
    }
    msg.attachment = attachment;
    resolve(msg);
})

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads }) {
    const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, body } = event;
    let name = await Users.getNameUser(senderID);
    switch (handleReply.type) {
        case "sendnoti": {
            let text = `====== [ 𝗣𝗵𝗮̉𝗻 𝗵𝗼̂̀𝗶 𝘁𝘂̛̀ 𝗨𝘀𝗲𝗿 ] ======\n━━━━━━━━━━━━━━━━━━\n『⏱』𝐓𝐢𝐦𝐞: ${gio}\n『📝』𝐍𝐨̣̂𝐢 𝐝𝐮𝐧𝐠: ${body}\n『📩』𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐮̛̀ 𝐔𝐬𝐞𝐫: ${name}  𝒕𝒓𝒐𝒏𝒈 𝒏𝒉𝒐́𝒎 ${(await Threads.getInfo(threadID)).threadName || "Unknow"}\n━━━━━━━━━━━━━━━━\n»『💬』𝐑𝐞𝐩𝐥𝐲 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐦𝐮𝐨̂́𝐧 𝐩𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐨̛́𝐢 𝐔𝐬𝐞𝐫`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `====== [ 𝗣𝗵𝗮̉𝗻 𝗵𝗼̂̀𝗶 𝘁𝘂̛̀ 𝗨𝘀𝗲𝗿 ] ======\n━━━━━━━━━━━━━━━━━━\n『⏱』𝐓𝐢𝐦𝐞: ${gio}\n『📝』𝐍𝐨̣̂𝐢 𝐝𝐮𝐧𝐠: ${body}\n『📩』𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐮̛̀ 𝐔𝐬𝐞𝐫: ${name}  𝒕𝒓𝒐𝒏𝒈 𝒏𝒉𝒐́𝒎 ${(await Threads.getInfo(threadID)).threadName || "Unknow"}\n━━━━━━━━━━━━━━━━\n»『💬』𝐑𝐞𝐩𝐥𝐲 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐦𝐮𝐨̂́𝐧 𝐩𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐨̛́𝐢 𝐔𝐬𝐞𝐫`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                })
            });
            break;
        }
        case "reply": {
            let text = `==== [ 𝑷𝒉𝒂̉𝒏 𝒉𝒐̂̀𝒊 𝒕𝒖̛̀ 𝑨𝑫𝑴𝑰𝑵 ] ====\n━━━━━━━━━━━━━━━━━━\n『⏱』𝐓𝐢𝐦𝐞: ${gio}\n『📝』𝐍𝐨̣̂𝐢 𝐝𝐮𝐧𝐠: ${body}\n『📩』𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐮̛̀ 𝐀𝐝𝐦𝐢𝐧: ${name} 𝑪𝒖𝒕𝒊𝒆\n━━━━━━━━━━━━━━━━\n» » 𝐑𝐞𝐩𝐥𝐲 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐦𝐮𝐨̂́𝐧 𝐩𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐯𝐞̂̀ 𝐀𝐝𝐦𝐢𝐧 💬`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `==== [ 𝑷𝒉𝒂̉𝒏 𝒉𝒐̂̀𝒊 𝒕𝒖̛̀ 𝑨𝑫𝑴𝑰𝑵 ] ====\n━━━━━━━━━━━━━━━━━━\n『⏱』𝐓𝐢𝐦𝐞: ${gio}\n『📝』𝐍𝐨̣̂𝐢 𝐝𝐮𝐧𝐠: ${body}\n『📩』𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐮̛̀ 𝐀𝐝𝐦𝐢𝐧: ${name} 𝑪𝒖𝒕𝒊𝒆\n━━━━━━━━━━━━━━━━\n» » 𝐑𝐞𝐩𝐥𝐲 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐦𝐮𝐨̂́𝐧 𝐩𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐯𝐞̂̀ 𝐀𝐝𝐦𝐢𝐧 💬`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "sendnoti",
                    messageID: info.messageID,
                    threadID
                })
            }, handleReply.messID);
            break;
        }
    }
}

module.exports.run = async function ({ api, event, args, Users }) {
    const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, messageReply } = event;
    if (!args[0]) return api.sendMessage("Please input message", threadID);
    let allThread = global.data.allThreadID || [];
    let can = 0, canNot = 0;
    let text = `» 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 𝗔𝗗𝗠𝗜𝗡 «\n━━━━━━━━━━━━━━━━━━\n『⏰』𝗧𝗶𝗺𝗲: ${gio}\n『📝』𝗡𝗼̣̂𝗶 𝗱𝘂𝗻𝗴: ${args.join(" ")}\n『👤』𝗧𝘂̛̀ 𝗔𝗗𝗠𝗜𝗡: ${await Users.getNameUser(senderID)} \n━━━━━━━━━━━━━━━━━━\n『💬』𝗥𝗲𝗽𝗹𝘆 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗮̀𝘆 𝗻𝗲̂́𝘂 𝗺𝘂𝗼̂́𝗻 ( 𝗽𝗵𝗮̉𝗻 𝗵𝗼̂̀𝗶 ) 𝘃𝗲̀ 𝗔𝗗𝗠𝗜𝗡 💞`;
    if(event.type == "message_reply") text = await getAtm(messageReply.attachments, `» 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 𝗔𝗗𝗠𝗜𝗡 «\n━━━━━━━━━━━━━━━━━━\n『⏰』𝗧𝗶𝗺𝗲: ${gio}\n『📝』𝗡𝗼̣̂𝗶 𝗱𝘂𝗻𝗴: ${args.join(" ")}\n『👤』𝗧𝘂̛̀ 𝗔𝗗𝗠𝗜𝗡: ${await Users.getNameUser(senderID)} \n━━━━━━━━━━━━━━━━━━\n『💬』𝗥𝗲𝗽𝗹𝘆 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗮̀𝘆 𝗻𝗲̂́𝘂 𝗺𝘂𝗼̂́𝗻 ( 𝗽𝗵𝗮̉𝗻 𝗵𝗼̂̀𝗶 ) 𝘃𝗲̀ 𝗔𝗗𝗠𝗜𝗡 💞`);
    await new Promise(resolve => {
        allThread.forEach((each) => {
            try {
                api.sendMessage(text, each, (err, info) => {
                    if(err) { canNot++; }
                    else {
                        can++;
                        atmDir.forEach(each => fs.unlinkSync(each))
                        atmDir = [];
                        global.client.handleReply.push({
                            name: this.config.name,
                            type: "sendnoti",
                            messageID: info.messageID,
                            messID: messageID,
                            threadID
                        })
                        resolve();
                    }
                })
            } catch(e) { console.log(e) }
        })
    })
    api.sendMessage(`✅ 𝐆𝐮̛̉𝐢 𝐭𝐡𝐨̂𝐧𝐠 𝐛𝐚́𝐨 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐭𝐨̛́𝐢 ${can} 𝐧𝐡𝐨́𝐦, ❌ 𝐊𝐡𝐨̂𝐧𝐠 𝐭𝐡𝐞̂̉ 𝐠𝐮̛̉𝐢 𝐭𝐡𝐨̂𝐧𝐠 𝐛𝐚́𝐨 𝐭𝐨̛́𝐢 ${canNot} 𝐧𝐡𝐨́𝐦`, threadID);
  }