let urls = require("./../../lekhanh/datajson/vdgai.json");
const axios = require("axios");
const fs = require("fs");

class Command {
    constructor(config) {
    this.config = config;
    this.queues = [];
    };
    async onLoad(o) {
    let status = false;
    if (!global.client.xx) global.client.xx = setInterval(_=> {
if (status == true || this.queues.length > 5) return;// mày có thể chỉnh ở đây, nếu vd khả dụng còn dưới 20 nó sẽ get thêm và upload lên fb
    status = true;
Promise.all([...Array(10)].map(e=>upload(urls[Math.floor(Math.random()*urls.length)]))).then(res=> { console.log(res, ...res); (this.queues.push(...res), status = false) });
},1000*5);// ...Array(10) (mày thay số ở đây là số lần upload, tối thiểu là 5,8,10,20,...)
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
return o.api.httpPostFormData('https://upload.facebook.com/ajax/mercury/upload.php',{upload_1024: await streamURL(url, 'mp4')}).then(res => Object.entries(JSON.parse(res.replace('for (;;);', '')).payload?.metadata?.[0] || {})[0] );
        };};
  async run(o) {
      const allicon = ["💞","💖","💗","🌸","💝","🎀","🌹","🍁","🎊","🌟","🍁","💭","💦","💢","🍒","💩","✅","💤","☕","🐸","🐟","🐧"];
      const icon = allicon[Math.floor(Math.random()*allicon.length)];
      const response = await axios.get('https://raw.githubusercontent.com/tuannr10/lekhanh/refs/heads/main/Data_Vtuan/datajson/thinh.json');
      const data = response.data;
      const thinhArray = Object.values(data.data);
      const randomThinh = thinhArray[Math.floor(Math.random() * thinhArray.length)];
      const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));
      const t = process.uptime();
      const h = Math.floor(t / (60 * 60));
      const p = Math.floor((t % (60 * 60)) / 60);
      const s = Math.floor(t % 60);
      const userID = o.event.senderID;
    let pidusage = require('pidusage');
      let pid = await pidusage(process.pid);
      let numBoxs = global.data.allThreadID.length;
      let numCmds = global.client.commands.size;
      let numEvts = global.client.events.size;
      let userName = await new Promise(resolve => {
      o.api.getUserInfo(userID, (err, res) => {
      if (err) return resolve("Người dùng không xác định");
      resolve(res[userID].name);});});
      let timeStart = Date.now();
    console.log(this.queues)
      send({body: `👋 Hello ${userName} ${icon}\n⚠️ Bạn chưa Nhập Tên Lệnh.\n💫 Thời gian hoạt động: ${h}:${p}:${s}\n💤 Thính: ${randomThinh}\n🧸 Cmd: ${numCmds}\n⚜️ Events: ${numEvts}\n🌎 Tổng nhóm: ${numBoxs}\n💨 Tốc độ xử lý: ${Math.floor((Date.now() - timeStart)/1000)} giây`,
          attachment: this.queues.splice(0, 1)});
  }
}
module.exports = new Command({
  name: "",
  version: "0.0.1",
  hasPermssion: 0,
  credits: "DC-Nam",
  description: "",
  commandCategory: "Tiện ích",
  usages: "[]",
  cooldowns: 8,
});