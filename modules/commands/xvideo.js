const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "xvideos",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "hphong",
    description: "Tìm kiếm và tải video trên xvideos mod bởi hphong",
    commandCategory: "Tiện ích",
    usages: "search",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": ""
    }
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
    const { threadID, senderID, messageID } = event;
    var data = await Currencies.getData(event.senderID);
    const out = (msg) => api.sendMessage(msg, threadID);

    if (!args.join(" ")) return out("Thiếu Từ Khoá Cần Tìm Kiếm ");
    const search = args.join(" ");
    const attachments = [];
    const dungkon = [];

    try {
        const res = (await axios.get(`https://joshweb.click/prn/search/${encodeURIComponent(search)}`)).data;
        const data = res.result;

        if (!data || data.length === 0) {
            return api.sendMessage("Không tìm thấy kết quả nào.", threadID);
        }

        for (let i = 0; i < Math.min(10, data.length); i++) {
            const video = data[i];
            const message = `ID: ${i + 1}.\n📝Tiêu đề: ${video.title}\nThời gian: ${video.duration}\n🔗Liên kết: ${video.video}\n📜Thông tin\n     -Người đăng: ${video.uploaderName}\n    -Link Profile: ${video.uploaderProfile}\n⊱ ⋅ ────────── ⋅ ⊰`;
            dungkon.push(message);

            if (video.thumbnail) {
                const thumbnailPath = path.join(__dirname, `cache/${i + 1}.jpg`);
                const response = await axios.get(video.thumbnail, { responseType: 'arraybuffer' });
                fs.writeFileSync(thumbnailPath, Buffer.from(response.data));
                attachments.push(fs.createReadStream(thumbnailPath));
            }
        }

        // Gửi tất cả thông tin và ảnh trong một lần
        api.sendMessage(
            {
                body:"[TÌM KIẾM VIDEO TRÊN XVIDEOS]\n" + dungkon.join("\n\n") + "\n\n» Hãy reply(phản hồi) chọn một trong những tìm kiếm trên (video dưới 10p)",
                attachment: attachments
            },
            threadID,
            (error, info) => {
                global.client.handleReply.push({
                    name: module.exports.config.name,
                    author: senderID,
                    messageID: info.messageID,
                    result: data,
                    attachment: attachments,
                });
            }
        );
    } catch (error) {
        api.sendMessage("Lỗi: " + error.message, threadID);
        console.error("Đã xảy ra lỗi:", error); // Log ra tìm lỗi
    }
};

module.exports.handleReply = async function ({ event, api, Currencies, Users, handleReply }) {
    const { threadID, messageID, body, senderID } = event;

    // Kiểm tra xem người reply có phải là người dùng lệnh không
    if (senderID !== handleReply.author) {
        return api.sendMessage("Bạn không phải người dùng lệnh", threadID, messageID);
    }

    const choose = parseInt(body.trim());

    api.unsendMessage(handleReply.messageID);
    if (isNaN(choose)) {
        return api.sendMessage("⚠️ Vui lòng nhập 1 con số", threadID, messageID);
    }
    if (choose > handleReply.result.length || choose < 1) {
        return api.sendMessage("❎ Lựa chọn không nằm trong danh sách", threadID, messageID);
    }

    const chosenVideo = handleReply.result[choose - 1];
    api.sendMessage(`Sẽ mất 1 khoảng thời gian (1-5p) để tải video, ${(await Users.getData(event.senderID)).name} vui lòng đợi`, event.threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID); }, 10000)); // tự động gỡ tin nhắn sau 20 giây 

    try {
        const res = await axios.get(`https://joshweb.click/prn/download?url=${encodeURIComponent(chosenVideo.video)}`);
        const response = res.data.result;
        const description = response.description;
        const uploadDate = response.uploadDate;
        const title = response.name;

        // Kiểm tra xem contentUrl có thuộc tính HD_Quality không
        const videoUrl = response.contentUrl?.HD_Quality;

        if (!videoUrl) {
            return api.sendMessage("Không tìm thấy URL video chất lượng HD.", threadID, messageID);
        }

        // Kiểm tra dung lượng video
        const headRes = await axios.head(videoUrl);
        const contentLength = headRes.headers['content-length'];

        if (contentLength > 24 * 1024 * 1024) { // 24MB
            return api.sendMessage("Video vượt quá dung lượng 24MB và không thể tải xuống.", threadID, messageID);
        }

        const filePath = path.join(__dirname, `cache/${title.replace(/[^\w\s]/gi, '')}.mp4`);

        const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(videoResponse.data));

        api.sendMessage(
            {
                body: `[TẢI VIDEO XVIDEOS]\nTiêu đề: ${title}\nMô tả: ${description}\nThời gian đăng tải: ${uploadDate}\nLƯU Ý; TỰ ĐỘNG GỠ VIDEO SAU 10S`,
                attachment: fs.createReadStream(filePath)
            },
            threadID,
            (error, info) => {
                if (error) return console.error(error);
                // Tự động gỡ tin nhắn sau 1 phút
                setTimeout(() => { api.unsendMessage(info.messageID); }, 10000); // 60000 ms = 1 phút
                fs.unlinkSync(filePath);
            },
            messageID
        );
    } catch (error) {
        console.error("Error:", error.message);
        api.sendMessage("Đã xảy ra lỗi khi tải video.", threadID, messageID);
    }
};