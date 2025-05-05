module.exports.config = {
  name: "fbcover",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "chinhle",
  description: "Tạo ra một avt trên taoanhdep.",
  commandCategory: "tạo ảnh",
  cooldowns: 0,
  dependencies: {
      "fs-extra": "",
      "request": "",
      "axios": ""
  }
};

module.exports.run = async function ({ api, args, event, permssion , handleReply}) {
const request = require('request');
const fs = require("fs-extra")
const axios = require("axios")
const { threadID, messageID, senderID, body } = event;
if (args[0] == "list") {
const list = await axios.get("https://api.ndtmint.repl.co/taoanhdep/list/");
    var page = 1;
    page = parseInt(args[1]) || 1;
    page < -1 ? page = 1 : "";
    var limit = 15;
    var count = list.data.listAnime.length;
    var numPage = Math.ceil(count / limit);
    var msg = [];
    for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
      if (i >= count) break;
      var nv = list.data.listAnime[i].name;
      msg += `${i + 0}. ${nv}\n`
    }
    msg += `Hiện tại có ${count} nhân vật\nSố trang (${page}/${numPage})\nDùng ${global.config.PREFIX}fbcover list <số trang>`;
    return api.sendMessage(msg, event.threadID)
 }
  else if (senderID == api.getCurrentUserID()) return;
api.sendMessage(`Reply tin nhắn để chọn nhân vật`,event.threadID, (err, info) => {
     return global.client.handleReply.push({
        type: "characters",
        name: this.config.name,
        author: senderID,
        tenchinh: args.join(" ").toUpperCase(),
        messageID: info.messageID
      });
  },event.messageID);
}
module.exports.handleReply = async function({ api, event, args, handleReply, client, __GLOBAL, Threads, Users, Currencies }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    var info = await api.getUserInfo(event.senderID);
    var nameSender = info[event.senderID].name;
    var arraytag = [];
        arraytag.push({id: event.senderID, tag: nameSender});
    if (handleReply.author != event.senderID) return;
    const {
        threadID,
        messageID,
        senderID
    } = event;

    switch (handleReply.type) {
        case "characters": { 
        	api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`🔍Bạn đã chọn ID nhân vật là ${event.body}\n(Reply tin nhắn này nhập vào tên chính của bạn)`,threadID , function (err, info) { 
        	  return global.client.handleReply.push({ 
        	  	type: 'subname',
        	  	name: 'fbcover',
        	  	author: senderID,
        	  	characters: event.body,
        	  	messageID: info.messageID
        	  })
        	}, messageID);
        }
        case "subname": { 
        	api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`🔍Bạn đã chọn tên chính là ${event.body}\n(Reply tin nhắn này nhập vào tên phụ của bạn)`,threadID , function (err, info) { 
        		return global.client.handleReply.push({ 
        			type: 'color',
        			name: 'fbcover',
        			author: senderID,
        			characters: handleReply.characters,
        			name_s: event.body,
        			messageID: info.messageID
        		})
        	}, messageID);
        }
        case "color": { 
        	api.unsendMessage(handleReply.messageID);
        	return api.sendMessage(`🔍Bạn đã chọn tên phụ là ${event.body}\nNhập màu nền của bạn (lưu ý: nhập tên tiếng anh của màu - Nếu không muốn nhập màu thì nhập "no")\n(Reply tin nhắn này)`,threadID , function (err, info) {
        		return global.client.handleReply.push({ 
        			type: 'create',
        			name: 'fbcover',
        			author: senderID,
        			characters: handleReply.characters,
        			subname: event.body,
        			name_s: handleReply.name_s,
        			messageID: info.messageID
        		})
        	}, messageID)
        }
        case "create": {
            var nhanvat = handleReply.characters;
            var name = handleReply.name_s;
            var color = event.body;
            var subname = handleReply.subname;
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`⏳ Đang khởi tạo chương trình tạo ảnh!`,threadID, (err, info) => {
            setTimeout(() => {
            	api.unsendMessage(info.messageID);
            	var callback = () => api.sendMessage({body:`Đây là ảnh bìa của ${nameSender}\nMã số nhân vật: ${nhanvat}\nTên chính: ${name}\nTên phụ: ${subname}\nMàu nền: ${color}`,mentions: arraytag,attachment: fs.createReadStream(__dirname + "/cache/fbcover.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/fbcover.png"),event.messageID);
                return request(encodeURI(`https://api.ndtmint.repl.co/fbcover/v2?name=${name}&id=${nhanvat}&subname=${subname}&color=${color}`)).pipe(fs.createWriteStream(__dirname + '/cache/fbcover.png')).on('close', () => callback());
            }, 1000);
          }, messageID);
        }
    }
}
