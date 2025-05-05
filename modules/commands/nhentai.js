module.exports.config = {
    name: "nhentai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie",
    description: "Đọc truyện hentaizz",
    commandCategory: "Dành cho Admin",
    usages: "",
    cooldowns: 5
};
module.exports.getHentaiz = async function(type, first, second) {
    const axios = require('axios');
    switch(type) {
        case '1': {
            var list = (await axios.get(`https://api.vanthuan2.repl.co/hentaiz/list`)).data;
            return list
        }
        case '2': {
            var read = (await axios.get(`https://api.vanthuan2.repl.co/hentaiz/read?id=${first}&chapter=${second}`)).data;
            return read
        }
        case '3': {
            var contribute = (await axios.get(`https://api.vanthuan2.repl.co/hentaiz/contribute?link=${first}&name=${second}`)).data;
            return contribute
        }
        default: return
    }
}
module.exports.run = async function ({ api, event, Users, args }) {
      const { threadID, messageID } = event;
      switch(args[0]) {
        case 'list':
        case 'all': {
            const axios = require('axios')
            var res = await this.getHentaiz('1')
            var list = [];
            var lengthID = [];
            for (let i of res) { 
                list.push({
                    ID: i.ID,
                    name: i.name,
                    author: i.author,
                    description: i.description,
                    total_chapters: i.total_chapters
                });
                lengthID.push(i.ID);
            };
            var page = 1;
                page = parseInt(args[1]) || 1;
                page < -1 ? page = 1 : "";
            var limit = 5;
            var msg = "⌛️==== DANH SÁCH TRUYỆN HENTAIZZ ===⌛️\n\n";
            var numPage = Math.ceil(list.length / limit);
            for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                if (i >= list.length) break;
                    let info = list[i];                  
                    msg += `${i+1} =>✅ ID: ${info.ID}\n🔰 Tên: ${info.name}\n👀 Tác giả: ${info.author}\n🥏 Mô tả: ${info.description}\n☘ Tổng số chương: ${info.total_chapters}\n\n`;             
                }
            msg += `» Reply để chọn truyện muốn đọc\n`
            msg += `» Trang ${page}/${numPage}\n`
            msg += `» Hiện tại có ${(lengthID.length)} truyện trên server\n`
            return api.sendMessage(msg, threadID, (error, info) => {
                global.client.handleReply.push({
                    type: 'choose',
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    list: list
                });
            }, messageID);
        }
        case 'contribute':
        case 'donggop': {
            return api.sendMessage('🔰 Vui lòng nhập link truyện cần thêm vào!', threadID, (error, info) => {
                global.client.handleReply.push({
                    type: 'link',
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    list: list
                });
            }, messageID);
        }
        default: {
            return api.sendMessage('✅TAG:\n- LIST: xem list truyện hiện có và lựa chọn để đọc.\n- CONTRIBUTE: đóng góp link truyện để có thể đọc trên messenger\n🥏 AUTHOR: D-Jukie', threadID, messageID);
        }
    }
}
module.exports.handleReply = async function ({ args, event, api, handleReply, Users }) {
    const { list, author, type } = handleReply;
    const { threadID, messageID, body, senderID } = event;
    const fs = require("fs-extra");
    const axios = require('axios');
    switch(type) {
        case 'choose': {
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`⌛️ ${list[parseInt(body) -1].name} có ${list[parseInt(body) -1].total_chapters} chương.\n👀Bạn vui lòng reply chương muốn đọc!`, threadID, (error, info) => {
                global.client.handleReply.push({
                    type: 'chapters',
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    number: parseInt(body -1)
                });
            }, messageID);
        }
        case 'chapters': {
            if(body == '->') {
                chap = handleReply.chap + 1;
            }
            else if(body == '<-') {
                chap = handleReply.chap - 1;
            }
            else {
                chap = body
            }
            try {
                const res = await this.getHentaiz('2', handleReply.number, chap)
                if(res.error != 0) return api.sendMessage('⌛️ Không tìm thấy chương bạn yêu cầu!', threadID, messageID);
                api.sendMessage('⌛️ Đang tải trang, vui lòng đợi trong giây lát!', threadID, messageID);
                var imgData = [], num = 0;
                for(let i of res.image) {
                    let path = __dirname + `/cache/${num++}.png`;
                    let getDown = (await axios.get(`${i}`, { responseType: 'arraybuffer' })).data;
                    fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
                    imgData.push(fs.createReadStream(path));
                }
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage({ body: `🔰 Tên: ${res.name}\n🥏 Chương hiện tại: ${res.chapters}\n☘ Tổng số chương: ${res.total_chapters}\n👀Reply -> hoặc <- để chuyển trang, react để gỡ trang!`,  attachment: imgData}, 
                    threadID, (error, info) => {
                        global.client.handleReply.push({
                            type: 'chapters',
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            number: handleReply.number,
                            chap: parseInt(chap)
                        });
                        global.client.handleReaction.push({
                            type: 'unsend',
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }, messageID);
            }
            catch(e) {
                console.log(e)
                return api.sendMessage('⌛️ API đang lỗi, vui lòng báo cáo với admin!', threadID, messageID);
            }
        }
        case 'link': {
            const res = await this.getHentaiz('3', encodeURI(body), encodeURI((await Users.getData(senderID)).name))
            if(res.error != 0) return api.sendMessage('⌛️ Vui lòng reply với nội dung là link cần đóng góp', threadID, messageID);
            return api.sendMessage('✅ Đóng góp truyện thành công, truyện có thể sẽ sớm có mặt trên messenger!', threadID, messageID);
        }
    }
}
module.exports.handleReaction = ({ api, event, handleReaction }) => {
    if(handleReaction.type == 'unsend') {
        api.unsendMessage(handleReaction.messageID)
    }
    else return
}
