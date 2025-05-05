module.exports.config = {
  name: "data",
  version: "1.0.2",
  hasPermssion: 3,
  credits: "HelyT",
  description: "",
  commandCategory: "Owner",
  usages: "[exp/money add/del/set] [số tiền] [tag]",
  cooldowns: 0,
};
module.exports.onLoad = async () => {
    const fs = require("fs-extra");
    const chalk = require("chalk");
    const figlet = require("figlet");
  const axios = require("axios");
//const colors = ['red', 'green', 'violet', 'blue', 'magenta', 'cyan'];
  
  const dirMaterial = __dirname + `/cache/fishy/`;

  if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
  if (!fs.existsSync(dirMaterial + "data.json")) (await axios({
      url: "https://hely-t.github.io/storage-data/data.json",
      method: 'GET',
      responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dirMaterial + "data.json"));
  
  if (!fs.existsSync(dirMaterial + "fonts/bold-font.ttf")) (await axios({
      url: "https://hely-t.github.io/storage-data/items.json",
      method: 'GET',
      responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dirMaterial + "items.json"));

   // console.log(chalk[colors[Math.floor(Math.random() * colors.length)]](figlet.textSync(`RqzaX`, { horizontalLayout: 'full' })));
  return;
}
module.exports.run = async function({ api, event, args, Currencies, utils,Users,Threads }) {
  const permission = ["100013942628281"];
	if (!permission.includes(event.senderID)) return api.sendMessage("[𖤐] Quyền lực của bạn không đủ mạnh sử dụng sử dụng lệnh này!", event.threadID, event.messageID);
           let { threadID, senderID, messageID } = event;
           var mentions = Object.keys(event.mentions)[0] || args[3];
          
            if(!mentions){
        var data = await Currencies.getData(senderID);
        var exp =  data.exp;
        var money = data.money
      




        if(args[0] == 'exp'){
              if(!args[1])api.sendMessage("Exp: " + exp,threadID,messageID)
              if(args[1] == 'add'){
              let expadd = args[2]
              console.log(expadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã cộng thêm " + expadd + " exp cho bản thân !",threadID, () => Currencies.setData(senderID, options = {exp: exp + parseInt(expadd)}),messageID);
            }
              if(args[1] == 'del'){
              let expadd = args[2]
              console.log(expadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã trừ " + expadd + " exp cho bản thân !",threadID, () => Currencies.setData(senderID, options = {exp: exp - parseInt(expadd)}),messageID);
            }
              if(args[1] == 'set'){
              let expadd = args[2]
              console.log(expadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã reset exp của bản thân thành: "  + expadd,threadID, () => Currencies.setData(senderID, options = {exp: parseInt(expadd)}),messageID);
            }
         }
              if(args[0] == 'money'){
              
              if(!args[1])api.sendMessage("Money: " + money + " đô",threadID,messageID)
              if(args[1] == 'add'){
              let moneyadd = args[2]
              console.log(moneyadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã cộng thêm " + moneyadd + " đô cho bản thân !",threadID, () => Currencies.setData(senderID, options = {money: money + parseInt(moneyadd)}),messageID);
            }
              if(args[1] == 'del'){
              let moneyadd = args[2]
              console.log(moneyadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã trừ " + moneyadd + " đô của bản thân !",threadID, () => Currencies.setData(senderID, options = {money: money - parseInt(moneyadd)}),messageID);
            }
              if(args[1] == 'set'){
              let moneyadd = args[2]
              console.log(moneyadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã reset đô của bản thân thành: "  + moneyadd,threadID, () => Currencies.setData(senderID, options = {money: parseInt(moneyadd)}),messageID);
            }
         }
     
      }
      
         if(mentions){
          var dataa = await Currencies.getData(mentions);
          var exp =  dataa.exp;
          var money = dataa.money
          let name = Users.getData(mentions).name || (await api.getUserInfo(mentions))[mentions].name;
          const expp = (await Currencies.getData(mentions)).exp;
          console.log(expp)
          if(args[0] == 'exp'){
              if(args[1] == 'add'){
              let expadd = args[2]
              console.log(expadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã cộng thêm " + expadd + " exp cho " + name,threadID, () => Currencies.setData(mentions, options = {exp: exp + parseInt(expadd)}),messageID);
            }
              if(args[1] == 'del'){
              let expadd = args[2]
              console.log(expadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã trừ " + expadd + " exp cho " + name,threadID, () => Currencies.setData(mentions, options = {exp: exp - parseInt(expadd)}),messageID);
            }
              if(args[1] == 'set'){
              let expadd = args[2]
              console.log(expadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã reset exp của " + name + " thành: "  + expadd,threadID, () => Currencies.setData(mentions, options = {exp: parseInt(expadd)}),messageID);
            }
         }
              if(args[0] == 'money'){
             
              if(!args[1])api.sendMessage("Money: " + money + " đô",threadID,messageID)
              if(args[1] == 'add'){
              let moneyadd = args[2]
              console.log(moneyadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã cộng thêm " + moneyadd + " đô cho " + name,threadID, () => Currencies.setData(mentions, options = {money: money + parseInt(moneyadd)}),messageID);
            }
              if(args[1] == 'del'){
              let moneyadd = args[2]
              console.log(moneyadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã trừ " + moneyadd + " đô của " + name,threadID, () => Currencies.setData(mentions, options = {money: money - parseInt(moneyadd)}),messageID);
            }
              if(args[1] == 'set'){
              let moneyadd = args[2]
              console.log(moneyadd)
              if(!args[2])api.sendMessage("Không có tham số !",threadID,messageID)
              else api.sendMessage("Đã reset đô của " + name + " thành: "  + moneyadd,threadID, () => Currencies.setData(mentions, options = {money: parseInt(moneyadd)}),messageID);
            }
         }
     
      }
   
}