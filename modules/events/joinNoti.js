module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "2.1.0",
  credits: "pcoder",
  description: "Thông báo bot hoặc người vào nhóm có random gif/ảnh/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "moment-timezone": ""
  }
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID } = event;
  const { join } = require("path");
  const { readdirSync, existsSync } = require("fs-extra");
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
  const hours = parseInt(moment.tz("Asia/Ho_Chi_Minh").format("HH"));
  const fullYear = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
  const authorData = await Users.getData(event.author || "");
  const nameAuthor = authorData?.name || "link join";
  
  // Xử lý file ngẫu nhiên đính kèm (nếu có data/joinMedia/)
  let randomAttachment = [];
  try {
    const mediaPath = join(__dirname, "data", "joinMedia");
    if (existsSync(mediaPath)) {
      const files = readdirSync(mediaPath);
      if (files.length > 0) {
        const file = files[Math.floor(Math.random() * files.length)];
        randomAttachment = [require("fs-extra").createReadStream(join(mediaPath, file))];
      }
    }
  } catch (e) {
    // Nếu lỗi, bỏ qua attachment
  }

  // Nếu bot tự join
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`『 ${global.config.PREFIX} 』⪼ ${global.config.BOTNAME || "Bot Team TienDat"}`, threadID, api.getCurrentUserID());
    return api.sendMessage({
      body: `🤖 𝐕𝐢𝐧𝐜𝐞𝐧𝐭 𝑩𝒐𝒕 đã kết nối thành công!\n━━━━━━━━━━━━━━━\n• Dùng [ .menu ] để xem tất cả lệnh.\n• Cảm ơn bạn đã thêm bot vào nhóm!\n• Admin: https://www.facebook.com/pcoder090`,
      attachment: randomAttachment.length > 0 ? randomAttachment : undefined
    }, threadID);
  }

  // Người khác join
  try {
    const { threadName } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};

    let mentions = [], nameArray = [], iduser = [];
    for (let user of event.logMessageData.addedParticipants) {
      nameArray.push(user.fullName);
      iduser.push(user.userFbId.toString());
      mentions.push({ tag: user.fullName, id: user.userFbId });
    }

    // Tùy chỉnh thông báo join
    let msg = threadData.customJoin || `` +
      `🌟 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 {type} ✨\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 𝗧𝗲̂𝗻: {name}\n` +
      `🔗 𝗙𝗕: m.me/{iduser}\n` +
      `🏡 𝗡𝗵𝗼́𝗺: {threadName}\n` +
      `🕰️ 𝗩𝗮̀𝗼 𝗹𝘂́𝗰: {time}\n` +
      `🗓️ 𝗡𝗴𝗮̀𝘆 𝘃𝗮̀𝗼: {fullYear}\n` +
      `🥳 𝗡𝗴𝘂̛𝗼̛̀𝗶 𝘁𝗵𝗲̂𝗺: {author}\n` +
      `━━━━━━━━━━━━━━━\n` +
      `💬 𝗛𝗮̃𝘆 𝘃𝘂𝗶 𝘃𝗲̉, 𝗰𝗵𝗮̆𝗺 𝗰𝗵𝗶̉ 𝘃𝗮̀ 𝘁𝗶́𝗰𝗵 𝗰𝘂̛̣ 𝗻𝗵𝗲́!`;

    msg = msg.replace(/{iduser}/g, iduser.join(', '))
      .replace(/{name}/g, nameArray.join(', '))
      .replace(/{type}/g, (nameArray.length > 1) ? '𝒄𝒂́𝒄 𝒃ạ𝒏' : '𝒃ạ𝒏')
      .replace(/{threadName}/g, threadName)
      .replace(/{fullYear}/g, fullYear)
      .replace(/{author}/g, nameAuthor)
      .replace(/{time}/g, time);

    const formPush = { body: msg, mentions, attachment: randomAttachment.length > 0 ? randomAttachment : undefined };
    return api.sendMessage(formPush, threadID);
  } catch (e) {
    console.error(e);
  }
};