module.exports.config = {
  name: "time",
  version: "1.2",
  hasPermssion: 0,
  credits: "TrúcCute",// chính chủ xin đừng hiểu nhầm thay credits
  description: "xem giờ",
  commandCategory: "Công cụ",
  usages: "[Trống]",
  cooldowns: 5,
  dependencies: {
    "moment-timezone": "",
    "axios": ""
  }
}

module.exports.run = async ({ api, event, Users }) => {
  const axios = require('axios');
  const res = await axios.get('https://jrt-api.nguyenhaidang.ml/cadao');
  const data = res.data.data;
  const req = await axios.get('https://jrt-api.nguyenhaidang.ml/vsbg');
  const data2 = req.data.data;
  let cc = (await axios.get(data2, {
      responseType: "stream"
    })).data;
  const qq = await axios.get('https://jrt-api.nguyenhaidang.ml/love');
  const data1 = qq.data.data;
  const moment = require('moment-timezone');
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH");
  var phut = moment.tz("Asia/Ho_Chi_Minh").format("mm");
  var giay = moment.tz("Asia/Ho_Chi_Minh").format("ss");
  var ngay = moment.tz("Asia/Ho_Chi_Minh").format("D");
  var thang = moment.tz("Asia/Ho_Chi_Minh").format("MM");
  var nam = moment.tz("Asia/Ho_Chi_Minh").format("YYYY");
  var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
  if (thu == 'Sunday') thu = 'Chủ nhật'
  if (thu == 'Monday') thu = 'Thứ 2'
  if (thu == 'Tuesday') thu = 'Thứ 3'
  if (thu == 'Wednesday') thu = 'Thứ 4'
  if (thu == "Thursday") thu = 'Thứ 5'
  if (thu == 'Friday') thu = 'Thứ 6'
  if (thu == 'Saturday') thu = 'Thứ 7'
  var tile = Math.floor(Math.random() * 101);
  var msg = [
    "admin rất đẹp trai",
    "admin sinh ngày 18 tháng 10",
    "admin đang kiếm bồ",
    "Kẹo sữa mikita được làm từ sữa",
    "con người thiếu oxi sẽ chết",
    "admin rất yêu crush",
    "chửi bot sẽ bị ban",
    "admin là trai",
    "admin là nam",
    "oxi là chất gây nghiện",
    "admin yêu con gái chứ không trai",
    "admin là trai thẳng",
    "tag admin bằng ban",
    "chửi bot bạn không khác gì thiểu năng vì rảnh háng chửi 1 thứ vô tri",
    "bạn sẽ nổi tiếng nếu thay credits",
    "người Trung Quốc là China",
    "người Việt Nam nói tiếng Việt",
    "buồn ngủ bạn sẽ ngủ",
    "muối rất mặn",
    "đường rất ngọt",
    "con người biết nói",
    "chúng ta đang sống ở trái đất"
  ]
  let name = await Users.getNameUser(event.senderID)
  return api.sendMessage({body:
    `Xin chào ` + name +
    `\n🌺────────────🌺` +
    `\n[⚜️]➜ Hôm nay là ` + thu +
    `\n[⚜️]➜ Bây giờ là ` + gio + 
    ` giờ ` + phut + 
    ` phút ` + giay + 
    ` giây` +
    `\n[⚜️]➜ Ngày ` + ngay +
    ` tháng ` + thang +
    ` năm ` + nam +
    `\n[⚜️]➜ Tỉ lệ có ny trong năm nay của bạn là: ` + tile + 
    `%` +
    `\n[Bạn có biết?]: ` + msg[Math.floor(Math.random() * msg.length)] +
    `\n🌺────────────🌺` +
    `\n[⚜️]➜ Thính: ` + data1 +
    `\n\n🌺────────────🌺` +
    `\n[⚜️]➜ Ca dao: ` + data
                          , attachment: cc}, event.threadID, event.messageID)
}