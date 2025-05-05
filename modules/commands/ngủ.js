module.exports.config = {
    name: "ngủ",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Lê Định",
    description: "",
    commandCategory: "không cần dấu lệnh",
    usages: "",
    cooldowns: 10,
    denpendencies: {
        "fs": "",
        "request": ""
    }
};
module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirMaterial = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "ngủ.mp4")) request("https://i.imgur.com/lWSJ5QT.mp4").pipe(fs.createWriteStream(dirMaterial + "ngủ.mp4"));
}
module.exports.handleEvent = async ({ event, api, Currencies,Users, args, utils, global, client }) => {
    const fs = require("fs");
    let name = await Users.getNameUser(event.senderID)
    var msg = {
                body: `‎┏━━━━━━━━━━━━━━━━━━━━┓\n┣➤🌸 𝗛𝗶𝗰 𝗽𝗮́𝗶 𝗽𝗮𝗶 ${name} 𝗻𝗵𝗲́👋\n┣➤💓𝘀𝗼̛́𝗺 𝗾𝘂𝗮𝘆 𝘁𝗿𝗼̛̉ 𝗹𝗮̣𝗶 𝘃𝗼̛́𝗶 𝗯𝗼𝘁 𝗻𝗵𝗮𝗮\n┣➤🌱 𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂𝘂 ${name} 𝘃𝗲𝗿𝘆 𝗺𝘂𝗰𝗵𝗵 💘\n┗━━━━━━━━━━━━━━━━━━━━┛`,
                attachment: fs.createReadStream(__dirname + `/noprefix/ngủ.mp4`)
            }
    if (event.body.toLowerCase() == "đi ngủ đây"){
        return api.sendMessage(msg,event.threadID,event.messageID);}
    if (event.body.toLowerCase() == "ngủ khỏe"){
        return api.sendMessage(msg,event.threadID,event.messageID);}
    if (event.body.toLowerCase() == "ngủ"){
        return api.sendMessage(msg,event.threadID,event.messageID);}
    if (event.body.toLowerCase() == "đi ngủ nha"){
        return api.sendMessage(msg,event.threadID,event.messageID);}
    if (event.body.toLowerCase() == "đi ngủ"){
        return api.sendMessage(msg,event.threadID,event.messageID);}
    if (event.body.toLowerCase() == "ngủ đi"){
        return api.sendMessage(msg,event.threadID,event.messageID);}
    if (event.body.toLowerCase() == "ngủ ngon"){
        return api.sendMessage(msg,event.threadID,event.messageID);}
        };
module.exports.run = async ({ event, api, Currencies, args, utils }) => {
return api.sendMessage("Dùng sai cách rồi lêu lêu",event.threadID)
    }