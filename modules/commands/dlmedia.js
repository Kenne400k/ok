const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "dlmedia",
    version: "1.3.0",
    hasPermission: 0,
    credits: "Vincent",
    description: "Tải video/âm thanh từ nhiều nền tảng (TikTok, YouTube, Facebook...)",
    commandCategory: "Tiện ích",
    usages: "/dlmedia <link>",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (args.length === 0) {
        return api.sendMessage("❌ Vui lòng nhập đường link video hoặc ảnh TikTok!", threadID, messageID);
    }

    const videoURL = args[0];
    const apiKey = "979ce6";
    const apiURL = `https://hungdev.id.vn/medias/down-aio?apikey=${apiKey}&url=${encodeURIComponent(videoURL)}`;

    api.sendMessage("🔄 Đang xử lý, vui lòng chờ...", threadID, messageID);

    try {
        const res = await axios.get(apiURL);
        const data = res.data;

        if (!data || !data.success || !data.data) {
            return api.sendMessage("❌ Không thể tải dữ liệu. Hãy kiểm tra lại link!", threadID, messageID);
        }

        const { title, author, duration, medias, images, source } = data.data;
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

        let attachments = [];

        // 🔹 Nếu có video/audio, tải về
        if (medias && medias.length > 0) {
            const bestMedia = medias.find(m => m.type === "video") || medias.find(m => m.type === "audio");
            if (bestMedia) {
                const fileExtension = bestMedia.extension || "mp4";
                const filePath = path.join(cacheDir, `dl_${Date.now()}.${fileExtension}`);

                const writer = fs.createWriteStream(filePath);
                const response = await axios.get(bestMedia.url, { responseType: "stream" });
                response.data.pipe(writer);

                await new Promise(resolve => writer.on("finish", resolve));
                attachments.push(filePath);
            }
        }

        // 🔹 Nếu là TikTok và có ảnh, tải ảnh luôn
        if (source === "TikTok" && images && images.length > 0) {
            for (const [index, imgUrl] of images.entries()) {
                const imagePath = path.join(cacheDir, `image_${index}.jpg`);
                const writer = fs.createWriteStream(imagePath);
                const response = await axios.get(imgUrl, { responseType: "stream" });
                response.data.pipe(writer);

                await new Promise(resolve => writer.on("finish", resolve));
                attachments.push(imagePath);
            }
        }

        // Gửi file lên Messenger
        api.sendMessage({
            body: `🎬 𝗧𝗔̉𝗜 𝗧𝗛𝗔̀𝗡𝗛 𝗖𝗢̂𝗡𝗚! ✅\n\n` +
                `📌 𝗧𝗶𝗲̂𝘂 đ𝗲̂̀: ${title}\n` +
                `👤 𝗧𝗮́𝗰 𝗴𝗶𝗮̉: ${author || "Không rõ"}\n` +
                `⏳ 𝗧𝗵𝗼̛̀𝗶 𝗹𝘂̛𝗼̛̣𝗻𝗴: ${duration || "Không rõ"}\n` +
                `🌐 𝗡𝗲̂̀𝗻 𝘁𝗮̉𝗻𝗴: ${source}\n\n` +
                `📥 𝗙𝗶𝗹𝗲 đ𝗮̃ đ𝘂̛𝗼̛̣𝗰 𝘁𝗮̉𝗶 𝘃𝗲̂̀! 🎶🎥`,
            attachment: attachments.map(file => fs.createReadStream(file))
        }, threadID, () => {
            // Xóa file sau khi gửi
            attachments.forEach(file => fs.unlinkSync(file));
        }, messageID);

    } catch (err) {
        console.error("❌ Lỗi khi tải file:", err);
        return api.sendMessage("❌ Đã xảy ra lỗi khi xử lý yêu cầu!", threadID, messageID);
    }
};

