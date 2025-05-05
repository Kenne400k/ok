exports.config = {
    name: 'noitu',
    version: '1.1.1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: 'Games nối chữ!',
    commandCategory: 'Game',
    usages: 'noitu + tiền > 10000 VNĐ',
    cooldowns: 3
};

let fs = require('fs');
let path = __dirname+'/bot/noitu.txt';
let data = [];
let stream_url= async url=>await require('axios').get(url, {
    responseType: 'stream'
}).then(res=>res.data);
let save = ()=>fs.writeFileSync(path, data.join(','), 'utf8');
let word_valid = word=>/^[a-zA-Zà-ỹÀ-Ỹ]+ [a-zA-Zà-ỹÀ-Ỹ]+$/.test(word);

exports.onLoad = async function() {
    if (!fs.existsSync(path)) {
        data = (await require('axios').get(`https://raw.githubusercontent.com/J-JRT/api2/mainV2/linkword.json`)).data.split(',').filter(word_valid);
    } else data = fs.readFileSync(path, 'utf8').split(',').filter(word_valid);
    save();
};

exports.handleReply = async function(o) {
    let _ = o.handleReply;
    if (o.event.senderID != _.event.senderID)return;

    let word = (o.event.body || '').split(' ');
    let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, callback == 0?undefined: o.event.messageID);

    if (!word_valid(word.join(' ')))return send(`[⚜️] ➜ Từ nối không hợp lệ!`); o.api.unsendMessage(_.messageID);
    if (_.type == 'player_vs_bot') {
        if (word[0].toLowerCase() != _.word_bot.split(' ')[1].toLowerCase()) {

            // send khác cũng làm tương tự như bên dưới,
            let image_all = [  
              "https://i.imgur.com/ct7CqS5.jpeg",
                "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
                "https://thietbimaycongnghiep.net/wp-content/uploads/2021/07/choi-noi-tu-online.jpg",
                "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
            ];
            let image_random = image_all[Math.random()*image_all.length<<0];
            send({
                body: `=== 『 GAME NỐI TỪ 』 ===\n━━━━━━━━━━━━━━━━\n[❎] ➜ Bạn đã thua\n[❗] ➜ số câu đã nối: ${_.loop}\n[💸] ➜ Bạn mất: ${_.bet} VNĐ`,
                attachment: await stream_url(image_random)
            }, 0);

            send(`[👎] ➜ Chúc mừng bạn đã thua!`);
            o.Currencies.decreaseMoney(o.event.senderID, _.bet);
            return;
        };
        let word_matching = data.filter($=>$.split(' ')[0].toLowerCase() == word[1].toLowerCase());
        let random_word_ = word_matching[Math.random()*word_matching.length<<0];

        if (!word_valid(random_word_)) {
            if (!data.includes(word.join(' '))) {
                data.push(word.join(' '));
                save();
            };
            o.Currencies.increaseMoney(o.event.senderID, _.bet*3);

            // send khác cũng làm tương tự như bên dưới,
            let image_all = [
                "https://i.imgur.com/ct7CqS5.jpeg",
                "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
                "https://thietbimaycongnghiep.net/wp-content/uploads/2021/07/choi-noi-tu-online.jpg",
                "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
            ];
            let image_random = image_all[Math.random()*image_all.length<<0];
            send({
                body: `=== 『 GAME NỐI TỪ 』 ===\n━━━━━━━━━━━━━━━━\n[✅] ➜ Bạn đã thắng\n[❗] ➜ Số câu đã nối được: ${_.loop}\n[💵] ➜ Tiền thưởng là: ${_.bet*3} VNĐ`,
                attachment: [await stream_url(image_random)]
            });
            send(`[👏] ➜ Chúc mừng bạn đã thắng bot!`);
        }else send(`=== 『 GAME NỐI TỪ 』 ===\n━━━━━━━━━━━━━━━━\n[📝] ➜ Bot nối tiếp: ${random_word_}\n[💬] ➜ Phản hồi bot để trả lời\n[❗] ➜ Số lần đã nối: ${_.loop+1}`, (err, res)=>(res.type = 'player_vs_bot', res.name = exports.config.name, res.event = o.event, res.word_bot = random_word_, res.loop = _.loop+1, res.bet = _.bet, client.handleReply.push(res)));
    };


};

exports.run = async function(o) {
    let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    let bet = +o.args[0] || 0;
    let word_bot = data[Math.random()*data.length<<0];
    
    if (o.args[0] == 'bot')return send(`[⚜️] ➜ Hiện tại bot có: ${data.length} câu có thể nối!`);
    if (bet < 10000 || bet > (await o.Currencies.getData(o.event.senderID)).money)return send(`[⚜️] ➜ Bạn phải cược tiền để chơi\n[💵] ➜ Cần 10000 VNĐ để chơi!`);

    // send khác cũng làm tương tự như bên dưới,
    let image_all = [
        "https://i.imgur.com/ct7CqS5.jpeg"
    ];
    let image_random = image_all[Math.random()*image_all.length<<0];
    send({
        body: `=== 『 GAME NỐI TỪ 』 ===\n━━━━━━━━━━━━━━━━\n[💵] ➜ Số tiền cược: ${bet} VNĐ\n[📝] ➜ Bot bắt đầu với từ: ${word_bot}\n[💬] ➜ Phản hồi bot để nối chữ\n[❗] ➜ Số lần đã nối: 0`,
        attachment: await stream_url(image_random)
    },
        (err, res)=>(res.type = 'player_vs_bot', res.name = exports.config.name, res.event = o.event, res.word_bot = word_bot, res.loop = 0, res.bet = bet, client.handleReply.push(res)));
};