module.exports.config = {
    name: "setqtv",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "pcoder",
    description: "Thêm hoặc gỡ quản trị viên nhóm bằng xác nhận cảm xúc",
    commandCategory: "group",
    usages: "[add/remove] [@tag | reply]",
    cooldowns: 5
};

module.exports.run = async function ({ event, api, args, Users, Threads }) {
    // Lấy thông tin nhóm
    let threadData = await Threads.getData(event.threadID);
    let adminIDs = threadData.threadInfo?.adminIDs || [];

    // Hướng dẫn sử dụng
    if (!args[0]) {
        return api.sendMessage(
            `===== [ 𝗦𝗘𝗧𝗤𝗧𝗩 - PCODER ] =====\n────────────────────\n→ /setqtv add @tag hoặc reply: Thêm thành viên làm quản trị viên nhóm\n→ /setqtv remove @tag hoặc reply: Gỡ quyền quản trị viên`,
            event.threadID,
            event.messageID
        );
    }

    // Kiểm tra quyền của người dùng & bot
    const botID = api.getCurrentUserID();
    const senderID = event.senderID;
    if (
        !adminIDs.some(item => item.id == botID) ||
        !adminIDs.some(item => item.id == senderID)
    ) {
        return api.sendMessage('⚠️ Bạn hoặc bot cần là quản trị viên nhóm để sử dụng lệnh này!', event.threadID, event.messageID);
    }

    // Xác định user cần thao tác
    let targetID = null;
    if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
    } else {
        targetID = senderID;
    }

    // Kiểm tra hành động add/remove
    if (["add", "remove"].includes(args[0].toLowerCase())) {
        const actionType = args[0].toLowerCase();
        let actionMsg = actionType === "add"
            ? "Thả cảm xúc ❤ tin nhắn này để xác nhận thêm QTV"
            : "Thả cảm xúc ❤ tin nhắn này để xác nhận gỡ QTV";

        return api.sendMessage(actionMsg, event.threadID, (error, info) => {
            global.client.handleReaction.push({
                name: this.config.name,
                type: actionType,
                messageID: info.messageID,
                author: senderID,
                userID: targetID
            });
        }, event.messageID);
    } else {
        return api.sendMessage("❓ Hành động không hợp lệ! Sử dụng add/remove.", event.threadID, event.messageID);
    }
};

module.exports.handleReaction = async function ({ event, api, handleReaction, Users }) {
    try {
        // Chỉ người xác nhận mới thao tác
        if (event.userID != handleReaction.author) return;
        if (event.reaction != "❤") return;

        const { threadID, messageID } = event;
        const targetID = handleReaction.userID;
        const userName = (await Users.getData(targetID)).name || "Người dùng";

        if (handleReaction.type === "add") {
            api.changeAdminStatus(threadID, targetID, true, (err) => {
                if (err) return api.sendMessage("❌ Bot không đủ quyền để thêm quản trị viên!", threadID, messageID);
                return api.sendMessage(`✅ Đã thêm ${userName} làm quản trị viên nhóm thành công!`, threadID, messageID);
            });
        } else if (handleReaction.type === "remove") {
            api.changeAdminStatus(threadID, targetID, false, (err) => {
                if (err) return api.sendMessage("❌ Bot không đủ quyền để gỡ quản trị viên!", threadID, messageID);
                return api.sendMessage(`✅ Đã gỡ quyền quản trị viên của ${userName} thành công.`, threadID, messageID);
            });
        }
    } catch (e) {
        return api.sendMessage("⚠️ Đã xảy ra lỗi khi xử lý!", event.threadID);
    }
};
