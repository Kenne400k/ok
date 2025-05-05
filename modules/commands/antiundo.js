const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "antiundo",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "vh",
  description: "Chống thu hồi tin nhắn",
  commandCategory: "Nhóm",
  usages: "antiundo [on/off]",
  cooldowns: 4,
  dependencies: { "request": "", "fs-extra": "" }
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const { on, off } = args;

  if (on) {
    // Bật anti thu hồi tin nhắn
    api.sendMessage("Anti thu hồi tin nhắn đã được bật!", threadID, messageID);
    fs.writeFileSync(path.join(__dirname, './data_dongdev/antiundo.json'), JSON.stringify({ enabled: true }));
  } else if (off) {
    // Tắt anti thu hồi tin nhắn
    api.sendMessage("Anti thu hồi tin nhắn đã được tắt!", threadID, messageID);
    fs.writeFileSync(path.join(__dirname, './data_dongdev/antiundo.json'), JSON.stringify({ enabled: false }));
  } else {
    // Kiểm tra trạng thái anti thu hồi tin nhắn
    const antirecallStatus = fs.readFileSync(path.join(__dirname, './data_dongdev/antiundo.json'), 'utf8');
    const enabled = JSON.parse(antirecallStatus).enabled;
    if (enabled) {
      api.sendMessage("Anti thu hồi tin nhắn đang được bật!", threadID, messageID);
    } else {
      api.sendMessage("Anti thu hồi tin nhắn đang được tắt!", threadID, messageID);
    }
  }

  // Xử lý thu hồi tin nhắn
  if (event.type === "message_recall") {
    const message = event.message;
    const sender = event.senderID;
    const thread = event.threadID;

    // Kiểm tra trạng thái anti thu hồi tin nhắn
    const antirecallStatus = fs.readFileSync(path.join(__dirname, './data_dongdev/antiundo.json'), 'utf8');
    const enabled = JSON.parse(antirecallStatus).enabled;
    if (enabled) {
      // Ghi tên người gửi và nội dung đã thu hồi
      const logFilePath = path.join(__dirname, './data_dongdev/undo.log');
      fs.appendFileSync(logFilePath, `Người gửi: ${sender}\nNội dung: ${message.body}\nThread: ${thread}\n\n`);

      // Ghi video, ảnh đã thu hồi
      if (message.attachments) {
        const attachments = message.attachments;
        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];
          if (attachment.type === "video") {
            fs.appendFileSync(logFilePath, `Video: ${attachment.url}\n`);
          } else if (attachment.type === "photo") {
            fs.appendFileSync(logFilePath, `Ảnh: ${attachment.url}\n`);
          }
        }
      }

      // Gửi thông báo cho người gửi
      let msg = `Bạn vừa thu hồi tin nhắn với nội dung: ${message.body}\n`;
      if (message.attachments) {
        const attachments = message.attachments;
        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];
          if (attachment.type === "video") {
            msg += `Video: ${attachment.url}\n`;
          } else if (attachment.type === "photo") {
            msg += `Ảnh: ${attachment.url}\n`;
          }
        }
      }
      api.sendMessage(msg, thread);
    }
  }
}