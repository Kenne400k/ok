const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "atdinstagram",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "Down ig",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },

    run: ({ api, event, args }) => {},    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;
        const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");

        if (!body || (!body.includes('https://www.instagram.com/reel/') && !body.includes('https://www.instagram.com/p/')) || senderID === api.getCurrentUserID() || senderID === '') return;

        const options = {
            method: 'GET',
            url: 'https://instagram-story-downloader-media-downloader.p.rapidapi.com/index',
            params: {
                url: body
            },
            headers: {
                'X-RapidAPI-Key': '540aa903bdmsh0a33f8b6f825e2bp125b81jsn17e1c26d383f',
                'X-RapidAPI-Host': 'instagram-story-downloader-media-downloader.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const { media, title } = response.data;
            const stream = await axios.get(media, { responseType: "stream" });

            api.sendMessage({
                body: `[ 𝐀𝐔𝐓𝐎𝐃𝐎𝐖𝐍 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌 ]\n────────────────\n┣➤ Tiêu đề: ${title}`,
                attachment: stream.data
            }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
        }
    }
};