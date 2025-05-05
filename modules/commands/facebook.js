module.exports.config = {
    name: "facebook",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Q.Huy",
    description: "fbget audio/video [link video] dạng 1000xxxx/video/idviddeo",
  commandCategory: "Tiện ích",
  usages: "fbget audio/video [link video] dạng 1000xxxx/video/idviddeo",
  cooldowns: 0

};
module.exports.run = async function ({ api, event, args, utils  })  {
    if (args == 0) return api.sendMessage(` ==== HƯỚNG DẪN SỬ DỤNG ====\n━━━━━━━━━━━━━━━━━━\n/facebook video <link> → Tải video từ facebook\n/facebook audio <link> → Tải âm nhạc từ facebook `, event.threadID);
const axios = global.nodemodule['axios'];  
const fs = global.nodemodule["fs-extra"];
try { 
  if(args[0] == 'audio'){
 let getPorn = (await axios.get(event.attachments[0].playableUrl,{ responseType:'arraybuffer'} )).data;
  fs.writeFileSync(__dirname+`/cache/2.mp3`, Buffer.from(getPorn, "utf-8"));
return api.sendMessage({body : `→ Đã Tải Thành Công Âm Nhạc`, attachment: fs.createReadStream(__dirname+`/cache/2.mp3`)}, event.threadID, () => fs.unlinkSync(__dirname+`/cache/2.mp3`));
    }; 
  } 
    catch { 
      return api.sendMessage("Không thể xử lý yêu cầu!",event.threadID,event.messageID)}
    try { 
      if(args[0] == 'video'){
 let getPorn = (await axios.get(event.attachments[0].playableUrl,{ responseType:'arraybuffer'} )).data;
  fs.writeFileSync(__dirname+`/cache/1.mp4`, Buffer.from(getPorn, "utf-8"));
return api.sendMessage({body : `→ Đã Tải Thành Công Video`, attachment: fs.createReadStream(__dirname+`/cache/1.mp4`)}, event.threadID, () => fs.unlinkSync(__dirname+`/cache/1.mp4`));
    }; 
  } 
  catch 
  {
   return api.sendMessage("Không thể xử lý yêu cầu!",event.threadID,event.messageID)}
    }