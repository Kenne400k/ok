module.exports = new Module({
  name: 'link',
  version: '205',
  hasPermssion: 0,
  credits: 'Công Nam',
  description: 'Lấy link',
  commandCategory: 'Công cụ',
  uages: 'link',
  cooldowns: 3
});

function Module(info) {
  axios = require('axios'),
  this.config = info,
  this.run = async(_)=> {
      try {
          let
          send = msg=>_.api.sendMessage(msg, _.event.threadID, _.event.messageID),
          url = _.args[0],
          res = await axios.post('https://saved.congnam.tech/upload', {
              url, type: _.args[1]
          });

          return send(`${res.data}`);
      }catch(e) {
          send(e.message)}
  };
};