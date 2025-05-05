module.exports.config = {
    name: "phantich",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Phân tích avatar của bạn",
    commandCategory: "Tiện ích",
    usages: "phantich reply/@tag",
    cooldowns: 0
    };
module.exports.run = async function ({ api, event, args, Users, Currencies }) {
  const fs = require("fs-extra");
  const request = require("request");
  const t = ["Người đẹp không tổi",
    "Đéo biết tuổi gì",
    "Tuổi con ngan con",
    "Tuổi con cặc",
    "Tuổi con tép",
    "Tuổi mày bằng tuổi con tao",
    "Lồn"
];
const tc = ["Tự tin",
  "Chầm tính",
  "Tự ti",
  "Khó tính",
  "Hiền lành",
  "Tính như lồn",
  "Người tình cảm",
  "Tham vọng",
  "Người cá tính",
  "Người lý trí",
  "Người trung thành",
  "Nhiệt tình",
  "Người mạnh mẽ",
  "Ôn hòa",
];
const y = ["Tiền",
  "tình",
  "Gia đình",
  "Tình dục",
  "Yêu gì kệ mày tao đéo biết",
  "Màu hồng",
  "Động vật",
  "Công việc",
];
const g = ["Nói dối",
  "Cục súc",
  "Nói nhiều",
  "Hãm lồn",
  "Tao đéo biết mày ghét gì",
  "Bạo lực",
  "Động vật",
  "Đông người",
  "Học",
  "Tình dục",
  "Người yêu cũ",
  "Giả dối"
];
const mt = ["Quá Độc Lập",
  "Nói nhiều",
  "Làm không suy nghĩ",
  "Tiêu cực",
  "Suy nghĩ nhiều, linh tinh",
  "Không suy nghĩ cho bản thân",
  "Ki bo",
  "Khao khát bạo lực",
  "Ăn cắp vặt",
  "Thích đánh bạc"
];
const ms = ["Vui vẻ",
  "Bình yên",
  "nhây",
  "Nhoi",
  "lầy",
  "Khiến người khác thoải mái",
  "Hay giúp đỡ người khác",
  "Đúng giờ",
  "Trung thành",
  "Tôn trọng người khác",
  "Giữ lời hứa",
  "Rộng lượng",
  "Đồng cảm"
];
const bm = ["Body nóng bỏng",
  "Rất nhiều tiền",
  "Gay",
  "Nghèo vcl",
  "Bí mật quá tao đéo biết",
  "Người không biết giữ Bí mật",
  "Học ngu",
  "Thiên tài",
  "Ăn nhiều"
];
const tk = ["Là người có tâm hồn đẹp",
  "Con người phóng khoáng",
  "Xấu tính hay làm người khác khó chịu",
  "Con người không biết suy nghĩ",
   "Không Biết trước biết sau",
];
    if (Object.keys(event.mentions).length == 1) {
      var mentions = Object.keys(event.mentions)
      var data = await Currencies.getData(mentions);
      var name = (await Users.getData(mentions)).name
      var callback = () => api.sendMessage({
        body: `【PHÂN TÍCH AVATAR CỦA BẠN】\n\n👽Tên: ${name}\n🗓Tuổi: ${t[Math.floor(Math.random() * t.length)]} \n🤖Tính cách: ${tc[Math.floor(Math.random() * tc.length)]}\n💗Yêu: ${y[Math.floor(Math.random() * y.length)]}\n💀Ghét: ${g[Math.floor(Math.random() * g.length)]}\n⬛Mặt tối: ${mt[Math.floor(Math.random() * mt.length)]}\n⬜Mặt sáng: ${ms[Math.floor(Math.random() * ms.length)]}\n🔐Bí mật: ${bm[Math.floor(Math.random() * bm.length)]}\n⚖Tổng kết: ${tk[Math.floor(Math.random() * tk.length)]}`,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
      },
        event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
      return request(encodeURI(`https://graph.facebook.com/${mentions}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
    }
    else {
      if (!args[0]) {
        if (event.type == "message_reply")
          idmen = event.messageReply.senderID
        else idmen = event.senderID;
        var data = await Currencies.getData(idmen);
        var name = (await Users.getData(idmen)).name;
        var callback = () => api.sendMessage({
          body: `【PHÂN TÍCH AVATAR CỦA BẠN】\n\n👽Tên: ${name}\n🗓Tuổi: ${t[Math.floor(Math.random() * t.length)]} \n🤖Tính cách: ${tc[Math.floor(Math.random() * tc.length)]}\n💗Yêu: ${y[Math.floor(Math.random() * y.length)]}\n💀Ghét: ${g[Math.floor(Math.random() * g.length)]}\n⬛Mặt tối: ${mt[Math.floor(Math.random() * mt.length)]}\n⬜Mặt sáng: ${ms[Math.floor(Math.random() * ms.length)]}\n🔐Bí mật: ${bm[Math.floor(Math.random() * bm.length)]}\n⚖Tổng kết: ${tk[Math.floor(Math.random() * tk.length)]}`,
          attachment: fs.createReadStream(__dirname + "/cache/1.png")
        },
          event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
        return request(encodeURI(`https://graph.facebook.com/${idmen}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
          .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
          .on('close', () => callback());
      }
    }
  }