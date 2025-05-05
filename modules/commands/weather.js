const axios = require("axios");
const moment = require("moment-timezone");
 
module.exports.config = {
  name: "weather",
  version: "2.0",
  credits: "Q.Huy",
  description: "Nhận biết điều kiện thời tiết hiện tại",
  commandCategory: "Tiện ích",
  usages: "/weather [vị trí]",
  cooldowns: 3,
};
 
module.exports.run = async function ({ api, event, args }) {
  const apiKey = "deae5206758c44f38b0184151232208";
  const city = args.join(" ");
  
  if (!city) {
    return api.sendMessage("Vui lòng cung cấp tên thành phố!", event.threadID, event.messageID);
  }
  
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
  
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    
    if (data.error) {
      return api.sendMessage("Không tìm thấy thành phố hoặc xảy ra lỗi.", event.threadID, event.messageID);
    }
    
    const weatherInfo = data.current;
    const currentDateTime = moment().tz(data.location.tz_id).format("HH:mm:ss - DD/MM/YYYY");
      var lo = `${weatherInfo.condition.text}`
  if (lo == 'Sunny') lo = 'Trời Nắng'
  if (lo == 'Mostly sunny') lo = 'Nhiều Nắng'
  if (lo == 'Partly sunny') lo = 'Nắng Vài Nơi'
  if (lo == 'Rain showers') lo = 'Mưa Rào'  
  if (lo == "T-Storms") lo = 'Có Bão'
  if (lo == 'Light rain') lo = 'Mưa Nhỏ'
  if (lo == 'Mostly cloudy') lo = 'Trời Nhiều Mây'
  if (lo == 'Rain') lo = 'Trời Mưa'
  if (lo == 'Heavy T-Storms') lo = 'Bão Lớn'
  if (lo == 'Partly cloudy') lo = 'Mây Rải Rác'
  if (lo == 'Mostly clear') lo = 'Trời Trong Xanh'
  if (lo == 'Cloudy') lo = 'Trời Nhiều Mây'
  if (lo == 'Clear') lo = 'Trời Trong Xanh, Không Mây'
   
    const weatherMessage = `
Thời tiết của ${city} (tính đến ${currentDateTime}):\n🌡 Nhiệt độ: ${weatherInfo.temp_c}°C (${weatherInfo.temp_f}°F)
✨ Cảm giác như: ${weatherInfo.feelslike_c}°C (${weatherInfo.feelslike_f}°F)
📌 Dự báo: ${lo}
🌪️ Gió: ${weatherInfo.wind_kph} km/h, ${weatherInfo.wind_dir}
🌀 Ấp suất: ${weatherInfo.pressure_mb} mb
💧 Độ ẩm: ${weatherInfo.humidity}%
🧬 Chỉ số tia cực tím: ${weatherInfo.uv}%
    `;
 
    const additionalInfo = `
☁️ Mây che phủ: ${weatherInfo.cloud}%
🌧️ Lượng mưa: ${weatherInfo.precip_mm} mm (${weatherInfo.precip_in} in)
🌬️ Gió giật: ${weatherInfo.gust_kph} km/h
    `;
 
    api.sendMessage(weatherMessage + additionalInfo, event.threadID, event.messageID);
  } catch (error) {
    console.error(`Lỗi khi tìm kiếm dữ liệu thời tiết: ${error}`);
    api.sendMessage("Đã xảy ra lỗi khi tìm kiếm dữ liệu.", event.threadID, event.messageID);
  }
};