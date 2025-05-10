module.exports.config = {
    name: "menu",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "Pcoder",
    description: "Hướng dẫn sử dụng bot và các lệnh.",
    usages: "[all/-a] [số trang]",
    commandCategory: "Thông tin",
    usePrefix: true,
    cooldowns: 5,
    envConfig: {
        "autoUnsend": true,
        "delayUnsend": 60
    }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { commands } = global.client;
    const { body, threadID, messageID, senderID } = event;
    const num = parseInt(body.trim());
    const prefix = global.config.PREFIX;

    // Xử lý reply cho nhóm chủ đề
    if (handleReply.type === "cmd_group") {
        if (isNaN(num) || num <= 0 || num > handleReply.content.length) {
            return api.sendMessage("❌ | 𝗦𝗼̂́ 𝗯𝗮̣𝗻 𝗰𝗵𝗼̣𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝗵𝗼̛̣𝗽 𝗹𝗲̣̂, 𝘃𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝘁𝗵𝘂̛̉ 𝗹𝗮̣𝗶!", threadID, messageID);
        }

        const selectedGroup = handleReply.content[num - 1];
        let commandList = selectedGroup.cmds.map(cmdName => {
            const cmd = commands.get(cmdName);
            return cmd ? `» ${prefix}${cmdName}: ${cmd.config.description}` : null;
        }).filter(item => item); // Loại bỏ các lệnh null

        if (commandList.length === 0) {
            return api.sendMessage("⚠️ | 𝗛𝗶𝗲̣̂𝗻 𝘁𝗮̣𝗶 𝗸𝗵𝗼̂𝗻𝗴 𝗰𝗼́ 𝗹𝗲̣̂𝗻𝗵 𝗻𝗮̀𝗼 𝘁𝗿𝗼𝗻𝗴 𝗰𝗵𝘂̉ đ𝗲̂̀ 𝗻𝗮̀𝘆.", threadID, messageID);
        }

        const totalCommands = commandList.length;
        const commandsPerPage = 10;
        const totalPages = Math.ceil(totalCommands / commandsPerPage);
        let currentPage = 1;

        if (handleReply.page) {
            currentPage = handleReply.page;
        }

        const start = (currentPage - 1) * commandsPerPage;
        const end = Math.min(start + commandsPerPage, totalCommands);
        const currentCommands = commandList.slice(start, end);

        let msg = `📚 | 𝗠𝗘̂𝗡𝗨 𝗖𝗛𝗨̉ Đ𝗘̂̀: ${selectedGroup.group.toUpperCase()} 📚\n\n`;
        msg += currentCommands.join("\n");
        msg += `\n\nTrang: ${currentPage}/${totalPages}`;
        msg += `\n💡 | 𝗥𝗲𝗽𝗹𝘆 𝘁𝗵𝗲̂𝗺 𝘀𝗼̂́ 𝘁𝗿𝗮𝗻𝗴 đ𝗲̂̉ 𝘅𝗲𝗺 𝘁𝗶𝗲̂́𝗽.\n🔰 | 𝗗𝘂̀𝗻𝗴 "${prefix}menu all" 𝗵𝗼𝗮̣̆𝗰 "${prefix}menu -a" 𝘅𝗲𝗺 𝘁𝗮̂́𝘁 𝗰𝗮̉ 𝗹𝗲̣̂𝗻𝗵.`;

        return api.sendMessage(msg, threadID, (err, info) => {
            global.client.handleReply.push({
                type: "cmd_group",
                name: this.config.name,
                messageID: info.messageID,
                content: handleReply.content,
                page: currentPage,
                maxPage: totalPages
            });
        }, messageID);
    }

    // Xử lý reply xem thông tin lệnh
    if (handleReply.type === "cmd_info") {
        if (isNaN(num) || num <= 0 || num > handleReply.content.length) {
            return api.sendMessage("❌ | 𝗦𝗼̂́ 𝗯𝗮̣𝗻 𝗰𝗵𝗼̣𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝗵𝗼̛̣𝗽 𝗹𝗲̣̂, 𝘃𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝘁𝗵𝘂̛̉ 𝗹𝗮̣𝗶!", threadID, messageID);
        }

        const selectedCmdName = handleReply.content[num - 1];
        const command = commands.get(selectedCmdName);

        if (!command) {
            return api.sendMessage("⚠️ | 𝗟𝗲̣̂𝗻𝗵 𝗸𝗵𝗼̂𝗻𝗴 𝘁𝗼̂̀𝗻 𝘁𝗮̣𝗶 𝗵𝗼𝗮̣̆𝗰 𝗯𝗶̣ 𝗹𝗼̂̃𝗶!", threadID, messageID);
        }

        const cmdConfig = command.config;
        let msg = "===== 📃 𝗠𝗘̂𝗡𝗨 𝗖𝗛𝗜 𝗧𝗜𝗘̂́𝗧 📃 =====\n\n";
        msg += `» 𝗧𝗲̂𝗻 𝗹𝗲̣̂𝗻𝗵: ${selectedCmdName}\n`;
        msg += `» 𝗠𝗼̂ 𝘁𝗮̉: ${cmdConfig.description || "Không có mô tả"}\n`;
        msg += `» 𝗖𝗮́𝗰𝗵 𝗱𝘂̀𝗻𝗴: ${cmdConfig.usages || "Không có hướng dẫn"}\n`;
        msg += `» 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 𝗰𝗵𝗼̛̀: ${cmdConfig.cooldowns || 3} giây\n`;
        msg += `» 𝗤𝘂𝘆𝗲̂̀𝗻 𝗵𝗮̣𝗻: ${cmdConfig.hasPermssion === 0 ? "Người dùng" : (cmdConfig.hasPermssion === 1 ? "Quản trị viên nhóm" : "Quản trị viên bot")}\n`;
        msg += `» 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: ${cmdConfig.credits || "Không có"}\n`;
        msg += `» 𝗧𝗵𝘂𝗼̣̂𝗰 𝗻𝗵𝗼́𝗺: ${cmdConfig.commandCategory || "Không có"}\n`;

        return api.sendMessage(msg, threadID, messageID);
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const prefix = global.config.PREFIX;

    if (args[0] === "all" || args[0] === "-a") {
        // Hiển thị tất cả lệnh
        let commandList = Array.from(commands.keys());
        const totalCommands = commandList.length;
        const commandsPerPage = 10;
        const totalPages = Math.ceil(totalCommands / commandsPerPage);
        let currentPage = 1;

        let msg = "===== 𝗠𝗘̂𝗡𝗨 𝗧𝗔̂́𝗧 𝗖𝗔̉ 𝗖𝗔́𝗖 𝗟𝗘̣̂𝗡𝗛 =====\n\n";

        for (let i = 0; i < totalCommands; i++) {
            const cmdName = commandList[i];
            const cmd = commands.get(cmdName);
            if (cmd) {
                msg += `» ${prefix}${cmdName}: ${cmd.config.description}\n`;
            }
        }

        msg += `\nTrang: ${currentPage}/${totalPages}`;
        msg += `\n💡 | 𝗥𝗲𝗽𝗹𝘆 𝘁𝗵𝗲̂𝗺 𝘀𝗼̂́ 𝘁𝗿𝗮𝗻𝗴 đ𝗲̂̉ 𝘅𝗲𝗺 𝘁𝗶𝗲̂́𝗽.`;

        return api.sendMessage(msg, threadID, messageID);
    } else {
        // Hiển thị theo chủ đề
        let groups = {};
        commands.forEach(cmd => {
            const category = cmd.config.commandCategory || "Khác";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(cmd.config.name);
        });

        let groupList = Object.keys(groups);
        let msg = "===== 𝗠𝗘̂𝗡𝗨 𝗖𝗔́𝗖 𝗖𝗛𝗨̉ Đ𝗘̂̀ =====\n\n";
        groupList.forEach((group, index) => {
            msg += `${index + 1}. » ${group}\n`;
        });

        msg += `\n🔰 | 𝗥𝗲𝗽𝗹𝘆 𝘀𝗼̂́ 𝘁𝗵𝘂̛́ 𝘁𝘂̛̣ 𝗰𝘂̉𝗮 𝗰𝗵𝘂̉ đ𝗲̂̀ đ𝗲̂̉ 𝘅𝗲𝗺 𝗰𝗮́𝗰 𝗹𝗲̣̂𝗻𝗵.\n💡 | 𝗗𝘂̀𝗻𝗴 "${prefix}menu all" 𝗵𝗼𝗮̣̆𝗰 "${prefix}menu -a" 𝘅𝗲𝗺 𝘁𝗮̂́𝘁 𝗰𝗮̉ 𝗹𝗲̣̂𝗻𝗵.`;

        return api.sendMessage(msg, threadID, (error, info) => {
            global.client.handleReply.push({
                type: "cmd_group",
                name: this.config.name,
                messageID: info.messageID,
                content: groupList.map(groupName => ({
                    group: groupName,
                    cmds: groups[groupName]
                }))
            });
        }, messageID);
    }
};
