module.exports.config = {
    name: "add",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hungcho x M-Drasew",
    description: "Thêm người dùng vào nhóm bằng link hoặc uid",
    commandCategory: "Tiện ích",
    usages: "[args]",
    cooldowns: 5
};
module.exports.run = async function ({ api, event, args, Threads, Users }) {
async function getUserByLink(data) {
            if (!data) return;
            var id = "";
            const paragraph = data;
            const regex = /(?:(?:http|https):\/\/)?(?:www.|m.)?facebook.com\/(?!home.php)(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\.-]+)/;
            const resault = paragraph.match(regex);
            var vanity = resault[1];
            var scan = isNaN(vanity);
            if (scan == true) {
                var value = await api.getUserID(vanity);
                value.forEach((i) => {
                    id = i.userID;
                });
            } else id = vanity;
            return id;
        };
const { threadID, messageID } = event;
const axios = require('axios')
const link = args.join(" ")
if(!args[0]) return api.sendMessage('Vui lòng nhập link hoặc id người dùng muốn thêm vào nhóm!', threadID, messageID);
var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
if(link.indexOf(".com/")!==-1) {
    const res = await getUserByLink(args[0] || event.messageReply.body);
    var uidUser = res
    api.addUserToGroup(uidUser, threadID, (err) => {
    if (participantIDs.includes(uidUser)) return api.sendMessage(`Thành viên đã có mặt trong nhóm`, threadID, messageID);
    if (err) return api.sendMessage(`Không thể thêm thành viên vào nhóm`, threadID, messageID);
    else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`Đã thêm người dùng vào danh sách phê duyệt`, threadID, messageID);
    else return api.sendMessage(`Thêm thành viên vào nhóm thành công`, threadID, messageID);
    });
    }
  else { 
    var uidUser = args[0] 
    api.addUserToGroup(uidUser, threadID, (err) => {
    if (participantIDs.includes(uidUser)) return api.sendMessage(`Thành viên đã có mặt trong nhóm`, threadID, messageID);
    if (err) return api.sendMessage(`Không thể thêm thành viên vào nhóm`, threadID, messageID);
    else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`Đã thêm người dùng vào danh sách phê duyệt`, threadID, messageID);
    else return api.sendMessage(`Thêm thành viên vào nhóm thành công`, threadID, messageID);
    });
  }
}