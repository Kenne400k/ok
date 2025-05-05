const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "kiss",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Lê Định Mod",//more by RqzaX
  description: "hôn người Bạn Muốn",
  commandCategory: "người dùng",
  usages: "@tag",
  cooldowns: 5,
  dependencies: {"request": "","fs": "","axios": ""}
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
        const request = require('request')
                const fs = require('fs')
                  var mention = Object.keys(event.mentions)[0];
let tag = event.mentions[mention].replace("@", "");
        var link = [
          "https://c.tenor.com/fiafXWajQFoAAAAM/kiss-anime.gif",
          "https://c.tenor.com/I8kWjuAtX-QAAAAM/anime-ano.gif",
          "https://c.tenor.com/riftr5iWqZQAAAAM/xdd.gif",
          "https://c.tenor.com/dn_KuOESmUYAAAAM/engage-kiss-anime-kiss.gif",
          "https://c.tenor.com/9Dc4nvrojakAAAAM/anime-kiss-engage-kiss.gif",
          "https://c.tenor.com/vhuon7swiOYAAAAM/rakudai-kishi-kiss.gif",
          "https://c.tenor.com/5iiiF4A7KI0AAAAM/anime-cry-anime.gif",
          "https://c.tenor.com/Fyq9izHlreQAAAAM/my-little-monster-haru-yoshida.gif",
          "https://c.tenor.com/P8sqjcWOmJwAAAAM/kiss.gif",
          "https://c.tenor.com/el8DHxNp9IsAAAAM/kiss-anime-love.gif",
          "https://c.tenor.com/YeitcPAdSCYAAAAM/kyo-x-tohru-kiss.gif",
          "https://c.tenor.com/h0-oyAlOVUEAAAAM/yosuga-no-sora-kiss.gif",
          "https://c.tenor.com/nRdyrvS3qa4AAAAM/anime-kiss.gif",
          "https://c.tenor.com/fwK_HPDyj1gAAAAM/kiss.gif",
          "https://c.tenor.com/06lz817csVgAAAAM/anime-anime-kiss.gif",
          "https://c.tenor.com/TnjL6WcdkkwAAAAM/anime-kiss.gif",
          "https://c.tenor.com/bUHmG6QySJ8AAAAM/kissing-make-out.gif",
          "https://c.tenor.com/g9HjxRZM2C8AAAAM/anime-love.gif",
          "https://c.tenor.com/8V-2mCzxzn0AAAAM/anime-kiss-romance.gif",
          "https://c.tenor.com/-tntwZEqVX4AAAAM/anime-kiss.gif",
          "https://c.tenor.com/woA_lrIFFAIAAAAM/girl-anime.gif",
          "https://c.tenor.com/F02Ep3b2jJgAAAAM/cute-kawai.gif",
          "https://c.tenor.com/UQwgkQbdp48AAAAM/kiss-anime.gif",
          "https://c.tenor.com/IvfI1mCRtRoAAAAM/anime-kiss-love.gif",
          "https://c.tenor.com/vtOmnXkckscAAAAM/kiss.gif",
          "https://c.tenor.com/lYKyQXGYvBkAAAAM/oreshura-kiss.gif",
          "https://c.tenor.com/NWPncyOVr0gAAAAS/amor.gif",
             ];
   var callback = () => api.sendMessage({body: `${tag} 💋, hun cái nè 😘` , mentions: [{
          tag: tag,
          id: Object.keys(event.mentions)[0]
        }],
  attachment: fs.createReadStream(__dirname + "/cache/hon.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/hon.gif"));
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/hon.gif")).on("close",() => callback());
   };