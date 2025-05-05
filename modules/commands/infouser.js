const configCmd = {
    name: 'infouser',
    version: '1.1.1',
    hasPermssion: 0,
    credits: 'DC-Nam, Sen',
    description: 'Thiết lập thông tin về bạn.',
    commandCategory: 'Người dùng',
    usages: '[...|setup|del|avatar]',
    cooldowns: 3
},
fse = require('fs-extra'),
axios = require('axios'),
pathS = __dirname+'/cache/savedInfo.json',
streamURL = async url => (await axios.get(url, {
    responseType: 'stream'
})).data,
formInfo = {
    info: [['tên'],
        ['ngày sinh'],
        ['biệt danh'],
        ['nơi ở'],
        ['sở thích'],
        ['ghi chú']]};


function swapInArray(a, x, y) {
    b = a[x]
    a[x] = a[y]
    a[y] = b;
    return a;
};

function upperFirstLetter(content) {
    return content.split(' ').map(el=> {
        el = el.split('')
        el[0] = el[0].toUpperCase()
        return el.join('');
    }).join(' ')
};

function loadCmd() {
    if (!fse.existsSync(pathS)) fse.writeFileSync(pathS, '{"user":{}}');
};

async function runCmd(arg) {
    const {
        senderID: sid,
        threadID: tid,
        type,
        messageReply,
        mentions
    } = arg.event,
    id = type == 'message_reply'?messageReply.senderID: (tags = Object.keys(mentions), tags != 0)?tags[0]: sid,
    prefix = arg.event.args[0][0],
    out = (a, b, c, d) => arg.api.sendMessage(a, b?b: tid, c?c: null, d?d: arg.event.messageID),
    dataInfo = JSON.parse(fse.readFileSync(pathS))

    if (/^setup/.test(arg.args[0])) {
        if (!dataInfo.user[sid]) {
            dataInfo.user[sid] = formInfo;
            fse.writeFileSync(pathS, JSON.stringify(dataInfo, 0, 4))
        }
        return out(`${dataInfo.user[sid].info.map((el, idx)=>`${idx+1}. ${el[0]}: ${!!el[1]?el.pop(): 'Chưa Có Dữ Liệu.'}`).join('\n')}\n━━━━━━━━━━━━━━━━━━\n${upperFirstLetter('→ [reply] + [STT]\n→ [reply] + [STT] + [txt]\n→ [reply] + [STT] + [txt]: [txt]\n→ [reply] + [STT] -> [STT]')}`, '', (err, dataMsg) => global.client.handleReply.push({
            name: configCmd.name, messageID: dataMsg.messageID, author: sid, chooses: 'setup'
        }));
    };

    if (!dataInfo.user[id]) return out(sid != id?'Người dùng này chưa có thông tin trong hệ thống.': `Bạn chưa có thông tin, dùng "${prefix}${configCmd.name} setup" để thêm`);

    if (/^(avatar|avt)/.test(arg.args[0])) {
        if (!/^https:\/\/[a-zA-Z0-9\.\/\-\_\#]+\.(png|jpg|jpge|JPGE|gif)$/.test(arg.args[1])) return out(`chỉ nhận link ảnh (jpg, jpge, png, gif)`);
        dataInfo.user[sid].avatar = arg.args[1];
        fse.writeFileSync(pathS, JSON.stringify(dataInfo, 0, 4));
        return out(`done`);
    };

    if (/^(del|reset)/.test(arg.args[0])) {
        delete dataInfo.user[sid];
        fse.writeFileSync(pathS, JSON.stringify(dataInfo, 0, 4));
        return out(`Đã xóa toàn bộ thông tin của bạn.`);
    };

    const msg = {};

    if ((avt = dataInfo.user[sid].avatar), !!avt) msg.attachment = await streamURL(avt);
    msg.body = dataInfo.user[id].info.map(el => `- ${upperFirstLetter(el[0])}: ${!!el[1]?el.pop(): 'Chưa Có Dữ Liệu!'}`).join('\n');
    out(msg);
};

function reply(arg) {
    const {
        senderID: sid,
        threadID: tid,
        body
    } = arg.event,
    _ = arg.handleReply,
    prefix = arg.event.args[0][0],
    out = (a, b, c, d) => arg.api.sendMessage(a, b?b: tid, c?c: null, d?d: arg.event.messageID),
    dataInfo = JSON.parse(fse.readFileSync(pathS))

    if (sid != _.author)return;
    if (/^setup/.test(_.chooses)) {
        var txt = '',
        input = /\n/.test(body)? body.split('\n'): [body];
        for (const el of input) {
            if (/[0-9] \-> [0-9]/.test(el)) {
                const a = el.split(' -> '),
                x = a[0],
                y = a[1]
                swapInArray(dataInfo.user[sid].info, x-1, y-1);
                txt += `Di chuyển vị trí "${x}" qua "${y}".`;
            } else if (isNaN(el)) {
                const edit = el.split(' '),
                index = edit.shift()-1;

                if (/:$/.test(edit[0])) {
                    if (!dataInfo.user[sid].info[index]) dataInfo.user[sid].info[index] = [];
                    const newI = edit[0].replace(':', '');
                    dataInfo.user[sid].info[index][0] = newI;
                    txt += `\nCập nhật ngoại hình "${newI}".`
                    edit.shift();
                }
                const content = edit.join(' ')
                dataInfo.user[sid].info[index].push(content);
                txt += `\nĐã cập nhật thông tin thành công`
            } else if (isFinite(el)) {
                const del = dataInfo.user[sid].info.splice(el-1, 1);
                txt += `\nGỡ thông tin "${del[0]}: ${del.pop()}"`
            }
        };
        dataInfo.user[sid].info = dataInfo.user[sid].info.filter(el=>!!el);
        fse.writeFileSync(pathS, JSON.stringify(dataInfo, 0, 4))
        out(txt)
    };
};

module.exports = {
    config: configCmd,
    onLoad: loadCmd,
    run: runCmd,
    handleReply: reply
}