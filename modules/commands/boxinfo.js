const fs = require("fs-extra")
const totalPath = __dirname + '/cache/hethong/totalChat.json';
const _24hours = 86400000;

module.exports.config = {
    name: "boxinfo",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dc-Nam",
    description: "Xem thông tin box của bạn",
    commandCategory: "Box chat",
    usages: "",
    cooldowns: 0
};
module.exports.languages = {
    "vi": {},
    "en": {}
};
module.exports.handleEvent = async ({
    api,
    event,
    args
}) => {
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

module.exports.run = async ({
    api,
    event,
    args,
    Threads,
    Users
}) => {
    try {
        const {
            threadID,
            messageID,
            senderID,
            isGroup
        } = event;
        let timeByMS = Date.now();
        let threadInfo = await Threads.getInfo(threadID)
        let dataThread = (await Threads.getData(threadID)).threadInfo;
        let threadAllUsers = threadInfo.participantIDs.length;
        var arrayNam = [];
        var arrayNu = [];
        var arrayUndefined = [];
        for (let getUsers in threadInfo.userInfo) {
            var getGender = threadInfo.userInfo[getUsers].gender;
            var getName = threadInfo.userInfo[getUsers].name;
            if (getGender == "MALE") {
                arrayNam.push(getUsers + getGender)
            } else if (getGender == "FEMALE") {
                arrayNu.push(getGender)
            } else {
                arrayUndefined.push(getName)
            }
        };

        var countNam = arrayNam.length;
        var countNu = arrayNu.length;
        var countUndefined = arrayUndefined.length;
        let adminID = dataThread.adminIDs || threadInfo.adminID || {}
        let countAdmin = adminID.length || {};
        let countAllMessage = threadInfo.messageCount;
        let threadIcon = threadInfo.emoji || dataThread.threadIcon || "";
        let themeName = dataThread.themeName || ""
        let emojiTheme = dataThread.themeEmoji || ""
        let threadName = dataThread.threadName || threadInfo.threadName || "undefined";
        let threadId = threadInfo.threadID;
        var approvalMode = threadInfo.approvalMode || dataThread.approvalMode || {}
        approve = approvalMode == false ? "tắt" : approvalMode == true ? "bật" : approvalMode == 0 ? "tắt" : approvalMode == 1 ? "bật" : ""
        var listAD = ""
        for (let id of adminID) {
            let infoUsers = await Users.getInfo(id.id);
            listAD += `• 🕵‍♂️${infoUsers.name}\n`
        }
        const moment = require("moment-timezone");
        var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
        if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
        let totalChat = JSON.parse(fs.readFileSync(totalPath));
        if (!totalChat[threadID]) {
            totalChat[threadID] = {
                time: timeByMS,
                count: countAllMessage,
                ytd: 0
            }
            fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
        }
        let mdtt = "Chưa có thống kê";
        let preCount = totalChat[threadID].count || 0;
        let ytd = totalChat[threadID].ytd || 0;
        let hnay = (ytd != 0) ? (countAllMessage - preCount) : "Chưa có thống kê";
        let hqua = (ytd != 0) ? ytd : "Chưa có thống kê";
        if (timeByMS - totalChat[threadID].time > _24hours) {
            if (timeByMS - totalChat[threadID].time > (_24hours * 2)) {
                totalChat[threadID].count = countAllMessage;
                totalChat[threadID].time = timeByMS - _24hours;
                totalChat[threadID].ytd = countAllMessage - preCount;
                fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
            }

            getHour = Math.ceil((timeByMS - totalChat[threadID].time - _24hours) / 3600000);
            if (ytd == 0) mdtt = 100;
            else mdtt = ((((hnay) / ((hqua / 24) * getHour))) * 100).toFixed(0);
            mdtt += "%";
        }
        api.sendMessage({
            body: "[======》 BOX INFO 《======]" + "\n\n" +
                "◆━━━━━━━━━━━━━◆" + "\n" +
                "➣ SetTing: " + "\n" +
                "• Tên: " + threadName + "\n" +
                "• ID: " + threadId + "\n" +
                "• Phê Duyệt: " + approve + "\n" +
                "• Name Theme: " + themeName + "\n" +
                "• Emoji Theme: " + emojiTheme + "\n" +
                "• Icon Thread: " + threadIcon + "\n" +
                "◆━━━━━━━━━━━━━◆" + "\n" +
                "➣ Tổng " + threadAllUsers + " Thành Viên, Gồm: " + "\n" +
                "• 👨‍🦰Nam: " + countNam + "\n" +
                "• 👩‍🦰Nữ: " + countNu + "\n" +
                "• 🧟‍♂️Bede: " + countUndefined + "\n\n" +
                "➣ Với " + countAdmin + " Quản Trị Viên, Gồm: " + "\n" +
                listAD +
                "◆━━━━━━━━━━━━━◆" + "\n" +
                "➣ Tương Tác Gồm: " + "\n" +
                "• Hôm Qua: " + hqua + "\n" +
                "• Hôm Nay: " + hnay + "\n" +
                "• Tổng: " + countAllMessage + "\n" +
                "• Tỷ Lệ Tương Tác: " + mdtt + "\n" +
                "◆━━━━━━━━━━━━━◆" + "\n\n" +
                "[=====[ " + timeNow + " ]=====]",
            attachment: await DownLoad(threadInfo.imageSrc, __dirname + "/cache/avtbox.jpg")
        }, threadID, () => fs.unlinkSync(__dirname + "/cache/avtbox.jpg"))
    } catch (e) {
        return api.sendMessage(e, threadID, messageID)
    }
}
async function DownLoad(url, path) {
    await require("image-downloader").image({
        url: url,
        dest: path
    })
    return fs.createReadStream(path)
}