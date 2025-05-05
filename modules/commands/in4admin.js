const request = require('request');

const fs = global.nodemodule["fs-extra"]

module.exports.config = {

  name: "in4admin",

  version: "1.0.0",

  hasPermssion: 0,

  credits: "JRT",

  description: "Kiểm tra thông tin adminbot",

  commandCategory: "Thông tin",

  usages: "in4admin",

  cooldowns: 0,

  dependencies: {

"request": ""

}

};
module.exports.run = async({api,event,args,Users,global,Currencies}) => {

var callback = () => api.sendMessage(

  {body:`[⚜️]=== 『 INFORMATION ADMIN 』 ===[⚜️]
   ◆━━━━━━━━━━━━━━━━◆


[👀]➜ Tên: Ng Van Hung 
[💮]➜ Biệt danh: Vincent 
[❎]➜ Ngày tháng năm sinh: 13/03/2010
[👤]➜ Giới tính: Nam
[💫]➜ Chiều cao cân nặng: 1m79 x 55 kg
[💘]➜ Mối quan hệ: Hẹn Hò 
[🌎]➜ Quê quán: Gia Lai
[🌸]➜ Tính cách: 360 
[🌀]➜ Sở thích: GYM,Football,cntt

[⚜️]=== 『 CONTACT 』 ===[⚜️]
◆━━━━━━━━━━━━━━━━◆

[👉]➜ Information: Đéo có 
[☎]➜ SĐT & Zalo: đéo tiết lộ
[🌐]➜ Facebook: https://www.facebook.com/erendayyyy/
[✉️]➜ Email: nvhzz123@gmail.com

[⚜️]=== 『 PROBLEM 』 ===[⚜️]
◆━━━━━━━━━━━━━━━━◆


[❗]➜ Mọi thắc mắc hay bot không hoạt động có thể hỏi trực tiếp admin theo các link ở trên.
[📌]➜ Hãy đồng hành cùng BOT và mình nhé. Cảm ơn mọi người ❤

✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

[📝]➜ 𝐁𝐨𝐭 Đ𝐮̛𝐨̛̣𝐜 Đ𝐢𝐞̂̀𝐮 𝐇𝐚̀𝐧𝐡 𝐁𝐨̛̉𝐢 𝐀𝐝𝐦𝐢𝐧 Văn Hưng`,

    attachment: fs.createReadStream(__dirname + "/cache/vh.png")}, event.threadID, () => 

    fs.unlinkSync(__dirname + "/cache/vh.png"));  

      return request(

        encodeURI(`https://graph.facebook.com/${219490729426680}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(

fs.createWriteStream(__dirname+'/cache/vh.png')).on('close',() => callback());

       };