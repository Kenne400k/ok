module.exports.config = {
  name: 'ggdich',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'Công Nam',
  description: 'Dịch văn bản!',
  commandCategory: 'Công cụ',
  usages: '[văn bản] -> [ngôn ngữ cần dịch],\n * bên trong [] có thể tùy chỉnh.',
  cooldowns: 3
};
const {
  get
} = require('axios');
module.exports.run = async function({
  api, event, args
}) {
  try {
      var out = (a, b, c, d) => api.sendMessage(`${a}`, b?b: event.threadID, c?c: null, d?d: event.messageID),
      argu = args.join(' ').split('->'),
      text = event.type == 'message_reply'?event.messageReply.body: argu[0],
      to = argu[1],
      {
          code,
          msg,
          data
      } = (await get(`https://api-tk-jiang.trankhuong-dz-2000.repl.co/tien-ich/translate.json?text=${encodeURI(text)}&from=auto&to=${to || global.config.language}`)).data;
      if (!/200|201/.test(code)) return out(msg);
      out(data.translate, null, (a, b) =>out(msg, null, null, b.messageID));
  }catch(err) {out(err)};
};