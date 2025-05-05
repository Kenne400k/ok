module.exports.config = {
	name: "txiu",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "WhoisHakira stolen form lorenBot(MinhHuyDev)",
	description: "Chơi tài xỉu",
	commandCategory: "game",
    usages: "taixiu [tài/xỉu] [số tiền]",
    cooldowns: 0
};
const axios = require('axios');
var bdsd = true;
var tilethang = 1;
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
        case 1: return "https://i.imgur.com/ruaSs1C.png";
        case 2: return "https://i.imgur.com/AIhuSxL.png";
        case 3: return "https://i.imgur.com/JB4vTVj.png";
        case 4: return "https://i.imgur.com/PGgsDAO.png";
        case 5: return "https://i.imgur.com/RiaMAHX.png";
        case 6: return "https://i.imgur.com/ys9PwAV.png";
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
    const format_day = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY");
    const thinh = ["Cờ bạc là bác thằng bần", "Bạn chơi, bạn thắng, bạn chơi, bạn thua. Bạn lại tiếp tục chơi.", "Người không chơi là người không bao giờ thắng", "Bạn không bao giờ biết điều gì tồi tệ hơn vận xui mà bạn có.", "Cách an toàn nhất để nhân đôi số tiền của bạn là gấp nó lại 1 lần và để vào túi.", "Cờ bạc là nguyên tắc vốn có của bản chất con người.", "Đánh đề thì chỉ có ra đê mà ở", "Cách tốt nhất để Ném xúc xắc là ném chúng đi và đừng chơi nữa.", "Ăn tiền cược của bạn nhưng đừng cược tiền ăn", "Áo quần bán hết, ngồi trần tô hô", "Đánh bạc quen tay, ngủ ngày quen mắt, ăn vặt quen mồm.", "Cược càng ít, khi thắng bạn càng thua nhiều", "Cờ bạc, khiến chúng ta mất hai thứ quý giá nhất của đời người. Đó là thời gian và tiền bạc", "Cờ bạc ai thua, ai thắng, ai không thắng để rồi lại sẽ thua.", "Cờ bạc có thắng có thua, thắng thì ít mà thua thì nhiều."];
    const { increaseMoney , decreaseMoney } = Currencies;
    const { threadID, messageID, senderID } = event;
    const { sendMessage: HakiraSEND } = api;
    var name = await Users.getNameUser(senderID)
    var money = (await Currencies.getData(senderID)).money
    var bet = parseInt((args[1] == "allin" ? money : args[1]));
    var input = args[0];
    var tong = parseInt(args[2])
    if(!input) return HakiraSEND("→ Bạn chưa nhập tài/xỉu/bộ ba giống nhau/bộ đôi giống nhau/cược tổng/cược số", threadID, messageID);
    if(!bet) return HakiraSEND("Co Dau Buoi", threadID, messageID);
    if(bet < 20) return HakiraSEND("Bạn cần đặt cược tối thiểu 20$", threadID, messageID);
    if(bet > money) return HakiraSEND("Bạn không đủ tiền để đặt cược", threadID, messageID);
    if(input == "tài" || input == "Tài" || input == '-t') var choose = 'tài'
    if(input == "xỉu" || input == "Xỉu" || input == '-x') var choose = 'xỉu'
    if(input == 'b3gn' || input == 'bbgn' || input == 'btgn') var choose = 'b3gn'
    if(input == 'b2gn' || input == 'bdgn' || input == 'bhgn') var choose = 'b2gn'
    if(input == 'cuoctong' || input == 'ct') var choose = 'cuoctong'
    if(input == 'cuocso' || input == 'cs') var choose = 'cuocso'
    var tag = ['tài','xỉu','b3gn','b2gn','cuoctong','cuocso']
    if(!tag.includes(choose)) return HakiraSEND('Sai Tag', threadID, messageID)
    if(choose == 'cuoctong' && (tong < 4 || tong > 17)) return HakiraSEND("Tổng cược không hợp lệ ?", threadID, messageID);
    if(choose == 'cuocso' && (tong < 1 || tong > 6)) return HakiraSEND("Số được chọn không hợp lệ ?", threadID, messageID);
    const number = [], img = [], bodem = 0;
    for(let i = 1; i < 4; i++){
    var n = Math.floor(Math.random() * 6 + 1) 
    number.push(n)
    var img_ = (await axios.get(encodeURI(getImage(n)), { responseType: 'stream' })).data;
    img.push(img_)
    HakiraSEND(`[ 𝗧𝗫 ] → Lần đổ xúc xắc thứ ${i}:\n──────────────────\n🎲 Bot lắc ra được số: ${n}`, threadID, messageID)
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
var msg =   `=== [ Kết Quả Tài Xỉu ] ===\n──────────────────`  
            + '\n' + 
            `⏰ Vào lúc: ${format_day}`
            + '\n' +
            `👤 Người chơi: ${name}`
            + '\n' +
            `🙋 Lựa chọn: ${choose}`
            + '\n' +
            `📌 Kết quả: ${ans}`
            + '\n' +
            `🎲 Xúc xắc 1: ${number[0]}`
            + '\n' + 
            `🎲 Xúc xắc 2: ${number[1]}`
            + '\n' +
            `🎲 Xúc xắc 3: ${number[2]}`
            + '\n' +
            `🖇️ Tổng ba xúc xắc: ${total}`
            + '\n──────────────────\n' +
            `🤑 Kết quả: ${(result == 'win' ? 'Thắng' : 'Thua')}`
            + '\n' +
            `💵 Tiền cược: ${replace(bet)}`
            + '\n' +
            `💶 Tiền ${(result == 'win' ? 'Thắng' : 'Thua')}: ${replace(Math.floor(mn))}$`
            + '\n' +
            `🕵️ Tình trạng: ${(result == 'win' ? 'Đã Trả Thưởng' : 'Đã Trừ Tiền')}`
            + '\n' +
            `💸 Số tiền hiện tại: ${replace(mne)}$`
            + '\n──────────────────\n' +
            `🤷 Lời khuyên: ${thinh[Math.floor(Math.random() * thinh.length)]}`
            HakiraSEND({body:msg,attachment: img}, threadID, messageID)
} catch(e){
    console.log(e)
}}