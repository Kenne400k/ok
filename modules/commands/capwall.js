 const axios = require("axios");
const fs = require("fs");
module.exports.config = {
    name: "capwall",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Thiệu Trung Kiên",
    description: "Chụp ảnh profile của người dùng",
    commandCategory: "Công cụ",
    usages: "capwall",
    cooldowns: 5
}
/*module.exports.handleEvent = async ({ api, event, Threads, args, Users }) => {
  try{
  if(event.body.toLowerCase() == "cap"){
    let name = await Users.getNameUser(event.senderID);
    let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    })
    api.sendMessage({body: `[⚜️]➜ đ𝗼̛̣𝗶 𝘁𝗶́ 𝗻𝗵𝗮 ${name} 𝗯𝗼𝘁 đ𝗮𝗻𝗴 𝗰𝗮𝗽`, mentions}, event.threadID, event.messageID);
    if (event.type == "message_reply") {
      var uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length == 1) {
      var uid = Object.keys(event.mentions)[0];
    }
  else {
          var uid = event.senderID;
    }
    var cookies = `datr=rH2WY-5HGVmBtkCtTP6WV3-E;wd=1536x714;sb=tn2WYxZsG2C6J3vDWaytbZGK;dpr=1.25;locale=vi_VN;c_user=100022089907330;xs=30%3AFgRPbDWxy7uTvg%3A2%3A1670807145%3A-1%3A6158;fr=00aLtGMsTWrs9wwG2.AWXliV74NmpyylLonXMhVXhrLWM.Bjln2s.8U.AAA.0.0.Bjln5q.AWXcOgZ-IdM;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1670807153938%2C%22v%22%3A1%7D;fr=00aLtGMsTWrs9wwG2.AWUMCkTvfXoyoOeGG0K1LjfvzEA.Bjln2s.8U.AAA.0.0.Bjln5-.AWXPuOG92NE;dpr=1.25;wd=1536x714;imei=;|Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36;`,
    vaildItems = ['sb', 'datr', 'c_user', 'xs', 'm_pixel_ratio', 'locale', 'wd', 'fr', 'presence', 'xs', 'm_page_voice', 'fbl_st', 'fbl_ci', 'fbl_cs', 'vpd', 'wd', 'fr', 'presence'];
    var cookie = `datr=rH2WY-5HGVmBtkCtTP6WV3-E;wd=1536x714;sb=tn2WYxZsG2C6J3vDWaytbZGK;dpr=1.25;locale=vi_VN;c_user=100022089907330;xs=30%3AFgRPbDWxy7uTvg%3A2%3A1670807145%3A-1%3A6158;fr=00aLtGMsTWrs9wwG2.AWXliV74NmpyylLonXMhVXhrLWM.Bjln2s.8U.AAA.0.0.Bjln5q.AWXcOgZ-IdM;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1670807153938%2C%22v%22%3A1%7D;fr=00aLtGMsTWrs9wwG2.AWUMCkTvfXoyoOeGG0K1LjfvzEA.Bjln2s.8U.AAA.0.0.Bjln5-.AWXPuOG92NE;dpr=1.25;wd=1536x714;imei=;|Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36;`;
    cookies.split(';').forEach(item => {
        var data = item.split('=');
        if (vaildItems.includes(data[0])) cookie += `${data[0]}=${data[1]};`;
    });
    var url = encodeURI(encodeURI((`https://apicap-1.suaries1204.repl.co/screenshot/${uid}/${cookie}`))),
        path = __dirname + `/cache/${uid}.png`;
    axios({
        method: "GET",
        url: `https://api.screenshotmachine.com/?key=a526f9&url=${url}&dimension=1920x1080`,
        responseType: "arraybuffer"
    }).then(res => {
        fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
        api.sendMessage({body: `====『 𝗖𝗔𝗣 𝗪𝗔𝗟𝗟 』====\n━━━━━━━━━━━━━━━━\n💞 𝗮̂𝘆 𝗱𝗼̂ 𝗯𝗼𝘁 𝗰𝗮𝗽 𝘅𝗼𝗻𝗴 𝗿𝗼̂̀𝗶 𝗻𝗲̀ ${name}\n[⚜️]➜ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝗰𝗮𝗽 𝘄𝗮𝗹𝗹 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗰𝗮𝗽`,mentions, attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }).catch(err => console.log(err));
  }
} catch(e){
    console.log(e)
}}*/
module.exports.run = async function ({ api,Users,event, args }) {
  let name = await Users.getNameUser(event.senderID);
    let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    })
    api.sendMessage({body: `[⚜️]➜ đ𝗼̛̣𝗶 𝘁𝗶́ 𝗻𝗵𝗮 ${name} 𝗯𝗼𝘁 đ𝗮𝗻𝗴 𝗰𝗮𝗽`,mentions}, event.threadID, event.messageID);
    var uid = String(args[0]);
    isNaN(uid) && (uid = Object.keys(event.mentions)[0], "message_reply" == event.type ? uid = event.messageReply.senderID : uid = event.senderID);
    var cookies = `datr=rH2WY-5HGVmBtkCtTP6WV3-E; wd=1536x714; sb=tn2WYxZsG2C6J3vDWaytbZGK; dpr=1.25; locale=vi_VN; c_user=100022089907330; xs=30%3AFgRPbDWxy7uTvg%3A2%3A1670807145%3A-1%3A6158; fr=00aLtGMsTWrs9wwG2.AWUMCkTvfXoyoOeGG0K1LjfvzEA.Bjln2s.8U.AAA.0.0.Bjln5-.AWXPuOG92NE; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1670807174057%2C%22v%22%3A1%7D; fr=00aLtGMsTWrs9wwG2.AWWdSdX2AbLIuA5vlYac4zMNMnc.Bjln2s.8U.AAA.0.0.Bjln8y.AWX9YXsaLNg; dpr=1.25; wd=1536x714; useragent=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwOC4wLjAuMCBTYWZhcmkvNTM3LjM2; _uafec=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F108.0.0.0%20Safari%2F537.36;`,
    vaildItems = ['sb', 'datr', 'c_user', 'xs', 'm_pixel_ratio', 'locale', 'wd', 'fr', 'presence', 'xs', 'm_page_voice', 'fbl_st', 'fbl_ci', 'fbl_cs', 'vpd', 'wd', 'fr', 'presence'];
    var cookie = `datr=rH2WY-5HGVmBtkCtTP6WV3-E; wd=1536x714; sb=tn2WYxZsG2C6J3vDWaytbZGK; dpr=1.25; locale=vi_VN; c_user=100022089907330; xs=30%3AFgRPbDWxy7uTvg%3A2%3A1670807145%3A-1%3A6158; fr=00aLtGMsTWrs9wwG2.AWUMCkTvfXoyoOeGG0K1LjfvzEA.Bjln2s.8U.AAA.0.0.Bjln5-.AWXPuOG92NE; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1670807174057%2C%22v%22%3A1%7D; fr=00aLtGMsTWrs9wwG2.AWWdSdX2AbLIuA5vlYac4zMNMnc.Bjln2s.8U.AAA.0.0.Bjln8y.AWX9YXsaLNg; dpr=1.25; wd=1536x714; useragent=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwOC4wLjAuMCBTYWZhcmkvNTM3LjM2; _uafec=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F108.0.0.0%20Safari%2F537.36;`;
    cookies.split(';').forEach(item => {
        var data = item.split('=');
        if (vaildItems.includes(data[0])) cookie += `${data[0]}=${data[1]};`;
    });
    var url = encodeURI(encodeURI((`https://apicap-1.suaries1204.repl.co/screenshot/${uid}/${cookie}`))),
        path = __dirname + `/cache/${uid}.png`;
    axios({
        method: "GET",
        url: `https://api.screenshotmachine.com/?key=a526f9&url=${url}&dimension=1920x1080`,
        responseType: "arraybuffer"
    }).then(res => {
        fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
        api.sendMessage({body: `====『 𝗖𝗔𝗣 𝗪𝗔𝗟𝗟 』====\n━━━━━━━━━━━━━━━━\n💞 𝗮̂𝘆 𝗱𝗼̂ 𝗯𝗼𝘁 𝗰𝗮𝗽 𝘅𝗼𝗻𝗴 𝗿𝗼̂̀𝗶 𝗻𝗲̀ ${name}`,mentions, attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }).catch(err => console.log(err));
                                                       }
