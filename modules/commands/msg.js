module.exports.config = {
    name: "savemsg",
    version: "1.0.2",
    hasPermssion: 2,
    credits: "MintDaL",
    description: "Lưu lịch sử tin nhắn nhưng mà bằng file",
    commandCategory: "Tiện ích",
    usages: "",
    cooldowns: 5
};

let pathJson = __dirname + '/../commands/hethong/savemessage';
const fs = require('fs-extra');
const moment = require('moment-timezone');

module.exports.onLoad = async ({ api, event }) => {
    if (!fs.existsSync(pathJson)) fs.mkdirSync(pathJson, { recursive: true });
}

module.exports.handleEvent = async ({ api, event,Users }) => {
    const { threadID, messageID, senderID, author } = event;
    if (!global.data.allThreadID.some(e => e == threadID)) return;
    let path = pathJson + `/${threadID}.json`;
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    let data = JSON.parse(fs.readFileSync(path));
    if (!data[senderID]) data[senderID] = [];
    if (event.type != "message" && event.type != "message_reply") return;
    var name = (await Users.getData(event.senderID)).name;
    let time = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
    data[senderID].push({
        type: event.type,
        name: name,
        message: event.body,
        time: time,
        attachment: event.attachments
    });
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

module.exports.handleReply = async ({ api, event, handleReply, Threads,Users }) => {
    const { threadID, messageID, senderID, body,author } = event;
    if (!body || senderID != handleReply.author) return;
    let input = parseInt(body.trim());
    if (input < 1 || input > handleReply.allJson.length) return;
    let name = (await Threads.getData(threadID)).threadInfo.threadName;
    return api.sendMessage({body: `Tin nhắn của nhóm "${name}" được lưu ở trong này`,
        attachment: fs.createReadStream(pathJson + '/' + handleReply.allJson[input - 1])
    }, threadID, (err) => { if (err) console.log(err) });
}

module.exports.run = async ({ api, event, Threads,Users }) => {
    const { threadID, messageID, senderID, author } = event;
    let path = pathJson + `/${threadID}.json`;
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    let allJson = fs.readdirSync(pathJson);
    let e = 1;
    let msg = `Danh sách các nhóm bot đã lưu được tin nhắn:\n\n`;
    for (let all of allJson) {
        if (all.endsWith('.json')) {
            let id = parseInt(all.replace('.json', ''));
            let name = (await Threads.getData(id)).threadInfo.threadName;
            
            msg += `${e++}. ${id} | ${name}\n\n`;
        }
    }
    msg += "Reply tin nhắn theo số thứ tự box để tải về";
    return api.sendMessage(msg, threadID, (err, info) => {
        global.client.handleReply.push({
            messageID: info.messageID,
            name: this.config.name,
            author: senderID,
            allJson
        })
    });
}