module.exports.config = {
    name: "taobinhchon",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hakira",
    description: "Tạo bình chọn",
    commandCategory: "group",
    usages: "Tiêu đề | bình chọn 1 | bình chọn 2 hoặc dùng < | > để tiếp tục chọn câu trả lời kế tiếp",
    cooldowns: 5
};
module.exports.run = async function({ api, event, args, Users }) {
   const { threadID, messageID, senderID } = event;
  let o = args.join(" ").split("|");
  obj = {} 
  var title = o[0]
  for(let i = 1; i < o.length; i++){
    var item = o[i]
    obj[item] = false
  }
 return api.createPoll(title, event.threadID, obj, (err, info) => {
        if(err) return console.log(err);
   api.sendMessage(`Tạo Thành Công Bình Chọn Với Tiêu Đề ${title}`, threadID);
 })
}