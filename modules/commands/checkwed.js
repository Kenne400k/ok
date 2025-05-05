this.config = {
    name: 'checkweb',
    version: '0.0.1',
    hasPermission: 0,
    credits: 'hphong',
    description: '',
    commandCategory: 'Công Cụ',
    usages: '.checkweb [domain]',
    cooldowns: 3
};

let axios = require('axios');
let cheerio = require('cheerio');

this.run = function (o) {
    let send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);

    axios.get('https://scam.vn/check-website?domain=' + encodeURIComponent(o.args[0])).then(res => {
        let dom = cheerio.load(res.data);
        let div = dom('.container.text-center');
        let date_register = div.find('div:eq(0) > div:eq(0) > h6').text().split(' ').pop();
        let [like, dis_like] = ['#improve_web', '#report_web'].map($ => div.find(`${$} > span`).text());
        let do_tin_cay = div.find('.col-md-12.bg-warning.p-3 > a').text();
        let warn = [0, 1].map($ => div.find('.col-md-6.mt-2').eq($).text().trim());

        send(`[===[ Check Scam ]===]\n\n- Tên Miền: ${o.args[0]}\n- Ngày Đăng Ký: ${date_register}\n- Lượt Đánh Giá:\n 👍: ${like}\n 👎: ${dis_like}\n- Độ Tin Cậy: ${do_tin_cay}\n- Điểm Đánh Giá:\n\n${warn.join('\n\n')}\nAPI BY HPHONG`);
    }).catch(err => send(err.toString()));
};