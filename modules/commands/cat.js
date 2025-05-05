module.exports.config = {
  name: "cat",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "tdunguwu",
  description: "Happy birthday cat",
  commandCategory: "Tạo ảnh",
  cooldowns: 0,
  dependencies: {
      "fs-extra": "",
      "request": ""
  }
};
module.exports.run = async ({ api, event,args }) => {  {

  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
 const { threadID, messageID, senderID, body } = event;
 var text = args.toString().replace(/,/g,  '  ');
if (!text)
  return api.sendMessage("thíu dữ kịn :<", event.threadID, event.messageID);
 var callback = () => api.sendMessage({body:``,attachment: fs.createReadStream(__dirname + "/cache/satcat.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/satcat.png"),event.messageID);
 return request(encodeURI(`https://api.popcat.xyz/sadcat?text=${text}`)).pipe(fs.createWriteStream(__dirname+'/cache/satcat.png')).on('close',() => callback());     
}}