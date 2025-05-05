module.exports.config = {
  name: 'xsmb',
  version: '10.02',
  hasPermssion: 0,
  credits: 'DC-Nam',
  description: 'Kiểm tra xổ số miền Bắc',
  commandCategory: 'Tiện ích',
  usages: '',
  cooldowns: 3
};
const {
  get
} = require('axios');
module.exports.onLoad = o => {
  if (!!global.xsmb_setinterval) clearInterval(global.xsmb_setinterval);
 global.xsmb_setinterval = setInterval(async() => {
  if ('6:32:00 PM' == new Date(Date.now()+25200000).toLocaleString().split(/,/).pop().trim()) {
      const {
          data
      } = (await get(`https://nguyenmanh.name.vn/api/xsmb?apikey=EmGBV3sY`)).data;
      global.data.allThreadID.forEach(i => o.api.sendMessage(data[0].message, i));
  };
}, 1000);
};
module.exports.run = async function({
  api, event, args
}) {
  const out = (a, b) => api.sendMessage(`${a}`, event.threadID, b?event.messageID: null);
  try {
      const {
          data
      } = (await get(`https://nguyenmanh.name.vn/api/xsmb?apikey=EmGBV3sY`)).data

}