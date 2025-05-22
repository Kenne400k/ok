const { existsSync, writeFileSync, mkdirSync, readFileSync, createReadStream } = global.nodemodule["fs-extra"];
const pathModule = global.nodemodule["path"];
const shortcutDataPath = pathModule.join(__dirname, '../../SystemData/data/shortcutdata.json');
const shortcutFolderPath = pathModule.join(__dirname, '../../SystemData/data/shortcut');

module.exports.config = {
  name: "shortcut",
  version: "1.2.0",
  hasPermssion: 1,
  Rent: 2,
  credits: "pcoder",
  description: "shortcut cực xịn của pcoder",
  commandCategory: "Tiện Ích",
  usages: "[all/delete/empty]",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

const format_attachment = (type) => ({
  photo: 'png', video: 'mp4', audio: 'mp3', animated_image: 'gif',
})[type] || 'bin';

// Khởi tạo shortcut khi load module
module.exports.onLoad = function () {
  if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();

  if (!existsSync(shortcutDataPath)) writeFileSync(shortcutDataPath, JSON.stringify([]), "utf-8");
  if (!existsSync(shortcutFolderPath)) mkdirSync(shortcutFolderPath, { recursive: true });

  try {
    const data = JSON.parse(readFileSync(shortcutDataPath, "utf-8"));
    for (const threadData of data) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts);
  } catch (e) {
    writeFileSync(shortcutDataPath, JSON.stringify([]), "utf-8");
    global.moduleData.shortcut.clear();
  }
};

// Xử lý event khi có tin nhắn
module.exports.handleEvent = async function ({ event, api, Users }) {
  const { threadID, messageID, body, senderID } = event;
  if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
  if (!global.moduleData.shortcut.has(threadID)) return;

  const data = global.moduleData.shortcut.get(threadID);
  // Kiểm tra input có trùng shortcut nào không
  const dataThread = data.find(item => item.input === body);
  if (!dataThread) return;

  let output = dataThread.output;
  if (/\{name}/g.test(output)) {
    const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
    output = output.replace(/\{name}/g, name);
  }

  const filePath = pathModule.join(shortcutFolderPath, dataThread.id);
  let object;
  if (existsSync(filePath)) {
    object = { body: output, attachment: createReadStream(filePath) };
  } else {
    object = { body: output };
  }
  return api.sendMessage(object, threadID, messageID);
};

// Xử lý trả lời để nhập shortcut
module.exports.handleReply = async function ({ event = {}, api, handleReply }) {
  if (handleReply.author != event.senderID) return;
  const { threadID, messageID, senderID, body, attachments } = event;
  const name = this.config.name;

  switch (handleReply.type) {
    case "requireInput": {
      if (!body || body.trim().length === 0)
        return api.sendMessage("[ Shortcut ] - Câu trả lời không được để trống!", threadID, messageID);
      const data = global.moduleData.shortcut.get(threadID) || [];
      if (data.some(item => item.input === body))
        return api.sendMessage("[ Shortcut ] - Input đã tồn tại từ trước!", threadID, messageID);
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage("[ Shortcut ] - Reply tin nhắn này để nhập câu trả lời khi sử dụng từ khóa", threadID, function (error, info) {
        return global.client.handleReply.push({
          type: "requireOutput",
          name,
          author: senderID,
          messageID: info.messageID,
          input: body
        });
      }, messageID);
    }
    case "requireOutput": {
      if (!body || body.trim().length === 0)
        return api.sendMessage("[ Shortcut ] - Câu trả lời không được để trống!", threadID, messageID);
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage("[ Shortcut ] - Reply tin nhắn này bằng tệp video/ảnh/mp3 hoặc nếu không cần bạn có thể reply tin nhắn này và nhập 's'", threadID, function (error, info) {
        return global.client.handleReply.push({
          type: "requireGif",
          name,
          author: senderID,
          messageID: info.messageID,
          input: handleReply.input,
          output: body
        });
      }, messageID);
    }
    case "requireGif": {
      let id = global.utils.randomString(10);
      let hasFile = false;
      if (attachments && attachments.length > 0) {
        try {
          let atm_0 = attachments[0];
          id = id + '.' + format_attachment(atm_0.type);
          const filePath = pathModule.join(shortcutFolderPath, id);
          await global.utils.downloadFile(atm_0.url, filePath);
          hasFile = true;
        } catch (e) {
          console.log(e);
          return api.sendMessage("[ Shortcut ] - Không thể tải file vì url không tồn tại hoặc bot đã xảy ra vấn đề về mạng!", threadID, messageID);
        }
      } else if (body && body.trim().toLowerCase() === 's') {
        // Không đính kèm file
        hasFile = false;
      } else if (body && body.trim().length > 0) {
        // Nếu user nhập gì đó ngoài 's' thì báo lỗi
        return api.sendMessage("[ Shortcut ] - Nếu không muốn đính kèm file, hãy nhập 's'. Nếu muốn gửi file, hãy reply bằng file!", threadID, messageID);
      }

      // Lưu shortcut
      let data = [];
      try {
        data = JSON.parse(readFileSync(shortcutDataPath, "utf-8"));
      } catch {
        data = [];
      }

      let dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
      let dataGlobal = global.moduleData.shortcut.get(threadID) || [];
      const object = { id: hasFile ? id : "", input: handleReply.input, output: handleReply.output };

      dataThread.shortcuts.push(object);
      dataGlobal.push(object);

      if (!data.some(item => item.threadID == threadID)) data.push(dataThread);
      else {
        const index = data.findIndex(item => item.threadID == threadID);
        data[index] = dataThread;
      }

      global.moduleData.shortcut.set(threadID, dataGlobal);
      writeFileSync(shortcutDataPath, JSON.stringify(data, null, 4), "utf-8");

      return api.sendMessage(
        `[ Shortcut ] - Đã thêm thành công shortcut mới:\n- ID: ${object.id || 'Không file'}\n- Input: ${handleReply.input}\n- Output: ${handleReply.output}`,
        threadID,
        messageID
      );
    }
  }
};

// Chạy lệnh shortcut
module.exports.run = function ({ event, api, args }) {
  const { threadID, messageID, senderID } = event;
  const name = this.config.name;

  switch ((args[0] || '').toLowerCase()) {
    case "remove":
    case "delete":
    case "del":
    case "-d": {
      let data;
      try {
        data = JSON.parse(readFileSync(shortcutDataPath, "utf-8"));
      } catch {
        data = [];
      }
      const indexData = data.findIndex(item => item.threadID == threadID);
      if (indexData == -1) return api.sendMessage("[ Shortcut ] - Hiện tại nhóm của bạn chưa có shortcut nào được set!", threadID, messageID);

      let dataThread = data[indexData];
      let dataGlobal = global.moduleData.shortcut.get(threadID) || [];
      if (dataThread.shortcuts.length == 0) return api.sendMessage("[ Shortcut ] - Hiện tại nhóm của bạn chưa có shortcut nào được set!", threadID, messageID);

      let rm = args.slice(1).map($ => +($ - 1)).filter(isFinite).filter(i => i >= 0);

      if (rm.length === 0) return api.sendMessage("[ Shortcut ] - Vui lòng nhập số thứ tự shortcut muốn xóa (ví dụ: shortcut delete 1 2 3)", threadID, messageID);

      dataThread.shortcuts = dataThread.shortcuts.filter((_, i) => !rm.includes(i));
      dataGlobal = dataGlobal.filter((_, i) => !rm.includes(i));
      global.moduleData.shortcut.set(threadID, dataGlobal);
      data[indexData] = dataThread;
      writeFileSync(shortcutDataPath, JSON.stringify(data, null, 4), "utf-8");

      return api.sendMessage("[ Shortcut ] - Đã xóa thành công!", threadID, messageID);
    }

    case "list":
    case "all":
    case "-a": {
      const data = global.moduleData.shortcut.get(threadID) || [];
      let array = [];
      if (data.length == 0) return api.sendMessage("[ Shortcut ] - Hiện tại nhóm của bạn chưa có shortcut nào!", threadID, messageID);
      let n = 1;
      for (const single of data) {
        const filePath = pathModule.join(shortcutFolderPath, single.id || "");
        let existPath = single.id && existsSync(filePath);
        array.push(`${n++}. ${single.input} => ${single.output} (${existPath ? "Có file" : "Không file"})`);
      }
      return api.sendMessage(`[ Shortcut ] - Danh sách shortcut của nhóm:\n[stt]/[Input] => [Output]\n\n${array.join("\n")}`, threadID, messageID);
    }

    default: {
      return api.sendMessage("[ Shortcut ] - Reply tin nhắn này để nhập từ khóa cho shortcut", threadID, function (error, info) {
        return global.client.handleReply.push({
          type: "requireInput",
          name,
          author: senderID,
          messageID: info.messageID
        });
      }, messageID);
    }
  }
};