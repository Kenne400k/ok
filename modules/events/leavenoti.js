module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.1.0",
  credits: "HĐGN (mod by H.Thanh, fix by Kenne400k)",
  description: "Thông báo Bot hoặc người rời khỏi nhóm có random gif/ảnh/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "moment-timezone": ""
  }
};

module.exports.run = async function ({ api, event, Users }) {
  // Nếu bot tự rời nhóm, không gửi thông báo
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { threadID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
  const hours = parseInt(moment.tz("Asia/Ho_Chi_Minh").format("HH"));
  const fullYear = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");

  // Lấy thông tin người rời nhóm
  let getData = {};
  try {
    getData = await Users.getData(event.logMessageData.leftParticipantFbId);
  } catch { getData = {}; }

  const name = getData.name || "Người dùng";
  // Nếu tự rời thì type là "rời", nếu bị quản lý đuổi thì type là "bị quản lý đuổi"
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "𝑟𝑜̛̀𝑖" : "𝑏𝑖̣ 𝑞𝑢𝑎̉𝑛 𝑙𝑦́ đ𝑢𝑜̂̉𝑖";

  // Random media từ thư mục nếu có (bạn có thể sửa sang dùng global.khanhdayr nếu thích)
  let randomAttachment = [];
  try {
    const { join } = require("path");
    const { readdirSync, existsSync, createReadStream } = require("fs-extra");
    const mediaPath = join(__dirname, "data", "leaveMedia");
    if (existsSync(mediaPath)) {
      const files = readdirSync(mediaPath);
      if (files.length > 0) {
        const file = files[Math.floor(Math.random() * files.length)];
        randomAttachment = [createReadStream(join(mediaPath, file))];
      }
    }
  } catch (e) {}

  // Nội dung thông báo đẹp và rõ ràng
  let msg = 
`😢 𝑇𝑎̣𝑚 𝑏𝑖𝑒̣̂𝑡 {name} đã {type} 𝑘ℎ𝑜̉𝑖 𝑛ℎ𝑜́𝑚!
━━━━━━━━━━━━━━━
🔗 𝐹𝐵: m.me/{iduser}
❤️‍🔥 𝑇ℎ𝑜̛̀𝑖 𝑔𝑖𝑎𝑛 𝑜𝑢𝑡: 𝑏𝑢𝑜̂̉𝑖 {session} || {time}
🗓️ 𝑁𝑔𝑎̀𝑦 𝑟𝑎: {fullYear}
━━━━━━━━━━━━━━━
🤖 𝐶𝑎̉𝑚 𝑜̛𝑛 {name} đ𝑎̃ đ𝑜̂̀𝑛𝑔 ℎ𝑎̀𝑛ℎ 𝑐𝑢̀𝑛𝑔 𝑛ℎ𝑜́𝑚 trong thời gian qua!`;

  msg = msg.replace(/{iduser}/g, event.logMessageData.leftParticipantFbId)
           .replace(/{name}/g, name)
           .replace(/{type}/g, type)
           .replace(/{session}/g, hours <= 10 ? "𝑠𝑎́𝑛𝑔" : hours <= 12 ? "𝑡𝑟𝑢̛𝑎" : hours <= 18 ? "𝑐ℎ𝑖𝑒̂̀𝑢" : "𝑡𝑜̂́𝑖")
           .replace(/{fullYear}/g, fullYear)
           .replace(/{time}/g, time);

  let formPush = { body: msg, attachment: randomAttachment.length > 0 ? randomAttachment : undefined };

  return api.sendMessage(formPush, threadID);
};