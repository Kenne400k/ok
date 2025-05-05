const configCommand = {
  name: 'cccd',
  version: '1.1.1',
  hasPermssion: 0,
  credits: 'DC-Nam',
  description: 'Tạo fake cccd',
  commandCategory: 'Tạo ảnh',
  usages: 'cccd + tên + năm sinh',
  cooldowns: 3
},
axios = require('axios'),
w = 'https://canvas-api.nambsls.repl.co/giay-to/cccd?data=',
ar = id => `https://graph.facebook.com/${id}/picture?height=1016&width=913&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
async function runCommand(arg) {
  var out = (a, b, c, d) => arg.api.sendMessage(a, b?b: arg.event.threadID, c?c: null, d?d: arg.event.messageID),
  str = arg.args.join(' ').replace(/\,/g,'-'),
  data;
  try {
      if (!str || !/\//.test(str)) data = str; else data = [arg.event.type == 'message_reply' && arg.event.messageReply.attachments.length == 0?ar(arg.event.messageReply.senderID): arg.event.type == 'message_reply' && arg.event.messageReply.attachments.length != 0?arg.event.messageReply.attachments[0].url: ar(arg.event.senderID),...str.split('|')];
      data = encodeURI(data).replace(/\?/g, '\\u003f').replace(/\&/g, '\\u0026');
      await axios.get(w+data);
      data += ',true';
      out({
          attachment: (await axios.get(w+data, {
              responseType: 'stream'
          })).data
      });
  }catch(e) {
      out(((x = e.response), !x?e: x.data.msg))};
};

module.exports = {
  config: configCommand,
  run: runCommand,
}