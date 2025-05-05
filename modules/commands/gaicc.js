const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "gaicc",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "Random Capcut",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },

    run: async ({ api, event, args }) => {
        const { threadID } = event;

        try {
            const res = await axios.get("https://api-7izq.onrender.com/randomcc?apikey=randomtnt");

            const { title, description, usage, video } = res.data;
            const stream = (await axios.get(video, { responseType: "stream" })).data;

            api.sendMessage({
                body: `
┏━━━━━━━━━━━━━━━━━━━━┓
┣➤ Random Capcut
┣➤ Tiêu đề: ${title} 
┣➤ Mô tả: ${description}
┣➤ Lượt dùng: ${usage}
┗━━━━━━━━━━━━━━━━━━━━┛`,
                attachment: stream
            }, threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("Đã xảy ra lỗi khi lấy dữ liệu từ API.", threadID);
        }
    }
};
