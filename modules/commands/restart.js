module.exports.config = {
	name: "restart",
	version: "1.0.0",
	hasPermssion: 3,
	credits: "Chill with Tea",
	description: "Khởi động lại Bot",
	commandCategory: "Admin",
	usages: "reload + time",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 const moment = require("moment-timezone");
 var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - D/MM/YYYY");
 var ngay = moment.tz('Asia/Ho_Chi_Minh').format('D/MM/YYYY');
  var gio = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');
  var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
  var thang = moment.tz("Asia/Ho_Chi_Minh").format('MM');
  var nam = moment.tz("Asia/Ho_Chi_Minh").format('YYYY');
  var thứ = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
  if (thứ == 'Sunday') thứ = 'Chủ Nhật'
  if (thứ == 'Monday') thứ = 'Thứ Hai'
  if (thứ == 'Tuesday') thứ = 'Thứ Ba'
  if (thứ == 'Wednesday') thứ = 'Thứ Tư'
  if (thứ == "Thursday") thứ = 'Thứ Năm'
  if (thứ == 'Friday') thứ = 'Thứ Sáu'
  if (thứ == 'Saturday') thứ = 'Thứ Bảy'
 const { commands } = global.client;
 const permission = [`${global.config.ADMINBOT[0]}`];
             if (!permission.includes(event.senderID))
             return api.sendMessage("Muốn khởi động lại sao ừ bạn không đủ tuổi", event.threadID, event.messageID);
	const { threadID, messageID } = event;
	var time = args.join(" ");
	var rstime = "4";
	if (!time) rstime = "5";
	else rstime = time;
  const timeStart = Date.now();
	api.sendMessage(`Đang chuẩn bị tiến hành khởi động lại bot...\n→ Time: ${moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY")} - ${thứ}\n→ Tổng lệnh hiện tại: ${commands.size} lệnh\n──────────────────\n[𝗕𝗼𝘁] → Sẽ khởi động lại sau ${rstime} giây nữa.`, threadID);
	return setTimeout(() => { api.sendMessage("[𝗕𝗼𝘁] → Tiến hành khởi động lại!", event.threadID,() => process.exit(1) )},	rstime * 1000);
}