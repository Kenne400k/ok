module.exports.config = {
    name: "tangqua",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "Horizon Lucius Synthesis I",
    description: "",
    commandCategory: "Admin bot",
    usages: "allbox",
    cooldowns: 0,
    dependencies: [] 
    };
    var array = [];
module.exports.run = async function ({ api,event,Currencies,args, }) {
  const moment = require("moment");
	var time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L"); 
    var x = global.data.allCurrenciesID;var out = (msg) => api.sendMessage(msg,event.threadID,event.messageID);
        let ix = Math.floor(Math.random() * 1000000) + 1; 
        let rxxi = global.data.allThreadID;var xs = false;
        var mention = Object.keys(event.mentions);
        switch (args[0]) {
           case 'all': {
              if (xs == true) return out("tặng quà rồi");
              for (let ex of x) {
        await Currencies.increaseMoney(ex, parseInt(ix));
                array.push(ex);
                            }
                for (let exs of rxxi) {
        api.sendMessage(`━━━━[ 𝗔𝗗𝗠𝗜𝗡 𝗟𝗜̀ 𝗫𝗜̀ 𝗡𝗘̀ ]━━━━\n\n➔ Nhóm Bạn Đã Được 𝗔𝗱𝗺𝗶𝗻 tặng quà gồm:\n💵 Random nhiều tiền đô (tự cộng ngẫu nhiên cho all thành viên)\n\n🤖 𝗖𝗵𝘂́𝗰 𝗰𝗮́𝗰 𝗯𝗮̣𝗻 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗕𝗢𝗧 𝘃𝘂𝗶 𝘃𝗲̉.`,exs,(error,info) => {
              if (error) return;
        });
                }
                 xs = true;
            return api.sendMessage("Đã gửi quà đến all box thành công",event.threadID);                      
           }
        }
    };