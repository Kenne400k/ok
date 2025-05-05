const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const crypto = require('crypto');
const cron = require('node-cron');

const RENT_DATA_PATH = path.join(__dirname, '/cache/data/thuebot.json');
const RENT_KEY_PATH = path.join(__dirname, '/cache/data/keys.json');
const setNameCheckPath = path.join(__dirname, '/data/setnamecheck.json');
const TIMEZONE = 'Asia/Ho_Chi_Minh';

let setNameCheck = fs.existsSync(setNameCheckPath) ? JSON.parse(fs.readFileSync(setNameCheckPath, 'utf8')) : {};
let data = fs.existsSync(RENT_DATA_PATH) ? JSON.parse(fs.readFileSync(RENT_DATA_PATH, 'utf8')) : [];
let keys = fs.existsSync(RENT_KEY_PATH) ? JSON.parse(fs.readFileSync(RENT_KEY_PATH, 'utf8')) : {};

const saveData = () => fs.writeFileSync(RENT_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
const saveKeys = () => fs.writeFileSync(RENT_KEY_PATH, JSON.stringify(keys, null, 2), 'utf8');
const formatDate = input => input.split('/').reverse().join('/');
const isInvalidDate = date => isNaN(new Date(date).getTime());

const generateKey = () => {
    const randomString = crypto.randomBytes(6).toString('hex').slice(0, 6);
    return `hphong_${randomString}_key_2025`.toLowerCase();
};

async function updateThreadIds() {
    console.log('Cập nhật thông tin nhóm');
    try {
        for (const entry of data) {
            try {
                const threadInfo = await global.client.api.getThreadInfo(entry.t_id);
                if (threadInfo) {
                    entry.t_id = threadInfo.threadID;
                }
            } catch (error) {
                console.error(`Lỗi khi lấy thông tin nhóm ${entry.t_id}:`, error);
            }
        }
        saveData();
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin nhóm:', error);
    }
}

async function updateGroupNames() {
    console.log('Bắt đầu cập nhật tên bot');
    try {
        const notificationMessage = '✅ Quá trình cập nhật lại tên của bot sẽ diễn ra sau vài phút';
        for (const entry of data) {
            const { t_id } = entry;
            try {
                await global.client.api.sendMessage(notificationMessage, t_id);
            } catch (error) {
                console.error(`Lỗi khi gửi thông báo đến nhóm ${t_id}:`, error);
            }
        }

        await updateThreadIds();

        for (const entry of data) {
            const { t_id, time_end } = entry;
            const currentDate = moment().tz(TIMEZONE);
            const endDate = moment(time_end, 'DD/MM/YYYY');
            const daysRemaining = endDate.diff(currentDate, 'days');

            let botName;
            if (daysRemaining <= 0) {
                botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || HSD: ${time_end}|| Đã hết hạn`;
            } else if (daysRemaining <= 3) {
                botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || ⚠️Hạn sử dụng còn ${daysRemaining} ngày `;
            } else {
                botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || HSD: ${time_end} || ✅Còn: ${daysRemaining} ngày`;
            }

            
            

            try {
                console.log(`Cập nhật nickname cho nhóm ${t_id} thành "${botName}"`);
                const currentUserId = await global.client.api.getCurrentUserID();
                if (!currentUserId) {
                    console.error(`Không thể lấy ID người dùng hiện tại.`);
                    continue;
                }

                await global.client.api.changeNickname(botName, t_id, currentUserId);
                setNameCheck[t_id] = true;
                console.log(`Đã cập nhật nickname cho nhóm ${t_id} với "${botName}"`);
            } catch (error) {
                console.error(`Lỗi khi cập nhật nickname cho nhóm ${t_id}:`, error);
            }
        }

        fs.writeFileSync(setNameCheckPath, JSON.stringify(setNameCheck, null, 2), 'utf8');
    } catch (error) {
        console.error('Lỗi trong quá trình cập nhật tên bot:', error);
    }
}

async function cleanupAllKeys() {
    console.log('Bắt đầu xóa tất cả các key');
    try {
        keys = {}; // Xóa tất cả các key
        fs.writeFileSync(RENT_KEY_PATH, JSON.stringify(keys, null, 2), 'utf8');
        console.log('Đã xóa tất cả các key');
    } catch (error) {
        console.error('Lỗi trong quá trình xóa key:', error);
    }
}

module.exports.config = {
    name: 'rent',
    version: '1.7.0',
    hasPermssion: 0,
    credits: 'DC-Nam & DongDev source lại & vdang mod key',
    description: "Hệ Thống",
    commandCategory: 'Nhóm',
    usePrefix: false,
    usage: '[]',
    cooldowns: 1
};

module.exports.run = async function (o) {
    const send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    const prefix = global.config.PREFIX;

    if (global.config.ADMINBOT[0] !== o.event.senderID) {
    return send(`⚠️ Chỉ Admin chính mới có thể sử dụng!`);
}


    switch (o.args[0]) {
        case 'add':
            if (!o.args[1]) return send(`❎ Dùng ${prefix}${this.config.name} add + reply tin nhắn người cần thuê`);
            let userId = o.event.senderID;
            if (o.event.type === "message_reply") {
                userId = o.event.messageReply.senderID;
            } else if (Object.keys(o.event.mentions).length > 0) {
                userId = Object.keys(o.event.mentions)[0];
            }
            let t_id = o.event.threadID;
            let time_start = moment.tz(TIMEZONE).format('DD/MM/YYYY');
            let time_end = o.args[1];
            if (o.args.length === 4 && !isNaN(o.args[1]) && !isNaN(o.args[2]) && o.args[3].match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
                t_id = o.args[1];
                userId = o.args[2];
                time_end = o.args[3];
            } else if (o.args.length === 3 && !isNaN(o.args[1]) && o.args[2].match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
                userId = o.args[1];
                time_end = o.args[2];
            }
            if (isNaN(userId) || isNaN(t_id) || isInvalidDate(formatDate(time_start)) || isInvalidDate(formatDate(time_end)))
                return send(`❎ ID hoặc Thời Gian Không Hợp Lệ!`);
            const existingData = data.find(entry => entry.t_id === t_id);
            if (existingData) {
                return send(`⚠️ Nhóm này đã có dữ liệu thuê bot!`);
            }
            data.push({ t_id, id: userId, time_start, time_end });
            send(`✅ Đã thêm nhóm vào danh sách thuê bot!`);
            break;

        case 'list':
    if (data.length === 0) {
        send('❎ Không có nhóm nào đang thuê bot!');
        break;
    }
    
    const updatedData = data.map((item) => {
        const timeEnd = new Date(formatDate(item.time_end)).getTime();
        const now = Date.now();
        const remainingTime = timeEnd - now;

        const daysRemainingForRent = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hoursRemainingForRent = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (remainingTime <= 0) {
            return { ...item, daysRemainingForRent: 0, hoursRemainingForRent: 0, status: '❎ Hết hạn' };
        }

        return { ...item, daysRemainingForRent, hoursRemainingForRent, status: '✅ Còn hạn' };
    });

    send(`[ DANH SÁCH THUÊ BOT ]\n\n${updatedData.map((item, i) => 
        `${i + 1}. ${global.data.userName.get(item.id)}\n⩺ Tình trạng: ${item.status}\n⩺ Nhóm: ${(global.data.threadInfo.get(item.t_id) || {}).threadName}\n⩺ Còn ${item.daysRemainingForRent} ngày ${item.hoursRemainingForRent} giờ là hết hạn `
    ).join('\n\n')}\n\n⩺ Reply [ del | out | giahan ] + stt để thực hiện hành động.`, (err, res) => {
        res.name = exports.config.name;
        res.event = o.event;
        res.data = data;
        global.client.handleReply.push({ ...res, type: 'list' });
    });
    break;
            
        case 'info':
            const rentInfo = data.find(entry => entry.t_id === o.event.threadID); 
            if (!rentInfo) {
                send(`❎ Không có dữ liệu thuê bot cho nhóm này`); 
            } else {
                const keyEntry = Object.entries(keys).find(([key, info]) => info.groupId === rentInfo.t_id) || [null, {}];
                const [key, keyDetails] = keyEntry;
                
                let keyInfoDisplay = 'Chưa có key';
                if (key) {
                    const daysSinceStart = Math.floor((Date.now() - new Date(rentInfo.time_start).getTime()) / (1000 * 60 * 60 * 24));
                    const daysRemaining = keyDetails.days - daysSinceStart;
                    keyInfoDisplay = `Key bạn đang sử dụng là: ${key}`;
                }

                const daysRemainingForRent = Math.floor((new Date(formatDate(rentInfo.time_end)).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const hoursRemainingForRent = Math.floor((new Date(formatDate(rentInfo.time_end)).getTime() - Date.now()) / (1000 * 60 * 60) % 24);
                
                send(`[ Thông Tin Thuê Bot ]\n\n👤 Người thuê: ${global.data.userName.get(rentInfo.id)}\n🔗 Link facebook: https://www.facebook.com/profile.php?id=${rentInfo.id}\n🗓️ Ngày Thuê: ${rentInfo.time_start}\n⌛ Hết Hạn: ${rentInfo.time_end}\n🔑 ${keyInfoDisplay}\n\n⩺ Còn ${daysRemainingForRent} ngày ${hoursRemainingForRent} giờ là hết hạn`, (err, res) => {
                    res.name = exports.config.name;
                    res.event = o.event;
                    res.data = data;
                    global.client.handleReply.push({ ...res, type: 'info' });
                });
            } 
            break;

        case 'newkey':
            const groupId = o.event.threadID;
            const days = parseInt(o.args[1], 10) || 31;

            if (isNaN(days) || days <= 0) {
                return send(`❎ Số ngày không hợp lệ!`);
            }

            const generatedKey = generateKey();
            const expiryDate = moment.tz(TIMEZONE).add(days, 'days').format('DD/MM/YYYY');
            keys[generatedKey] = {
                days: days,
                used: false,
                groupId: null
            };

            send(`🔑 New key: ${generatedKey}\n📆 Thời hạn Key Thêm Cho Nhóm (${days} ngày)`);
            saveKeys();
            break;

        case 'check':
    if (Object.keys(keys).length === 0) {
        send('❎ Không có key nào được tạo!');
        break;
    }
    
    const now = moment(); 
    send(`[ DANH SÁCH KEY ]\n\n${Object.entries(keys).map(([key, info], i) => {
        const expiryDate = moment().add(info.days, 'days').format('DD/MM/YYYY');
        const keyStartDate = moment(); 
        const daysRemaining = info.days - Math.floor(moment().diff(keyStartDate, 'days'));
        const displayDaysRemaining = daysRemaining < 0 ? 0 : daysRemaining;
        return `${i + 1}. Key: ${key}\n🗓️ Thời gian khi sử dụng key: ${displayDaysRemaining} ngày\n📝 Tình Trạng: ${info.used ? '✅ Đã sử dụng' : '❎ Chưa sử dụng'}\n📎 ID Nhóm: ${info.groupId || 'Chưa sử dụng'}\n`;
    }).join('\n\n')}\n\n\n⩺ Tự Động Làm Mới Vào 00:00 Hàng Ngày!`);
    break;
            
        default:
            send(`[ Menu Thuê Bot ]\n──────────────────\n⩺ rent add: thêm nhóm vào danh sách \n⩺ rent key: tạo key ngẫu nhiên với số ngày thuê bot⩺ rent info: xem thông tin thuê bot của nhóm \n⩺ rent check: xem danh sách key \n⩺ rent list: xem danh sách thuê`);
            break;
    }
    saveData();
};

module.exports.handleEvent = async function (o) {
    const send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    const message = o.event.body.toLowerCase();
    const groupId = o.event.threadID;
    const keyMatch = message.match(/hphong_[0-9a-fA-F]{6}_key_2025/);

    if (keyMatch) {
        const key = keyMatch[0];

        // Kiểm tra xem người gửi có phải là bot không
        if (o.event.senderID === o.api.getCurrentUserID()) {
            console.log("Bot đã gửi tin nhắn, không xử lý.");
            return;
        }

        if (keys.hasOwnProperty(key)) {
            const keyInfo = keys[key];
            if (!keyInfo.used) {
                const existingData = data.find(entry => entry.t_id === groupId);
                const time_start = moment().format('DD/MM/YYYY');

                let time_end;
                let daysAdded = keyInfo.days;
                let daysRemaining;

                if (existingData) {
                    const oldEndDate = moment(existingData.time_end, 'DD/MM/YYYY');
                    time_end = oldEndDate.add(daysAdded, 'days').format('DD/MM/YYYY');
                    const daysDiff = moment(time_end, 'DD/MM/YYYY').diff(moment(existingData.time_end, 'DD/MM/YYYY'), 'days');

                    o.api.shareContact(`🔑 Key hợp lệ!\n- Đã gia hạn ${daysAdded} ngày.\n- Ngày kết thúc trước: ${existingData.time_end}\n- Ngày kết thúc mới: ${time_end}\n- Số ngày gia hạn thêm: ${daysDiff} ngày\n- Liên hệ admin ${global.config.ADMIN_NAME} để được hỗ trợ`, global.config.ADMINBOT[0], o.event.threadID);

                    existingData.time_end = time_end;
                } else {
                    time_end = moment().add(daysAdded, 'days').format('DD/MM/YYYY');
                    daysRemaining = moment(time_end, 'DD/MM/YYYY').diff(moment(), 'days');

                    o.api.shareContact(`🔑 Key hợp lệ!\n- Thời gian thuê: ${daysAdded} ngày\n- Ngày kết thúc: ${time_end}\nMọi thắc mắc xin liên hệ admin ${global.config.ADMIN_NAME} để được hỗ trợ`, global.config.ADMINBOT[0], o.event.threadID);

                    data.push({ t_id: groupId, id: o.event.senderID, time_start, time_end });
                }
                const botName = `『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME} || HSD: ${time_end}`;
                await o.api.changeNickname(botName, groupId, o.api.getCurrentUserID());

                keyInfo.used = true;
                keyInfo.groupId = groupId;
                saveKeys();
                saveData();
            } else {
                o.api.shareContact(`🔒 Key không hợp lệ hoặc đã được sử dụng!\nVui lòng liên hệ admin ${global.config.ADMIN_NAME} để lấy key mới`, global.config.ADMINBOT[0], o.event.threadID);
            }
        } else {
            o.api.shareContact(`Nhóm bạn đã nhập key hợp lệ và được phép sử dụng bot.\nMọi thắc mắc xin vui lòng liên hệ admin ${global.config.ADMIN_NAME} để được hỗ trợ!`, global.config.ADMINBOT[0], o.event.threadID);
        }
    }
};

module.exports.handleReply = async function (o) {
    const send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    const { type, data } = o.handleReply;
    const args = o.event.body.split(' ');
    const command = args.shift().toLowerCase();
    const index = parseInt(command);

    if (o.event.senderID === o.api.getCurrentUserID()) {
        console.log("Bot đã gửi tin nhắn, không xử lý.");
        return;
    }

    if (isNaN(index)) {
        switch (command) {
            case 'del':
                args.sort((a, b) => b - a).forEach($ => {
                    const groupId = data[$ - 1].t_id;
                    data.splice($ - 1, 1);
                });
                send('✅ Đã xóa thành công!');
                break;
            case 'out':
                for (const i of args) {
                    await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[i - 1].t_id);
                }
                send('✅ Đã out nhóm theo yêu cầu');
                break;
            case 'giahan':
                const [STT, time_end] = args;
                if (isInvalidDate(formatDate(time_end))) return send('❎ Thời Gian Không Hợp Lệ!');
                if (!data[STT - 1]) return send('❎ Số thứ tự không tồn tại');
                const time_start = moment.tz(TIMEZONE).format('DD/MM/YYYY');
                Object.assign(data[STT - 1], { time_start, time_end });
                send('✅ Gia hạn nhóm thành công!');
                break;
            default:
                send('❎ Lệnh không hợp lệ!');
                break;
        }
    } else {
        if (type === 'list') {
            if (index < 1 || index > data.length) {
                return send('❎ Số thứ tự không hợp lệ!');
            }
            const entry = data[index - 1];
            send(`[ Thông Tin Thuê Bot ]\n\n👤 Người thuê: ${global.data.userName.get(entry.id)}\n🔗 Link facebook: https://www.facebook.com/profile.php?id=${entry.id}\n🗓️ Ngày Thuê: ${entry.time_start}\n⌛ Hết Hạn: ${entry.time_end}\n\n⩺ Còn ${Math.floor((new Date(formatDate(entry.time_end)).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày ${Math.floor((new Date(formatDate(entry.time_end)).getTime() - Date.now()) / (1000 * 60 * 60) % 24)} giờ là hết hạn`);
        }
    }
    saveData();
    saveKeys();
};

cron.schedule('42 03 * * *', async () => {
    console.log('cập nhật name bot theo thời hạn thuê bắt đầu');
    await updateGroupNames();
    await cleanupAllKeys();
}, {
    scheduled: true,
    timezone: TIMEZONE
});
