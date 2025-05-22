const fs = require("fs-extra");
const request = require("request");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "box",
  version: "2.2.0",
  hasPermssion: 0,
  credits: "pcoder",
  description: "Các cài đặt của nhóm",
  commandCategory: "Thông tin",
  usages: "[id/name/setnamebox/emoji/me setqtv/setqtv/image/info/new/taobinhchon/setname/setnameall/rdcolor]",
  cooldowns: 0,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "request": ""
  }
};

const totalPath = path.join(__dirname, 'cache', 'totalChat.json');
const _24hours = 86400000;

// Ensure cache dir exists
if (!fs.existsSync(path.join(__dirname, 'cache'))) fs.mkdirSync(path.join(__dirname, 'cache'));

module.exports.handleEvent = async ({ api, event }) => {
  if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
  let totalChat = JSON.parse(fs.readFileSync(totalPath));
  if (!totalChat[event.threadID]) return;
  if (Date.now() - totalChat[event.threadID].time > (_24hours * 2)) {
    let sl = (await api.getThreadInfo(event.threadID)).messageCount;
    totalChat[event.threadID] = {
      time: Date.now() - _24hours,
      count: sl,
      ytd: sl - totalChat[event.threadID].count
    };
    fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
  }
};

module.exports.handleReply = function({ api, event, handleReply }) {
  const { threadID, senderID, body } = event;
  if (senderID != handleReply.author) return;
  return api.createPoll(body, event.threadID, handleReply.obj, (err, info) => {
    if (err) return console.log(err);
    else {
      api.sendMessage(`[⚜️]➜ Bình chọn ${body} đã được tạo`, threadID);
      api.unsendMessage(handleReply.messageID);
      global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
    }
  });
};

module.exports.run = async function({ api, event, args, Users, Threads }) {
  const { threadID, messageID, senderID, type, mentions, messageReply } = event;
  const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
  const fullTime = global.client.getTime("fullTime");
  const prefix = global.config.PREFIX;

  if (args.length === 0) {
    return api.sendMessage(
      `[⚜️]➜ 𝗕𝗢𝗫 𝗖𝗢𝗡𝗙𝗜𝗚 ←[⚜️]\n──────────────\n` +
      `[⚜️]➜ ${prefix}${this.config.name} id → Lấy ID của nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} name → Lấy tên nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} setname < tên > → Đổi tên nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} emoji < icon > → Đổi icon nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} info → Xem thông tin nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} me setqtv → Bot sẽ thêm bạn làm Quản trị viên nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} setqtv < tag > → Thêm người dùng làm Quản trị viên nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} image < phản hồi ảnh > → Đổi ảnh bìa nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} new < tag > → Tạo 1 nhóm mới với những người được tag!\n` +
      `[⚜️]➜ ${prefix}${this.config.name} info < tag > → Xem thông tin người dùng facebook\n` +
      `[⚜️]➜ ${prefix}${this.config.name} taobinhchon → Tạo bình chọn trong nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} setname < tag/phản hồi > < biệt danh > → Đặt biệt danh thành viên nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} setnameall < biệt danh > → Đặt biệt danh đồng bộ tất cả thành viên nhóm\n` +
      `[⚜️]➜ ${prefix}${this.config.name} rdcolor → Thiết lập chủ đề nhóm ngẫu nhiên\n\n` +
      `━━━━━━━━━━━━━━━\n[⚜️]=== 『 𝐁𝐎𝐓 𝐉𝐑𝐓 』 ===[⚜️]\n\n===「${timeNow}」===`, threadID
    );
  }

  // -- NEW GROUP --
  if (args[0] === "new") {
    let id = [senderID];
    for (var uid of Object.keys(event.mentions)) id.push(uid);
    let groupTitle = event.body.includes("|") ? event.body.split("|")[1].trim() : "Nhóm mới";
    api.createNewGroup(id, groupTitle, () => {
      api.sendMessage(`[⚜️]➜ Đã tạo nhóm ${groupTitle}`, threadID);
    });
    return;
  }

  // -- ID --
  if (args[0] === "id")
    return api.sendMessage(`[⚜️]➜ ID của box đây: ${threadID}`, threadID, messageID);

  // -- NAME --
  if (args[0] === "name") {
    let nameThread =
      global.data.threadInfo.get(threadID)?.threadName ||
      (await Threads.getData(threadID)).threadInfo?.threadName;
    return api.sendMessage(nameThread || "Không thể lấy tên nhóm", threadID, messageID);
  }

  // -- NAMEBOX --
  if (args[0] === "namebox") {
    let c = args.slice(1).join(" ") || messageReply?.body || "";
    if (!c) return api.sendMessage("Vui lòng nhập tên box hoặc reply một tin nhắn có tên.", threadID, messageID);
    api.setTitle(c, threadID);
    return api.sendMessage(`[⚜️]➜ Đã đặt tên box thành: ${c}`, threadID, messageID);
  }

  // -- EMOJI --
  if (args[0] === "emoji") {
    let emoji = args[1] || messageReply?.body;
    if (!emoji) return api.sendMessage("Vui lòng nhập emoji hoặc reply emoji.", threadID, messageID);
    api.changeThreadEmoji(emoji, threadID);
    return api.sendMessage(`[⚜️]➜ Đã đổi emoji nhóm thành: ${emoji}`, threadID, messageID);
  }

  // -- ME SETQTV --
  if (args[0] === "me" && args[1] === "setqtv") {
    let threadInfo = await api.getThreadInfo(threadID);
    let botIsAdmin = threadInfo.adminIDs.some(el => el.id == api.getCurrentUserID());
    if (!botIsAdmin) return api.sendMessage("[⚜️]➜ BOT cần quyền quản trị viên.", threadID, messageID);
    if (!global.config.ADMINBOT.includes(senderID))
      return api.sendMessage("[⚜️]➜ Bạn không đủ quyền để sử dụng chức năng này.", threadID, messageID);
    api.changeAdminStatus(threadID, senderID, true);
    return api.sendMessage("[⚜️]➜ Đã thêm bạn làm Quản trị viên nhóm.", threadID, messageID);
  }

  // -- SETQTV --
  if (args[0] === "setqtv") {
    let threadInfo = await api.getThreadInfo(threadID);
    let botIsAdmin = threadInfo.adminIDs.some(el => el.id == api.getCurrentUserID());
    let youAreAdmin = threadInfo.adminIDs.some(el => el.id == senderID);
    if (!youAreAdmin) return api.sendMessage("[⚜️]➜ Bạn không phải quản trị viên.", threadID, messageID);
    if (!botIsAdmin) return api.sendMessage("[⚜️]➜ BOT cần quyền quản trị viên.", threadID, messageID);

    let targetID = messageReply ? messageReply.senderID :
      Object.keys(mentions).length ? Object.keys(mentions)[0] : args[1];
    if (!targetID) return api.sendMessage("Vui lòng tag hoặc reply người cần set/unset qtv.", threadID, messageID);

    let isTargetAdmin = threadInfo.adminIDs.some(el => el.id == targetID);
    api.changeAdminStatus(threadID, targetID, !isTargetAdmin);
    return api.sendMessage(`[⚜️]➜ Đã ${isTargetAdmin ? "gỡ" : "thêm"} quản trị viên cho ID ${targetID}.`, threadID, messageID);
  }

  // -- IMAGE --
  if (args[0] === "image") {
    if (type !== "message_reply" || !messageReply?.attachments?.length)
      return api.sendMessage("[⚜️]➜ Bạn phải reply một audio, video, ảnh nào đó.", threadID, messageID);
    if (messageReply.attachments.length > 1)
      return api.sendMessage("[⚜️]➜ Chỉ được reply một file duy nhất.", threadID, messageID);

    let imgPath = path.join(__dirname, "cache", "box_image.png");
    let callback = () => api.changeGroupImage(fs.createReadStream(imgPath), threadID, () => fs.unlinkSync(imgPath));
    request(encodeURI(messageReply.attachments[0].url)).pipe(fs.createWriteStream(imgPath)).on('close', callback);
    return;
  }

  // -- TAOBINHCHON --
  if (args[0] === "taobinhchon") {
    let options = args.slice(1).join(" ").split("|").map(s => s.trim()).filter(Boolean);
    if (!options.length) return api.sendMessage("Vui lòng nhập các lựa chọn sau lệnh, phân cách bởi dấu |", threadID, messageID);
    let obj = {};
    for (let item of options) obj[item] = false;
    api.sendMessage(`[⚜️]➜ Đã tạo các lựa chọn: ${options.join(", ")}\nHãy reply tin nhắn này để đặt tiêu đề bình chọn.`, threadID, (err, info) => {
      if (err) return console.log(err);
      else {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          obj
        });
      }
    });
    return;
  }

  // -- SETNAME (nickname) --
  if (args[0] === "setname") {
    let name = args.slice(2).join(" ") || args.slice(1).join(" ");
    let targetID = messageReply ? messageReply.senderID :
      Object.keys(mentions).length ? Object.keys(mentions)[0] : senderID;
    if (!name) return api.sendMessage("Vui lòng nhập biệt danh.", threadID, messageID);
    api.changeNickname(name, threadID, targetID);
    return api.sendMessage(`[⚜️]➜ Đã đổi biệt danh thành: ${name}`, threadID, messageID);
  }

  // -- RDCOLOR --
  if (args[0] === "rdcolor") {
    let colorCodes = [
      '196241301102133', '169463077092846', '2442142322678320', '234137870477637',
      '980963458735625', '175615189761153', '2136751179887052', '2058653964378557',
      '2129984390566328', '174636906462322', '1928399724138152', '417639218648241',
      '930060997172551', '164535220883264', '370940413392601', '205488546921017',
      '809305022860427'
    ];
    api.changeThreadColor(colorCodes[Math.floor(Math.random() * colorCodes.length)], threadID);
    return api.sendMessage("[⚜️]➜ Đã đổi màu chủ đề nhóm ngẫu nhiên.", threadID, messageID);
  }

  // -- SETNAMEALL --
  if (args[0] === "setnameall") {
    let threadInfo = await api.getThreadInfo(threadID);
    let idtv = threadInfo.participantIDs;
    let name = args.slice(1).join(" ");
    if (!name) return api.sendMessage("Vui lòng nhập biệt danh để đồng bộ.", threadID, messageID);
    for (let uid of idtv) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      api.changeNickname(name, threadID, uid);
    }
    return api.sendMessage(`[⚜️]➜ Đã đồng bộ biệt danh tất cả thành: ${name}`, threadID, messageID);
  }

  // -- INFO (GROUP STATS) --
  if (args[0] === "info") {
    try {
      if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
      let totalChat = JSON.parse(fs.readFileSync(totalPath));
      let threadInfo = await api.getThreadInfo(args[1] || threadID);
      let timeByMS = Date.now();
      const threadSetting = (await Threads.getData(String(threadID))).data || {};

      let participantIDs = threadInfo.participantIDs;
      let adminIDs = threadInfo.adminIDs;
      let threadUserInfo = threadInfo.userInfo || [];
      let memLength = participantIDs.length;
      let gendernam = threadUserInfo.filter(u => u.gender === "MALE").length;
      let gendernu = threadUserInfo.filter(u => u.gender === "FEMALE").length;

      let adminName = [];
      for (const admin of adminIDs) {
        const name = await Users.getNameUser(admin.id);
        adminName.push(name);
      }

      let threadName = threadInfo.threadName || "không có";
      let id = threadInfo.threadID;
      let approvalMode = threadInfo.approvalMode;
      let pd = approvalMode ? 'bật' : (approvalMode === false ? 'tắt' : 'kh');
      let icon = threadInfo.emoji || "👍";
      let color = threadInfo.color;
      let sl = threadInfo.messageCount;
      let qtv = adminIDs.length;

      // Lấy thống kê tổng số tin nhắn
      if (!totalChat[args[1] || threadID]) {
        totalChat[args[1] || threadID] = { time: timeByMS, count: sl, ytd: 0 };
        fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
      }
      let preCount = totalChat[args[1] || threadID].count || 0;
      let ytd = totalChat[args[1] || threadID].ytd || 0;
      let hnay = (ytd != 0) ? (sl - preCount) : "chưa có thống kê";
      let hqua = (ytd != 0) ? ytd : "chưa có thống kê";

      let mdtt = 100;
      if (Date.now() - totalChat[args[1] || threadID].time > _24hours) {
        let getHour = Math.ceil((Date.now() - totalChat[args[1] || threadID].time - _24hours) / 3600000);
        if (ytd != 0 && getHour > 0) mdtt = ((((hnay) / ((hqua / 24) * getHour))) * 100).toFixed(0);
      }
      mdtt = mdtt + "%";

      // Ảnh nhóm
      let imgPath = path.join(__dirname, "cache", "box_info.png");
      let callback = () => api.sendMessage({
        body: `[⚜️] 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽 [⚜️]━\n────────────\n→ Tên nhóm: ${threadName}\n→ ID: ${id}\n→ Phê duyệt: ${pd}\n→ Biểu tượng: ${icon}\n→ Mã giao diện: ${color}\n→ Dấu lệnh hệ thống: ${prefix}\n→ Tổng: ${memLength} thành viên\n→ Nam: ${gendernam} thành viên\n→ Nữ: ${gendernu} thành viên\n→ Quản trị viên: ${qtv}\n→ Danh sách quản trị viên nhóm:\n[👉] ${adminName.join('\n[👉] ')}\n────────────\n→ Tổng tin nhắn: ${sl}\n→ Mức độ tương tác: ${mdtt}\n→ Tổng số tin nhắn hôm qua: ${hqua}\n→ Tổng tin nhắn hôm nay: ${hnay}\n→ Ngày tạo dữ liệu: ${fullTime}\n\n━━━━━━━━━━━━━━━\n[⚜️]=== 『 𝐁𝐎𝐓 𝗛𝗣𝗛𝗢𝗡𝗚 』 ===[⚜️]\n\n===「${timeNow}」===`,
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => fs.unlinkSync(imgPath), messageID);

      request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(imgPath)).on('close', callback);
    } catch (e) {
      console.log(e);
      api.sendMessage(`[⚜️]➜ Không thể lấy thông tin nhóm của bạn!\n${e}`, threadID, messageID);
    }
    return;
  }

  // Default fallback
  return api.sendMessage(`[⚜️]➜ Lệnh không hợp lệ hoặc không tồn tại. Gõ "${prefix}${this.config.name}" để xem hướng dẫn.`, threadID, messageID);
};