module.exports.config = {
   name: 'thuebot',
   version: '1.3.7',
   hasPermssion: 3,
   credits: 'DC-Nam & DongDev source lại',
   description: 'thuê bot',
   commandCategory: 'Admin',
   usages: '[]',
   cooldowns: 5,
   usePrefix: false,
};
let fs = require('fs');
if (!fs.existsSync(__dirname + '/data'))
   fs.mkdirSync(__dirname + '/data');
let path = __dirname + '/data/thuebot.json';
let data = [];
let save = () => fs.writeFileSync(path, JSON.stringify(data));
if (!fs.existsSync(path)) save();
else data = require(path);
let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
let invalid_date = date => /^Invalid Date$/.test(new Date(date));

exports.run = function (o) {
   let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
   if (!["100020460654779","100020460654779"].includes(o.event.senderID)) return send(`⚠️ Chỉ Admin chính mới có thể sử dụng!`);

   switch (o.args[0]) {
      case 'add': {
         if (!o.args[1]) return send(`⚠️ Thêm người thuê bot vào dữ liệu:\n - thuebot add + ngày hết hạn\n - thuebot add + id người thuê + ngày hết hạn\n - thuebot add id nhóm + id người thuê + ngày hết hạn\n⚠️ Lưu ý: định dạng ngày là DD/MM/YYY`);
         let userId = o.event.senderID;
         if (o.event.type === "message_reply") {
            userId = o.event.messageReply.senderID;
         } else if (Object.keys(o.event.mentions).length > 0) {
            userId = Object.keys(o.event.mentions)[0];
         }
         let t_id = o.event.threadID;
         let id = userId;
         let time_start = (require('moment-timezone')).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
         let time_end = o.args[1];
         if (o.args.length === 4 && !isNaN(o.args[1]) && !isNaN(o.args[2]) && o.args[3].match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
            t_id = o.args[1];
            id = o.args[2];
            time_start = (require('moment-timezone')).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
            time_end = o.args[3];

         } else if (o.args.length === 3 && !isNaN(o.args[1]) && o.args[2].match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
            t_id = o.event.threadID;
            id = o.args[1];
            time_start = (require('moment-timezone')).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
            time_end = o.args[2];
         }
         if (isNaN(id) || isNaN(t_id)) return send(`⚠️ ID Không Hợp Lệ!`);
         if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end))) return send(`⚠️ Thời Gian Không Hợp Lệ!`);
         data.push({
            t_id,
            id,
            time_start,
            time_end,
         });
         send(`☑️ Đã thêm người thuê bot vào danh sách!`);
         break;
      }
      case 'list': {
         send(`┏━━━━━━━━━━━━━━━━━━━┓\n┣➤ [ DANH SÁCH THUÊ BOT ]\n┗━━━━━━━━━━━━━━━━━━━┛\n${data.map(($, i)=>`┏━━━━━━━━━━━━━━━━━━━┓\n┣➤ ${i+1}. 👤 Người thuê: ${global.data.userName.get($.id)}\n┣➤ 📝 Tình trạng: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now()+25200000?'Chưa Hết Hạn ✅': 'Đã Hết Hạn ❎'}\n┣➤ 🔰 Nhóm: ${(global.data.threadInfo.get($.t_id) || {}).threadName}`).join('\n┗━━━━━━━━━━━━━━━━━━━┛\n')}\n┗━━━━━━━━━━━━━━━━━━━┛\n┏━━━━━━━━━━━━━━━━━━━┓\n┣➤ Reply STT để xem chi tiết\n┣➤ Reply del STT để xóa.\n┣➤ Reply out STT để rời nhóm\n┣➤ Reply giahan STT + time_end\n┗━━━━━━━━━━━━━━━━━━━┛`, (err, res) => (res.name = exports.config.name,
            res.event = o.event, res.data = data,
            global.client.handleReply.push(res)));
         break;
      }
      default:
         send(`Dùng: ${global.config.PREFIX}thuebot add → Để thêm nhóm vào danh sách thuê bot\nDùng: ${global.config.PREFIX}thuebot list → Để xem danh sách thuê bot\n𝗛𝗗𝗦𝗗 → ${global.config.PREFIX}thuebot lệnh cần dùng.`)
   }
   save();
};
exports.handleReply = async function (o) {
   let _ = o.handleReply;
   let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
   if (o.event.senderID != _.event.senderID)
      return;
   if (isFinite(o.event.args[0])) {
      let info = data[o.event.args[0] - 1];
      if (!info) return send(`❎ STT không tồn tại!`);
      return send(`[ THÔNG TIN NGƯỜI THUÊ BOT ]\n────────────────────\n👤 Người thuê: ${global.data.userName.get(info.id)}\n🌐 Link Facebook: https://www.facebook.com/profile.php?id=${info.id}\n👥 Nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n🔰 TID: ${info.t_id}\n────────────────────\n📆 Ngày Thuê: ${info.time_start}\n──────\n⏳ Ngày hết Hạn: ${info.time_end}\n────────────────────\n⏰ ${(() => {
 let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
 let days = (time_diff / (1000 * 60 * 60 * 24)) << 0;
 let hour = ((time_diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) << 0;
 if (time_diff <= 0) {
 return "Đã hết thời hạn thuê 🔐";
 } else {
 return `
         Còn $ {
            days
         }
         ngày $ {
            hour
         }
         giờ là hết hạn thuê`;
 }
})()}`);
   } else if (o.event.args[0].toLowerCase() == 'del') {
      o.event.args.slice(1).sort((a, b) => b - a).forEach($ => data.splice($ - 1, 1));
      send(`☑️ Đã xóa thành công!`);
   } else if (o.event.args[0].toLowerCase() == 'giahan') {
      let STT = o.event.args[1];
      let time_start = (require('moment-timezone')).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
      let time_end = o.event.args[2];
      if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end))) return send(`❎ Thời Gian Không Hợp Lệ!`);
      if (!data[STT - 1]) return send(`❎ STT không tồn tại`);
      let $ = data[STT - 1];
      $.time_start = time_start;
      $.time_end = time_end;
      send(`☑️ Đã gia hạn nhóm thành công!`);
   } else if (o.event.args[0].toLowerCase() == 'out') {
      for (let i of o.event.args.slice(1)) await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[i - 1].t_id);
      send(`⚠️ Đã out nhóm theo yêu cầu`);
   };
   save();
};