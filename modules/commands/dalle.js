const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const KievRPSSecAuth = "1_IFkCDgvJCdu-u85xIGYX4oqbytGgxX-ezMOsobG0S_WyzR8Jz3OVThmzxZzlrETAOrCeCwKEsUBOU8DkT7qLwFBhkJdt2VLl7_hwGCVb4VcML8vF82ZCcUWTqpSY-wZj10LkcVO5Fu-UVwKr4l7veD2zgjAZlew58ifDSQOR4P0ERWZp_cKod4cynjCKXAKY6Ic6k2KcCdh7ui5nzbg4w";
const _U = "1_IFkCDgvJCdu-u85xIGYX4oqbytGgxX-ezMOsobG0S_WyzR8Jz3OVThmzxZzlrETAOrCeCwKEsUBOU8DkT7qLwFBhkJdt2VLl7_hwGCVb4VcML8vF82ZCcUWTqpSY-wZj10LkcVO5Fu-UVwKr4l7veD2zgjAZlew58ifDSQOR4P0ERWZp_cKod4cynjCKXAKY6Ic6k2KcCdh7ui5nzbg4w";

module.exports.config = {
  name: "dalle",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Samir Œ",
  description: "Tạo ảnh bằng công nghệ AI Dall-E 3",
  commandCategory: "AI-Generated",
  usages: "dalle <prompt>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage("Vui lòng nhập prompt để tạo ảnh!", threadID, messageID);
  }

  try {
    const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(prompt)}`);
    const data = res.data.results.images;

    if (!data || data.length === 0) {
      return api.sendMessage("Không nhận được hình ảnh nào từ server.", threadID, messageID);
    }

    const imgData = [];
    for (let i = 0; i < Math.min(4, data.length); i++) {
      const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
      const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
      await fs.outputFile(imgPath, imgResponse.data);
      imgData.push(fs.createReadStream(imgPath));
    }

    await api.sendMessage({
      attachment: imgData,
      body: `Đây là ảnh được tạo từ prompt: "${prompt}"`
    }, threadID, messageID);

  } catch (error) {
    return api.sendMessage("Không thể thực hiện yêu cầu này.", threadID, messageID);
  }
};