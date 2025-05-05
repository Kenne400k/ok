class Judas {
  get config() {
    return {
      name: "upcode",
      version: "1.1.2",
      hasPermssion: 2,
      credits: "Minh Huy Dev(Loren Bot py)",
      description: "Lấy code từ file ra",
      commandCategory: "Admin",
      usages: "",
      cooldowns: 0
    }
  }

  async run({ event, api, args, Users }) {
    const axios = require('axios');
    const fs = require('fs');
     if (event.senderID != 100085073240621) return api.sendMessage(`Không thể gửi file`, event.threadID, event.messageID)
    var contents = args.join(" ")
    if (!contents) {
  return api.sendMessage('thiếu dữ liệu text!', event.threadID, event.messageID);

  }
if(contents.endsWith(".js")){
 var data = fs.readFile(
          `${__dirname}/${contents}`,
          "utf-8",
          async (err, data) => {
            if (err) return api.sendMessage(`Lệnh ${contents} không tồn tại!.`, event.threadID, event.messageID);
        axios.post("https://api.mocky.io/api/mock",{
          "status": 200,
          "content": data,
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "NguyenMinhHuy",
          "expiration": "never"
        }
          ).then(function(response) {
  return api.sendMessage(`${response.data.link}`, event.threadID, event.messageID);
 })}
        );
        return
} else {
  axios.post("https://api.mocky.io/api/mock",{
          "status": 200,
          "content": contents,
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "NguyenMinhHuy",
          "expiration": "never"
        }
          ).then(function(response) {
  return api.sendMessage(`${response.data.link}`, event.threadID, event.messageID);
 })
}
}
}
module.exports = new Judas();