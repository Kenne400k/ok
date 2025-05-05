module.exports.config = {
    name: "luật",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "Vincent & ChatGPT",
    description: "Gửi luật nhóm kèm ảnh QR",
    commandCategory: "Group",
    usages: "[]",
    cooldowns: 3
};

const axios = require("axios");
const MESSAGE_CONTENT = `📌⚠️ Đây là luật của nhóm, vui lòng tuân thủ!`;
const QR_IMAGE_URL = "https://f52-zpg-r.zdn.vn/jpg/1895608507755864540/1f38a73d7262cc3c9573.jpg";

module.exports.run = async ({ api, event }) => {
    try {
        const response = await axios.get(QR_IMAGE_URL, { responseType: "stream" });

        return api.sendMessage({
            body: MESSAGE_CONTENT,
            attachment: response.data
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error("❌ Lỗi khi tải ảnh QR:", error);
        return api.sendMessage("❌ Đã xảy ra lỗi khi gửi ảnh luật nhóm.", event.threadID);
    }
};
