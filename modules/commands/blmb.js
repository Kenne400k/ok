module.exports.config = {
  name: 'blmb',
  version: '10.02',
  hasPermssion: 0,
  credits: 'DC-Nam',
  description: 'Tạo bằng lái máy bay!',
  commandCategory: 'Tạo ảnh',
  usages: 'blmb + tên + ngày sinh',
  cooldowns: 3
};
const {
  loadImage,
  createCanvas,
  registerFont,
  Canvas
} = require('canvas'),
{
  writeFileSync,
  createReadStream,
  existsSync,
  unlinkSync
} = require('fs-extra'),
down = require('image-downloader'),
url_bg = 'https://i.postimg.cc/LsG1ytDP/c3b36d506d98986ad7f9924a844ef4de-0.jpg',
destFont_$0 = __dirname + '/cache/ChakraPetch-Medium.ttf';
module.exports.onLoad = async function() {
  if (!existsSync(destFont_$0)) await down.image({
      url: `https://raw.githubusercontent.com/duongcongnam02/Font/main/ttf/ChakraPetch-Medium.ttf`, dest: destFont_$0
  });
};
module.exports.run = async function({
  api, event, args
}) {
  try {
      const str = args.join(' '),
      idx = str.indexOf('');
      if (idx == -1) return api.sendMessage(`[⚜️]➜ Vui lòng nhập đúng định dạng: [tên] [ngày sinh]`, event.threadID, event.messageID);
      const tên = str.slice(0, idx).trim(),
      ngàySinh = str.slice(idx+1).trim();
      const img = await loadImage(url_bg),
      avt = await loadImage((event.type != 'message_reply' ?`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`: event.messageReply.attachments[0].url)),
      destSBlmb = __dirname + `/cache/blmb_${event.messageID}.png`,
      canvas = createCanvas(1439, 960),
      context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      context.rotate(-9.9*Math.PI/180);
      context.drawImage(avt, 146, 414, 290, 346);
      registerFont(destFont_$0, {
          family: 'ChakraPetch-Medium'
      });
      context.font = '38px ChakraPetch-Medium';
      context.fillStyle = 'black';
      context.textAlign = 'start';
      context.fillText(tên, 630, 516);
      context.fillText(ngàySinh, 620, 559);
      writeFileSync(destSBlmb, canvas.toBuffer());
      api.sendMessage({
          attachment: createReadStream(destSBlmb)}, event.threadID, () => unlinkSync(destSBlmb), event.messageID);
  }catch(err) {
      api.sendMessage(`${err}`, event.threadID, event.messageID);
  };
};