module.exports.config = {
  name: "danso",  
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "D-Jukie",
  description: "Xem dân số thế giới hoặc 1 quốc gia nào đó", 
  commandCategory: "Thông tin",
  usages: "[name country]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args}) {
const axios = global.nodemodule['axios']; 
  const moment = require("moment-timezone"); 
  var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss")
if (!args[0]) {
var options = {
  method: 'GET',
  url: 'https://world-population.p.rapidapi.com/worldpopulation',
  headers: {
    'x-rapidapi-host': 'world-population.p.rapidapi.com',
    'x-rapidapi-key': 'a012e05802msh4ce48bff26d5c0ap151d85jsn4edde7f89de0'
  }
};

axios.request(options).then(function (response) {
  const dataCountry = response.data
  const dataPopulation = dataCountry.body
  const population = dataPopulation.world_population
  const countCountry = dataPopulation.total_countries
  return api.sendMessage(`[📝]→ Tổng dân số thế giới: ${population}\n[🔎]→ Tổng số quốc gia: ${countCountry}\n\n━━━━━━━━━━━━━━━\n[⚜️]=== 『 𝐁𝐎𝐓 𝐉𝐑𝐓  』 ===[⚜️]\n\n===「${timeNow}」===`, event.threadID, event.messageID);
}).catch(function (error) {

  return api.sendMessage(`[⚜️]→ Không thể lấy thông tin ngay lúc này!!!\n\n━━━━━━━━━━━━━━━\n[⚜️]=== 『 𝐁𝐎𝐓 𝐉𝐑𝐓  』 ===[⚜️]\n\n===「${timeNow}」===`, event.threadID, event.messageID)
});
}
else {
const country = args.join(" ") 
var options = {
  method: 'GET',
  url: 'https://world-population.p.rapidapi.com/population',
  params: {country_name: `${country}`},
  headers: {
    'x-rapidapi-host': 'world-population.p.rapidapi.com',
    'x-rapidapi-key': 'a012e05802msh4ce48bff26d5c0ap151d85jsn4edde7f89de0'
  }
};

axios.request(options).then(function (response) {
  const data = response.data;
  const dataCountry = data.body;
  return api.sendMessage(`[🌐]→ Tên quốc gia: ${dataCountry.country_name}\n[👤]→ Dân số: ${dataCountry.population}\n[🔰]→ Đứng thứ ${dataCountry.ranking} trên thế giới\n\n━━━━━━━━━━━━━━━\n[⚜️]=== 『 𝐁𝐎𝐓 𝐉𝐑𝐓  』 ===[⚜️]\n\n===「${timeNow}」===`, event.threadID, event.messageID);
}).catch(function (error) {
   return api.sendMessage(`[❗]→ Không tìm thấy thông tin quốc gia!!!\n\n━━━━━━━━━━━━━━━\n[⚜️]=== 『 𝐁𝐎𝐓 𝐉𝐑𝐓  』 ===[⚜️]\n\n===「${timeNow}」===`, event.threadID, event.messageID);
});
}
}
