module.exports.config = {
    name: "thính",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "lekhanh",
    description: "Thính",
    commandCategory: "Tiện ích",
    usages: "[]",
    cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
const axios = require('axios');
const res = await axios.get(`https://api.sumiproject.net/text/thinh`);
var poem = res.data.data;
console.log(poem)
return api.sendMessage(`${poem}`, event.threadID, event.messageID)
}