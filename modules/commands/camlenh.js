module.exports.config = {
  name: "camlenh",
  version: "1.0.5",
  hasPermssion: 2,
  credits: "Mirai team",
  description: "Cấm lệnh",
  commandCategory: "Admin",
  usages: "-l < lệnh cần cấm > -u < lệnh cần gỡ > / có thể cấm all lệnh bằng cách  -l all / gỡ cấm all lệnh thì -u all",
  cooldowns: 5,
  dependencies: {
    "moment-timezone": ""
  }
};

module.exports.languages = {
  "vi": {
    "allCommand": "toàn bộ lệnh",
    "commandList": "những lệnh",
    "banCommandSuccess": "[📌 𝐓𝐇𝐎̂𝐍𝐆 𝐁𝐀́𝐎 💌] 𝐕𝐮̛̀𝐚 𝐱𝐮̛̉ 𝐥𝐲́ 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐲𝐞̂𝐮 𝐜𝐚̂̀𝐮 𝐜𝐚̂́𝐦 𝐥𝐞̣̂𝐧𝐡 𝐭𝐫𝐞̂𝐧 𝐧𝐡𝐨́𝐦 𝐧𝐚̀𝐲",
    "unbanCommandSuccess": "[📌 𝐓𝐇𝐎̂𝐍𝐆 𝐁𝐀́𝐎 💌] 𝐕𝐮̛̀𝐚 𝐱𝐮̛̉ 𝐥𝐲́ 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐲𝐞̂𝐮 𝐜𝐚̂̀𝐮 𝐠𝐨̛̃ 𝐜𝐚̂́𝐦 %1 𝐭𝐫𝐞̂𝐧 𝐧𝐡𝐨́𝐦 𝐧𝐚̀𝐲",
    "missingCommandInput": "%1 𝐏𝐡𝐚̂̀𝐧 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐜𝐚̂̀𝐧 𝐜𝐚̂́𝐦 𝐤𝐡𝐨̂𝐧𝐠 𝐜𝐡𝐨 𝐩𝐡𝐞́𝐩 𝐭𝐫𝐨̂́𝐧𝐠 !",
    "notExistBanCommand": "[📌 𝐓𝐇𝐎̂𝐍𝐆 𝐁𝐀́𝐎 💌] 𝐇𝐢𝐞̣̂𝐧 𝐭𝐚̣𝐢 𝐈𝐃 𝐧𝐡𝐨́𝐦 𝐛𝐚̣𝐧 𝐧𝐡𝐚̣̂𝐩 𝐜𝐡𝐮̛𝐚 𝐭𝐮̛̀𝐧𝐠 𝐛𝐢̣ 𝐜𝐚̂́𝐦 𝐬𝐮̛̉ 𝐝𝐮̣𝐧𝐠 𝐥𝐞̣̂𝐧𝐡",


    "returnBanCommand": "[📌 𝐓𝐇𝐎̂𝐍𝐆 𝐁𝐀́𝐎 💌] 𝐁𝐚̣𝐧 𝐯𝐮̛̀𝐚 𝐲𝐞̂𝐮 𝐜𝐚̂̀𝐮 𝐜𝐚̂́𝐦 𝐬𝐮̛̉ 𝐝𝐮̣𝐧𝐠 𝐥𝐞̣̂𝐧𝐡 𝐭𝐫𝐞̂𝐧 𝐧𝐡𝐨́𝐦 𝐧𝐚̀𝐲\n- 𝐂𝐚́𝐜 𝐥𝐞̣̂𝐧𝐡 𝐜𝐚̂̀𝐧 𝐜𝐚̂́𝐦: %2\n\n❮ 𝐓𝐡𝐚̉ 𝐜𝐚̉𝐦 𝐱𝐮́𝐜 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐱𝐚́𝐜 𝐧𝐡𝐚̣̂𝐧 𝐭𝐡𝐢 𝐡𝐚̀𝐧𝐡 ❯",
    "returnUnbanCommand": "[📌 𝐓𝐇𝐎̂𝐍𝐆 𝐁𝐀́𝐎 💌] 𝐁𝐚̣𝐧 𝐯𝐮̛̀𝐚 𝐲𝐞̂𝐮 𝐜𝐚̂̀𝐮 𝐠𝐨̛̃ 𝐜𝐚̂́𝐦 𝐬𝐮̛̉ 𝐝𝐮̣𝐧𝐠 𝐥𝐞̣̂𝐧𝐡 𝐭𝐫𝐞̂𝐧 𝐧𝐡𝐨́𝐦 𝐧𝐚̀𝐲\n- 𝐂𝐚́𝐜 𝐥𝐞̣̂𝐧𝐡 𝐜𝐚̂̀𝐧 𝐠𝐨̛̃ 𝐜𝐚̂́𝐦: %2\n\n❮ 𝐓𝐡𝐚̉ 𝐜𝐚̉𝐦 𝐱𝐮́𝐜 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐱𝐚́𝐜 𝐧𝐡𝐚̣̂𝐧 𝐭𝐡𝐢 𝐡𝐚̀𝐧𝐡 ❯"
  }
}

module.exports.handleReaction = async ({ event, api, Threads, handleReaction, getText }) => {
  if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
  const moment = require("moment-timezone");
  const { threadID } = event;
  const { messageID, type, targetID, reason, commandNeedBan } = handleReaction;

  const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
  global.client.handleReaction.splice(global.client.handleReaction.findIndex(item => item.messageID == messageID), 1);
  switch (type) {
  case "banCommand": {
      try {	
        let data = (await Threads.getData(targetID)).data || {};
        data.commandBanned = [...data.commandBanned || [], ...commandNeedBan];
        await Threads.setData(targetID, { data });
        global.data.commandBanned.set(targetID, data.commandBanned);
        return api.sendMessage(getText("banCommandSuccess", targetID), threadID, () => {
          return api.unsendMessage(messageID);
        });
      } catch (e) { return api.sendMessage(getText("errorReponse", "[📌 𝐓𝐇𝐎̂𝐍𝐆 𝐁𝐀́𝐎 💌]", targetID), threadID) };
    }
    case "unbanCommand": {
      try {
        let data = (await Threads.getData(targetID)).data || {};
        data.commandBanned = [...data.commandBanned.filter(item => !commandNeedBan.includes(item))];
        await Threads.setData(targetID, { data });
        global.data.commandBanned.set(targetID, data.commandBanned);
        if(data.commandBanned.length == 0) global.data.commandBanned.delete(targetID)
        return api.sendMessage(getText("unbanCommandSuccess", ((data.commandBanned.length == 0) ? getText("allCommand") : `${getText("commandList")}: ${commandNeedBan.join(", ")}`), targetID), threadID, () => {
          return api.unsendMessage(messageID);
        });
      } catch (e) { return api.sendMessage(getText("errorReponse", "[📌 𝐓𝐇𝐎̂𝐍𝐆 𝐁𝐀́𝐎 💌]", targetID), threadID) };
    }
    default:
      break;
  }
}
module.exports.run = async ({ event, api, args, Threads, getText }) => { 
  const { threadID, messageID } = event;
  var targetID = String(args[1]);
  var reason = (args.slice(2, args.length)).join(" ") || null;

  if (isNaN(targetID)) {
    targetID = String(event.threadID);
    reason = (args.slice(1, args.length)).join(" ") || null;
  }
  switch (args[0]) {
  case "lệnh":
    case "-l": {
      if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ THÔNG BÁO ]"), threadID, messageID);
      if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", '[ THÔNG BÁO ]'), threadID, messageID);
      if (reason == "all") {
        var allCommandName = [];
        const commandValues = global.client.commands.keys();
        for (const cmd of commandValues) allCommandName.push(cmd);
        reason = allCommandName.join(" ");
      }
      const commandNeedBan = reason.split(" ");
      return api.sendMessage(getText("returnBanCommand", targetID, ((commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
        global.client.handleReaction.push({
          type: "banCommand",
          targetID,
          commandNeedBan,
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,

        });
      }, messageID);
    }

    case "unban":
    case "-u": {
      if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ THÔNG BÁO ]"), threadID, messageID);
      if (!global.data.commandBanned.has(targetID)) return api.sendMessage(getText("notExistBanCommand"), threadID, messageID);
      if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ THÔNG BÁO ]"), threadID, messageID);
      if (reason == "all") {
        reason = (global.data.commandBanned.get(targetID)).join(" ");
      }
      const commandNeedBan = reason.split(" ");
      return api.sendMessage(getText("returnUnbanCommand", targetID, ((commandNeedBan.length == global.data.commandBanned.get(targetID).length) ? "toàn bộ lệnh" : commandNeedBan.join(", "))), threadID, (error, info) => {
        global.client.handleReaction.push({
          type: "unbanCommand",
          targetID,
          commandNeedBan,
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,

        });
      }, messageID);
    }
  }
}