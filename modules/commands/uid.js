module.exports.config = {
  name: "uid",
  version: "1.0.6",
  hasPermssion: 0,
  credits: "Mirai Team mod by Hphong",
  description: "Lấy ID người dùng hoặc ID nhóm.",
  commandCategory: "Người dùng",
  usePrefix: false,
  cooldowns: 0
};

const axios = require("axios");
const fse = require("fs-extra");
const moment = require("moment");

global.khanhdayr = global.khanhdayr || [];

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;
  const userInfo = await api.getUserInfo(senderID);
  const name = userInfo[senderID]?.name || "Người dùng";

  if (args[0] === "box") {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const boxName = threadInfo.name || "Không có tên";
      const boxID = threadInfo.threadID;
      return api.sendMessage({ body: `Tên nhóm: ${boxName}\nID của box là: ${boxID}`, attachment: global.khanhdayr.splice(0, 1) || [] }, threadID, messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("⚠️ Không thể lấy thông tin nhóm.", threadID, messageID);
    }
  }

  if (type === "message_reply") {
    const uid = messageReply.senderID;
    const repliedUserInfo = await api.getUserInfo(uid);
    const repliedName = repliedUserInfo[uid]?.name || "Người dùng";
    return api.sendMessage({ body: `Tên: ${repliedName}\nUID của bạn: ${uid}`, attachment: global.khanhdayr.splice(0, 1) || [] }, threadID, messageID);
  }

  if (!args[0]) {
    return api.sendMessage({ body: `Tên: ${name}\nUID của bạn: ${senderID}`, attachment: global.khanhdayr.splice(0, 1) || [] }, threadID, messageID);
  }

  if (args[0].includes(".com/")) {
    try {
      const link = args[0];
      const { data } = await axios.get(`https://ffb.vn/api/tool/get-id-fb?idfb=${encodeURIComponent(link)}`);
      
      if (!data || data.error !== 0 || !data.id || !data.name) {
        return api.sendMessage("⚠️ Không thể lấy ID từ liên kết này.", threadID, messageID);
      }
      return api.sendMessage({ body: `Tên: ${data.name}\nUID của bạn: ${data.id}`, attachment: global.khanhdayr.splice(0, 1) || [] }, threadID, messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("⚠️ Đã xảy ra lỗi khi lấy ID.", threadID, messageID);
    }
  }

  if (mentions && Object.keys(mentions).length > 0) {
    for (const [id, mentionName] of Object.entries(mentions)) {
      return api.sendMessage({ body: `${mentionName.replace('@', '')}: ${id}`, attachment: global.khanhdayr.splice(0, 1) || [] }, threadID, messageID);
    }
  } else {
    return api.sendMessage("⚠️ Vui lòng tag người dùng để lấy UID.", threadID, messageID);
  }
};