const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "mp3",
    version: "1.0.0",
    hasPermission: 0,
    credits: "vh",
    description: "Tìm kiếm và tải nhạc từ ZingMP3",
    commandCategory: "Tiện ích",
    usages: "[Tên bài hát]",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const apiUrl = "https://regular-mastiff-cheerful.ngrok-free.app/api/search-song";
    const songName = args.join(" ");

    if (!songName) {
        return api.sendMessage("Vui lòng nhập tên bài hát cần tìm kiếm.", event.threadID, event.messageID);
    }

    try {
        // Gửi yêu cầu tìm kiếm bài hát
        const response = await axios.get(`${apiUrl}?name=${encodeURIComponent(songName)}`);

        if (response.data && response.data.name) {
            const song = response.data;

            // Lấy link tải nhạc
            const downloadUrl = song.streamingLinks["128"]; // Sử dụng link 128kbps
            if (!downloadUrl) {
                return api.sendMessage("Không thể tải bài hát. Vui lòng thử bài hát khác.", event.threadID, event.messageID);
            }

            // Tải bài hát về
            const filePath = path.join(__dirname, `${song.name.replace(/[^a-zA-Z0-9]/g, "_")}.mp3`);
            const writer = fs.createWriteStream(filePath);
            const responseStream = await axios({
                url: downloadUrl,
                method: "GET",
                responseType: "stream",
            });

            responseStream.data.pipe(writer);

            writer.on("finish", () => {
                // Gửi bài hát dưới dạng file đính kèm kèm theo tên bài hát
                api.sendMessage(
                    {
                        body: `🎶 Đang gửi bài hát:\n\nTên: ${song.name}\nCa sĩ: ${song.artist}\n\n\nlyrics: ${song.lyrics}`,
                        attachment: fs.createReadStream(filePath),
                    },
                    event.threadID,
                    () => {
                        // Xóa file sau khi gửi xong
                        fs.unlinkSync(filePath);
                    },
                    event.messageID
                );
            });

            writer.on("error", (err) => {
                console.error("Lỗi khi tải bài hát:", err.message);
                return api.sendMessage("Đã xảy ra lỗi khi tải bài hát. Vui lòng thử lại sau.", event.threadID, event.messageID);
            });
        } else {
            return api.sendMessage("Không tìm thấy bài hát nào với từ khóa đã nhập.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API hoặc xử lý dữ liệu:", error.message);

        // Gửi tin nhắn lỗi chung cho người dùng
        return api.sendMessage(
            "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
            event.threadID,
            event.messageID
        );
    }
};