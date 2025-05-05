const fse = require('fs-extra');
const Canvas = require('canvas');
const axios = require('axios');
const config = {
    name: 'timejoin',
    version: '1.1.1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: 'Xem chi tiết thời gian đã qua kể từ khi bạn vào nhóm',
    commandCategory: 'game',
    usages: '',
    cooldowns: 3
};
const handleEvent = function({
    event
}) {
    const path = __dirname + '/hethong/timeJoin.json';
    if (!fse.existsSync(path)) {
        fse.writeFileSync(path, '{}');
    };
    const data = JSON.parse(fse.readFileSync(path), 'utf-8');
    if (!data[event.threadID]) {
        data[event.threadID] = {}
        fse.writeFileSync(path, JSON.stringify(data, null, 4), 'utf-8');
    } else if (!data[event.threadID][event.senderID]) {
        data[event.threadID][event.senderID] = {
            timestamp: new Date().getTime() + 25200000
        };
        fse.writeFileSync(path, JSON.stringify(data, null, 4), 'utf-8');
    };
};
const run = async function({
    api,
    event
}) {
    const data = require('./hethong/timeJoin.json');
    const imgCanvas = __dirname + '/cache/timeJoin.png';
    const font_Roboto_B = __dirname + '/cache/Roboto-Black.ttf';
    if (!fse.existsSync(font_Roboto_B)) {
        let down = (await axios.get(`https://raw.githubusercontent.com/duongcongnam/font/main/Roboto-Black.ttf`, {
            responseType: "arraybuffer"
        })).data
        fse.writeFileSync(font_Roboto_B, Buffer.from(down, "utf-8"))
    };
    const uid = event.type == 'message_reply' ? event.messageReply.senderID : event.senderID;
    const DU = data[event.threadID][uid].timestamp;
    var diff = Date.now() + 25200000 - DU;

    var month = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    diff -= month * (1000 * 60 * 60 * 24 * 30);
    var week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    diff -= week * (1000 * 60 * 60 * 24 * 7);
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);

    const bgr = await Canvas.loadImage('https://bikiphay.net/wp-content/uploads/2019/06/backround-%C4%91%E1%BA%B9p27-1024x681.png');

    Canvas.registerFont(font_Roboto_B, {
        family: "Roboto-Black"
    })
    var canvas = Canvas.createCanvas(1280, 720);
    var ctx = canvas.getContext("2d");

    ctx.drawImage(bgr, 0, 0, 1280, 720);
    ctx.font = '60px Roboto-Black';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('CHI TIẾT THỜI GIAN ĐÃ QUA', 620, 150);
    /**/

    ctx.font = '50px Roboto-Black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('THÁNG', 320, 270);
    //
    ctx.font = '40px Roboto-Black';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText(month, 320, 310);
    /**/

    /**/
    ctx.font = '50px Roboto-Black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('TUẦN', 620, 270);
    //
    ctx.font = '40px Roboto-Black';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText(week, 620, 310);
    /**/

    /**/
    ctx.font = '50px Roboto-Black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('NGÀY', 920, 270);
    //
    ctx.font = '40px Roboto-Black';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText(days, 920, 310);
    /**/

    /**/
    ctx.font = '50px Roboto-Black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('GIỜ', 320, 440);
    //
    ctx.font = '40px Roboto-Black';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText(hours, 320, 480);
    /**/

    /**/
    ctx.font = '50px Roboto-Black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('PHÚT', 620, 440);
    //
    ctx.font = '40px Roboto-Black';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText(mins, 620, 480);
    /**/

    /**/
    ctx.font = '50px Roboto-Black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('GIÂY', 920, 440);
    //
    ctx.font = '40px Roboto-Black';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText(seconds, 920, 480);
    /**/

    fse.writeFileSync(imgCanvas, canvas.toBuffer());
    const date2 = new Date(DU);
    var body = `Bạn đã gia nhập nhóm vào lúc: ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()} ngày ${date2.getDate()}-${+date2.getMonth() + 1}-${date2.getFullYear()}.`
    return api.sendMessage({
        body,
        attachment: fse.createReadStream(imgCanvas)
    }, event.threadID, event.messageID);
};
module.exports = {
    config,
    run,
    handleEvent
}