module.exports.config = {
  name: "idsticker",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sam",
  description: "Save sticker id",
  commandCategory: "Tiện ích",
  usages: "[reply]",
  cooldowns: 5   
}

module.exports.run = async function ({ api, event, args }) {
  if (event.type == "message_reply") {
    if (event.messageReply.attachments[0].type == "sticker") {
      return api.sendMessage({
        body: `ID: ${event.messageReply.attachments[0].ID}\nCaption: ${event.messageReply.attachments[0].description}`
      }, event.threadID)
    }
    else return api.sendMessage("Vui lòng reply 1 nhãn!", event.threadID);
  }
  else if (args[0]) {
    return api.sendMessage({body:`Đây là nhãn dán`, sticker: args[0]}, event.threadID);
  }
  else return api.sendMessage("Vui lòng reply 1 nhãn nào đó!", event.threadID);
}