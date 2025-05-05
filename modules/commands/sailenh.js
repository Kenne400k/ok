let urls = require("./../../Api/data/gaidep.json");

const { streamURL } = global.utils;

const axios = require("axios");

const fs = require("fs");

class Command {

    constructor(config) {
        this.config = config;
        this.queues = [];
    }

    async onLoad(o) {
        let status = false;

        if (!global.client.xx) global.client.xx = setInterval(_ => {
            if (status == true || this.queues.length > 50) return; // Điều chỉnh giới hạn hàng đợi lên 50

            status = true;

            Promise.all([...Array(5)].map(e => upload(urls[Math.floor(Math.random() * urls.length)]))) // Điều chỉnh số lượng tải lên cùng lúc
                .then(res => {
                    console.log(res, ...res);
                    this.queues.push(...res);
                    status = false;
                });

        }, 1000 * 5);

        async function streamURL(url, type) {
            return axios.get(url, {
                responseType: 'arraybuffer'
            }).then(res => {
                const path = __dirname + `/cache/${Date.now()}.${type}`;
                fs.writeFileSync(path, res.data);
                setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
                return fs.createReadStream(path);
            });
        }

        async function upload(url) {
            return o.api.httpPostFormData('https://upload.facebook.com/ajax/mercury/upload.php', {
                upload_1024: await streamURL(url, 'mp4')
            }).then(res => Object.entries(JSON.parse(res.replace('for (;;);', '')).payload?.metadata?.[0] || {})[0]);
        }
    }

    async run(o) {
        const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));

        const t = process.uptime() + global.config.UPTIME;
        const h = Math.floor(t / (60 * 60));
        const p = Math.floor((t % (60 * 60)) / 60);
        const s = Math.floor(t % 60);
        const moment = require("moment-timezone");//D/MM/YYYY
          var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
        const hours = moment.tz('Asia/Ho_Chi_Minh').format('HHmm');
        let timeStart = Date.now();

        console.log(this.queues);

        send({
            body: `⚠️| Chưa Nhập Tên Lệnh \n🌐| Ping: ${Date.now() - timeStart}ms\n📥| Tổng: ${urls.length - 2}\n✅| Video khả dụng: ${this.queues.length}\n⏰| Time on: ${h}:${p}:${s}\n───────────────\n⏱️| ${gio}\n`,
            attachment: this.queues.splice(0, 1)
        });
    }

}

module.exports = new Command({
    name: "",
    version: "0.0.1",
    hasPermssion: 0,
    credits: "DONGDEV mod by Vdang",
    description: "",
    commandCategory: "Tiện Ích",
    usages: "[]",
    cooldowns: 0,
});