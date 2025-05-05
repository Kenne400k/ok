module.exports.config = {
  name: "cuck",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "JRT",
  description: "Random ảnh cuck",
  commandCategory: "NSFW",
  usages: "cuck",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
    axios.get('https://www.nguyenmanh.name.vn/api/nsfw/cuckold?apikey=krwWfbvh').then(res => {
    let callback = function () {
          api.sendMessage({
            body : ``,
            attachment: fs.createReadStream(__dirname + '/cache/gaidep.jpg')
          }, event.threadID, () => fs.unlinkSync(__dirname + '/cache/gaidep.jpg'), event.messageID);
        };
        request(res.data.url).pipe(fs.createWriteStream(__dirname + '/cache/gaidep.jpg')).on("close", callback);
      })
}