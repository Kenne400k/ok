module.exports.config = {
  name: "checktt",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "DungUwU && Nghĩa",
  description: "Check tương tác ngày/tuần/toàn bộ",
  commandCategory: "Thống kê",
  usages: "[all/week/day]",
  cooldowns: 5,
  dependencies: {
      "fs": "",
      "moment-timezone": ""
  }
};

const path = __dirname + '/checktt/';
const moment = require('moment-timezone');
const fs = require('fs');

module.exports.onLoad = () => {
  if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
  }
  setInterval(() => {
    const today = moment.tz("Asia/Ho_Chi_Minh").day();
    fs.readdirSync(path).forEach(file => {
      let fileData = JSON.parse(fs.readFileSync(path + file));
      if (fileData.time !== today) {
        fileData.time = today;
        fs.writeFileSync(path + file, JSON.stringify(fileData, null, 4));
      }
    });
  }, 60 * 1000);
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!event.isGroup) return;
  if (global.client.sending_top) return;
  const { threadID, senderID } = event;
  const today = moment.tz("Asia/Ho_Chi_Minh").day();
  
  const filePath = path + threadID + '.json';
  let threadData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : { total: [], week: [], day: [], time: today };
  
  if (threadData.time !== today) {
    global.client.sending_top = true;
    setTimeout(() => global.client.sending_top = false, 5 * 60 * 1000);
    threadData.time = today;
  }

  ["total", "week", "day"].forEach(type => {
      let index = threadData[type].findIndex(e => e.id === senderID);
      if (index === -1) threadData[type].push({ id: senderID, count: 1 });
      else threadData[type][index].count++;
  });

  fs.writeFileSync(filePath, JSON.stringify(threadData, null, 4));
};

module.exports.run = async function ({ api, event, args, Users }) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const { threadID } = event;
  const filePath = path + threadID + '.json';
  
  if (!fs.existsSync(filePath)) {
      return api.sendMessage("⚠ Không có dữ liệu tương tác trong nhóm này!", threadID);
  }

  const threadData = JSON.parse(fs.readFileSync(filePath));
  let data = threadData.total;

  if (args[0]) {
      const query = args[0].toLowerCase();
      if (query === "all" || query === "-a") data = threadData.total;
      else if (query === "week" || query === "-w") data = threadData.week;
      else if (query === "day" || query === "-d") data = threadData.day;
  }

  let storage = data.map(item => ({
      ...item,
      name: Users.getNameUser(item.id) || 'Facebook User'
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  if (storage.length === 0) {
      return api.sendMessage("⚠ Không có dữ liệu tương tác!", threadID);
  }

  let msg = storage.map((item, index) => `${index + 1}. ${item.name} với ${item.count} tin nhắn`).join('\n');
  msg = `📊 Danh sách tương tác:\n${msg}\n🔹 Tổng tin nhắn: ${storage.reduce((a, b) => a + b.count, 0)}`;

  // Lấy video từ global.khanhdayr nếu có
  let attachment = null;
  if (Array.isArray(global.khanhdayr) && global.khanhdayr.length > 0) {
      attachment = global.khanhdayr.splice(0, 1)[0]; // Lấy video đầu tiên
  } else {
      // Nếu không có video trong global.khanhdayr, tự động thêm video mặc định
      const videoPath = __dirname + "/checktt/video.mp4";
      if (fs.existsSync(videoPath)) {
          attachment = fs.createReadStream(videoPath);
      }
  }

  api.sendMessage({ body: msg, attachment }, threadID);
};
