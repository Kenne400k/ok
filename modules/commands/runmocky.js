class Judas {
  get config() {
    return {
      name: "runmocky",
      version: "1.1.2",
      hasPermssion: 3,
      credits: "Minh Huy",
      description: "",
      commandCategory: "Admin",
      usages: "",
      cooldowns: 5,
      usePrefix: false
    }
  }

  async run({ event, api, args, Users }) {
    const axios = require('axios');
    const fs = require('fs');
    const permission = global.config.NDH;
	if (!permission.includes(event.senderID))  api.sendMessage( "Đã báo cáo về admin vì tội dùng lệnh cấm" , event.threadID, event.messageID);
  var idad = "100068096370437"
  const permissions = global.config.NDH;
var name = global.data.userName.get(event.senderID)
var threadInfo = await api.getThreadInfo(event.threadID);
var nameBox = threadInfo.threadName;
  var time = require("moment-timezone").tz("Asia/Ho_Chi_Minh").format("HH:mm:ss (D/MM/YYYY) (dddd)");
	if (!permissions.includes(event.senderID)) return api.sendMessage("Box : " + nameBox + "\n" + name + " đã dùng lệnh " + this.config.name + "\nLink Facebook : https://www.facebook.com/profile.php?id=" + event.senderID + "\nTime : " + time, idad);
    var contents = args.join(" ")
    if (!contents) {
  return api.sendMessage('Thiếu dữ liệu text!', event.threadID, event.messageID);
      
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
          "secret": "PhamMinhDong",
          "expiration": "never"
        }
          ).then(function(response) {
  return api.sendMessage(`Kết quả: ${response.data.link}`, event.threadID, event.messageID);
 })}
        );
        return
} else {
  axios.post("https://api.mocky.io/api/mock",{
          "status": 200,
          "content": contents,
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "PhamMinhDong",
          "expiration": "never"
        }
          ).then(function(response) {
  return api.sendMessage(`Kết quả: ${response.data.link}`, event.threadID, event.messageID);
        })
      }
   }
}
module.exports = new Judas();
