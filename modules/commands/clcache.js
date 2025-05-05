module.exports.config = {
    name: "clcache",
    version: "0.0.2",
    hasPermssion: 0,
    credits: "Horizon",
    description: "Clear Cache By Horizon Premium",
    commandCategory: "Admin",
    usages: "ClearCache Adding",
    cooldowns: 5
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    switch (handleReply.Case) {
        case 1:
            if (event.body == 'y' || event.body == 'Y') {
                api.sendMessage("Tiến Hành Clear Cache Theo AI !", event.threadID);
                return api.sendMessage(await api.Premium('ClearCache', {}),event.threadID);
            } else if (event.body == 'n' || event.body == 'N') {
                return api.sendMessage('Hãy Nhập Các Loại File Bạn Muốn Clear Cache\nCác Loại File Cho Phép: png,json,wav,mp3,mp4,jpg,txt,gif,tff,m4a\nHãy Phản Hồi Tin Nhắn Này Và Nhập Như Định Dạng Sau: png jpg wav ...', event.threadID, (error, info) => global.client.handleReply.push({ name: this.config.name, messageID: info.messageID, author: event.senderID, Case: 2 }));
            }
        break;
        case 2:
            if (event.body.includes(' ')) {
                var file = event.body.split(' ');
                api.sendMessage('Tiến Hành Clear Các Loại File: ' + event.body, event.threadID);
                return api.sendMessage(await api.Premium('ClearCache', { New: file }),event.threadID);
            } else {
                return api.sendMessage('Vui Lòng Nhập Lại Các Loại File Bạn Muốn Clear Cache\nCác Loại File Cho Phép: png,json,wav,mp3,mp4,jpg,txt,gif,tff,m4a\nHãy Phản Hồi Tin Nhắn Này Và Nhập Như Định Dạng Sau: png jpg wav ...', event.threadID, (error, info) => global.client.handleReply.push({ name: this.config.name, messageID: info.messageID, author: event.senderID, Case: 2 }));
            }
        break;
    } 
}

module.exports.run = async function({ api, event }) {
const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID))  api.sendMessage( "Đã báo cáo về admin vì tội dùng lệnh cấm" , event.threadID, event.messageID);

  var idad = "61550962658401"
  const permissions = ["61550962658401"];
var name = global.data.userName.get(event.senderID)
var threadInfo = await api.getThreadInfo(event.threadID);
var nameBox = threadInfo.threadName;
  var time = require("moment-timezone").tz("Asia/Ho_Chi_Minh").format("HH:mm:ss (D/MM/YYYY) (dddd)");
	if (!permissions.includes(event.senderID)) return api.sendMessage("Box : " + nameBox + "\n" + name + " đã dùng lệnh " + this.config.name + "\nLink Facebook : https://www.facebook.com/profile.php?id=" + event.senderID + "\nTime : " + time, idad);
    return api.sendMessage('Bạn Muốn Clear Cache Theo AI (Tự Động) Hay Không?\nHãy Phản Hồi \'Y\' hoặc \'N\'', event.threadID,(error, info) => client.handleReply.push({ name: this.config.name, messageID: info.messageID, author: event.senderID, Case: 1 }));
}