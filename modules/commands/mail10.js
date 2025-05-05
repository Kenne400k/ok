module.exports.config = {
  name: "mail10p",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "tdunguwu",
  description: "lấy mail ở 10mm thôi",
  commandCategory: "Tiện ích",
  usages: "",
  cooldowns: 2,
  dependencies: {"axios" : ""}
};
module.exports.run = async({api, event, args}) => {
	const axios = require('axios');
	if (args[0] == "new") {
		const res = await axios.get(`https://10minutemail.net/address.api.php?new=1`);
	var user = res.data.mail_get_user;
	var host = res.data.mail_get_host;
	var time = res.data.mail_get_time;
	var stime = res.data.mail_server_time;
	var kmail = res.data.mail_get_key;
	var ltime = res.data.mail_left_time;
	var mid = res.data.mail_list[0].mail_id;
var sub = res.data.mail_list[0].subject;
var date = res.data.mail_list[0].datetime2;
	return api.sendMessage(`» Tên mail: ${user}\n» Host: ${host}\n» Mail ${user}@${host} (.)com\n» Thời gian: ${time}\n» Thời gian ở server: ${stime}\n» Key: ${kmail}\n» Thời gian còn lại: ${ltime}s\n» Mail id: ${mid}\n» Nội dung ${sub}\n» Date: ${date}`, event.threadID, event.messageID)
}
else if (args[0] == "list") {
	const res = await axios.get(`https://www.phamvandienofficial.xyz/mail10p/domain`);
	var list = res.data.domain
	return api.sendMessage(`List domain: \n${list}`, event.threadID, event.messageID)
}
else if (args[0] == "more") {
 const res = await axios.get(`https://10minutemail.net/address.api.php?more=1`);
	var user = res.data.mail_get_user;
	var host = res.data.mail_get_host;
	var time = res.data.mail_get_time;
	var stime = res.data.mail_server_time;
	var kmail = res.data.mail_get_key;
	var ltime = res.data.mail_left_time;
	var mid = res.data.mail_list[0].mail_id;
var sub = res.data.mail_list[0].subject;
var date = res.data.mail_list[0].datetime2;
	return api.sendMessage(`» Tên mail: ${user}\n» Host: ${host}\n» Mail ${user}@${host} (.)com\n» Thời gian: ${time}\n» Thời gian ở server: ${stime}\n» Key: ${kmail}\n» Thời gian còn lại: ${ltime}s\n» Mail id: ${mid}\n» Nội dung ${sub}\n» Date: ${date}`, event.threadID, event.messageID)
}
else if (args[0] == "get") {
	 var get = await  axios.get(`https://10minutemail.net/address.api.php`)
      var data = get.data
      var mail = data.mail_get_mail,
        id = data.session_id,
        url = data.permalink.url,
        key_mail = data.permalink.key
      let urlMail = url.replace(/\./g,' . ')
      let maill = mail.replace(/\./g,' . ')
      return api.sendMessage(`» Email: ${maill}\n» ID Mail: ${id}\n» Url Mail: ${urlMail}\n» Key Mail: ${key_mail}`, event.threadID, event.messageID)}
else if (args[0] == "check") {
	var get = await  axios.get(`https://10minutemail.net/address.api.php`)
      var data = get.data.mail_list[0]
      var email = get.data.mail_get_mail
      var id = data.mail_id,
        from = data.from,
        subject = data.subject,
        time = data.datetime2
      let formMail = from.replace(/\./g,' . ')
      let maill = email.replace(/\./g,' . ')
      return api.sendMessage(`» Email: ${maill}\n» ID Mail: ${id}\n» From: ${formMail}\n» Tiêu đề: ${subject}\n» ${time}`, event.threadID, event.messageID)}
else if (args.join() == "") { 
	  return api.sendMessage(`NEW - Tạo mail mới \n
CHECK - Check hộp thư đến \n
GET - Lấy mail hiện tại \n
LIST - Xem list mail \n
MORE - Thêm mail mới \n
-------------------------\n\n
Bạn có thể click vào url mail và nhập Key Mail để xem nội dung mail. `, event.threadID, event.messageID)} 
    }