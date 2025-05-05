 module.exports.config = {
  name: "tag",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "lekhanh",
  description: "tag admin bot reply",
  commandCategory: "Admin",
  usages: "[]",
  cooldowns: 1
};

module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "61550962658401") {
    var aid = ["61550962658401"]; ///// điền uid fb mày vào
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["Admin đang bận !", `Dùng ${config.PREFIX}callad + nội dung cần gửi!` ,"Vui lòng chờ đợi Admin trả lời, cấm spam !"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};

module.exports.run = async function({}) {}