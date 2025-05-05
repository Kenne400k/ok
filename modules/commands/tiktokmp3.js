const axios = require("axios");
const moment = require("moment-timezone");

const linkapi = "https://ttmp3.onrender.com";

module.exports = {
    config: {
        name: "tiktokmp3",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "tikok mp3",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },
    
    run: ({ api, event, args }) => {},    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;
        const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
        
        if (!body || (!body.includes('https://vt.tiktok.com/') && !body.includes('https://www.tiktok.com/')) || senderID === api.getCurrentUserID() || senderID === '') return;

        try {
            const { music, title } = (await axios.get(`${linkapi}/tiktok?link=${body}`)).data.data;
            const stream = (await axios.get(music, { responseType: "stream" })).data;

            api.sendMessage({
                body: `『 AUTODOWN MP3 』\n───────────────── \nTiêu đề: ${title}`,
                attachment: stream
            }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
        }
    }
};
