const axios = require("axios");
const fs = require("fs")
const linkapi = "https://api.sumiproject.net/capcutdowload?url="
exports.config = {
    name: "capcut",
    version: "0.9.9",
    hasPermssion: 0,
    credits: "harin",//fix by Trankhuong
    description: "Download mẫu capcut!",
    commandCategory: "Tiện ích",
    usages: "link capcut",
    cooldowns: 5
};
exports.run = async function (_) {
  const { threadID: t, messageID: m, messageReply: mrl, type } = _.event;
  const send = msg => _.api.sendMessage(msg, t, m)
  if (type == "message_reply") link  = mrl.body
  else link = _.args.join(" ");
  if (!link) return send("⚡ Nhập link mẫu Capcut!");
  send('⚡ Vui lòng đợi xíu!')
  try {
  var res = (await axios.get(`${linkapi}${link}`))
  const stream = (await axios.get(res.data.data.video,{ responseType: "arraybuffer" })).data
  const path = __dirname+`/cache/1.mp4`;
  fs.writeFileSync(path, Buffer.from(stream, "utf-8"));
  send({body: `[ Auto Mẫu Video Capcut ]
──────────────────
📝 Nội dung: ${res.data.data.tieude}
✏️ Mô tả: ${res.data.data.mota}
⚡ Lượt dùng: ${res.data.data.luotxem}
🖇️ Link capcut: ${link}
📎 Link video: ${res.data.data.video}

👉 Bạn muốn edit video thì ấn vào link ở trên để edit video nhé!`, attachment: fs.createReadStream(path)})
  } catch (error) {
  console.error(error);
  send("⚡ Lỗi đã có vấn đề xảy ra vui lòng thử lại!");
};
};