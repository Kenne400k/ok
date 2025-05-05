module.exports.config = {
  name: "bdsm",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "JRT",
  description: "Random ảnh bdsm",
  commandCategory: "NSFW",
  usages: "bdsm",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
    axios.get('https://www.nguyenmanh.name.vn/api/nsfw/bdsm?apikey=krwWfbvh').then(res => {
    let callback = function () {
          api.sendMessage({
            body : ``,
            attachment: fs.createReadStream(__dirname + '/cache/gaidep.jpg')
          }, event.threadID, () => fs.unlinkSync(__dirname + '/cache/gaidep.jpg'), event.messageID);
        };
        request(res.data.url).pipe(fs.createWriteStream(__dirname + '/cache/gaidep.jpg')).on("close", callback);
      })
}