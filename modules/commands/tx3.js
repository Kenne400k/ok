const axios = require('axios');
const moment = require("moment-timezone");

module.exports.config = {
  name: "tx3",
  version: "0.0.1",
  hasPermssion: 0,
  Rent: 1,
  credits: "WhoisHakira stolen form lorenBot(MinhHuyDev)",
  description: "Chơi tài xỉu",
  commandCategory: "game",
  usages: "taixiu [tài/xỉu] [số tiền]",
  cooldowns: 0
};

var bdsd = true;
var tilethang = 3;
var tilethangb3dn = 10;
var tilethangb2dn = 5;
var timedelay = 2;
var haisogiong = 2;
var basogiong = 3;
var motsogiong = 1;

function replace(int) {
    var str = int.toString();
    var newstr = str.replace(/(.)(?=(\d{3})+$)/g, '$1,');
    return newstr;
}

function getImage(number) {
    switch (number) {
        case 1: return "https://i.imgur.com/H8w634y.jpg";
        case 2: return "https://i.imgur.com/vc9r4q4.jpg";
        case 3: return "https://i.imgur.com/SmOzlNt.jpg";
        case 4: return "https://i.imgur.com/680wTWp.jpg";
        case 5: return "https://i.imgur.com/X3KzAc4.jpg";
        case 6: return "https://i.imgur.com/KAOjcW0.jpg";
    }
}

function getRATE(tong) {
    if (tong >= 4 && tong <= 17) return 25;
    return 0;
}

module.exports.run = async function ({ event, api, Currencies, Users, args }) {
    try {
        const { increaseMoney, decreaseMoney } = Currencies;
        const { threadID, messageID, senderID } = event;
        const { sendMessage: HakiraSEND } = api;
        var name = await Users.getNameUser(senderID);
        var money = (await Currencies.getData(senderID)).money;
        var bet = parseInt((args[1] == "all" ? money : args[1]));
        var input = args[0];
        var tong = parseInt(args[2]);

        if (!input) return HakiraSEND("Bạn chưa nhập tài/xỉu/bộ ba giống nhau/bộ đôi giống nhau/cược tổng/cược số", threadID, messageID);
        if (!bet || isNaN(bet) || bet < 1000) return HakiraSEND("Co Dau Buoi", threadID, messageID);
        if (bet > money) return HakiraSEND("Bạn không đủ tiền để đặt cược", threadID, messageID);

        var choose;
        if (['tài', 'Tài', '-t'].includes(input)) choose = 'tài';
        else if (['xỉu', 'Xỉu', '-x'].includes(input)) choose = 'xỉu';
        else if (['b3gn', 'bbgn', 'btgn'].includes(input)) choose = 'b3gn';
        else if (['b2gn', 'bdgn', 'bhgn'].includes(input)) choose = 'b2gn';
        else if (['cuoctong', 'ct'].includes(input)) choose = 'cuoctong';
        else if (['cuocso', 'cs'].includes(input)) choose = 'cuocso';
        else return HakiraSEND('Sai Tag', threadID, messageID);

        if (choose === 'cuoctong' && (tong < 4 || tong > 17)) return HakiraSEND("Tổng cược không hợp lệ ?", threadID, messageID);
        if (choose === 'cuocso' && (tong < 1 || tong > 6)) return HakiraSEND("Số được chọn không hợp lệ ?", threadID, messageID);

        const number = [], img = [];
        for (let i = 1; i < 4; i++) {
            var n = Math.floor(Math.random() * 6 + 1);
            number.push(n);
            var img_ = (await axios.get(encodeURI(getImage(n)), { responseType: 'stream' })).data;
            img.push(img_);
            await new Promise(resolve => setTimeout(resolve, timedelay * 0));
        }

        var total = number[0] + number[1] + number[2];
        var ans, result, mn, mne;

        if (choose === 'cuocso') {
            if ([number[0], number[1], number[2]].includes(tong)) {
                ans = `${tong}`;
                result = 'win';
                mn = bet * motsogiong;
                mne = money + mn;
            } else if ([number[1], number[2]].includes(tong) || [number[0], number[2]].includes(tong) || [number[0], number[1]].includes(tong)) {
                ans = `${tong}`;
                result = 'win';
                mn = bet * haisogiong;
                mne = money + mn;
            } else if (number[0] === number[1] && number[1] === number[2]) {
                ans = `${tong}`;
                result = 'win';
                mn = bet * basogiong;
                mne = money + mn;
            } else {
                ans = `${tong}`;
                result = 'lose';
                mn = bet;
                mne = money - mn;
            }
        }

        if (choose === 'cuoctong') {
            if (total === tong) {
                ans = "cược tổng";
                result = 'win';
                mn = bet * getRATE(tong);
                mne = money + mn;
            } else {
                ans = `${total}`;
                result = 'lose';
                mn = bet;
                mne = money - mn;
            }
        }

        if (choose === 'b3gn') {
            if (number[0] === number[1] && number[1] === number[2]) {
                ans = "bộ ba đồng nhất";
                result = 'win';
                mn = bet * tilethangb3dn;
                mne = money + mn;
            } else {
                ans = (total >= 11 && total <= 18) ? "tài" : "xỉu";
                result = 'lose';
                mn = bet;
                mne = money - mn;
            }
        }

        if (choose === 'b2gn') {
            if (number[0] === number[1] || number[1] === number[2] || number[0] === number[2]) {
                ans = "bộ hai đồng nhất";
                result = 'win';
                mn = bet * tilethangb2dn;
                mne = money + mn;
            } else {
                ans = (total >= 11 && total <= 18) ? "tài" : "xỉu";
                result = 'lose';
                mn = bet;
                mne = money - mn;
            }
        }

        if (['tài', 'xỉu'].includes(choose)) {
            if (number[0] === number[1] && number[1] === number[2]) {
                ans = "bộ ba đồng nhất";
            } else {
                ans = (total >= 11 && total <= 18) ? "tài" : "xỉu";
            }

            if (number[0] === number[1] && number[1] === number[2]) {
                result = 'lose';
                mn = bet;
                mne = money - mn;
            } else if (ans === choose) {
                result = 'win';
                mn = bet * tilethang;
                mne = mn + money;
            } else {
                result = 'lose';
                mn = bet;
                mne = money - mn;
            }
        }

        if (result === 'lose') {
            decreaseMoney(senderID, mn);
        } else if (result === 'win') {
            increaseMoney(senderID, mn);
        }

        var msg = `===== TÀI XỈU =====` +
            '\n' +
            `[ x ] - Người Chơi: ${name} Đã Lựa Chọn: ${choose}` +
            '\n' +
            `[ x ] - Tổng ba xúc xắc: ${total}` +
            '\n' +
            `[ x ] - Kết Quả: ${ans}` +
            '\n' +
            `[ x ] - Bạn cược ${choose} với số tiền ${replace(bet)} và ${(result === 'win' ? 'Thắng' : 'Thua')}: ${replace(Math.floor(mn))}$` +
            '\n' +
            `[ x ] - Số Tiền Hiện Tại: ${replace(mne)}$` +
            '\n' +
            `===== TÀI XỈU =====`;

        HakiraSEND({ body: msg, attachment: img }, threadID, messageID);

        if (bdsd === true) {
            var format_day = moment.tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY");
            var msg = `MiraiPay, Ngày ${format_day}\n${(result === 'win') ? 'nhận tiền' : 'trừ tiền'} dịch vụ game tài xỉu\nsố tiền ${replace(mn)}\nSố dư khả dụng: ${replace(mne)}$\nCảm ơn đã tin dùng dịch vụ của MiraiPay`;

            HakiraSEND({
                body: msg,
            }, senderID);
        }
    } catch (e) {
        console.error(e);
    }
};
