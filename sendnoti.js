const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports.config = {
    name: "sendnoti",
    version: "3.1.0",
    hasPermssion: 2,
    credits: "pcoder",
    description: "Gửi tin nhắn + media từ admin tới toàn bộ nhóm, hỗ trợ phản hồi qua reply",
    commandCategory: "Tiện ích",
    usages: "[msg]",
    cooldowns: 5,
};

let atmDir = [];

/** 
 * Tải file đính kèm về cache, trả về mảng fs.ReadStream 
 * @param {Array} atm - Danh sách attachment từ event.attachments
 * @param {String} body - Nội dung đi kèm
 */
const getAtm = async (atm, body) => {
    let msg = { body }, attachment = [];
    for (let eachAtm of atm) {
        try {
            const url = eachAtm.url;
            const filename = eachAtm.filename || "attachment";
            const ext = path.extname(url.split("?")[0]) || ".dat";
            const savePath = path.join(__dirname, "cache", `${filename}${ext}`);
            const response = await axios.get(url, { responseType: 'stream' });
            await new Promise((res, rej) => {
                const writer = fs.createWriteStream(savePath);
                response.data.pipe(writer);
                writer.on('finish', res);
                writer.on('error', rej);
            });
            attachment.push(fs.createReadStream(savePath));
            atmDir.push(savePath);
        } catch (e) {
            console.log("Lỗi tải file đính kèm:", e);
        }
    }
    msg.attachment = attachment;
    return msg;
};

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads }) {
    const moment = require("moment-timezone");
    const gio = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:ss");
    const { threadID, messageID, senderID, body } = event;
    let name = await Users.getNameUser(senderID);
    switch (handleReply.type) {
        case "sendnoti": {
            let text = `====== [ 𝗣𝗵𝗮̉𝗻 𝗵𝗼̂̀𝗶 𝘁𝘂̛̀ 𝗨𝘀𝗲𝗿 ] ======\n━━━━━━━━━━━━━━━━━━\n『⏱』𝐓𝐢𝐦𝐞: ${gio}\n『📝』𝐍𝐼̣̂𝐧𝐠: ${body}\n『📩』𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐮̛̀ 𝐔𝐬𝐞𝐫: ${name}  𝒕𝒓𝒐𝒏𝒈 𝒏𝒉𝒐́𝒎 ${(await Threads.getInfo(threadID)).threadName || "Unknown"}\n━━━━━━━━━━━━━━━━\n»『💬』𝐑𝐞𝐩𝐥𝐲 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐦𝐮𝐨̂́𝐧 𝐩𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐨̛́𝐢 𝐔𝐬𝐞𝐫`;
            let sendMsg = text;
            if (event.attachments && event.attachments.length > 0)
                sendMsg = await getAtm(event.attachments, text);
            api.sendMessage(sendMsg, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.existsSync(each) && fs.unlinkSync(each));
                atmDir = [];
                global.client.handleReply.push({
                    name: module.exports.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                });
            });
            break;
        }
        case "reply": {
            let text = `==== [ 𝑷𝒉𝒂̉𝒏 𝒉𝒐̂̀𝒊 𝒕𝒖̛̀ 𝑨𝑫𝑴𝑰𝑵 ] ====\n━━━━━━━━━━━━━━━━━━\n『⏱』𝐓𝐢𝐦𝐞: ${gio}\n『📝』𝐍𝐨̣̂𝐢 𝐝𝐮𝐧𝐠: ${body}\n『📩』𝐏𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐭𝐮̛̀ 𝐀𝐝𝐦𝐢𝐧: ${name}\n━━━━━━━━━━━━━━━━\n» » 𝐑𝐞𝐩𝐥𝐲 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐦𝐮𝐨̂́𝐧 𝐩𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢 𝐯𝐞̂̀ 𝐀𝐝𝐦𝐢𝐧 💬`;
            let sendMsg = text;
            if (event.attachments && event.attachments.length > 0)
                sendMsg = await getAtm(event.attachments, text);
            api.sendMessage(sendMsg, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.existsSync(each) && fs.unlinkSync(each));
                atmDir = [];
                global.client.handleReply.push({
                    name: module.exports.config.name,
                    type: "sendnoti",
                    messageID: info.messageID,
                    threadID
                });
            }, handleReply.messID);
            break;
        }
    }
};

module.exports.run = async function ({ api, event, args, Users }) {
    const moment = require("moment-timezone");
    const gio = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:ss");
    const { threadID, messageID, senderID, messageReply } = event;

    if (!args[0] && !(event.type == "message_reply" && messageReply && messageReply.attachments && messageReply.attachments.length)) {
        return api.sendMessage("⚠️ Vui lòng nhập nội dung hoặc reply 1 media để gửi thông báo!", threadID);
    }

    let allThread = global.data.allThreadID || [];
    let can = 0, canNot = 0;

    let text = `» 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 𝗔𝗗𝗠𝗜𝗡 «\n━━━━━━━━━━━━━━━━━━\n『⏰』𝗧𝗶𝗺𝗲: ${gio}\n『📝』𝗡𝗼̣̂𝗶 𝗱𝘂𝗻𝗴: ${args.join(" ")}\n『👤』𝗧𝘂̛̀ 𝗔𝗗𝗠𝗜𝗡: ${await Users.getNameUser(senderID)} \n━━━━━━━━━━━━━━━━━━\n『💬』𝗥𝗲𝗽𝗹𝘆 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗮̀𝘆 𝗻𝗲̂́𝘂 𝗺𝘂𝗼̂́𝗻 ( 𝗽𝗵𝗮̉𝗻 𝗵𝗼̂̀𝗶 ) 𝘃𝗲̀ 𝗔𝗗𝗠𝗜𝗡 💞`;

    let sendMsg = text;
    if (event.type == "message_reply" && messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        sendMsg = await getAtm(messageReply.attachments, text);
    }

    for (const each of allThread) {
        try {
            await api.sendMessage(sendMsg, each, (err, info) => {
                if (err) canNot++;
                else {
                    can++;
                    atmDir.forEach(each => fs.existsSync(each) && fs.unlinkSync(each));
                    atmDir = [];
                    global.client.handleReply.push({
                        name: module.exports.config.name,
                        type: "sendnoti",
                        messageID: info.messageID,
                        messID: messageID,
                        threadID: each
                    });
                }
            });
        } catch (e) {
            canNot++;
        }
    }
    api.sendMessage(`✅ Đã gửi thông báo thành công tới ${can} nhóm.\n❌ Không gửi được tới ${canNot} nhóm.`, threadID);
};
