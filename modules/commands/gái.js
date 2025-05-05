const request = require('request');
const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "gái",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "nnl",
    description: "Random gái",
    commandCategory: "nsfw",
    usages: "gái",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async ({ api, event }) => {
    const threadID = event.threadID;

    const imageUrl = require('./../../Api/gai.json');

    const imageUrls = Object.values(imageUrl);

    const randomImageUrls = [];
    while (randomImageUrls.length < 6) {
        const randomIndex = Math.floor(Math.random() * imageUrls.length);
        if (!randomImageUrls.includes(imageUrls[randomIndex])) {
            randomImageUrls.push(imageUrls[randomIndex]);
        }
    }

    const attachments = [];
    for (const url of randomImageUrls) {
        const response = await axios({
            url,
            method: "GET",
            responseType: "stream"
        });
        attachments.push(response.data);
    }

    api.sendMessage({
        body: `→ 𝗔̉𝗻𝗵 𝗴𝗮́𝗶 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗯𝗲̂𝗻 𝗱𝘂̛𝗼̛́𝗶
⚠️ 𝗔̉𝗻𝗵 𝘀𝗲̃ 𝗿𝗮 𝗻𝗴𝗮̂̃𝘂 𝗻𝗵𝗶𝗲̂𝗻 𝘁𝘂̛̀ 𝟭 => 𝟲 𝗮̉𝗻𝗵`,
        attachment: attachments
    }, threadID);
};


