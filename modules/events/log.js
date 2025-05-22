module.exports.config = {
  name: "log",
  eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
  version: "1.1.0",
  credits: "pcoder",
  description: "Ghi lại thông báo các hoạt động của bot!",
  envConfig: {
    enable: true
  }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  // Check enable config
  if (!global.configModule[this.config.name].enable) return;

  const axios = require("axios");
  const moment = require("moment-timezone");
  const logger = require("../../utils/log");
  const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");

  // Lấy thông tin thread
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
  const threadInfo = await api.getThreadInfo(event.threadID);
  const threadName = threadInfo.threadName || "Tên không tồn tại";
  const botID = api.getCurrentUserID();
  const threadMem = threadInfo.participantIDs.length;
  const qtv = threadInfo.adminIDs.length;
  const icon = threadInfo.emoji || "Không sử dụng";
  const sex = threadInfo.approvalMode;
  const pd = sex === false ? "Tắt" : sex === true ? "Bật" : "\n";
  const nameUser = global.data.userName.get(event.author) || await Users.getNameUser(event.author);

  let task = "";
  let newName = "";

  switch (event.logMessageType) {
    case "log:thread-name": {
      newName = event.logMessageData.name || "Tên không tồn tại";
      task = `『📝』Người dùng đã thay đổi tên nhóm thành: ${newName}`;
      await Threads.setData(event.threadID, { name: newName });
      break;
    }
    case "log:subscribe": {
      if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
        task = "『🤖』Người dùng đã thêm bot vào một nhóm mới!";
      }
      break;
    }
    case "log:unsubscribe": {
      if (event.logMessageData.leftParticipantFbId == botID) {
        if (event.senderID == botID) return;
        const data = (await Threads.getData(event.threadID)).data || {};
        data.banned = true;
        data.reason = "Kích bot tự do, không xin phép";
        data.dateAdded = time;
        await Threads.setData(event.threadID, { data });
        global.data.threadBanned.set(event.threadID, { reason: data.reason, dateAdded: data.dateAdded });
        task = "『❌』Người dùng đã kick bot ra khỏi nhóm!";
      }
      break;
    }
    default: break;
  }

  if (!task) return;

  // Form thông báo đẹp
  let formReport =
`▭▭▭[ 𝗕𝗢𝗧 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 ]▭▭▭
━━━━━━━━━━━━━━━━━━
『🧸』𝗧𝗲̂𝗻 𝗻𝗵𝗼́𝗺: ${threadName}
『🔰』𝗧𝗜𝗗: ${event.threadID}
『👥』𝗦𝗼̂́ 𝘁𝗵𝗮̀𝗻𝗵 𝘃𝗶𝗲̂𝗻: ${threadMem}
『🧩』𝗣𝗵𝗲̂ 𝗱𝘂𝘆𝗲̣̂𝘁: ${pd}
『⚜️』𝗤𝘂𝗮̉𝗻 𝘁𝗿𝗶̣ 𝘃𝗶𝗲̂𝗻: ${qtv}
『😻』𝗕𝗶𝗲̂̉𝘂 𝘁𝘂̛𝗼̛̣𝗻𝗴 𝗰𝗮̉𝗺 𝘅𝘂́𝗰: ${icon}
━━━━━━━━━━━━━━━━━━
『💞』𝗛𝗮̀𝗻𝗵 đ𝗼̣̂𝗻𝗴: ${task}
『👤』𝗧𝗲̂𝗻 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: ${nameUser}
『🍄』𝗨𝘀𝗲𝗿 𝗶𝗱: ${event.author}
『🌐』𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/profile.php?id=${event.author}
━━━━━━━━━━━━━━━━━━
⏰️=『${time}』=⏰️`;

  // Random số lượng ảnh (2 hoặc 3)
  const so = ["2", "3"];
  const dongdev = so[Math.floor(Math.random() * so.length)];
  let imgurl = [];
  try {
    const imageUrls = await Promise.all(Array.from({ length: Number(dongdev) }, async () => {
      const res = await axios.get(`${global.config.configApi.domain}/images/gai?apikey=${global.config.configApi.keyApi}`);
      return res.data.data;
    }));
    imgurl = await Promise.all(imageUrls.map(async (url) => {
      return (await axios({
        url,
        method: "GET",
        responseType: "stream"
      })).data;
    }));
  } catch (e) {
    // Nếu lỗi API hình ảnh, chỉ gửi text
    imgurl = [];
  }

  // Gửi thông báo về ADMINBOT[0], nếu lỗi ghi log
  return api.sendMessage(
    { body: formReport, attachment: imgurl.length > 0 ? imgurl : undefined },
    global.config.ADMINBOT[0],
    (error, info) => {
      if (error) return logger(formReport, "[ Logging Event ]");
    }
  );
};