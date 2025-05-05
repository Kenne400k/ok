const fs = require("fs-extra");
const axios = require("axios");

var r = ["jn6PoPho", "WKd4XzHX", "FI6bX3kC","KyPJquPy"];
const api = r[Math.floor(Math.random() * r.length)];

module.exports.config = {
    name: "atdscl",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "hphong", // cấm thay credit của hphong
    description: "tự động tải nhạc dạng mp3 từ soundcloud",
    commandCategory: "Tiện ích",
    usages: "autodown",
    cooldowns: 5
};

module.exports.run = async function () { };

module.exports.handleEvent = async function ({ api, event }) {
    if (this.checkLink(event.body)) {
        var { type, url } = this.checkLink(event.body);
        this.downLoad(url, type, api, event);
    }
};

module.exports.downLoad = function (url, type, api, event) {
    var time = Date.now();
    var path = __dirname + `/cache/${time}.${type}`;
    this.getLink(url).then(res => {
        if (type == 'mp3') url = res.result.audio;

        // Lấy thông tin bài hát
        var title = res.result.title;
        var mieuta = res.result.data.description;
        var duration = res.result.duration;
        var like = res.result.data.likes_count;
        var cmt = res.result.data.comment_count;
        axios({
            method: "GET",
            url: url,
            responseType: "arraybuffer"
        }).then(res => {
            fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
            if (fs.statSync(path).size / 1024 / 1024 > 2225) {
                return api.sendMessage("File quá lớn, không thể gửi", event.threadID, () => fs.unlinkSync(path), event.messageID);
            }

            // Gửi thông tin bài hát và file nhạc
            api.sendMessage({
                body: `[ 𝐀𝐔𝐓𝐎𝐃𝐎𝐖𝐍 𝗦𝗢𝗨𝗡𝗗𝗖𝗟𝗢𝗨𝗗 ]\n────────────────\n⩺ 𝐓𝐢𝐞̂𝐮 đ𝐞̂̀: ${title}\n⩺ 𝐌𝐨̂ 𝐭𝐚̉: ${mieuta}\n⩺ 𝐋𝐢𝐤𝐞: ${like}\n⩺ 𝐂𝐨𝐦𝐦𝐞𝐧𝐭: ${cmt}\n⩺ 𝐓𝐡𝐨̛̀𝐢 𝐋𝐮̛𝐨̛̣𝐧𝐠: ${duration}\n⩺ 𝐓𝐮̛̣ đ𝐨̣̂𝐧𝐠 𝐭𝐚̉𝐢 𝐧𝐡𝐚̣𝐜 𝐭𝐮̛̀ 𝐒𝐨𝐮𝐧𝐝𝐂𝐥𝐨𝐮𝐝`,
                attachment: fs.createReadStream(path)
            }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        });
    });
};

module.exports.getLink = function (url) {
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: `https://nguyenmanh.name.vn/api/scDL?url=${url}&apikey=${api}`
        }).then(res => resolve(res.data)).catch(err => reject(err));
    });
};

module.exports.checkLink = function (url) {
    const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    const found = (url).match(regex);
    var media = ['vt', 'tiktok', 'facebook', 'douyin', 'youtube', 'youtu', 'twitter', 'instagram', 'kuaishou', 'fb'];
    if (this.isVaildUrl(String(found))) {
        if (media.some(item => String(found).includes(item))) {
            return {
                type: "mp4",
                url: String(found)
            };
        }
        else if (String(found).includes("soundcloud") || String(found).includes("zingmp3")) {
            return {
                type: "mp3",
                url: String(found)
            }
        }
    }
    return !1;
};

module.exports.isVaildUrl = function (url) {
    var regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if (url.match(regex) == null) return !1;
    return !0;
};