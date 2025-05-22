const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "gái",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "nnl (improve: Kenne400k)",
    description: "Random gái",
    commandCategory: "nsfw",
    usages: "gái",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.run = async ({ api, event }) => {
    const threadID = event.threadID;
    const dataPath = path.join(__dirname, '../../Api/gai.json');

    // Load mảng link ảnh
    let imageUrls;
    try {
        imageUrls = Object.values(require(dataPath));
        if (!Array.isArray(imageUrls) || imageUrls.length === 0) throw new Error();
    } catch {
        return api.sendMessage("Không thể đọc dữ liệu ảnh gái. Vui lòng kiểm tra lại file 'gai.json'.\n// thông tin fb.com/pcoder090 . Github.com/Kenne400k . Zalo : 0786888655", threadID, event.messageID);
    }

    // Random số lượng ảnh (1-6)
    const maxImages = Math.min(6, imageUrls.length);
    const numImages = Math.floor(Math.random() * maxImages) + 1;

    // Random không trùng lặp
    const shuffled = imageUrls.sort(() => 0.5 - Math.random());
    const selectedUrls = shuffled.slice(0, numImages);

    // Tải từng ảnh, bỏ qua link lỗi
    let attachments = [];
    for (const url of selectedUrls) {
        try {
            const res = await axios.get(url, { responseType: "stream", timeout: 10000 });
            attachments.push(res.data);
        } catch (e) {
            // Bỏ qua ảnh lỗi, không push
        }
    }

    if (attachments.length === 0) {
        return api.sendMessage("Tất cả các link ảnh đều lỗi hoặc không thể tải về.\n// thông tin fb.com/pcoder090 . Github.com/Kenne400k . Zalo : 0786888655", threadID, event.messageID);
    }

    api.sendMessage({
        body: `→ 𝗔̉𝗻𝗵 𝗴𝗮́𝗶 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗯𝗲̂𝗻 𝗱𝘂̛𝗼̛́𝗶\n⚠️ Số ảnh: ${attachments.length}\n// thông tin fb.com/pcoder090 . Github.com/Kenne400k . Zalo : 0786888655`,
        attachment: attachments
    }, threadID, event.messageID);
};