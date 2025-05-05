module.exports.config = {
  name: "getinfo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "D-Jukie",
  description: "Xem thông tin của người dùng facebook",
  commandCategory: "Thông tin",
  usages: "[reply/tag/id]",
  cooldowns: 3

};

module.exports.run = async function ({ api, event, args, Users }) {

  const { threadID, messageID, senderID, type, mentions } = event;
 const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  const axios = global.nodemodule['axios'];

  if (type == "message_reply") {
      var uid = event.messageReply.senderID
  } else if (args.join().indexOf(".com/") !== -1) {
      const res_ID = await axios.get(`https://docs-api.nguyenhaidang.ml/finduid?url=${args.join(' ')}`);
      var uid = res_ID.data.id;
  } else if (args.join().indexOf('@') !== -1) {
      var uid = Object.keys(mentions)[0]
  } else {
      var uid = senderID
  }
  var data = (await Users.getUserFull(uid)).data;
  try {
      var location = data.location.name || null;
  }
  catch {
       var location = null
  }
  try {
      var love = data.love.name || null;
  }
  catch {
       var love = null
  }
  try {
      var hometown = data.hometown.name || null;
  }
  catch {
       var hometown = null
  }
  var gender = data.gender.replace('female', 'Nữ')
                          .replace('male', 'Nam')
 var callback = () => api.sendMessage({body:`=== 『𝑻𝒉𝒐̂𝒏𝒈 𝑻𝒊𝒏』 ===\n\n→ Tên: ${data.name}\n→ Người theo dõi: ${data.follow}\n→ Sinh nhật: ${data.birthday}\n→ Giới tính: ${gender}\n→ Nơi sống: ${location}\n→ Quê quán: ${hometown}\n→ Mối quan hệ: ${data.relationship_status}${(love != null) ? ' với ' + love : ''}\n`, attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID,
      () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID ); 
  return request(encodeURI(`https://graph.facebook.com/v12.0/${uid}/picture?height=240&width=240&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',
      () => callback());

}