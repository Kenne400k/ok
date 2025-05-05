module.exports.config = {
  name: "tagv2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "Tag admin",
  commandCategory: "không phải lệnh",
  usages: "",
  cooldowns: 1
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  const moment = require("moment-timezone");

  var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
  var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');

  if (thu == 'Sunday') thu = 'Chủ Nhật';
  if (thu == 'Monday') thu = 'Thứ 2';
  if (thu == 'Tuesday') thu = 'Thứ 3';
  if (thu == 'Wednesday') thu = 'Thứ 4';
  if (thu == 'Thursday') thu = 'Thứ 5';
  if (thu == 'Friday') thu = 'Thứ 6';
  if (thu == 'Saturday') thu = 'Thứ 7';

  var idad = ["100008895922054"];
  let name = await Users.getNameUser(event.senderID);

  let mentions = [{
    tag: name,
    id: event.senderID
  }];

  for (const id of idad) {
    if (!id) return;
    if (!event.body) return;

    if (Object.keys(event.mentions).includes(id)) {
      var msg = [{
        body: `${name}𝐗𝐢𝐧 Đ𝐮̛̀𝐧𝐠 𝐋𝐚̀𝐦 𝐏𝐡𝐢𝐞̂̀𝐧!! \n𝗧𝗶𝗺𝗲: ${thu} ${gio}`,
        attachment: global.khanhdayr.splice(0, 1)
      }];

      return api.sendMessage(msg[Math.floor(Math.random() * msg.length)], event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function ({ api, event, Users }) {
  let name = await Users.getNameUser(event.senderID);
  api.sendMessage(`${name} immmmmmmmmmmmm`, event.threadID, event.messageID);
};