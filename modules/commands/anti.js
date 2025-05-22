module.exports.config = {
  name: "anti",
  version: "4.1.6",
  hasPermssion: 1,
  credits: "pcoder",
  description: "Anti change Box chat",
  commandCategory: "Box chat",
  usages: "anti dùng để bật tắt",
  cooldowns: 5,
  images: [],
  dependencies: {
    "fs-extra": "",
  },
};

const { readdirSync, readFileSync, writeFileSync, existsSync } = require("fs-extra");
const path = require('path');
const fs = require('fs');

module.exports.handleReply = async function ({ api, event, handleReply, Threads }) {
  const { senderID, threadID, messageID, args } = event;
  const { author, permssion } = handleReply;
  const pathData = global.anti;
  const dataAnti = JSON.parse(readFileSync(pathData, "utf8"));

  if (author !== senderID) return api.sendMessage(`❎ Bạn không phải người dùng lệnh`, threadID);

  const numbers = args.filter(i => !isNaN(i));
  for (const num of numbers) {
    switch (num) {
      case "1": { // Anti đổi tên box
        if (permssion < 1)
          return api.sendMessage("⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này", threadID, messageID);
        const existed = dataAnti.boxname.find(item => item.threadID === threadID);
        if (existed) {
          dataAnti.boxname = dataAnti.boxname.filter(item => item.threadID !== threadID);
          api.sendMessage("☑️ Tắt thành công chế độ anti đổi tên box", threadID, messageID);
        } else {
          const threadName = (await api.getThreadInfo(threadID)).threadName;
          dataAnti.boxname.push({ threadID, name: threadName });
          api.sendMessage("☑️ Bật thành công chế độ anti đổi tên box", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "2": { // Anti đổi ảnh box
        if (permssion < 1)
          return api.sendMessage("⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này", threadID, messageID);
        const existed = dataAnti.boximage.find(item => item.threadID === threadID);
        if (existed) {
          dataAnti.boximage = dataAnti.boximage.filter(item => item.threadID !== threadID);
          api.sendMessage("☑️ Tắt thành công chế độ anti đổi ảnh box", threadID, messageID);
        } else {
          const threadInfo = await api.getThreadInfo(threadID);
          let url = threadInfo.imageSrc || "";
          let img = url;
          if (url && global.api.imgur) {
            try {
              let response = await global.api.imgur(url);
              img = response.link || url;
            } catch (e) {}
          }
          dataAnti.boximage.push({ threadID, url: img });
          api.sendMessage("☑️ Bật thành công chế độ anti đổi ảnh box", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "3": { // Anti đổi biệt danh
        if (permssion < 1)
          return api.sendMessage("⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này", threadID, messageID);
        const existed = dataAnti.antiNickname.find(item => item.threadID === threadID);
        if (existed) {
          dataAnti.antiNickname = dataAnti.antiNickname.filter(item => item.threadID !== threadID);
          api.sendMessage("☑️ Tắt thành công chế độ anti đổi biệt danh", threadID, messageID);
        } else {
          const nickName = (await api.getThreadInfo(threadID)).nicknames;
          dataAnti.antiNickname.push({ threadID, data: nickName });
          api.sendMessage("☑️ Bật thành công chế độ anti đổi biệt danh", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "4": { // Anti out
        if (permssion < 1)
          return api.sendMessage("⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này", threadID, messageID);
        dataAnti.antiout[threadID] = !dataAnti.antiout[threadID];
        api.sendMessage(`☑️ ${dataAnti.antiout[threadID] ? "Bật" : "Tắt"} thành công chế độ anti out`, threadID, messageID);
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "5": { // Anti emoji
        const filepath = path.join(process.cwd(), 'systemdata', 'data', 'antiemoji.json');
        let data = existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath, 'utf8')) : {};
        let emoji = "";
        try {
          let threadInfo = await api.getThreadInfo(threadID);
          emoji = threadInfo.emoji || "";
        } catch (error) {}
        if (!data.hasOwnProperty(threadID)) {
          data[threadID] = { emoji, emojiEnabled: true };
        } else {
          data[threadID].emojiEnabled = !data[threadID].emojiEnabled;
          if (data[threadID].emojiEnabled) data[threadID].emoji = emoji;
        }
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
        api.sendMessage(`☑️ ${data[threadID].emojiEnabled ? "Bật" : "Tắt"} thành công chế độ anti emoji`, threadID, messageID);
        break;
      }
      case "6": { // Anti theme
        const filepath = path.join(process.cwd(), 'systemdata', 'data', 'antitheme.json');
        let data = existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath, 'utf8')) : {};
        let theme = "";
        try {
          const threadInfo = await Threads.getInfo(threadID);
          theme = threadInfo.threadTheme?.id || "";
        } catch (error) {}
        if (!data.hasOwnProperty(threadID)) {
          data[threadID] = { themeid: theme, themeEnabled: true };
        } else {
          data[threadID].themeEnabled = !data[threadID].themeEnabled;
          if (data[threadID].themeEnabled) data[threadID].themeid = theme;
        }
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
        api.sendMessage(`☑️ ${data[threadID].themeEnabled ? "Bật" : "Tắt"} thành công chế độ anti theme`, threadID, messageID);
        break;
      }
      case "7": { // Anti QTV
        const dataAntiQTVPath = path.join(__dirname, 'data', 'antiqtv.json');
        let data = existsSync(dataAntiQTVPath) ? JSON.parse(fs.readFileSync(dataAntiQTVPath, 'utf8')) : {};
        const info = await api.getThreadInfo(threadID);
        if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
          return api.sendMessage('❎ Bot cần quyền quản trị viên để có thể thực thi lệnh', threadID, messageID);
        data[threadID] = !data[threadID];
        api.sendMessage(`☑️ ${data[threadID] ? "Bật" : "Tắt"} thành công chế độ anti qtv`, threadID, messageID);
        fs.writeFileSync(dataAntiQTVPath, JSON.stringify(data, null, 4));
        break;
      }
      case "8": { // Anti join
        const antiJoinPath = path.join(__dirname, 'data', 'threadData.json');
        let antiJoinData = existsSync(antiJoinPath) ? JSON.parse(fs.readFileSync(antiJoinPath, 'utf8')) : {};
        antiJoinData[threadID] = !antiJoinData[threadID];
        fs.writeFileSync(antiJoinPath, JSON.stringify(antiJoinData, null, 2), 'utf8');
        api.sendMessage(`☑️ ${antiJoinData[threadID] ? "Bật" : "Tắt"} thành công chế độ anti thêm thành viên vào nhóm`, threadID, messageID);
        break;
      }
      case "9": { // Check trạng thái
        const antiImage = dataAnti.boximage.find(item => item.threadID === threadID);
        const antiBoxname = dataAnti.boxname.find(item => item.threadID === threadID);
        const antiNickname = dataAnti.antiNickname.find(item => item.threadID === threadID);
        const antiout = dataAnti.antiout[threadID] ? "bật" : "tắt";
        return api.sendMessage(`[ CHECK ANTI BOX ]\n────────────────────\n|› 1. anti namebox: ${antiBoxname ? "bật" : "tắt"}\n|› 2. anti imagebox: ${antiImage ? "bật" : "tắt" }\n|› 3. anti nickname: ${antiNickname ? "bật" : "tắt"}\n|› 4. anti out: ${antiout}\n────────────────────\n|› Trên kia là các trạng thái của từng anti`, threadID);
      }
      default:
        api.sendMessage(`❎ Số bạn chọn không có trong lệnh`, threadID);
        break;
    }
  }
};

module.exports.run = async ({ api, event, args, permssion, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage({
    body: `╭─────────────⭓
│ Anti Change Info Group
├─────⭔
│ 1. anti namebox: cấm đổi tên nhóm
│ 2. anti boximage: cấm đổi ảnh nhóm
│ 3. anti nickname: cấm đổi biệt danh người dùng
│ 4. anti out: cấm thành viên out chùa
│ 5. anti emoji: cấm thay đổi emoji nhóm
│ 6. anti theme: cấm thay đổi chủ đề nhóm
│ 7. anti qtv: cấm thay qtv nhóm (tránh bị cướp box)
│ 8. anti join: cấm thêm thành viên mới vào nhóm
│ 9. check trạng thái anti của nhóm
├────────⭔
│ 📌 Reply (phản hồi) theo stt để chọn chế độ mà bạn muốn thay đổi trạng thái
╰─────────────⭓`,
    attachment: global.khanhdayr && global.khanhdayr.length > 0 ? global.khanhdayr.splice(0, 1) : undefined
  },
    threadID, (error, info) => {
      if (error) {
        return api.sendMessage("❎ Đã xảy ra lỗi!", threadID);
      } else {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          permssion
        });
      }
    }, messageID
  );
};