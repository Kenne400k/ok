module.exports.config = {
  name: "cosplay",	
  version: "4.0.0", 
  hasPermssion: 0,
  Rent: 2,
  credits: "Vtuan",
  description: "sos", 
  commandCategory: "Random Ảnh",
  usages: "",
  cooldowns: 60000
};

module.exports.run = async ({ api, event }) => {
  const request = require('request');
  const fs = require("fs");
  const tdungs = [
    require('./../../lekhanh/datajson/cosplay.json'),
    require('./../../lekhanh/datajson/cosplay.json')
  ];

  function vtuanhihi(image, vtuandz, callback) {
    request(image).pipe(fs.createWriteStream(__dirname + `/` + vtuandz)).on("close", callback);
  }

    const numImages = Math.floor(Math.random() * 6) + 1;
    let imagesDownloaded = 0;
    let attachments = [];

    for (let i = 0; i < numImages; i++) {
      const randomTdung = tdungs[Math.floor(Math.random() * tdungs.length)];
      let image = randomTdung[Math.floor(Math.random() * randomTdung.length)].trim();
      let imgFileName = `image_${i}.png`;
      vtuanhihi(image, imgFileName, () => {
          imagesDownloaded++;
          attachments.push(fs.createReadStream(__dirname + `/${imgFileName}`));
          if (imagesDownloaded === numImages) {
            api.sendMessage({
              body: `Tha hồ ngắm=)))`,
              attachment: attachments
            }, event.threadID, () => {

              for (let img of attachments) {
                fs.unlinkSync(img.path); 
              }
            }, event.messageID);
          }
      });
    }
  }