module.exports.config = {
  name: "tinder",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "M-Drasew, HungCho", 
  description: "Ghép đôi có chọn giới tính",
  commandCategory: "Trò Chơi", 
  usages: "Nam/Nữ", 
  cooldowns: 10
};
module.exports.run = async ({ api, event, handleReply, Users, Currencies }) => {
const { threadID, messageID, senderID } = event;
/*var data = await Currencies.getData(event.senderID);
var money = data.money
if( money = 0) api.sendMessage(`Bạn muốn ghép đôi à kiếm đủ 1000$ mị mới ghép cho nhé\nSố tiền bạn hiện có: ${money}$`,threadID,messageID)
  else {
  Currencies.setData(event.senderID, options = {money: money - 1000})*/
  return api.sendMessage(`🖤====「 𝗧𝗜𝗡𝗗𝗘𝗥  」====🖤\n━━━━━━━━━━━━━━\n\n🎎 𝗖𝗵𝘂𝗮̂̉𝗻 𝗯𝗶̣ 𝗺𝗮𝗶 𝗺𝗼̂́𝗶 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴\n👉 𝗣𝗵𝗮̉𝗻 𝗵𝗼̂̀𝗶 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗮̀𝘆 𝗰𝗵𝗼̣𝗻 𝗴𝗶𝗼̛́𝗶 𝘁𝗶́𝗻𝗵 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗯𝗮̣𝗻 𝗺𝘂𝗼̂́𝗻 𝘅𝗲𝗺 𝗺𝗮̆́𝘁 "𝗡𝗮𝗺 𝗵𝗼𝗮̣̆𝗰 𝗡𝘂̛̃"`, event.threadID, (error, info) => {
        global.client.handleReply.push({
            type: "tinder",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        })  
     })
   }
module.exports.handleReply = async ({ api, event, handleReply, Users, Currencies }) => {
var token = `6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];
const tile = (Math.random() * 50)+50;
const emoji = ["♥️","❤️","💛","💚","💙","💜","🖤","💖","💝","💓","💘","💍"];
const random = ["𝗖𝗵𝘂́𝗰 𝟮 𝗯𝗮̣𝗻 𝘁𝗿𝗮̆𝗺 𝗻𝗮̆𝗺 𝗵𝗮̣𝗻𝗵 𝗽𝗵𝘂́𝗰", "𝗖𝗵𝘂́𝗰 𝟮 𝗯𝗮̣𝗻 𝘆𝗲̂𝘂 𝗻𝗵𝗮𝘂 𝘁𝗼̛́𝗶 𝗴𝗶𝗮̀", "𝗖𝗵𝘂́𝗰 𝗰𝗵𝗼 𝟮 𝗯𝗮̣𝗻 𝘀𝗼̛́𝗺 𝗰𝗵𝗶𝗮 𝘁𝗮𝘆", "𝗠𝗮̃𝗶 𝗯𝗲̂𝗻 𝗻𝗵𝗮𝘂 𝟮 𝗯𝗮̣𝗻 𝗻𝗵𝗲́", "𝗦𝗼̛́𝗺 𝘀𝗶𝗻𝗵 𝗾𝘂𝘆́ 𝘁𝘂̛̉ 𝗻𝗵𝗲𝗮𝗮𝗮", "𝗦𝗼̛́𝗺 𝘀𝗶𝗻𝗵 𝗾𝘂𝘆́ 𝘁𝘂̛̉ 𝗻𝗵𝗲𝗮𝗮𝗮", "𝗖𝗵𝘂́𝗰 𝟮 𝗯𝗮̣𝗻 𝗰𝗼́ 𝟭 𝘁𝗶̀𝗻𝗵 𝘆𝗲̂𝘂 𝗯𝗲̂̀𝗻 𝘃𝘂̛̃𝗻𝗴", "𝗖𝗵𝘂́𝗰 𝟮 𝗯𝗮̣𝗻 𝗺𝗮̃𝗶 𝗺𝗮̃𝗶 𝟭 𝘁𝗶̀𝗻𝗵 𝘆𝗲̂𝘂"];
    switch(handleReply.type) {
        case "tinder": {
          switch(event.body) {
          case "trai":
          case "nam":
          case "Trai":
          case "Nam": {
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`• 𝗩𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝗰𝗵𝗼̛̀ 𝘁𝗶̀𝗺 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝘅𝗲𝗺 𝗺𝗮̆́𝘁 𝗽𝗵𝘂̀ 𝗵𝗼̛̣𝗽 𝘃𝗼̛́𝗶 𝗯𝗮̣𝗻....`,event.threadID);
            var ThreadInfo = await api.getThreadInfo(event.threadID);
            var all = ThreadInfo.userInfo
            let data = [];
            for (let male of all) {
                if (male.gender == "MALE") {
                 if ( male != event.senderID) data.push(male.id)   
                }
            }
          let member = data[Math.floor(Math.random() * data.length)]
          let n = (await Users.getData(member)).name
          const url = api.getCurrentUserID(member);
          let Avatar_boy = (await axios.get(`https://graph.facebook.com/${member}/picture?height=1500&width=1500&access_token=`+token, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + `/cache/avt1.png`, Buffer.from(Avatar_boy, "utf-8") );
          let name = await Users.getNameUser(handleReply.author);
          let gifLove = (await axios.get( `https://i.imgur.com/C5cnuvK.png`, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8") );
          let Avatar_author = (await axios.get( `https://graph.facebook.com/${handleReply.author}/picture?width=512&height=512&access_token=`+token, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar_author, "utf-8") );
           var arraytag = [];
                arraytag.push({id: handleReply.author, tag: name});
                arraytag.push({id: member, tag: n});
           var imglove = []; 
              imglove.push(fs.createReadStream(__dirname + "/cache/avt1.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
           var msg = {body: `━━━「 𝗧𝗜𝗡𝗗𝗘𝗥  」━━━\n\n• 𝗠𝗮𝗶 𝗺𝗼̂́𝗶 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 💮\n• 𝗧𝗶̉ 𝗹𝗲̣̂ 𝗵𝗼̛̣𝗽 𝗻𝗵𝗮𝘂 𝗰𝘂̉𝗮 𝟮 𝗯𝗮̣𝗻 𝗹𝗮̀ ${tile.toFixed(2)}%\n• ${random[Math.floor(Math.random() * random.length)]}\n`+n+" "+emoji[Math.floor(Math.random() * random.length)]+" "+name, mentions: arraytag, attachment: imglove}
        return api.sendMessage(msg, event.threadID, event.messageID);
          } break;
          case "gái":
          case "nữ":
          case "Gái": 
          case "Nữ": {
            api.unsendMessage(handleReply.messageID);
            api.sendMessage(`• 𝗩𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝗰𝗵𝗼̛̀ 𝘁𝗶̀𝗺 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝘅𝗲𝗺 𝗺𝗮̆́𝘁 𝗽𝗵𝘂̀ 𝗵𝗼̛̣𝗽 𝘃𝗼̛́𝗶 𝗯𝗮̣𝗻....`,event.threadID);
            var ThreadInfo = await api.getThreadInfo(event.threadID);
            var all = ThreadInfo.userInfo
            let data = [];
            for (let female of all) {
                if (female.gender == "FEMALE") {
                 if ( female != event.senderID) data.push(female.id)   
                }
            }
          let member = data[Math.floor(Math.random() * data.length)]
          let n = (await Users.getData(member)).name
          let Avatar_girl = (await axios.get(`https://graph.facebook.com/${member}/picture?height=1500&width=1500&access_token=`+token, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + `/cache/avt1.png`, Buffer.from(Avatar_girl, "utf-8") );
          let name = await Users.getNameUser(handleReply.author);
          let gifLove = (await axios.get( `https://i.imgur.com/C5cnuvK.png`, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8") );
          let Avatar_author = (await axios.get( `https://graph.facebook.com/${handleReply.author}/picture?width=512&height=512&access_token=`+token, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar_author, "utf-8") );
           var arraytag = [];
                arraytag.push({id: handleReply.author, tag: name});
                arraytag.push({id: member, tag: n});
           var imglove = []; 
              imglove.push(fs.createReadStream(__dirname + "/cache/avt1.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
           var msg = {body: `━━━「 𝗧𝗜𝗡𝗗𝗘𝗥  」━━━\n\n• 𝗠𝗮𝗶 𝗺𝗼̂́𝗶 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 💮\n️• 𝗧𝗶̉ 𝗹𝗲̣̂ 𝗵𝗼̛̣𝗽 𝗻𝗵𝗮𝘂 𝗰𝘂̉𝗮 𝟮 𝗯𝗮̣𝗻 𝗹𝗮̀ ${tile.toFixed(2)}%\n• ${random[Math.floor(Math.random() * random.length)]}\n`+n+" "+emoji[Math.floor(Math.random() * random.length)]+" "+name, mentions: arraytag, attachment: imglove}
        return api.sendMessage(msg, event.threadID, event.messageID);
          } break;
        }
      }
    }
}