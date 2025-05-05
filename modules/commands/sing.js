const fs = require('fs');
const ytdl = require('@distube/ytdl-core');
const path = require('path');
const moment = require("moment-timezone");
const { createReadStream, unlinkSync, statSync } = require("fs-extra");
const Youtube = require('youtube-search-api');

async function getdl(link, downloadPath) {
    const timestart = Date.now();
    if (!link) return 'Thiếu link';

    return new Promise((resolve, reject) => {
        ytdl(link, {
            filter: format =>
                format.quality === 'tiny' &&
                format.audioBitrate === 48 &&
                format.hasAudio === true
        })
        .pipe(fs.createWriteStream(downloadPath))
        .on("close", async () => {
            try {
                const data = await ytdl.getInfo(link);
                const result = {
                    title: data.videoDetails.title,
                    dur: Number(data.videoDetails.lengthSeconds),
                    viewCount: data.videoDetails.viewCount,
                    likes: data.videoDetails.likes,
                    uploadDate: data.videoDetails.uploadDate,
                    sub: data.videoDetails.author.subscriber_count,
                    author: data.videoDetails.author.name,
                    timestart: timestart
                };
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
        .on("error", (error) => {
            reject(error);
        });
    });
}

function convertHMS(value) {
    const sec = parseInt(value, 10); 
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
}

module.exports.config = {
    name: "sing",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "D-Jukie",
    description: "Phát nhạc thông qua từ khoá tìm kiếm trên YouTube",
    commandCategory: "Music",
    usages: "[searchMusic]",
    cooldowns: 0,
    usePrefix: false,
    dependencies: {
        "@distube/ytdl-core": "",
        "youtube-search-api": "",
        "moment-timezone": "",
        "fs-extra": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    const client = global.client;

    const downloadPath = path.resolve(__dirname, 'cache', `sin-${senderID}.mp3`);

    if (event.type === 'message_reply' && client.handleReply) {
        const handle = client.handleReply.find(item => item.messageID === event.messageReply.messageID && item.name === module.exports.config.name);

        if (handle) {
            return handleReply({ api, event, handleReply: handle });
        }
    }

    if (args.length === 0) {
        return api.sendMessage('❎ Phần tìm kiếm không được để trống!', threadID, messageID);
    }

    const keywordSearch = args.join(" ");

    if (fs.existsSync(downloadPath)) {
        fs.unlinkSync(downloadPath);
    }

    try {
        const link = [];
        const data = (await Youtube.GetListByKeyword(keywordSearch, false, 8)).items;

        if (!data.length) {
            return api.sendMessage('❎ Không tìm thấy kết quả nào phù hợp với từ khóa của bạn.', threadID, messageID);
        }

        const msg = data.map((value, index) => {
            link.push(value.id);
            return `|› ${index + 1}. ${value.title}\n|› 👤 Kênh: ${value.channelTitle}\n|› ⏱️ Thời lượng: ${value.length.simpleText}\n──────────────────`;
        }).join('\n');

        return api.sendMessage(
            `📝 Có ${link.length} kết quả trùng với từ khóa tìm kiếm của bạn:\n──────────────────\n${msg}\n\n📌 Reply (phản hồi) STT để tải nhạc`,
            threadID,
            (error, info) => {
                if (error) return console.error(error);
                client.handleReply = client.handleReply || [];
                client.handleReply.push({
                    type: 'reply',
                    name: module.exports.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    link
                });
            },
            messageID
        );

    } catch (error) {
        console.error(error);
        return api.sendMessage('❎ Đã xảy ra lỗi, vui lòng thử lại sau!', threadID, messageID);
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, senderID, messageID, body } = event;
    const selectedNumber = parseInt(body, 10) - 1;

    if (isNaN(selectedNumber) || selectedNumber < 0 || selectedNumber >= handleReply.link.length) {
        return api.unsendMessage('❎ Lựa chọn không hợp lệ. Vui lòng nhập số tương ứng với bài hát muốn tải.', threadID, messageID);
    }

    const videoID = handleReply.link[selectedNumber];
    const videoURL = `https://www.youtube.com/watch?v=${videoID}`;
    const downloadPath = path.resolve(__dirname, 'cache', `sin-${senderID}.mp3`);

    try {
        const data = await getdl(videoURL, downloadPath);

        if (typeof data === 'string') {
            return api.sendMessage(data, threadID, messageID);
        }

        if (fs.statSync(downloadPath).size > 26214400) {
            fs.unlinkSync(downloadPath);
            return api.sendMessage('❎ File quá lớn, vui lòng chọn bài khác!', threadID, messageID);
        }

       
        api.unsendMessage(handleReply.messageID);

        global.client.handleReply = global.client.handleReply.filter(item => item.messageID !== handleReply.messageID);

        return api.sendMessage({
            body: `[ 🎶 Âm Nhạc Từ YouTube ]\n──────────────────\n` +
                  `|› 🎬 Title: ${data.title}\n` +
                  `|› ⏱️ Thời lượng: ${convertHMS(data.dur)} giây\n` +
                  `|› 🗓️ Ngày tải lên: ${data.uploadDate}\n` +
                  `|› 👤 Tên kênh: ${data.author} (${data.sub})\n` +
                  `|› 🌐 Lượt xem: ${data.viewCount}\n` +
                  `|› 📥 Link tải: https://www.youtubepp.com/watch?v=${videoID}\n` +
                  `|› ⏳ Thời gian xử lý: ${Math.floor((Date.now() - data.timestart) / 1000)} giây\n` +
                  `──────────────────\n` +
                  `|› ⏰ Time: ${moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss | DD/MM/YYYY")}`,
            attachment: createReadStream(downloadPath)
        }, threadID, () => {
            fs.unlinkSync(downloadPath);
        }, messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage('❎ Đã xảy ra lỗi trong quá trình tải nhạc. Vui lòng thử lại sau!', threadID, messageID);
    }
}