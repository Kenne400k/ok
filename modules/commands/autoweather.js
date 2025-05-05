const axios = require('axios');
module.exports.config = {
  name: 'autoweather',
  version: '10.02',
  hasPermssion: 0,
  credits: 'DC-Nam', // Bok idea thời tiết
  description: 'Tự động gửi tin nhắn theo giờ đã cài!',
  commandCategory: 'Nhóm messenger',
  usages: '[]',
  cooldowns: 3
};
const nam = [
  {
    timer: '12:00:00',
    message: ['\n{abc}']
  },
  {
    timer: '18:00:00',
    message: ['\n{abc}']
  },
  {
    timer: '6:00:00',
    message: ['\n{abc}']
  }];
module.exports.onLoad = o => setInterval(async () => {
  var date = (new Date).toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh"
  });

  const r = a => a[Math.floor(Math.random() * a.length)];
  if (á = nam.find(i => i.timer == date)) {
    var msg = r(á.message);
    const res = await axios.get(`https://api.popcat.xyz/weather?q=H%C3%A0%20N%E1%BB%99i`);
    var currentDay = res.data[0].current.day.replace(/Friday/g, "𝗧𝗵𝘂̛́ 𝟲").replace(/Saturday/g, "𝗧𝗵𝘂̛́ 𝟳").replace(/Sunday/g, "𝗖𝗵𝘂̉ 𝗻𝗵𝗮̣̂𝘁").replace(/Monday/g, "𝗧𝗵𝘂̛́ 𝟮").replace(/Tuesday/g, "𝗧𝗵𝘂̛́ 𝟯").replace(/Wednesday/g, "𝗧𝗵𝘂̛́ 𝟰").replace(/Thursday/g, "𝗧𝗵𝘂̛́ 𝟱");
    var date = res.data[0].current.date;
    var dateFormat = `🗓️ 𝗡𝗴𝗮̀𝘆 ${date.split("-")[2]}-${date.split("-")[1]}-${date.split("-")[0]}`;

    var skytext = res.data[0].current.skytext.toString()
    "Cloudy" == skytext ? skytext = "𝗠𝗮̂𝘆" : "Sunny" == skytext ? skytext = "𝗡𝗮̆́𝗻𝗴" : "Partly Cloudy" == skytext ? skytext = "𝗠𝗮̂𝘆 𝗺𝗼̣̂𝘁 𝗽𝗵𝗮̂̀𝗻" : "Mostly Cloudy" == skytext ? skytext = "𝗠𝗮̂𝘆 𝗿𝗮̂́𝘁 𝗻𝗵𝗶𝗲̂̀𝘂" : "Rain" == skytext ? skytext = "𝗠𝘂̛𝗮" : "Thunderstorm" == skytext ? skytext = "𝗕𝗮̃𝗼" : "Snow" == skytext ? skytext = "𝗧𝘂𝘆𝗲̂́𝘁" : "Fog" == skytext || "Haze" == skytext ? skytext = "𝗦𝘂̛𝗼̛𝗻𝗴 𝗺𝘂̀" : "Clear" == skytext ? skytext = "𝗧𝗿𝗼̛̀𝗶 𝘁𝗿𝗼𝗻𝗴" : "Light Rain" == skytext ? skytext = "𝗠𝘂̛𝗮 𝗻𝗵𝗲̣" : "Mostly Clear" == skytext && (skytext = "𝗧𝗿𝗼̛̀𝗶 𝘁𝗿𝗼𝗻𝗴 𝗿𝗮̂́𝘁 𝗻𝗵𝗶𝗲̂̀𝘂");

    var winddisplay = res.data[0].current.winddisplay.toString().split(" ")[2];
    "Northeast" == winddisplay && (winddisplay = "𝗛𝘂̛𝗼̛́𝗻𝗴 𝗗𝗼̂𝗻𝗴 𝗕𝗮̆́𝗰"), "Northwest" == winddisplay && (winddisplay = "𝗛𝘂̛𝗼̛́𝗻𝗴 𝗧𝗮̂𝘆 𝗕𝗮̆́𝗰"), "Southeast" == winddisplay && (winddisplay = "𝗛𝘂̛𝗼̛́𝗻𝗴 𝗗𝗼̂𝗻𝗴 𝗡𝗮𝗺"), "Southwest" == winddisplay && (winddisplay = "𝗛𝘂̛𝗼̛́𝗻𝗴 𝗧𝗮̂𝘆 𝗡𝗮𝗺"), "East" == winddisplay && (winddisplay = "𝗛𝘂̛𝗼̛́𝗻𝗴 𝗗𝗼̂𝗻𝗴"), "West" == winddisplay && (winddisplay = "𝗛𝘂̛𝗼̛́𝗻𝗴 𝗧𝗮̂𝘆"), "North" == winddisplay && (winddisplay = "𝗛𝘂̛𝗼̛́𝗻𝗴 𝗕𝗮̆́𝗰"), "South" == winddisplay && (winddisplay = "𝗛𝘂̛𝗼̛́𝗻𝗴 𝗡𝗮𝗺");

    console.log(`\n[ ${date} ] Đã gửi tin nhắn tự động!`); //fix by RqzaX

    var abc = `=====[ 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 𝗧𝗛𝗢̛̀𝗜 𝗧𝗜𝗘̂́𝗧 ]=====\n━━━━━━━━━━━━━━━━━━\n→ 🌏 𝗗𝘂̛𝗼̛́𝗶 𝗱𝗮̂𝘆 𝗹𝗮̀ 𝘁𝗵𝗼̂𝗻𝗴 𝗯𝗮́𝗼 𝘁𝗵𝗼̛̀𝗶 𝘁𝗶𝗲̂́𝘁 𝗵𝗼̂𝗺 𝗻𝗮𝘆 𝘁𝗮̣𝗶:\n\n🌃 ${res.data[0].location.name}.\n\n→ 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${currentDay}/${dateFormat}.\n→ 𝗡𝗵𝗶𝗲̣̂𝘁 𝗱𝗼̣̂: ${res.data[0].current.temperature}°${res.data[0].location.degreetype}.\n→ 𝗠𝗼̂ 𝘁𝗮̉: ${skytext}.\n→ 𝗗𝗼̣̂ 𝗮̂̉𝗺: ${res.data[0].current.humidity}%.\n→ 𝗛𝘂̛𝗼̛́𝗻𝗴 𝗴𝗶𝗼́: ${res.data[0].current.windspeed} ${winddisplay}.\n→ 𝗚𝗵𝗶 𝗻𝗵𝗮̣̂𝗻 𝘃𝗮̀𝗼 𝗹𝘂́𝗰: ${res.data[0].current.observationtime}.\n→ 𝗧𝘂̛̀ 𝘁𝗿𝗮̣𝗺 𝘃𝘂̃ 𝘁𝗿𝘂̣ 𝗰𝘂̉𝗮 𝗧𝗵𝗶𝗲̂𝗻 𝗩𝗮̂𝗻`;
    global.data.allThreadID.forEach(i => o.api.sendMessage(r(á.message).replace(/{abc}/g, abc), i));
  };
}, 1000);

module.exports.run = async o => {
  try {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const { api, event, args } = o;
    const { threadID, messageID } = event;
    var bok = args.join(" ");
    if (!bok) return api.sendMessage("nhập tỉnh/tp cần xem thời tiết", threadID);
    const res = await axios.get(`https://api.popcat.xyz/weather?q=${encodeURI(bok)}`);
    const bokk = res.data[0].forecast;
    var text = `Thời tiết của: ${bok} vào các ngày`;
    for (let i = 0; i < 5; i++) {
      text += `\n${i + 1}-> ${bokk[i].day} ${bokk[i].date}\n=>Nhiệt độ dự báo: từ ${bokk[i].low} đến ${bokk[i].high}\n=>Mô tả: ${bokk[i].skytextday}\n=>Tỷ lệ mưa: ${bokk[i].precip}\n`
    };
    api.sendMessage(text, threadID, messageID)
  } catch (err) { api.sendMessage(`${err}`, threadID) }
}