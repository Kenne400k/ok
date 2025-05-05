module.exports.config = {
  name: 'checkip',
  version: '10.02',
  hasPermssion: 0,
  credits: 'DC-Nam',
  description: 'Kiểm tra địa chỉ',
  commandCategory: 'Công cụ',
  usages: '[host]',
  cooldowns: 3
};
const {
  get
} = require('axios');
module.exports.run = async function({
  api, event, args
}) {
  const out = (a, b, c, d) => api.sendMessage(a, b?b: event.threadID, c?c: null, d?d: event.messageID);
  try {
      const {
          code,
          msg,
          data
      } = (await get(`https://api.nambsls.repl.co/tien-ich/check-address.json?h=${args[0]}`)).data;
      if (![201,200,1].includes(code)) return out(msg);
      out({
          body: msg, location: {
              latitude: data.latitude, longitude: data.longitude, current: true
          }
      });
  }catch(err) {
      out(`${err}`)};
};