module.exports.config = {
  name: "daochu",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Khoa x Nam",
  description: "Đảo ngược text",
  commandCategory: "Tiện ích",
  cooldowns: 0,
  usages: "[text]"
};

module.exports.run = async function ({ event, api, args }) {
  var { threadID, messageID, body } = event;
  const send = msg => api.sendMessage(msg, threadID, messageID);
  if (event.type == 'message_reply' && event.messageReply.body !== "") return send(event.messageReply.body.split("").reverse().join(""));
  if (args.length == 0) return;
  return send(body.slice(body.indexOf(args[0])).split("").reverse().join(""));
}