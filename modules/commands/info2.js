const axios = require("axios")
const fs = require("fs-extra");
module.exports.config = {
    name: "info2",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "hong biec",
    description: "Xem thông tin của nhóm/người dùng",
    commandCategory: "info",
    usages: "",
    cooldowns: 3,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.run = async ({ api, event, args, Users, Currencies }) => {
    var uid = event.type == 'message_reply' ? event.messageReply.senderID : Object.keys(event.mentions).length != 0 ? Object.keys(event.mentions)[0] : !!args[0] && !!args[0] ? args[0] : event.senderID;
    var data = await Users.getInfo(uid);
    var { isFriend, isBirthday } = data;
    var gender = data.gender == 2 ? "Nam" : data.gender == 1 ? "Nữ" : "Unknown";
    api.getUserInfoV2(uid).then(async res => {
        console.log(res)
        var { name, first_name, follow, birthday, relationship_status, website, love, location, hometown, link } = res
        const timeJoin = (await axios.get('https://golike.com.vn/func-api.php?user=' + uid)).data.data.date,
            checkBan = global.data.userBanned.has(uid) ? "Đang bị cấm" : "Không bị cấm",
            { money, exp } = (await Currencies.getData(uid));
        global.config.ADMINBOT.includes(uid) ? perm = "Admin Bot" : (await api.getThreadInfo(event.threadID)).adminIDs.includes(uid) ? perm = "Admin Nhóm" : perm = "Thành Viên";
        const getImg = await this.getImages(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=100038740121428|csqGyA8VWtIhabZZt-yhEBStl9Y`);
        return api.sendMessage({
            body: `==== 𝗜𝗡𝗙𝗢 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 ====\n━━━━━━━━━━━━━━━━━━\n→ Tên: ${first_name}.\n→Tên đầy đủ: ${name}.\n→ UID: ${uid}.\n→ Link Facebook: ${link}.\n→ Giới tính: ${gender}.\n→ Mối quan hệ: ${relationship_status ? relationship_status : "Unknown"}.\n→ Đối với Bot: ${isFriend ? "Đã kết bạn" : "Chưa kết bạn"}.\n→ Ngày sinh: ${birthday ? birthday : "Unknown"}.\n→ Website: ${website ? website : "Unknown"}.\n→ Nơi ở hiện tại: ${location.name ? location.name : "Unknown"}.\n→ Quê quán: ${hometown.name ? hometown.name : "Unknown"}.\n→ Yêu thích: ${love ? love : "Unknown"}.\n→ Số người theo dõi: ${follow ? follow : "Unknown"}.\n→ Ngày tạo Facebook: ${timeJoin}.\n→ Số dư hiện tại: ${money}.\n→ Sử dụng Bot: ${checkBan}.\n→ Ngày sinh nhật: ${isBirthday ? "Hôm nay là sinh nhật" : "Hôm nay không phải sinh nhật"}.\n→ Số tin nhắn: ${exp}.\n→ Quyền hạn: ${perm}.`,
            attachment: fs.createReadStream(getImg)
        }, event.threadID, event.messageID);
    }).catch(err => console.log(err));
}
module.exports.getImages = async function (e) {
    const a = __dirname + "/cache/avt.png";
    let t = (await axios.get(e, {
        responseType: "arraybuffer"
    })).data;
    return fs.writeFileSync(a, Buffer.from(t, "utf-8")), a;
};