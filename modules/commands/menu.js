module.exports.config = {
    name: "menu",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "hphong",
    description: "Hướng dẫn cho người mới",
    usages: "[all/-a] [số trang]",
    commandCategory: "Dành cho người dùng",
    usePrefix: false,
    cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { commands } = global.client;
    const num = parseInt(event.body.trim());
    const prefix = global.config.PREFIX;

    // Kiểm tra và xử lý khi reply lệnh trong nhóm chủ đề
    if (handleReply.type === "cmd_group") {
        if (isNaN(num) || num <= 0 || num > handleReply.content.length) {
            return api.sendMessage({
                body: "𝗦𝗼̂́ 𝗯𝗮̣𝗻 𝗰𝗵𝗼̣𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝗻𝗮̆̀𝗺 𝘁𝗿𝗼𝗻𝗴 𝗱𝗮𝗻𝗵 𝘀𝗮́𝗰𝗵, 𝘃𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝘁𝗵𝘂̛̉ 𝗹𝗮̣𝗶!!",
                attachment: global.khanhdayr.splice(0, 1)
            }, event.threadID);
        }

        let selectedGroup = handleReply.content[num - 1]; // Lấy nhóm chủ đề được chọn
        let selectedCommands = [];

        // Lấy danh sách các lệnh thuộc nhóm chủ đề đã chọn
        selectedGroup.cmds.forEach(cmdName => {
            let commandConfig = commands.get(cmdName)?.config;
            if (commandConfig) {
                selectedCommands.push({
                    name: cmdName,
                    description: commandConfig.description
                });
            }
        });

        // Hiển thị các lệnh trong chủ đề được chọn
        let msg = `===== 𝐋𝐞̣̂𝐧𝐡 𝐂𝐡𝐮̉ Đ𝐞̂̀: ${selectedGroup.group.toUpperCase()} =====\n`;
        selectedCommands.forEach((cmd, index) => {
            msg += `\n${index + 1}. » ${cmd.name}: ${cmd.description}`;
        });

        // Kiểm tra và lấy video nếu có từ global.khanhdayr
        let attachment = global.khanhdayr?.length > 0 ? global.khanhdayr.splice(0, 1) : null;

        // Thêm thông tin chi tiết lệnh và video (nếu có)
        msg += `\n\n[🧸] 𝗕𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝗱𝘂̀𝗻𝗴 ${prefix}𝗺𝗲𝗻𝘂 𝗮𝗹𝗹 đ𝗲̂̉ 𝘅𝗲𝗺 𝘁𝑎̂́𝘁 𝗰𝗮̉ 𝗹𝗲̣̂𝗻𝗵`;

        let msgData = { body: msg };
        if (attachment) {
            msgData.attachment = attachment;  // Đính kèm video từ global.khanhdayr nếu có
        }

        // Gửi tin nhắn và tiếp tục xử lý reply để người dùng có thể chọn số thứ tự lệnh
        return api.sendMessage(msgData, event.threadID, (error, info) => {
            global.client.handleReply.push({
                type: "cmd_info",
                name: this.config.name,
                messageID: info.messageID,
                content: selectedCommands.map(cmd => cmd.name)
            });
        });
    }

    // Nếu người dùng reply số thứ tự của lệnh trong chủ đề
    if (handleReply.type === "cmd_info") {
        let num = parseInt(event.body.trim());
        if (isNaN(num) || num <= 0 || num > handleReply.content.length) {
            return api.sendMessage({
                body: "𝗦𝗼̂́ 𝗯𝗮̣𝗻 𝗰𝗵𝗼̣𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝗻𝗮̆̀𝗺 𝘁𝗿𝗼𝗻𝗴 𝗱𝗮𝗻𝗵 𝘀𝗮́𝗰𝗵, 𝘃𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝘁𝗵𝘂̛̉ 𝗹𝗮̣𝗶!!",
                attachment: global.khanhdayr.splice(0, 1)
            }, event.threadID);
        }

        const selectedCmd = handleReply.content[num - 1]; // Lệnh được chọn
        const { commands } = global.client;
        const commandConfig = commands.get(selectedCmd)?.config;

        if (!commandConfig) {
            return api.sendMessage({
                body: "𝐋𝐞̣̂𝐧𝐡 𝐊𝐡𝐨̂𝐧𝐠 𝐓𝐨̂̀𝐧 𝐓𝐚̣𝐢!!",
                attachment: global.khanhdayr.splice(0, 1)
            }, event.threadID);
        }

        let msg = `🔹 𝗧𝗲̂𝗻 𝗹𝗲̣̂𝗻𝗵: ${selectedCmd}`;
        msg += `\n📖 𝗠𝗼̂ 𝘁𝗮̉: ${commandConfig.description}`;
        msg += `\n🛠 𝗖𝗮́𝗰𝗵 𝗱𝘂̀𝗻𝗴: ${commandConfig.usages || "Không có hướng dẫn"}`;
        msg += `\n⏳ 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 𝗰𝗵𝗼̛̀: ${commandConfig.cooldowns || 5}s`;
        msg += `\n🔰 𝗤𝘂𝘆𝗲̂̀𝗻 𝗵𝗮̣𝗻: ${commandConfig.hasPermssion == 0 ? "Người dùng" : commandConfig.hasPermssion == 1 ? "Quản trị viên nhóm" : "Quản trị viên bot"}`;
        msg += `\n💡 𝗖𝐨𝗱𝗲 𝗯𝘆: ${commandConfig.credits}`;

        // Kiểm tra và lấy video nếu có từ global.khanhdayr
        let attachment = global.khanhdayr?.length > 0 ? global.khanhdayr.splice(0, 1) : null;
        let msgData = { body: msg };

        if (attachment) msgData.attachment = attachment;  // Đính kèm video nếu có

        return api.sendMessage(msgData, event.threadID);
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { commands } = global.client;
    const { threadID } = event;
    const prefix = global.config.PREFIX;
    let msg = "=====『 𝗠𝗘𝗡𝗨 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 』=====\n";
    
    // Kiểm tra và lấy video nếu có từ global.khanhdayr
    let attachment = global.khanhdayr?.length > 0 ? global.khanhdayr.splice(0, 1) : null;
    let commandList = [];

    if (args[0] === "all" || args[0] === "-a") {
        // Hiển thị tất cả các lệnh
        msg = "=====『 𝗠𝗘𝗡𝗨 𝗧𝗔̂́𝗧 𝗖𝗔̉ 𝗟𝗘̣̂𝗡𝗛 』=====\n";
        let count = 0;

        commands.forEach((cmd, name) => {
            msg += `\n${++count}. » ${name}: ${cmd.config.description}`;
            commandList.push(name);
        });

        msg += `\n╭─────╮\n ${commands.size} 𝐥𝐞̣̂𝐧𝐡\n╰─────╯ `;
        msg += `\n[🧸] 𝗕𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝗱𝘂̀𝗻𝗴 ${prefix}𝗺𝗲𝗻𝘂 𝗮𝗹𝗹 đ𝗲̂̉ 𝘅𝗲𝗺 𝘁𝘁𝗮̂́𝗍 𝗰𝗮̉ 𝗹𝗲̣̂𝗻𝗵`;

        // Gửi tin nhắn và xử lý reply để người dùng có thể chọn số thứ tự lệnh
        let msgData = { body: msg };
        if (attachment) msgData.attachment = attachment;

        return api.sendMessage(msgData, threadID, (error, info) => {
            global.client.handleReply.push({
                type: "cmd_info",
                name: this.config.name,
                messageID: info.messageID,
                content: commandList
            });
        });
    } else {
        let group = [];
        // Nhóm các lệnh theo chủ đề
        commands.forEach(cmd => {
            let category = cmd.config.commandCategory.toLowerCase();
            let cmdName = cmd.config.name;

            let groupObj = group.find(item => item.group === category);
            if (!groupObj) {
                group.push({ group: category, cmds: [cmdName] });
            } else {
                groupObj.cmds.push(cmdName);
            }
        });

        // Hiển thị các chủ đề
        group.forEach((groupItem, index) => {
            msg += `\n${index + 1}. » ${groupItem.group.toUpperCase()} «`;
        });

        msg += `\n\n[🧸] 𝗕𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝗱𝘂̀𝗻𝗴 ${prefix}𝗺𝗲𝗻𝘂 𝗮𝗹𝗹 đ𝗲̂̉ 𝘅𝗲𝗺 𝘁𝘁𝗮̂́𝗍 𝗰𝗮̉ 𝗹𝗲̣̂𝗻𝗵`;
        msg += `\n╭─────╮\n ${commands.size} 𝐥𝐞̣̂𝐧𝐡\n╰─────╯ `;
        msg += `\n[💓] 𝐇𝐚̃𝐲 𝐫𝐞𝐩𝐥𝐲 (𝐩𝐡𝐚̉𝐧 𝐡𝐨̂̀𝐢) 𝐒𝐓𝐓 𝐜𝐮̉𝐚 𝐜𝐡𝐮̉ đ𝐞̂̀ đ𝐞̂̉ 𝐱𝐞𝐦 𝐜𝐚́𝐜 𝐥𝐞̣̂𝐧𝐡 𝐭𝐫𝐨𝐧𝐠 𝐜𝐡𝐮̉ đ𝐞̂̀ 𝐧𝐚̀𝐨`;

        // Gửi tin nhắn và xử lý reply cho người dùng chọn nhóm chủ đề
        let msgData = { body: msg };
        if (attachment) msgData.attachment = attachment;

        return api.sendMessage(msgData, threadID, (error, info) => {
            global.client.handleReply.push({
                type: "cmd_group",
                name: this.config.name,
                messageID: info.messageID,
                content: group
            });
        });
    }
};
