module.exports.config = {
  name: "vdtamtrang",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "hphong",
  description: "video Nhạc",
  commandCategory: "noprefix",
  usages: "",
  cooldowns: 0,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
  if (event.body.indexOf("vdtamtrang")==0 || (event.body.indexOf("tamtrang")==0) || event.body.indexOf("tt")==0 ||
event.body.indexOf("tâm trạng")==0 ||
event.body.indexOf("Vdtamtrang")==0 ||
event.body.indexOf(":((")==0) {
    const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
  
    api.sendMessage("〖🎶〗| Ramdom Video Tâm Trạng 👀:\n\nVideo sẽ được gửi sau vài phút/giây💤..", event.threadID, event.messageID);
  
    var link = [
"https://i.imgur.com/26tBGNz.mp4",
"https://i.imgur.com/bKahRyR.mp4",
"https://i.imgur.com/nsAeBu9.mp4",
"https://i.imgur.com/YBEqu4T.mp4",
"https://i.imgur.com/Zq5iniZ.mp4",
"https://i.imgur.com/eAue5PQ.mp4",
"https://i.imgur.com/p0uF1JZ.mp4",
"https://i.imgur.com/c9d9k8V.mp4",
"https://i.imgur.com/Q7k7En2.mp4",
"https://i.imgur.com/17QK9Ym.mp4",
"https://i.imgur.com/RgXyYf6.mp4",
"https://i.imgur.com/TPCfN2n.mp4",
"https://i.imgur.com/5wFRzh6.mp4",
"https://i.imgur.com/eKg22cS.mp4",
"https://i.imgur.com/jPRR3s6.mp4",
"https://i.imgur.com/LfW7EHr.mp4",
"https://i.imgur.com/zy7sr6N.mp4",
"https://i.imgur.com/jaKWRn4.mp4",
"https://i.imgur.com/92xJwzd.mp4",
"https://i.imgur.com/bVJ4yC4.mp4",
"https://i.imgur.com/7u6af0D.mp4",
"https://i.imgur.com/77oeeE4.mp4",
"https://i.imgur.com/VeJ3zDB.mp4",
"",
"",
"",
"",   
     ];
   var callback = () => api.sendMessage({body:`  『📲』Video Tâm Trạng Khi Chia Tay  `,attachment: fs.createReadStream(__dirname + "/cache/boobs.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/boobs.mp4"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/boobs.mp4")).on("close",() => callback());
    }
};


module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {

   };