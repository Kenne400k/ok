const fse = require("fs-extra");
const configPath = __dirname + "/../../config.json";
let Cdata = JSON.parse(fse.readFileSync(configPath, "utf8"));

module.exports.config = {
    name: "antinamebot",
    version: "1.1.2",
    hasPermssion: 0,
    credits: "DC-Nam (improved by Kenne400k)",
    description: "Giúp chặn người dùng đổi tên bot của bạn",
    commandCategory: "Tiện ích",
    usages: "change <tên mới> hoặc antinamebot để bật/tắt",
    cooldowns: 0,
    envConfig: {
        status: true
    },
};

// Xử lý đổi tên bot khi bị đổi trái phép
module.exports.handleEvent = async ({ api, event, Threads }) => {
    const { threadID, senderID, isGroup } = event;
    const botID = api.getCurrentUserID();
    const nameModule = this.config.name;

    // Chỉ kiểm tra khi là group, và chính bot vừa bị đổi tên
    if (isGroup && senderID == botID) {
        let getDataThread = await Threads.getData(threadID) || {};
        const { data = {}, threadInfo = {} } = getDataThread;
        const prefix = data.PREFIX || global.config.PREFIX || "/";
        const saveName = `〈 ${prefix} 〉➺ ${Cdata.BOTNAME}`;
        const nickname = threadInfo.nicknames ? threadInfo.nicknames[botID] : undefined;

        if (nickname != saveName && Cdata[nameModule]?.status === true) {
            if (threadInfo.nicknames) threadInfo.nicknames[botID] = saveName;
            await Threads.setData(threadID, { threadInfo });
            await global.data.threadInfo.set(threadID, threadInfo);
            await api.changeNickname(saveName, threadID, botID, () => {
                api.sendMessage("» Hiện tại đang cấm đổi tên bot\n// thông tin fb.com/pcoder090 . Github.com/Kenne400k . Zalo : 0786888655", threadID);
            });
        }
    }
};

// Xử lý lệnh đổi tên bot hoặc bật/tắt chế độ cấm đổi tên
module.exports.run = function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const nameModule = this.config.name;

    // Chỉ chủ bot mới được thao tác
    if (!Cdata.OWNER?.includes(senderID)) {
        return api.sendMessage("» Bạn không đủ quyền hạn!\n// thông tin fb.com/pcoder090 . Github.com/Kenne400k . Zalo : 0786888655", threadID, messageID);
    }

    // Đổi tên bot: antinamebot change <tên mới>
    if (args[0] === "change" || args[0] === "c") {
        const newName = args.slice(1).join(" ").trim();
        if (!newName) {
            return api.sendMessage("» Bạn chưa nhập tên cho bot\n// thông tin fb.com/pcoder090 . Github.com/Kenne400k . Zalo : 0786888655", threadID, messageID);
        }
        Cdata.BOTNAME = newName;
        fse.writeFileSync(configPath, JSON.stringify(Cdata, null, 2));
        api.sendMessage(`» Đã đổi định dạng tên bot thành: ${newName}\n// thông tin fb.com/pcoder090 . Github.com/Kenne400k . Zalo : 0786888655`, threadID, messageID);
    } else {
        // Bật/tắt chế độ cấm đổi tên bot
        const status = !!Cdata[nameModule]?.status;
        Cdata[nameModule] = Cdata[nameModule] || {};
        Cdata[nameModule].status = !status;
        fse.writeFileSync(configPath, JSON.stringify(Cdata, null, 2));
        api.sendMessage(`» ${!status ? "Bật" : "Tắt"} chế độ cấm đổi tên bot\n// thông tin fb.com/pcoder090 . Github.com/Kenne400k . Zalo : 0786888655`, threadID, messageID);
    }

    // Reload lại config toàn cục nếu có
    if (global.client?.configPath) {
        delete require.cache[require.resolve(global.client.configPath)];
        global.config = require(global.client.configPath);
    }
};