const request = require('request');
const fs = require('fs');
const axios = require('axios');

module.exports.config = {
  name: "dú",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "nnl",
  description: "Random dú",
  commandCategory: "nsfw",
  usages: "dú",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const threadID = event.threadID;
  const imageUrl = require('./Api/du.json');
  const imageUrls = Object.values(imageUrl);
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  const randomImageUrl = imageUrls[randomIndex];
  const response = await axios.get(randomImageUrl, { responseType: 'arraybuffer' });
  const attachment = Buffer.from(response.data, 'binary');
  api.sendMessage({
    body: `→ 𝗔̉𝗻𝗵 𝗱𝘂́ 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗯𝗲̂𝗇 𝗱𝘂̛𝗼̛́𝗶`,
    attachment: attachment
  }, threadID, (err) => {
    if (err) console.log(err);
  });
};