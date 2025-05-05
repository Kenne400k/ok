module.exports.config = {
  name: "autobanthread",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "NTKhang",
  description: "tự động cấm nhóm dùng bot nếu spam bot 10 lần/phút",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 5
 };
 
 module.exports.run = ({api, event}) => {
   api.sendMessage("auto ban thread nếu spam bot", event.threadID, event.messageID);
 };
 
 module.exports.handleEvent = async ({ Threads, api, event}) => {
   const fs = require("fs-extra");
   const moment = require("moment-timezone");
   
   let { senderID, messageID, threadID } = event;
   const so_lan_spam = 100; // số lần spam, vượt quá sẽ bị ban
   const thoi_gian_spam = 600000; // 60000 millisecond (5 phút)
   const unbanAfter = 600000; // 600000 millisecond (10 phút) 
   if (!global.client.autobanthread) global.client.autobanthread = {};
   
   if (!global.client.autobanthread[threadID]) {
     global.client.autobanthread[threadID] = {
       timeStart: Date.now(),
       number: 0
     }
   };
   
   const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  if (!event.body || event.body.indexOf(prefix) != 0) return;
  
  let dataThread = (await Threads.getData(threadID)) || {};
  let data = dataThread.data;
  
  if ((global.client.autobanthread[threadID].timeStart + thoi_gian_spam) <= Date.now()) {
    global.client.autobanthread[threadID] = {
      timeStart: Date.now(),
      number: 0
    }
  }
  else {
    global.client.autobanthread[threadID].number++;
    if (global.client.autobanthread[threadID].number >= so_lan_spam) {
      const time = moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss - DD/MM/YYYY");
      if (data && data.banned == true) return;
      data.banned = true;
      data.reason = `spam bot ${so_lan_spam} lần/${thoi_gian_spam/600000} phút`;
      data.dateAdded = time;
      await Threads.setData(threadID, { data });
      global.data.threadBanned.set(threadID, { reason: data.reason, dateAdded: data.dateAdded });
      global.client.autobanthread[threadID] = {
        timeStart: Date.now(),
        number: 0
      };
      api.sendMessage(`\n→ Tên Nhóm: ${dataThread.threadInfo.threadName}\n→ ID Nhóm: ${threadID}\n→ Nhóm đã bị cấm sử dụng bot\n→ lý do: spam bot ${so_lan_spam} lần/${thoi_gian_spam/60000} phút\n→ Sẽ tự động gỡ ban nhóm sau 10 phút, hẹn gặp lại`, threadID, () => {
        setTimeout(async function() {
          delete data.autoban;
          data.banned = false;
          data.reason = null;
          data.dateAdded = null;
          await Threads.setData(threadID, { data });
          global.data.threadBanned.delete(threadID);
        api.sendMessage("Chúc mừng nhóm bạn đã được gỡ ban thành công.", threadID);
        }, unbanAfter);
      });
      api.sendMessage(`→ Đã ban nhóm: ${dataThread.threadInfo.threadName}\n→ ID nhóm: ${threadID}\n→ Lý do spam bot ${so_lan_spam} lần/${Math.floor(thoi_gian_spam/60000)} phút\n→ Thời gian: ${time}\n→ Tự đông gỡ ban sau 10p`, global.config.ADMINBOT[0]);
    }
  }
 };
 
 // FIX