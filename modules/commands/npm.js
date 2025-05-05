module.exports.config = {
  name: "npm",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "",
  commandCategory: "người dùng",
  usages: "npm",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  var cc = args.join(" ");
  const res = await axios.get(`https://api.popcat.xyz/npm?q=${encodeURIComponent(cc)}`)
  const c = res.data.author;
  const a = res.data.name;
  const b = res.data.description;
  const d = res.data.keywords;

  if (!cc) return api.sendMessage(`Vui lòng nhập tên package cần tìm!`, event.threadID, event.messageID);
  if (d == undefined) return api.sendMessage(`Package không tồn tại`,event.threadID, event.messageID)
  return api.sendMessage({ body: `[💙]━━『 𝗧𝗛𝗢̂𝗡𝗚 𝗧𝗜𝗡 𝗣𝗔𝗖𝗞𝗔𝗚𝗘 』━━[💙]\n\n==== 𝗣𝗮𝗰𝗸𝗮𝗴𝗲: ${cc} ====\n→ 𝗧𝗲̂𝗻: ${a}\n→ 𝗔𝘂𝘁𝗵𝗼𝗿: ${res.data.author}\n→ 𝗠𝗼̂ 𝘁𝗮̉: ${b}\n→ 𝗣𝗵𝗶𝗲̂𝗻 𝗯𝗮̉𝗻: ${res.data.version}\n→ 𝗟𝘂̛𝗼̛̣𝘁 𝘁𝗮̉𝗶: ${res.data.downloads_this_year}\n→ 𝗞𝗲𝘆𝗪𝗼𝗿𝗱𝘀: ${d}\n→ 𝗟𝗶𝗻𝗸: https://www.npmjs.com/package/${cc}` }, event.threadID, event.messageID);
};