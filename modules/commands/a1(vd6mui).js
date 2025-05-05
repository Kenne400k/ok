module.exports.config = {
  name: "a1",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "vthien",// thay cc, đc t bố thí cho dùng thì bớt thay nha bố khánh thêm vài dòng code như lon
  description: "Random video",
  commandCategory: "noprefix",
  usages: "noprefix 6 múi",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.handleEvent = async ({ api, event, Threads }) => {
  if (event.body.indexOf("6mui")==0 || (event.body.indexOf("6 múi")==0) || event.body.indexOf("sáu múi")==0 ||
event.body.indexOf("6 mui")==0 ||
event.body.indexOf("trai 6 múi")==0 ||
event.body.indexOf("sáu múi")==0 ||
event.body.indexOf("8 múi")==0 ||
event.body.indexOf("💪")==0 ||
event.body.indexOf("sau mui")==0 ||
event.body.indexOf("Múi")==0) {
    const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];

    api.sendMessage("hình như bạn muốn xem sáu múi\nchờ mình xíu mình gửi liền", event.threadID, event.messageID);

    var link = [
      "https://i.imgur.com/sGemCXt.mp4",
      "https://i.imgur.com/T5PX9I4.mp4",
      "https://i.imgur.com/NBEkqy0.mp4",
      "https://i.imgur.com/tYmnPFy.mp4",
      "https://i.imgur.com/spo0NUr.mp4",
      "https://i.imgur.com/k2Tdz9E.mp4",
      "https://i.imgur.com/MuoS7kR.mp4",
      "https://i.imgur.com/NRk6PRq.mp4",
      "https://i.imgur.com/0KlpYdt.mp4",
      "https://i.imgur.com/lHeXA64.mp4",
      "https://i.imgur.com/zMk2x1K.mp4",
      "https://i.imgur.com/XQleoBs.mp4",
      "https://i.imgur.com/j3nMf73.mp4",
      "https://i.imgur.com/Z8f4Hje.mp4",
      "https://i.imgur.com/2WRnAUg.mp4",
      "https://i.imgur.com/ctF2Zsn.mp4",
      "https://i.imgur.com/W2TWIy1.mp4",
      "https://i.imgur.com/AS9pDxu.mp4",
      "https://i.imgur.com/pMU1EvA.mp4",
      "https://i.imgur.com/y2MS4kP.mp4",
      "https://i.imgur.com/FOqZ3N6.mp4",
      "https://i.imgur.com/F5lPZ4q.mp4",
      "https://i.imgur.com/Jb9HFLR.mp4",
      "https://i.imgur.com/xkqD1D1.mp4",
      "https://i.imgur.com/tmRGnB9.mp4",
      "https://i.imgur.com/9FAlJia.mp4",
      "https://i.imgur.com/NnLtqlX.mp4",
      "https://i.imgur.com/HjZ5xrW.mp4",
      "https://i.imgur.com/X8ebNrT.mp4",
      "https://i.imgur.com/isCqJhJ.mp4",
      "https://i.imgur.com/644FTlW.mp4",
      "https://i.imgur.com/DxJzA9r.mp4",
      "https://i.imgur.com/2GeJp3B.mp4",
      "https://i.imgur.com/yTXrrAp.mp4",
      "https://i.imgur.com/d6LPd9o.mp4",
      "https://i.imgur.com/mQtSY8B.mp4",
      "https://i.imgur.com/EaZUO5y.mp4",
      "https://i.imgur.com/YvmnxSJ.mp4",
      "https://i.imgur.com/i41ctFo.mp4",
      "https://i.imgur.com/jnGm1cw.mp4",
      "https://i.imgur.com/j7nLRPu.mp4",
      "https://i.imgur.com/CXHtSwv.mp4",
      "https://i.imgur.com/7GZq4Yv.mp4",
      "https://i.imgur.com/VKOAKmM.mp4",
      "https://i.imgur.com/t594oTG.mp4",
      "https://i.imgur.com/UEJ4WpX.mp4",      
      "https://i.imgur.com/Wsn41te.mp4",
      "https://i.imgur.com/kIgY6Pk.mp4",
      "https://i.imgur.com/jqCBqEs.mp4",
      "https://i.imgur.com/CSWUi1q.mp4",
      "https://i.imgur.com/AqOWoKK.mp4",
      "https://i.imgur.com/FlTkmFB.mp4",
      "https://i.imgur.com/hf2f0uT.mp4",
      "https://i.imgur.com/kvlfYuO.mp4",
      "https://i.imgur.com/sdcNzYc.mp4",
      "https://i.imgur.com/ZMIVWeN.mp4",
      "https://i.imgur.com/FOSSL9j.mp4",
      "https://i.imgur.com/giXsWxf.mp4",
      "https://i.imgur.com/nOEpo6t.mp4",
      "https://i.imgur.com/19SCUeR.mp4",
      "https://i.imgur.com/LImOi0F.mp4",
      "https://i.imgur.com/4ha1aqf.mp4",
      "https://i.imgur.com/dTdH2uM.mp4",
      "https://i.imgur.com/PDuq9GR.mp4",
      "https://i.imgur.com/skMIuie.mp4",
      "https://i.imgur.com/D8ychgg.mp4",
      "https://i.imgur.com/Q4ObxNq.mp4",
      "https://i.imgur.com/NwPOooT.mp4",
      "https://i.imgur.com/KvCLYts.mp4",
      "https://i.imgur.com/ziDoUmi.mp4",
      "https://i.imgur.com/r1cb4DF.mp4",
      "https://i.imgur.com/sgpIrir.mp4",
      "https://i.imgur.com/DLarpDD.mp4",
      "https://i.imgur.com/U9kC9nN.mp4",
      "https://i.imgur.com/D2K22F8.mp4",
      "https://i.imgur.com/AhncGNh.mp4",
      "https://i.imgur.com/Cb0lH6G.mp4",
      "https://i.imgur.com/BKWKjGN.mp4",
      "https://i.imgur.com/PzOV2Nn.mp4",
      "https://i.imgur.com/UhcDxHS.mp4",
      "https://i.imgur.com/PUVaovr.mp4",
      "https://i.imgur.com/DbXHC1m.mp4",
      "https://i.imgur.com/f58lOAM.mp4",
      "https://i.imgur.com/j6Q0780.mp4",
      "https://i.imgur.com/VE4jBS4.mp4",
      "https://i.imgur.com/uB8FPcM.mp4",
      "https://i.imgur.com/BLdz8lq.mp4",
      "https://i.imgur.com/V2Ren75.mp4"
          ];
var callback = () => api.sendMessage({body:`🥨 == [ 𝗩𝗜𝗗𝗘𝗢 𝗧𝗥𝗔𝗜 𝟲 𝗠𝗨́𝗜 ] == 🥨\n━━━━━━━━━━━━━━━━━━━\n[🎀] → 𝗩𝗶𝗱𝗲𝗼 𝘁𝗿𝗮𝗶 𝟲 𝗺𝘂́𝗶 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 đ𝗮̂𝘆\n[😼] → 𝗖𝗵𝘂́𝗰 𝗯𝗮̣𝗻 𝘅𝗲𝗺 𝘃𝗶𝗱𝗲𝗼 𝘃𝘂𝗶 𝘃𝗲̉\n[🌟] → 𝗦𝗼̂́ 𝘃𝗶𝗱𝗲𝗼 𝗵𝗶𝗲̣̂𝗻 𝗰𝗼́: ${link.length}`,attachment: fs.createReadStream(__dirname + "/cache/1.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.mp4"), event.messageID);  
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.mp4")).on("close",() => callback());
}
                                                                                                         }
module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {

   };