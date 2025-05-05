module.exports.config = {
name: "quỹ",
version: "1.0.0",
hasPermssion: 0,
credits: "Nam",
description: "như hd",
commandCategory: "Tài chính",
usages: "Như hd",
cooldowns: 5,
dependencies: {
         "fs-extra": "",
         "request": "",
         "axios": ""
  }
};
    
module.exports.onLoad = async () => {
	const { existsSync, writeFileSync, mkdirSync } = require("fs-extra")
	const { join } = require("path")
	const axios = require("axios");
  const { resolve } = require("path");
    const pathA = require('path');
  const path = pathA.join(__dirname, 'hethong', 'lichsu.json');
    if (!existsSync(path)) {
        const obj = []
        writeFileSync(path, JSON.stringify(obj, null, 4));
  }
	const dir = __dirname + `/hethong`;
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const pathData = join(__dirname + '/hethong/quyThread.json');
  if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
	return;
}
module.exports.run = async function({ api, event, args, models, Users, Threads, Currencies, permssion, client }) {
  const { threadID, messageID, senderID } = event;
  const { readFileSync, writeFileSync, existsSync } = require("fs-extra")
  const axios = require("axios")
  const fs = require("fs");
  const pathA = require('path');
  const { join } = require("path")
  const thread = require('./hethong/lichsu.json');
  const path = pathA.join(__dirname, 'hethong', 'lichsu.json');
  const pathData = join(__dirname + '/hethong/quyThread.json');
  const user = require('./hethong/quyThread.json');
  const pathDataL = __dirname + '/../../includes/handle/usages.json';
  const usages = JSON.parse(require("fs").readFileSync(__dirname + `/../../includes/handle/usages.json`));
  let dataM = JSON.parse(fs.readFileSync(pathDataL));
  const data = [({ senderID, name: "", time: "", money: "", usages: "" })];
  const moneyInput = parseInt(args[2])
  if(args[0] == '-r' || args[0] == 'register') {
    if (permssion < 2) return api.sendMessage("Cần Quản Trị Viên để đăng ký", threadID, messageID);
    if (!user.find(i => i.id == threadID)) {
      var add = { id: threadID,  money: 500, usages: 100 }
      user.push(add);
      writeFileSync(pathData, JSON.stringify(user, null, 2));
      return api.sendMessage(`Đăng ký quỹ nhóm thành công\n + 500$ và 100 lượt vào quỹ`, threadID, async (error,info) => {
        thread.push({ threadID: threadID, data: data });
        fs.writeFileSync(path, JSON.stringify(thread, null, 2));
      }, messageID);
    }
  else return api.sendMessage(`Nhóm bạn đã có quỹ`, threadID, messageID)
  }
  if(args[0] == "del") {
    var userData = user.find(i => i.id == threadID); 
    return api.sendMessage(`Đã xóa quỹ nhóm`, threadID,  async (error, info) => {
  userData.id = ""
      writeFileSync(pathData, JSON.stringify(user, null, 2));
                }, messageID)
  
  }
  if(args[0] == 'check' || args[0] == 'c') {
  if (!user.find(i => i.id == threadID)) return api.sendMessage('Nhóm bạn chưa có quỹ, để đăng ký: /quỹ register', threadID, messageID)
    else { 
      var userData = user.find(i => i.id == threadID);
      return api.sendMessage(`==== QUỸ NHÓM ====\n\n Money: ${userData.money} $\n Lượt dùng: ${userData.usages}\n Level: ${((userData.money+userData.usages)/123456).toFixed(0)}`, threadID, messageID)
    }
  } 
     if (args[0] == "góp") {
  	return api.sendMessage(`Nhập lựa chọn\n1. góp money\n2. góp lượt dùng`,threadID, (error, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "gop",
        })
    }, messageID);
    }
       if (args[0] == "rút") {
         //if (permssion < 2) return api.sendMessage("Liên hệ Quản Trị Viên để rút", threadID, messageID);
  	return api.sendMessage(`Nhập lựa chọn\n1. rút money\n2. rút lượt dùng`,threadID, (error, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "rut",
        })
    }, messageID);
    }
         if (args[0] == "lichsu" || args[0] == "ls") {
           return api.sendMessage(`Nhập lựa chọn\n1. lịch sử góp\n2. lịch sử rút`,threadID, (error, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "lichsu",
        })
    }, messageID);
    }
           if (args[0] == "request") {
             let threadInfo = await api.getThreadInfo(event.threadID)
             let qtv = threadInfo.adminIDs.length;
             return api.sendMessage(`Đã gửi tb đến ${qtv} qtv nhóm`, threadID);
           }
  else return api.sendMessage(`====== HELP ======\n\n quỹ check => xem thông tin quỹ\n\n quỹ góp => góp măn ni, lượt dùng\n\n quỹ rút => rút măn ni, lượt dùng\n\n quỹ lichsu => xem lịch sử rút / góp vào quỹ\n\n quỹ request => gửi yc cần rút đến qtv box\n\n ===== RqzaX =====`, threadID, messageID)
}
module.exports.handleReply = async function ({ event, api, Currencies, handleReply, Users }) {
    if (handleReply.author != event.senderID) return;
  const { body, threadID, messageID, senderID } = event;
  const { type } = handleReply;
  const { readFileSync, writeFileSync, existsSync } = require("fs-extra")
  const axios = require("axios")
  const fs = require("fs");
  const pathA = require('path');
  const thread = require('./hethong/lichsu.json');
  const path = pathA.join(__dirname, 'hethong', 'lichsu.json');
  const moment = require("moment-timezone");
  var time = moment.tz("Asia/Ho_Chi_Minh").format(`HH:mm:ss || D/MM/YYYY`);
    const { join } = require("path")
  const pathData = join(__dirname + '/hethong/quyThread.json');
  const user = require('./hethong/quyThread.json');
  const pathDataL = __dirname + '/../../includes/handle/usages.json';
  const usages = JSON.parse(require("fs").readFileSync(__dirname + `/../../includes/handle/usages.json`));
  let dataM = JSON.parse(fs.readFileSync(pathDataL));
  var userData = user.find(i => i.id == threadID); 
  var money = userData.money;
  const balance = (await Currencies.getData(senderID)).money;
  var moneyInput = body;
  var threadDataLs = thread.find(i => i.threadID == threadID);
  var userDataLs = threadDataLs.data.find(i => i.senderID == senderID);
  switch (type) {
        case "gop": {
            switch (body) {
                case "1": {
                    return api.sendMessage(
                        "Nhập số tiền cần góp"
                  , threadID, (error, info) => {
                      global.client.handleReply.push({
                          name: this.config.name,
                          messageID: info.messageID,
                          author: senderID,
                          type: "money"
                      });
                  }, messageID);
                }
                case "2": {
                    return api.sendMessage(
                        "Nhập số lượt dùng cần góp"
                  , threadID, (error, info) => {
                      global.client.handleReply.push({
                          name: this.config.name,
                          messageID: info.messageID,
                          author: senderID,
                          type: "usages"
                      });
                  }, messageID);
                        }
                      }
          }
          case "money": {
          if (!user.find(i => i.id == threadID)) {
      return api.sendMessage('Nhóm bạn chưa đăng ký quỹ, để đăng ký dùng /quỹ register', threadID, messageID)
    }
            else 
            {
      if(balance < moneyInput) return api.sendMessage(`Số dư của bạn không đủ để góp vào quỹ nhóm`, threadID, messageID)
      var userData = user.find(i => i.id == threadID);
      var money = userData.money;
      userData.money = parseInt(money) + parseInt(moneyInput)
      writeFileSync(pathData, JSON.stringify(user, null, 2));
      await Currencies.decreaseMoney(senderID, parseInt(moneyInput));
      return api.sendMessage(`Bạn đã góp ${moneyInput} $ vào quỹ nhóm`, threadID, messageID); 
            }
          break;
          }
        case "usages": {
          if (!user.find(i => i.id == threadID)) {
    return api.sendMessage('Nhóm bạn chưa đăng ký quỹ!!\nđể đăng ký dùng: /quỹ register', threadID, messageID)
  }
  else { 
      let luotdung = usages[senderID].usages;
      if(luotdung < moneyInput) return api.sendMessage(`Số dư lượt dùng của bạn không đủ để góp vào quỹ nhóm`, threadID, messageID)
      var userData = user.find(i => i.id == threadID);
      var luotd = userData.usages;
var checkd = usages[senderID].usages;
      userData.usages = parseInt(luotd) + parseInt(moneyInput)
      writeFileSync(pathData, JSON.stringify(user, null, 2));
      return api.sendMessage(`Bạn đã góp ${moneyInput} lượt vào quỹ nhóm`, threadID, async (error, info) => {
  dataM[senderID] = { usages: usages[senderID].usages - moneyInput }
fs.writeFileSync(pathDataL, JSON.stringify(dataM));
                }, messageID)
  }
        }
  }
  
      switch (type) {
        case "rut": {
            switch (body) {
                case "1": {
                    return api.sendMessage(
                        "Nhập số tiền cần rút"
                  , threadID, (error, info) => {
                      global.client.handleReply.push({
                          name: this.config.name,
                          messageID: info.messageID,
                          author: senderID,
                          type: "moneyrut"
                      });
                  }, messageID);
                }
                case "2": {
                    return api.sendMessage(
                        "Nhập số lượt dùng cần rút"
                  , threadID, (error, info) => {
                      global.client.handleReply.push({
                          name: this.config.name,
                          messageID: info.messageID,
                          author: senderID,
                          type: "usagesrut"
                      });
                  }, messageID);
                        }
                      }
    }
                        case "usagesrut": {
                          if (!moneyInput || isNaN(moneyInput) || parseInt(moneyInput) < 1) return api.sendMessage("Số lượt cần rút phải là con số và lớn hơn 1", threadID, messageID);
    if (!user.find(i => i.id == threadID)) {
      return api.sendMessage('Nhóm bạn chưa đăng ký quỹ!!\nđể đăng ký dùng: /quỹ -r', threadID, messageID)
    }
  else {
    var userData = user.find(i => i.id == threadID); 
    var luotd = userData.usages;
    if(parseInt(luotd) < parseInt(moneyInput)) return api.sendMessage('Số dư lượt dùng trong quỹ nhóm không đủ để thực hiện giao dịch!!', threadID, messageID)
      else {
        userData.usages = parseInt(luotd) - parseInt(moneyInput)
        writeFileSync(pathData, JSON.stringify(user, null, 2));
        return api.sendMessage(`Rút thành công ${parseInt(moneyInput)} lượt dùng, số dư lượt dùng còn lại trong quỹ nhóm là ${userData.usages}`, threadID, async (error, info) => {
  dataM[senderID] = { usages: parseInt(usages[senderID].usages) + parseInt(moneyInput) }
fs.writeFileSync(pathDataL, JSON.stringify(dataM, null, 4));
        }, messageID)
       }
      }
    }
        case "moneyrut": {
          let nameUser = await Users.getNameUser(senderID);
          if (!moneyInput || isNaN(moneyInput) || parseInt(moneyInput) < 1) return api.sendMessage("Số tiền cần rút phải là con số và lớn hơn 1", threadID, messageID);
    if (!user.find(i => i.id == threadID)) {
      return api.sendMessage('Nhóm bạn chưa đăng ký quỹ!!\nđể đăng ký dùng: /quỹ -r', threadID, messageID)
    }
  else {
   if(parseInt(money) < parseInt(moneyInput)) return api.sendMessage('Số dư money trong quỹ nhóm không đủ để thực hiện giao dịch!!', threadID, messageID)
      else {
        await await Currencies.increaseMoney(senderID, parseInt(moneyInput));
        userData.money = parseInt(money) - parseInt(moneyInput)
        writeFileSync(pathData, JSON.stringify(user, null, 2));
        return api.sendMessage(`Rút thành công ${parseInt(moneyInput)} $, số dư còn lại trong quỹ nhóm là ${userData.money} $`, threadID, async (error, info) => {
userDataLs.name = nameUser, userDataLs.senderID = senderID, userDataLs.money = moneyInput, userDataLs.time = time;
    fs.writeFileSync(path, JSON.stringify(thread, null, 2));
        }, messageID);
      }
    }
  }
}
  let msg = "";
  switch (type) {
        case "lichsu": {
            switch (body) {
                case "1": {
                    return api.sendMessage(
                        `=====「 LỊCH SỬ GÓP 」 ====`
                  , threadID, messageID);
                }
                case "2": {
                  msg = `=====「 LỊCH SỬ RÚT 」 ====\n`;
    const data = thread.find(i => i.threadID == threadID);
    let i = 20;
    	for( i of data.data) {
         msg += `\n Vào lúc ${i.time} ${i.name} - ${i.senderID} đã rút ${i.money} ${i.money}`;
    	}
    	api.sendMessage(msg, threadID, messageID);
                        }
                      }
                   }
                }
             }