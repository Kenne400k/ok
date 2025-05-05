const axios = require('axios');
let prompt;
let content;
const dungkon = "0nl7KTPKnu9w2UWoTgYUioxOCcynml2193wcw47_Evf" //Tự để token ở đây l có thì liên hệ: https://www.facebook.com/nguyendinhtiendung.User
module.exports.config = {
    name: "qr",
    version: "1.0",
    credis: "Dũngkon",//convert của L.V. Bằng, thay cre làm chó 
    hasPermssion: 0,
    description: "Mã hoá văn bản bằng mã QR theo dạng AI",
    commandCategory: "Tiện ích",
    usages: "[text]",
    countDown: 5
  };
module.exports.run = async function({ api, args, handleReply, event }) {
  const dk = "Mod convert by Dũngkon"
  const { threadID, messageID, senderID } = event
    if (args.join(' ').length < 1) {
      api.sendMessage('Vui lòng nhập prompt!',threadID,messageID)
      return;
    } else {
      prompt = args.join(' ')
    }
    api.sendMessage({
      body: 'Vui lòng reply nội dung bạn muốn trong QR!'
    }, threadID,(err, info) => {
      global.client.handleReply.push({
                    type: "choose",
                    name: this.config.name,
                    author: senderID,
                    messageID: info.messageID,
        prompt: args.join(" ")
                })
            })
  }

module.exports.handleReply = async function({ api, handleReply, event }) {
    const { messageID, author, prompt } = handleReply;
    if (event.senderID != author)
      return api.sendMessage('Tự bật mà sài!',event.threadID, event.messageID);
    if (event.body) {
      api.unsendMessage(messageID);
      content = event.body

      const url = 'https://studio-api.mojo.vn/service/api/art/generate';

      const headers = {
        'authority': 'studio-api.mojo.vn',
        'accept': '*/*',
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,ru;q=0.4',
        'content-type': 'application/json',
        'origin': 'https://app.mojo.vn',
        'referer': 'https://app.mojo.vn/',
        'sec-ch-ua': '"Not:A-Brand";v="99", "Chromium";v="112"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': 'Linux',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        'x-auth-token': `${dungkon}`
      };

      const data = {
        "prompt": handleReply.prompt,
        "ar": "1152:1152",
        "count": 1,
        "init_image": "",
        "image_strength": 0,
        "image_weight": 7,
        "negative_prompt": "",
        "style": "f",
        "seed": 0,
        "private": false,
        "device": "web",
        "qr": true,
        "qr_content": event.body,
        "qr_weight": 1.1,
        "high_quality": false,
        "shortlink": true,
        "community": true
      };
  const timeStart = Date.now();
  const dk = "Mod convert by Dũngkon"
  const push = []
            push.push(Date.now())
             const moment = require("moment-timezone");
             var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
      try {
       const response = await axios.post(url, data, { headers })
    const timeEnd = Date.now();
      //  console.log(response.data)
     //   if (response.data.success) {
     api.sendMessage({
            body: `Ảnh qr của bạn đây\nVào lúc: ${gio}\n⏱️Thời gian xử lý: ${Math.floor((Date.now()- push[0])/1000)} giây\n${dk}`,
          attachment: (await axios.get(response.data.result[0],{responseType: "stream"})).data
          },event.threadID)
     /* } else {
          api.sendMessagd('Đã xảy ra lỗi', event.threadID, event.messageID)
        }*/
      } catch (err) {
        console.log(err);
        api.sendMessage('Đã xảy ra lỗi', event.threadID, event.messageID)
      }
    }
  }