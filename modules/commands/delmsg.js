module.exports.config = {
	name: "delmsg",
	version: "1.0.0",
	hasPermssion: 3,
	credits: "D-Jukie",
	description: "Xóa tất cả tin nhắn trên acc bot",
	commandCategory: "Admin",
	usages: "[thread/all]",
	cooldowns: 0
};

module.exports.run = function({ api, event, args, getText }) {
if (args[0] == "all") {
 return api.getThreadList(200, null, ["INBOX"], (err, list) => {
 	if (err) throw err;
 	list.forEach(item => (item.threadID != event.threadID) ? api.deleteThread(item.threadID) : "");
 	api.sendMessage("[🌟] => Đã xóa thành công tất cả tin nhắn trong acc bot !", event.threadID)
 })
}
else return api.getThreadList(200, null, ["INBOX"], (err, list) => {
 	if (err) throw err;
 	list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.deleteThread(item.threadID) : "");
 	api.sendMessage("[🌟] => Đã xóa thành công tất cả tin nhắn nhóm trong acc bot !", event.threadID)
 })
}
