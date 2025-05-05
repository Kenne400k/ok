const fse = require("fs-extra");
const path = __dirname + "/../../config.json";
let Cdata = JSON.parse(fse.readFileSync(path));
module.exports.config = {
    name: "antinamebot",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "DC-Nam",
    description: "Giúp chặn người dùng đổi tên bot của bạn",
    commandCategory: "Tiện ích",
    usages: "change",
    cooldowns: 0,
    envConfig: {
        status: true
    },
};
module.exports.handleEvent = async ({
    api,
    event,
    Threads
}) => {
    const {
        threadID,
        messageID,
        senderID,
        isGroup,
        author
    } = event, nameModule = this.config.name;
    const botID = api.getCurrentUserID();
    if (isGroup == true && /*threadID == 5163688080366637 && */ senderID == botID) {
        let getDataThread = await Threads.getData(threadID) || {}
        const {
            data,
            threadInfo
        } = getDataThread
        const prefix = data.PREFIX || global.config.PREFIX;
        const saveName = `〈 ${prefix} 〉➺ ${Cdata.BOTNAME}`
        const nickname = threadInfo.nicknames[botID]
        if (nickname != saveName && Cdata[nameModule].status == true) {
            threadInfo.nicknames[botID] = saveName
            await Threads.setData(threadID, {
                threadInfo
            });
            await global.data.threadInfo.set(threadID, threadInfo)
            await api.changeNickname(saveName, threadID, botID, () => {
                return api.sendMessage("» Hiện tại đang cấm đổi tên bot", threadID);
            })
        }
    }
};
module.exports.run = function({
    api,
    event,
    args
}) {
    const {
        threadID,
        messageID,
        senderID
    } = event, nameModule = this.config.name;
    const spl = args.splice(1)
    if (!Cdata.OWNER.includes(senderID)) return api.sendMessage("» Bạn không đủ quyền hạn!", threadID, messageID);
    switch (args[0]) {
        case "change":
        case "c": {
            if (!spl.join("")) {
                return api.sendMessage(`» Bạn chưa nhập tên cho bot`, threadID);
            }
            Cdata.BOTNAME = spl.join(" ")
            fse.writeFileSync(path, JSON.stringify(Cdata));
            api.sendMessage(`» Đã đổi định dạng tên bot thành: ${text}`, threadID, messageID);
            break
        }
        default: {
            const status = Cdata[nameModule].status == true ? false : true
            Cdata[nameModule].status = status
            fse.writeFileSync(path, JSON.stringify(Cdata));
            api.sendMessage(`» ${status == true ? "Bật" : "Tắt"} chế độ cấm đổi tên bot`, threadID, messageID)
        }
        break
    }
    delete require.cache[require.resolve(global.client.configPath)];
    global.config = require(global.client.configPath);
}