const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

const totalPath = path.join(__dirname, "cache", "hethong", "totalChat.json");
const _24hours = 86400000;

module.exports.config = {
    name: "boxinfo",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "pcoder",
    description: "Xem thông tin box của bạn",
    commandCategory: "Box chat",
    usages: "",
    cooldowns: 0
};
module.exports.languages = {
    "vi": {},
    "en": {}
};

module.exports.handleEvent = async ({ api, event }) => {
    // Đảm bảo file tồn tại
    if (!fs.existsSync(totalPath)) fs.outputFileSync(totalPath, JSON.stringify({}));
    let totalChat = JSON.parse(fs.readFileSync(totalPath));
    if (!totalChat[event.threadID]) return;
    if (Date.now() - totalChat[event.threadID].time > (_24hours * 2)) {
        let sl = (await api.getThreadInfo(event.threadID)).messageCount;
        totalChat[event.threadID] = {
            time: Date.now() - _24hours,
            count: sl,
            ytd: sl - totalChat[event.threadID].count
        };
        fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
    }
};

module.exports.run = async ({ api, event, Threads, Users }) => {
    try {
        const { threadID, messageID } = event;
        let timeByMS = Date.now();
        // Lấy info nhóm
        let threadInfo = await Threads.getInfo(threadID);
        let dataThread = (await Threads.getData(threadID)).threadInfo;
        let threadAllUsers = threadInfo.participantIDs.length;

        // Thống kê giới tính
        let arrayNam = [], arrayNu = [], arrayUndefined = [];
        for (let u of threadInfo.userInfo) {
            if (u.gender == "MALE") arrayNam.push(u.name);
            else if (u.gender == "FEMALE") arrayNu.push(u.name);
            else arrayUndefined.push(u.name);
        }

        let countNam = arrayNam.length;
        let countNu = arrayNu.length;
        let countUndefined = arrayUndefined.length;

        // Quản trị viên
        let adminID = dataThread.adminIDs || threadInfo.adminIDs || [];
        let countAdmin = adminID.length;
        let listAD = "";
        for (let id of adminID) {
            let infoUsers = await Users.getInfo(id.id);
            listAD += `• 🕵‍♂️${infoUsers.name}\n`;
        }

        let countAllMessage = threadInfo.messageCount;
        let threadIcon = threadInfo.emoji || dataThread.threadIcon || "";
        let themeName = dataThread.themeName || "";
        let emojiTheme = dataThread.themeEmoji || "";
        let threadName = dataThread.threadName || threadInfo.threadName || "undefined";
        let threadId = threadInfo.threadID;
        let approvalMode = threadInfo.approvalMode ?? dataThread.approvalMode;
        let approve = (approvalMode === false || approvalMode === 0) ? "tắt" : (approvalMode === true || approvalMode === 1) ? "bật" : "không rõ";

        // Thời gian
        let timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");

        // Đảm bảo file thống kê tồn tại
        if (!fs.existsSync(totalPath)) fs.outputFileSync(totalPath, JSON.stringify({}));
        let totalChat = JSON.parse(fs.readFileSync(totalPath));
        if (!totalChat[threadID]) {
            totalChat[threadID] = {
                time: timeByMS,
                count: countAllMessage,
                ytd: 0
            };
            fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
        }

        // Tính tỷ lệ tương tác
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
            let getHour = Math.ceil((timeByMS - totalChat[threadID].time - _24hours) / 3600000);
            if (ytd == 0) mdtt = "100%";
            else mdtt = ((((hnay) / ((hqua / 24) * getHour))) * 100).toFixed(0) + "%";
        }

        // Tải ảnh avatar nhóm
        let imgPath = path.join(__dirname, "cache", "avtbox.jpg");
        await DownLoad(threadInfo.imageSrc, imgPath);

        api.sendMessage({
            body:
                "[======》 BOX INFO 《======]\n\n" +
                "◆━━━━━━━━━━━━━◆\n" +
                "➣ SetTing:\n" +
                `• Tên: ${threadName}\n` +
                `• ID: ${threadId}\n` +
                `• Phê Duyệt: ${approve}\n` +
                `• Name Theme: ${themeName}\n` +
                `• Emoji Theme: ${emojiTheme}\n` +
                `• Icon Thread: ${threadIcon}\n` +
                "◆━━━━━━━━━━━━━◆\n" +
                `➣ Tổng ${threadAllUsers} Thành Viên, Gồm:\n` +
                `• 👨‍🦰Nam: ${countNam}\n` +
                `• 👩‍🦰Nữ: ${countNu}\n` +
                `• 🧟‍♂️Bede: ${countUndefined}\n\n` +
                `➣ Với ${countAdmin} Quản Trị Viên, Gồm:\n` +
                listAD +
                "◆━━━━━━━━━━━━━◆\n" +
                "➣ Tương Tác Gồm:\n" +
                `• Hôm Qua: ${hqua}\n` +
                `• Hôm Nay: ${hnay}\n` +
                `• Tổng: ${countAllMessage}\n` +
                `• Tỷ Lệ Tương Tác: ${mdtt}\n` +
                "◆━━━━━━━━━━━━━◆\n\n" +
                `[=====[ ${timeNow} ]=====]`,
            attachment: fs.createReadStream(imgPath)
        }, threadID, () => fs.unlinkSync(imgPath), messageID);

    } catch (e) {
        return api.sendMessage("Đã xảy ra lỗi khi lấy thông tin box:\n" + e, event.threadID, event.messageID);
    }
};

async function DownLoad(url, savePath) {
    const { image } = require("image-downloader");
    await image({ url, dest: savePath });
    return fs.createReadStream(savePath);
}