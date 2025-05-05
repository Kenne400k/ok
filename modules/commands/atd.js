const axios = require('axios');
const fs = require('fs');
const path = require('path');

const platforms = {
    tiktok: /(^https:\/\/)((vt|vm|www)\.)?tiktok\.com\//,
    douyin: /(^https:\/\/)((v|vm|www)\.)?douyin\.com\//,
    capcut: /(^https:\/\/)(www\.)?capcut\.com\//,
    threads: /(^https:\/\/)(www\.)?threads\.net\//,
    instagram: /https:\/\/(www\.)?instagram\.com\/(stories|p|reel)/,
    facebook: /(^https:\/\/)(www\.)?facebook\.com\//,
    espn: /https:\/\/(www\.)?espn\.com\//,
    kuaishou: /(^https:\/\/)(www\.)?kuaishou\.com\//,
    pinterest: /https:\/\/(www\.)?pinterest\.com\//,
    imdb: /https:\/\/(www\.)?imdb\.com\//,
    imgur: /https:\/\/(www\.)?imgur\.com\//,
    ifunny: /https:\/\/(www\.)?ifunny\.co\//,
    izlesene: /https:\/\/(www\.)?izlesene\.com\//,
    reddit: /https:\/\/(www\.)?reddit\.com\//,
    youtube: /https:\/\/(www\.)?youtube\.com\//,
    twitter: /https:\/\/(www\.)?twitter\.com\//,
    vimeo: /https:\/\/(www\.)?vimeo\.com\//,
    snapchat: /https:\/\/(www\.)?snapchat\.com\//,
    bilibili: /https:\/\/(www\.)?bilibili\.com\//,
    dailymotion: /https:\/\/(www\.)?dailymotion\.com\//,
    sharechat: /https:\/\/(www\.)?sharechat\.com\//,
    linkedin: /https:\/\/(www\.)?linkedin\.com\//,
    tumblr: /https:\/\/(www\.)?tumblr\.com\//,
    hipi: /https:\/\/(www\.)?hipi\.com\//,
    telegram: /https:\/\/(www\.)?telegram\.org\//,
    getstickerpack: /https:\/\/(www\.)?getstickerpack\.com\//,
    bitchute: /https:\/\/(www\.)?bitchute\.com\//,
    febspot: /https:\/\/(www\.)?febspot\.com\//,
    oke_ru: /https:\/\/(www\.)?oke\.ru\//,
    rumble: /https:\/\/(www\.)?rumble\.com\//,
    streamable: /https:\/\/(www\.)?streamable\.com\//,
    ted: /https:\/\/(www\.)?ted\.com\//,
    sohutv: /https:\/\/(www\.)?sohu\.com\//,
    xvideos: /https:\/\/(www\.)?xvideos\.com\//,
    xnxx: /https:\/\/(www\.)?xnxx\.com\//,
    xiaohongshu: /https:\/\/(www\.)?xiaohongshu\.com\//,
    weibo: /^https?:\/\/(www\.)?weibo\.com\/\d+\/[A-Za-z0-9]+$/,
    miaopai: /https:\/\/(www\.)?miaopai\.com\//,
    meipai: /https:\/\/(www\.)?meipai\.com\//,
    xiaoying: /https:\/\/(www\.)?xiaoying\.com\//,
    nationalvideo: /https:\/\/(www\.)?nationalvideo\.com\//,
    yingke: /https:\/\/(www\.)?yingke\.com\//,
    soundcloud: /https:\/\/(www\.)?soundcloud\.com\//,
    mixcloud: /https:\/\/(www\.)?mixcloud\.com\//,
    spotify: /https:\/\/(www\.)?spotify\.com\//,
    zingmp3: /https:\/\/(www\.)?zingmp3\.com\//,
    bandcamp: /https:\/\/(www\.)?bandcamp\.com\//,
};

const getPlatformName = (url) => {
    for (let [platform, regex] of Object.entries(platforms)) {
        if (regex.test(url)) {
            return platform.toUpperCase();
        }
    }
};

let stream_url = (url, type) => axios.get(url, {
    responseType: 'arraybuffer'
}).then(res => {
    let filePath = path.join(__dirname, 'cache', Date.now() + '.' + type);
    fs.writeFileSync(filePath, res.data);
    setTimeout(() => fs.unlinkSync(filePath), 1000 * 60);
    return fs.createReadStream(filePath);
}).catch(err => console.error("Lỗi khi tải file:", err));

const downloadMedia = async (mediaData) => {
    let attachments = [];
    let videoDownloaded = false;

    for (let media of mediaData.medias) {
        if (media.url) {
            if (media.type === 'video' && !videoDownloaded) {
                try {
                    let fileStream = await stream_url(media.url, media.extension || 'mp4');
                    attachments.push(fileStream);
                    videoDownloaded = true;
                } catch (error) {
                    console.error("Lỗi khi tải video:", error);
                }
            } else if (media.type === 'image') {
                try {
                    let fileStream = await stream_url(media.url, media.extension || 'jpg');
                    attachments.push(fileStream);
                } catch (error) {
                    console.error("Lỗi khi tải hình ảnh:", error);
                }
            }
        }
    }
    return attachments;
    
};

exports.config = {
    name: 'atd',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'KyPhanDev-(DGK-hỗ trợ api)',
    description: 'Tự động tải video và hình ảnh từ nhiều nền tảng mạng xã hội.',
    commandCategory: 'Tiện ích',
    usages: 'autodown',
    cooldowns: 0
};

exports.run = function(o) {};

exports.handleEvent = async function(o) {
    let text = o.event.body;
    let urls = text.match(/https?:\/\/[^\s]+/g);
    let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);

    if (!urls || urls.length === 0) return;
    let mediaUrl = urls[0];
    let platform = getPlatformName(mediaUrl);

    console.log("URL được xử lý:", mediaUrl);

    try {
        let res = await axios.get(`https://kyphandev.site/down/allj2?link=${encodeURIComponent(mediaUrl)}&apikey=test`);

        if (!res.data || !res.data.medias) {
            console.error('Lỗi phân tích dữ liệu API.');
            return;
        }

        let { author, title, medias } = res.data;
        let attachments = [];

        if (medias) {
            attachments = await downloadMedia(res.data);
        }

        if (attachments.length > 0) {
            send({
                body: `[ AUTODOWN - ${platform} ]\n──────────────────\n⩺ Tiêu đề: ${title || "Không có tiêu đề"}\n⩺ Tác giả: ${author || "Không có tác giả"}
`, attachment: attachments
            });
        }
    } catch (err) {
        console.error("Lỗi khi gọi API hoặc xử lý dữ liệu:", err);
    }
};
