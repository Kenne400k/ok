module.exports.config = {
    name: "xoatien",
    version: "1.1.0",
    hasPermssion: 1,
    credits: "manhIT (fix & improve: Kenne400k Copilot)",
    description: "Reset toàn bộ số tiền của thành viên nhóm về 0",
    commandCategory: "group",
    usages: "[cc], [del], [all]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, Currencies }) => {
    try {
        const threadData = await api.getThreadInfo(event.threadID);
        let resetCount = 0;
        let failedList = [];
        for (const user of threadData.userInfo) {
            try {
                let currenciesData = await Currencies.getData(user.id);
                if (currenciesData && typeof currenciesData.money !== "undefined" && currenciesData.money !== 0) {
                    await Currencies.setData(user.id, { money: 0 });
                    resetCount++;
                }
            } catch (e) {
                failedList.push(user.id);
            }
        }
        let msg = `✅ Đã reset tiền về 0 cho ${resetCount} thành viên trong nhóm!`;
        if (failedList.length > 0) {
            msg += `\n⚠️ Không thể reset cho ${failedList.length} thành viên (có thể chưa từng dùng tiền hoặc lỗi dữ liệu).`;
        }
        return api.sendMessage(msg, event.threadID);
    } catch (err) {
        return api.sendMessage("❌ Đã xảy ra lỗi khi reset tiền nhóm. Vui lòng thử lại sau.", event.threadID);
    }
};
