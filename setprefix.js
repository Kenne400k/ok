module.exports.config = {
    name: "setprefix",
    version: "1.1.0",
    hasPermssion: 1,
    credits: "Mirai Team - Modified by pcoder",
    description: "Đặt lại prefix của nhóm, xác nhận bằng reaction, hỗ trợ reset về mặc định",
    commandCategory: "Box chat",
    usePrefix: false,
    cooldowns: 0
};

// Xử lý khi người dùng reaction để xác nhận đổi prefix
module.exports.handleReaction = async function({ api, event, Threads, handleReaction }) {
    try {
        // Chỉ cho phép người xác nhận, và cảm xúc phải là 👍 hoặc ❤ (thân thiện hơn)
        if (event.userID != handleReaction.author) return;
        if (!["👍", "❤"].includes(event.reaction)) return;
        const { threadID, messageID } = event;
        var data = (await Threads.getData(String(threadID))).data || {};
        const prefix = handleReaction.PREFIX;
        data["PREFIX"] = prefix;
        await Threads.setData(threadID, { data });
        await global.data.threadData.set(String(threadID), data);
        api.unsendMessage(handleReaction.messageID);

        const botID = api.getCurrentUserID();
        try {
            await api.changeNickname(`『 ${prefix} 』 ⪼ ${global.config.BOTNAME}`, threadID, botID);
        } catch (e) {
            // Nickname đổi không được cũng không lỗi
        }

        return api.sendMessage(`☑️ Đã thay đổi prefix của nhóm thành: ${prefix}`, threadID, messageID);
    } catch (e) {
        return api.sendMessage("❌ Đã xảy ra lỗi khi đổi prefix.", event.threadID);
    }
};

// Xử lý lệnh
module.exports.run = async ({ api, event, args, Threads }) => {
    if (!args[0]) {
        return api.sendMessage(`⚠️ Vui lòng nhập prefix mới để thay đổi prefix của nhóm.\n\nVí dụ:\n${global.config.PREFIX}${module.exports.config.name} !\n${global.config.PREFIX}${module.exports.config.name} reset (để đổi về mặc định)`, event.threadID, event.messageID);
    }
    const prefix = args[0].trim();
    if (!prefix) return api.sendMessage(`⚠️ Vui lòng nhập prefix mới để thay đổi prefix của nhóm`, event.threadID, event.messageID);

    // Reset về mặc định
    if (prefix.toLowerCase() === "reset") {
        var data = (await Threads.getData(event.threadID)).data || {};
        data["PREFIX"] = global.config.PREFIX;
        await Threads.setData(event.threadID, { data });
        await global.data.threadData.set(String(event.threadID), data);

        const botID = api.getCurrentUserID();
        try {
            await api.changeNickname(`『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME}`, event.threadID, botID);
        } catch (e) {
            // Nickname đổi không được cũng không lỗi
        }
        return api.sendMessage(`☑️ Đã reset prefix về mặc định: ${global.config.PREFIX}`, event.threadID, event.messageID);
    } else if (prefix.length > 8) {
        return api.sendMessage("❌ Prefix quá dài (tối đa 8 ký tự)!", event.threadID, event.messageID);
    } else {
        api.sendMessage(
            `📝 Bạn đang yêu cầu set prefix mới: [ ${prefix} ]\n👉 Hãy thả cảm xúc 👍 hoặc ❤ vào tin nhắn này để xác nhận.`,
            event.threadID,
            (error, info) => {
                global.client.handleReaction.push({
                    name: module.exports.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    PREFIX: prefix
                });
            },
            event.messageID
        );
    }
};
