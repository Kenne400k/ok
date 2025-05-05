module.exports.config = {
    name: "help",
    version: "1.1.3",
    hasPermission: 0,
    credits: "DC-Nam",
    description: "Xem danh sách lệnh và thông tin chi tiết",
    commandCategory: "Người dùng",
    usePrefix: false,
    usages: "[tên lệnh/all]",
    cooldowns: 0
};

module.exports.languages = {
    "vi": {},
    "en": {}
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const cmds = global.client.commands;
    
    if (!cmds || cmds.size === 0) {
        return api.sendMessage("⚠️ Bot chưa có lệnh nào!", threadID, messageID);
    }

    const threadData = global.data.threadData.get(threadID) || {};
    const prefix = threadData.PREFIX || global.config.PREFIX || "!";
    const type = args[0] ? args[0].toLowerCase() : "";
    let msg = "";

    // Tính thời gian uptime của bot
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // Hàm lấy ảnh đính kèm nếu có
    const getAttachment = () => (global.khanhdayr && global.khanhdayr.length > 0) ? global.khanhdayr.splice(0, 1) : [];

    // Hiển thị tất cả lệnh
    if (type === "all") {
        let i = 0;
        for (const cmd of cmds.values()) {
            msg += `${++i}. 📌 Lệnh: ${cmd.config.name}\n🔹 Mô tả: ${cmd.config.description}\n\n`;
        }
        return api.sendMessage({ body: msg, attachment: getAttachment() }, threadID, messageID);
    }

    // Hiển thị thông tin chi tiết của một lệnh
    if (type) {
        if (!cmds.has(type)) {
            const stringSimilarity = require("string-similarity");
            const allCommandNames = Array.from(cmds.keys());
            const checker = stringSimilarity.findBestMatch(type, allCommandNames);
            
            if (checker.bestMatch.rating >= 0.6) {
                return api.sendMessage(
                    { body: `❌ Không tìm thấy lệnh '${type}'.\n⚡ Có phải bạn muốn dùng '${checker.bestMatch.target}' không?`, attachment: getAttachment() },
                    threadID,
                    messageID
                );
            }
            return api.sendMessage({ body: `❌ Không tìm thấy lệnh '${type}'.`, attachment: getAttachment() }, threadID, messageID);
        }

        const cmd = cmds.get(type).config;
        msg = `=== 📖 HƯỚNG DẪN SỬ DỤNG ===\n`
            + `🔹 𝗧𝗲̂𝗻: ${cmd.name}\n`
            + `📌 𝗣𝗵𝗶𝗲̂𝗻 𝗯𝗮̉𝗻: ${cmd.version}\n`
            + `🔗 𝗤𝘂𝘆𝗲̂̀𝗻 𝗵𝗮̣𝗻: ${getPermissionText(cmd.hasPermission)}\n`
            + `👤 𝗧𝗮́𝗰 𝗴𝗶𝗮̉: ${cmd.credits}\n`
            + `📝 𝗠𝗼̂ 𝘁𝗮̉: ${cmd.description}\n`
            + `📂 𝗡𝗵𝗼́𝗺: ${cmd.commandCategory}\n`
            + `💬 𝗖𝗮́𝗰𝗵 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴: ${cmd.usages || "Không có hướng dẫn"}\n`
            + `⏳ 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 𝗰𝗵𝗼̛̀: ${cmd.cooldowns}s`;

        return api.sendMessage({ body: msg, attachment: getAttachment() }, threadID, messageID);
    }

    // Hiển thị danh sách lệnh theo danh mục
    const categories = categorizeCommands(cmds);
    let i = 0;
    for (const category of categories) {
        msg += `⭐━━━━ 〈 ${category.name.toUpperCase()} 〉 ━━━━⭐\n👤 Quyền Hạn: ${getPermissionText(category.permission)}\n📝 Tổng: ${category.commands.length} lệnh\n✏️ Danh sách: ${category.commands.join(", ")}\n\n`;
    }

    msg += `──────────────────\n📥 Tổng lệnh: ${cmds.size}\n⏳ Bot online: ${hours} giờ ${minutes} phút ${seconds} giây.\n🔥 Dùng '${prefix}help [tên lệnh]' để xem chi tiết lệnh.`;

    return api.sendMessage({ body: msg, attachment: getAttachment() }, threadID, messageID);
};

// Hàm nhóm lệnh theo danh mục
function categorizeCommands(cmds) {
    const categories = [];
    for (const cmd of cmds.values()) {
        const { commandCategory, hasPermission, name } = cmd.config;
        const category = categories.find(c => c.name === commandCategory);
        if (category) {
            category.commands.push(name);
        } else {
            categories.push({ name: commandCategory, permission: hasPermission, commands: [name] });
        }
    }
    return categories;
}

// Hàm hiển thị quyền hạn
function getPermissionText(permission) {
    return permission === 0 ? "Thành Viên" 
         : permission === 1 ? "QTV Nhóm" 
         : permission === 2 ? "Admin Bot" 
         : "Toàn Quyền";
}
