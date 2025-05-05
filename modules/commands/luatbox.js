module.exports.config = {
  name: "luatbox",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CallmeSun",
  description: "video Nhạc",
  commandCategory: "Box-chat",
  usages: "girlnude",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
  var link = [
"https://i.imgur.com/dYSB3Tr.mp4",
"https://i.imgur.com/rrhusLy.mp4",
"https://i.imgur.com/YjK8hSF.mp4",
"https://i.imgur.com/XZ74T4b.mp4",
"https://i.imgur.com/KrXKiuL.mp4",
"https://i.imgur.com/wVEVjZU.mp4",
"https://i.imgur.com/CR5CEeB.mp4",
"https://i.imgur.com/rGLNo1g.mp4",
"https://i.imgur.com/DPc1hp2.mp4",
"https://i.imgur.com/DPc1hp2.mp4",
"https://i.imgur.com/qJYdLQv.mp4",
"https://i.imgur.com/ASrdgk1.mp4",
"https://i.imgur.com/hE0IrPF.mp4",
"https://i.imgur.com/Dq9HlIU.mp4",
"https://i.imgur.com/aBwJPcx.mp4",
"https://i.imgur.com/cO0jbhL.mp4",
"https://i.imgur.com/Rsf0fHK.mp4",
"https://i.imgur.com/qnix1wr.mp4",
"https://i.imgur.com/IjmIEH8.mp4",
  ];
  var max = Math.floor(Math.random() * 6);  
  var min = Math.floor(Math.random() * 2);
  var data = await Currencies.getData(event.senderID);
  var exp =  data.exp;
  var money = data.money
      if(money < 0) api.sendMessage("Bạn cần 0 đô để xem video:V",event.threadID,event.messageID)
          else {
   Currencies.setData(event.senderID, options = {money: money - 0})
   var callback = () => api.sendMessage({body:`====❤️𝙇𝙐𝘼̣̂𝙏 𝘽𝙊𝙓❤️===== \n━━━━━━━━━━━━━━━━━\n𝟏. Tvm vào giới thiệu + show (Phải bắt buộc🥰) \n𝟐. Được chửi tục nhưng hạn chế lại🤐 \n𝟑. Không gây war trong box (war giỡn còn chấp nhận😗) \n𝟒. Khi out thì phải xin phép, vào chào ra hỏi \n𝟓. Mọi người thường xuyên tương tác với box và không bơ box một mình vắng tanh \n𝟔. Tvc không bơ tvm (hoặc ngược lại) \n𝟕. Nhóm này có nền tảng như sau: \n+ Tik tok \n+ Zalo \n+ Facebook \n+ Messenger \n𝟖. Mọi người nhắn tin vui vẻ, hoà đồng, thân thiện, có thể làm quen, vui vẻ😍 \n𝟗. Sai quy định quá 3 lần sẽ bị kick😇 \n━━━━━━━━━━━━━━━━━\n👑Chào mừng bạn đến với box của chúng tôi🦋`,attachment: fs.createReadStream(__dirname + "/cache/5.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.gif"));
let name = await Users.getNameUser(event.senderID);
    let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    })            
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/5.gif")).on("close",() => callback());
   }
};