const fs = require("fs");
module.exports.config = {
  name: "hetcuu",
    version: "1.0.1",
  hasPermssion: 0,
  credits: "trunguwu", 
  description: "noprefix",
  commandCategory: "Tiện ích",
  usages: "hetcuu",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (event.body.indexOf("Hết cứu")==0 || (event.body.indexOf("Hetcuu")==0 || (event.body.indexOf("hetcuu")==0 || (event.body.indexOf("het cuu")==0)))) {
    var msg = {
        body: "bot cũng ko cứu nổi",
        attachment: fs.createReadStream(__dirname + `/noprefix/hetcuu.mp3`)
      }
      api.sendMessage(msg, threadID, messageID);
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }