module.exports.config = {
  name: "tx",
  version: "6.6.6",
  hasPermssion: 0,
  credits: "Hphong",
  description: "Tài xỉu trên hệ thống Raiden Pay đa dạng nhiều kiểu",
  commandCategory: "Trò Chơi",
    usages: "[tài/xỉu/b3gn/b2gn/cs/ct] [số tiền]",
    cooldowns: 5
};
const axios = require('axios');
var bdsd = true;
var tilethang = 2.53;
var tilethangb3dn = 10;
var tilethangb2dn = 5;
var timedelay = 2;
var haisogiong = 2;
var basogiong = 3;
var motsogiong = 1;
function replace(int){
    var str = int.toString();
    var newstr = str.replace(/(.)(?=(\d{3})+$)/g,'$1,');
    return newstr;
}
function getImage(number){
    switch (number){
        case 1: return "https://imgur.com/qn9PXUX.jpg";
        case 2: return "https://imgur.com/hbQISCE.jpg";
        case 3: return "https://imgur.com/gyskBsm.jpg";
        case 4: return "https://imgur.com/vHMWTc2.jpg";
        case 5: return "https://imgur.com/HvA4KVd.jpg";
        case 6: return "https://imgur.com/JVuky8r.jpg";
    }
}
function getRATE(tong){
    if(tong == 4) var rate = 40;
    if(tong == 5) var rate = 35;
    if(tong == 6) var rate = 33.33;
    if(tong == 7) var rate = 25;
    if(tong == 8) var rate = 20;
    if(tong == 9) var rate = 16.66;
    if(tong == 10) var rate = 14.28;
    if(tong == 11) var rate = 12.5;
    if(tong == 12) var rate = 11.11;
    if(tong == 13) var rate = 10;
    if(tong == 14) var rate = 9.09;
    if(tong == 15) var rate = 8.33;
    if(tong == 16) var rate = 7.69;
    if(tong == 17) var rate = 7.14;
    return rate
}
module.exports.run = async function ({ event, api, Currencies, Users, args }) {
    try{
    const moment = require("moment-timezone");
    const format_day = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:ss");
    const { increaseMoney , decreaseMoney } = Currencies;
    const { threadID, messageID, senderID } = event;
    const { sendMessage: HakiraSEND } = api;
    var name = await Users.getNameUser(senderID)
    var money = (await Currencies.getData(senderID)).money
    var bet = parseInt((args[1] == "allin" ? money : args[1]));
    var input = args[0];
    var tong = parseInt(args[2])
    if(!input) return HakiraSEND("[ ❗ ] 𝗕𝗮̣𝗻 𝗰𝗵𝘂̛𝗮 𝗻𝗵𝗮̣̂𝗽 𝘁𝗮̀𝗶/𝘅𝗶̉𝘂/𝗯𝗼̣̂ 𝟯 𝗴𝗶𝗼̂́𝗻𝗴 𝗻𝗵𝗮𝘂/𝗯𝗼̣̂ 𝟮 𝗴𝗶𝗼̂́𝗻𝗴 𝗻𝗵𝗮𝘂/𝗰𝘂̛𝗼̛̣𝗰 𝘁𝗼̂̉𝗻𝗴/𝗰𝘂̛𝗼̛̣𝗰 𝘀𝗼̂́", threadID, messageID);
    if(!bet) return HakiraSEND("Co Dau Buoi", threadID, messageID);
    if(bet < 1000) return HakiraSEND("[ 💸 ] 𝗕𝗮̣𝗻 𝗰𝗮̂̀𝗻 𝗰𝘂̛𝗼̛̣𝗰 𝘁𝗼̂́𝗶 𝘁𝗵𝗶𝗲̂̉𝘂 𝗹𝗮̀ 𝟭𝟬𝟬𝟬$", threadID, messageID);
    if(bet > money) return HakiraSEND("[ 💸 ] 𝗕𝗮̣𝗻 𝘁𝗵𝗶𝗲̂́𝘂 𝘁𝗶𝗲̂̀𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝘁𝗵𝗲̂̉ 𝗰𝘂̛𝗼̛̣𝗰", threadID, messageID);
    if(input == "tài" || input == "Tài" || input == '-t') var choose = 'tài'
    if(input == "xỉu" || input == "Xỉu" || input == '-x') var choose = 'xỉu'
    if(input == 'b3gn' || input == 'bbgn' || input == 'btgn') var choose = 'b3gn'
    if(input == 'b2gn' || input == 'bdgn' || input == 'bhgn') var choose = 'b2gn'
    if(input == 'cuoctong' || input == 'ct') var choose = 'cuoctong'
    if(input == 'cuocso' || input == 'cs') var choose = 'cuocso'
    var tag = ['tài','xỉu','b3gn','b2gn','cuoctong','cuocso']
    if(!tag.includes(choose)) return HakiraSEND('[ ❗ ] 𝗕𝗮̣𝗻 𝗻𝗵𝗮̣̂𝗽 𝘀𝗮𝗶 𝗹𝘂̛̣𝗮 𝗰𝗵𝗼̣𝗻, 𝗵𝗮̃𝘆 𝗰𝗵𝗼̣𝗻 𝘁𝗮̀𝗶/𝘅𝗶̉𝘂/𝗯𝟯𝗴𝗻/𝗯𝟮𝗴𝗻/𝗰𝘁/𝗰𝘀', threadID, messageID)
    if(choose == 'cuoctong' && (tong < 4 || tong > 17)) return HakiraSEND("[ 💸 ] 𝗧𝗼̂̉𝗻𝗴 𝗰𝘂̛𝗼̛̣𝗰 𝗸𝗵𝗼̂𝗻𝗴 𝗵𝗼̛̣𝗽 𝗹𝗲̣̂", threadID, messageID);
    if(choose == 'cuocso' && (tong < 1 || tong > 6)) return HakiraSEND("[ ❗ ] 𝗦𝗼̂́ 𝗯𝗮̣𝗻 𝗰𝗵𝗼̣𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝗵𝗼̛̣𝗽 𝗹𝗲̣̂ ?", threadID, messageID);
    const number = [], img = [], bodem = 0;
    for(let i = 1; i < 4; i++){
    var n = Math.floor(Math.random() * 6 + 1) 
    number.push(n)
    var img_ = (await axios.get(encodeURI(getImage(n)), { responseType: 'stream' })).data;
    img.push(img_)
    HakiraSEND(`[ 🎲 ] - 𝗟𝗮̂̀𝗻 𝗹𝗮̆́𝗰 𝘅𝘂́𝗰 𝘅𝗮̆́𝗰 𝘁𝗵𝘂̛́ ${i}: ${n}`, threadID, messageID)
      await new Promise(resolve => setTimeout(resolve, timedelay * 1000))
}
var total = number[0] + number[1] + number[2];
if(choose == 'cuocso'){
    if(number[0] == tong || number[1] == tong || number[2] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * motsogiong 
        var mne = money + mn
    }
    if(number[1] == tong && number[2] == tong || number[0] == tong && number[2] == tong || number[0] == tong && number[1] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * haisogiong
        var mne = money + mn
    }
    if(number[0] == tong && number[1] == tong && number[2] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * basogiong
        var mne = money + mn
    }
    if(number[0] != tong && number[1] != tong && number[2] != tong){
        var ans = `${tong}`
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }   
}
if(choose == 'cuoctong'){
    if(total == tong){
        var ans = "cược tổng"
        var result = 'win'
        var mn = bet * parseInt((getRATE(tong)))
        var mne = money + mn
    } else {
        var ans = `${total}`
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'b3gn' ){
    if(number[0] == number[1] && number[1] == number[2]) {
        var ans = "bộ ba đồng nhất"
        var result = 'win'
        var mn = bet * tilethangb3dn
        var mne = money + mn
    } else {
        var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'b2gn'){
    if(number[0] == number[1] || number[1] == number[2] || number[0] == number[2]) {
        var ans = "bộ hai đồng nhất"
        var result = 'win'
        var mn = bet * tilethangb2dn
        var mne = money + mn
    } else {
        var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'tài' || choose == 'xỉu') {
if(number[0] == number[1] && number[1] == number[2]){
var ans = "bộ ba đồng nhất"
} else {
var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
}
if(number[0] == number[1] && number[1] == number[2]) {
    var result = 'lose'
    var mn = bet
    var mne = money - mn
}
if(ans == choose) {
    var result = 'win'
    var mn = bet * tilethang
    var mne = mn + money
} else {
    var result = 'lose'
    var mn = bet
    var mne = money - mn
}
}
if(result =='lose'){
    decreaseMoney(senderID, mn)
} else if(result == 'win'){
    increaseMoney(senderID, mn)
}
var msg =   `===== 𝗧𝗔̀𝗜 𝗫𝗜̉𝗨 =====` 
            + '\n' + 
            `[ ⏰ ] - 𝗧𝗶𝗺𝗲: ${format_day}`
            + '\n' +
            `[ 👤 ] - 𝗣𝗹𝗮𝘆𝗲𝗿: ${name}`
            + '\n' +
            `[ 🌸 ] - 𝗟𝘂̛̣𝗮 𝗖𝗵𝗼̣𝗻: ${choose}`
            + '\n' +
            `[ ⚜️ ] - 𝗞𝗲̂́𝘁 𝗤𝘂𝗮̉: ${ans}`
            + '\n' +
            `[ 🎲 ] - 𝗫𝘂́𝗰 𝗫𝗮̆́𝗰 𝟭: ${number[0]}`
            + '\n' + 
            `[ 🎲 ] - 𝗫𝘂́𝗰 𝗫𝗮̆́𝗰 𝟮: ${number[1]}`
            + '\n' +
            `[ 🎲 ] - 𝗫𝘂́𝗰 𝗫𝗮̆́𝗰 𝟯: ${number[2]}`
            + '\n' +
            `[ 🎲 ] - 𝗧𝗼̂̉𝗻𝗴 𝗫𝘂́𝗰 𝗫𝗮̆́𝗰: ${total}`
            + '\n' +
            `[ 🎰 ] - 𝗞𝗲̂́𝘁 𝗤𝘂𝗮̉: ${(result == 'win' ? 'Thắng' : 'Thua')}`
            + '\n' +
            `[ 💸 ] - 𝗧𝗶𝗲̂̀𝗻 𝗖𝘂̛𝗼̛̣𝗰: ${replace(bet)}`
            + '\n' +
            `[ 💵 ] - 𝗧𝗶𝗲̂̀𝗻 ${(result == 'win' ? 'Thắng' : 'Thua')}: ${replace(Math.floor(mn))}$`
            + '\n' +
            `[ ♻️ ] - 𝗧𝗿𝗮̣𝗻𝗴 𝗧𝗵𝗮́𝗶: ${(result == 'win' ? 'Đã Trả Thưởng' : 'Đã Trừ Tiền')}`
            + '\n' +
            `[ 💰 ] - 𝗦𝗼̂́ 𝗧𝗶𝗲̂̀𝗻 𝗛𝗶𝗲̣̂𝗻 𝗧𝗮̣𝗶: ${replace(mne)}$`
            +'\n' +
            `===== 𝗧𝗔̀𝗜 𝗫𝗜̉𝗨 =====`
            HakiraSEND({body:msg,attachment: img}, threadID, messageID)
            if(bdsd == false) {
          var msg =  `𝗛𝗽𝗵𝗼𝗻𝗴𝗣𝗮𝘆 𝘁𝗵𝗼̂𝗻𝗴 𝗯𝗮́𝗼, 𝗻𝗴𝗮̀𝘆 ${format_day}\n${(result == 'win') ? '𝗡𝗵𝗮̣̂𝗻 𝘁𝗶𝗲̂̀𝗻' : '𝗕𝗶̣ 𝘁𝗿𝘂̛̀ 𝘁𝗶𝗲̂̀𝗻'} 𝘁𝘂̛̀ 𝗱𝗶̣𝗰𝗵 𝘃𝘂̣ 𝗴𝗮𝗺𝗲 𝘁𝗮̀𝗶 𝘅𝗶̉𝘂\n𝗦𝗼̂́ 𝘁𝗶𝗲̂̀𝗻 𝗻𝗵𝗮̣̂𝗻 𝘃𝗲̂̀ ${replace(mn)}\n𝗦𝗼̂́ 𝗱𝘂̛ 𝗸𝗵𝗮̉ 𝗱𝘂̣𝗻𝗴: ${replace(mne)}$\n𝗖𝗮̉𝗺 𝗼̛𝗻 𝘃𝗶̀ 𝘁𝗶𝗻 𝗱𝘂̀𝗻𝗴 𝗱𝗶̣𝗰𝗵 𝘃𝘂̣ 𝗰𝘂̉𝗮 𝗥𝗮𝗶𝗱𝗲𝗻𝗣𝗮𝘆 🌸`
            HakiraSEND({
                body: msg,
               // attachment: img
            }, senderID)
        }
} catch(e){
    console.log(e)
}}