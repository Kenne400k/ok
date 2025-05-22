const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "gaicc",
        version: "1.1.0",
        hasPermssion: 0,
        credits: "tnt (fix & improve by Kenne400k)",
        description: "Random Capcut template/video",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },

    run: async ({ api, event, args }) => {
        const { threadID, messageID } = event;

        try {
            // Lấy dữ liệu random Capcut
            const { data } = await axios.get("https://api-7izq.onrender.com/randomcc?apikey=randomtnt");

            // Kiểm tra dữ liệu hợp lệ
            if (!data || !data.video) {
                return api.sendMessage("API không trả về dữ liệu hợp lệ.", threadID, messageID);
            }

            // Lấy thông tin
            const { title = "Không có tiêu đề", description = "Không có mô tả", usage = "Không rõ", video } = data;

            // Tải video về stream
            const response = await axios.get(video, { responseType: "stream", timeout: 10000 });
            const stream = response.data;

            // Soạn tin nhắn
            const msg = 
`┏━━━━━━━━━━━━━━━━━━━━┓
┣➤ 𝗥𝗮𝗻𝗱𝗼𝗺 𝗖𝗮𝗽𝗰𝘂𝘁
┣➤ 𝗧𝗶𝗲̂𝘂 đ𝗲̂̀: ${title}
┣➤ 𝗠𝗼̂ 𝘁𝗮̉: ${description}
┣➤ 𝗟𝘂̛̛𝗼̛̣𝘁 𝗱𝘂̀𝗻𝗴: ${usage}
┣➤ 𝗧𝗶𝗺𝗲: ${moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss")}
┗━━━━━━━━━━━━━━━━━━━━┛`;

            api.sendMessage({
                body: msg,
                attachment: stream
            }, threadID, () => {
                try { if (stream && stream.destroy) stream.destroy(); } catch {}
            }, messageID);

        } catch (error) {
            console.error(error);
            api.sendMessage("Đã xảy ra lỗi khi lấy hoặc gửi dữ liệu từ API Capcut.", event.threadID, event.messageID);
        }
    }
};