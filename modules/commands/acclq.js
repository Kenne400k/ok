const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "acclq",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "vhfix",
  description: "Lấy tài khoản Liên Quân",
  commandCategory: "Nhóm",
  usages: "",
  cooldowns: 4,
  dependencies: { "request": "", "fs-extra": "" }
};

module.exports.run = async ({ api, event }) => {
  const accFilePath = path.join(__dirname, './acc.txt');

  function readAccFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(accFilePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const accs = data.split('\n');
          resolve(accs);
        }
      });
    });
  }

  async function sendAcc() {
    try {
      const accs = await readAccFile();
      if (accs.length > 0) {
        let msg = '📋 Danh sách tài khoản:\n';
        for (let i = 0; i < accs.length; i++) {
          const acc = accs[i].split(':');
          if (acc.length === 2) {
            msg += `🔑 Tài Khoản ${i + 1}: ${acc[0]} Mật Khẩu: ${acc[1]}\n`;
          }
        }
        const msgSend = await api.sendMessage(msg, event.threadID, event.messageID);
        console.log(`Acc Liên Quân Của M đây`);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        api.unsendMessage(msgSend.messageID);
        console.log(`Tin nhắn đã được xoá!`);
      } else {
        api.sendMessage('Không có tài khoản còn lại', event.threadID, event.messageID);
        console.log('Không có tài khoản còn lại');
      }
    } catch (error) {
      console.log(error);
    }
  }

  sendAcc();
}