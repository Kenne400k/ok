module.exports.config = {
  name: "chịch",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "HĐGN",
  description: "Chịch người bạn muốn",
  commandCategory: "Hành động",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
  }
};

module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'chich.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/A7T04KJ.jpg", path);
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let chich_img = await jimp.read(__root + "/chich.png");
  let pathImg = __root + `/chich_${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));
  chich_img.composite(circleOne.resize(150, 150), 56, 164).composite(circleTwo.resize(150, 150), 380, 190);

  let raw = await chich_img.getBufferAsync("image/png");

  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}
async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  var mention = Object.keys(event.mentions)[0]
  let tag = event.mentions[mention].replace("@", "");
  if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
  else {
      var one = senderID, two = mention;
      return makeImage({ one, two }).then(path => api.sendMessage({ body: "𝐒𝐮̛𝐨̛́𝐧𝐠 𝐐𝐮𝐚́ 𝐀𝐧𝐡 𝐎̛𝐢 >< 𝐘𝐚𝐦𝐚𝐭𝐞",
          mentions: [{
        tag: tag,
        id: mention
      }],
   attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
  }
}