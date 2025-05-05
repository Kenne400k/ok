module.exports.config = {
  name: "ass",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "JRT",
  description: "Random ảnh ass",
  commandCategory: "NSFW",
  usages: "ass",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
    axios.get('https://www.nguyenmanh.name.vn/api/nsfw/ass?apikey=krwWfbvh').then(res => {
    let callback = function () {
          api.sendMessage({
            body : ``,
            attachment: fs.createReadStream(__dirname + '/cache/gaidep.jpg')
          }, event.threadID, () => fs.unlinkSync(__dirname + '/cache/gaidep.jpg'), event.messageID);
        };
        request(res.data.url).pipe(fs.createWriteStream(__dirname + '/cache/gaidep.jpg')).on("close", callback);
      })
}