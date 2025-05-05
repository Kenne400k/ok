module.exports.config = {
	name: "user",
	version: "1.0.5",
	hasPermssion: 2,
	credits: "Mirai Team",
	description: "Cấm hoặc gỡ cấm người dùng",
	commandCategory: "Hệ Thống",
	usages: "[unban/ban/search] [ID or text]",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"reason": "Lý do",
		"at": "vào lúc",
		"allCommand": "toàn bộ lệnh",
		"commandList": "những lệnh",
		"banSuccess": "[📌 𝗕𝗮𝗻 𝗨𝘀𝗲𝗿 💸] 𝗩𝘂̛̀𝗮 𝘅𝘂̛̉ 𝗹𝘆́ 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗰𝗮̂́𝗺 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: %1",
		"unbanSuccess": "[🎀 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 💎] 𝗩𝘂̛̀𝗮 𝘅𝘂̛̉ 𝗹𝘆́ 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗴𝗼̛̃ 𝗰𝗮̂́𝗺 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 %1",
		"banCommandSuccess": "[🔰 𝗕𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 🔰] 𝗩𝘂̛̀𝗮 𝘅𝘂̛̉ 𝗹𝘆́ 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗰𝗮̂́𝗺 𝗹𝗲̣̂𝗻𝗵 𝗿𝗶𝗲̂𝗻𝗴 𝘃𝗼̛́𝗶 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: %1",
		"unbanCommandSuccess": "[🍑 𝗨𝗻𝗯𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 🎲] 𝗩𝘂̛̀𝗮 𝘅𝘂̛̉ 𝗹𝘆́ 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗴𝗼̛̃ 𝗰𝗮̂́𝗺 %1 𝗿𝗶𝗲̂𝗻𝗴 𝘃𝗼̛́𝗶 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: %2",
		"errorReponse": "%1 Không thể hoàn tất công việc bạn yêu cầu",
		"IDNotFound": "%1 ID người dùng bạn nhập không tồn tại trong cơ sở dữ liệu",
		"existBan": "[📌 𝗕𝗮𝗻 𝗨𝘀𝗲𝗿 💸]] 𝗡𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 %1 𝗩𝗮̂̃𝗻 𝗰𝗼̀𝗻 𝗯𝗶̣ 𝗯𝗮𝗻 𝘁𝘂̛̀ 𝘁𝗿𝘂̛𝗼̛́𝗰 %2 %3",
		"notExistBan": "[🎀 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 💎] 𝗡𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗯𝗮̣𝗻 𝗻𝗵𝗮̣̂𝗽 𝗰𝗵𝘂̛𝗮 𝘁𝘂̛̀𝗻𝗴 𝗯𝗶̣ 𝗰𝗮̂́𝗺 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗯𝗼𝘁",
		"missingCommandInput": "%1 Phần command cần cấm không được để trống!",
		"notExistBanCommand": "[🍑 𝗨𝗻𝗯𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 🎲] 𝗛𝗶𝗲̣̂𝗻 𝘁𝗮̣𝗶 𝗜𝗗 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗯𝗮̣𝗻 𝗻𝗵𝗮̣̂𝗽 𝗰𝗵𝘂̛𝗮 𝘁𝘂̛̀𝗻𝗴 𝗯𝗶̣ 𝗰𝗮̂́𝗺 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗹𝗲̣̂𝗻𝗵",

		"returnBan": "[📌 𝗕𝗮𝗻 𝗨𝘀𝗲𝗿 💸] 𝗛𝗶𝗲̣̂𝗻 𝘁𝗮̣𝗶 𝗯𝗮̣𝗻 𝗱𝗮𝗻𝗴 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗰𝗵𝗼 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗻𝗮̀𝘆 𝘃𝗲̂̀ 𝗰𝗮́𝘁 𝗯𝘂̣𝗶 📵:\n- 𝗜𝗗 𝘃𝗮̀ 𝘁𝗲̂𝗻 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗰𝗮̂̀𝗻 𝗰𝗮̂́𝗺 💈: %1%2\n\n❮ 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗮̀𝘆 𝗱𝗲̂̉ 𝘅𝗮́𝗰 𝗻𝗵𝗮̣̂𝗻 𝘁𝗵𝗶 𝗵𝗮̀𝗻𝗵 𝗹𝗲̣̂𝗻𝗵 𝗔́𝗡 𝗻𝗮̀𝘆 ❯",
		"returnUnban": "[🎀 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 💎] 𝗛𝗶𝗲̣̂𝗻 𝘁𝗮̣𝗶 𝗯𝗮̣𝗻 𝗱𝗮𝗻𝗴 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗰𝗵𝗼 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗻𝗮̀𝘆 𝗺𝗼̣̂𝘁 𝗸𝗵𝗼𝗮𝗻 𝗵𝗼̂̀𝗻𝗴 𝘃𝗲̂̀ 𝗵𝗼̀𝗮 𝗻𝗵𝗮̣̂𝗽 𝘃𝗼̛́𝗶 𝘅𝗮̃ 𝗵𝗼̣̂𝗶❗:\n- 𝗜𝗗 𝘃𝗮̀ 𝘁𝗲̂𝗻 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗰𝗮̂̀𝗻 𝗴𝗼̛̃ 𝗰𝗮̂́𝗺 💌: %1\n\n❮ 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗲̂́𝘂 𝘅𝗮́𝗰 𝗻𝗵𝗮̣̂𝗻 𝗯𝗮̃𝗶 𝗯𝗼̉ 𝘁𝗵𝗶 𝗵𝗮̀𝗻𝗵 𝗮́𝗻 ❯",
		"returnBanCommand": "[🔰 𝗕𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 🔰] 𝗛𝗶𝗲̣̂𝗻 𝘁𝗮̣𝗶 𝗯𝗮̣𝗻 𝗱𝗮𝗻𝗴 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗰𝗮̂́𝗺 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗹𝗲̣̂𝗻𝗵 𝗿𝗶𝗲̂𝗻𝗴 𝘃𝗼̛́𝗶 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴🔒:\n - 𝗜𝗗 𝘃𝗮̀ 𝘁𝗲̂𝗻 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗰𝗮̂̀𝗻 𝗰𝗮̂́𝗺 📌: %1\n- 𝐂𝐚́𝐜 𝐥𝐞̣̂𝐧𝐡 𝐜𝐚̂̀𝐧 𝐜𝐚̂́𝐦 🛠: %2\n\n❮ 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻  𝗻𝗮̀𝘆𝗱𝗲̂̉ 𝘅𝗮́𝗰 𝗻𝗵𝗮̣̂𝗻  𝘁𝗵𝗶 𝗵𝗮̀𝗻𝗵 𝗹𝗲̣̂𝗻𝗵 𝗔́𝗡 𝗻𝗮̀𝘆 ❯",
		"returnUnbanCommand": "[🍑 𝗨𝗻𝗯𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 🎲] 𝗛𝗶𝗲̣̂𝗻 𝘁𝗮̣𝗶 𝗯𝗮̣𝗻 𝗱𝗮𝗻𝗴 𝘆𝗲̂𝘂 𝗰𝗮̂̀𝘂 𝗴𝗼̛̃ 𝗰𝗮̂́𝗺 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗹𝗲̣̂𝗻𝗵 𝗿𝗶𝗲̂𝗻𝗴 𝘃𝗼̛́𝗶 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 🎀:\n - 𝗜𝗗 𝘃𝗮̀ 𝘁𝗲̂𝗻 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗰𝗮̂̀𝗻  𝗴ỡ 𝗰𝗮̂́𝗺 🔗: %1\n- 𝐂𝐚́𝐜 𝐥𝐞̣̂𝐧𝐡 𝐜𝐚̂̀𝐧 𝐠𝐨̛̃ 𝐜 𝐚𝗰𝗮́𝗰 𝗹𝗲̣̂𝗻𝗵 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗲̂́𝘂 𝘅𝗮́𝗰 𝗻𝗵𝗮̣̂𝗻 𝗯𝗮̃𝗶 𝗯𝗼̉ 𝘁𝗵𝗶 𝗵𝗮̀𝗻𝗵 𝗮́𝗻𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐱𝐚́𝐜 𝐧𝐡𝐚̣̂𝐧 𝐛𝐚̃𝐢 𝐛𝐨̉ 𝐭𝐡𝐢 𝐡𝐚̀𝐧𝐡 𝐚́𝐧 ❯",//𝗴𝗼̛̃
	
		"returnResult": "Đây là kết quả phù hợp: \n",
		"returnNull": "Không tìm thấy kết quả dựa vào tìm kiếm của bạn!",
		"returnList": "[ User List ]\nHiện tại đang có %1 người dùng bị ban, dưới đây là %2 người dùng\n\n%3",
		"returnInfo": "[ Info User ] Đây là một sô thông tin về người dùng bạn cần tìm:\n- ID và tên của người dùng: %1n- Có bị ban?: %2 %3 %4\n- Bị ban lệnh?: %5"
	},
	"en": {
		"reason": "Reason",
		"at": "At",
		"allCommand": "All commands",
		"commandList": "Commands",
		"banSuccess": "[ Ban User ] Banned user: %1",
		"unbanSuccess": "[ Unban User ] Unbanned user %1",
		"banCommandSuccess": "[ banCommand User ] Banned command with user: %1",
		"unbanCommandSuccess": "[ UnbanCommand User ] Unbanned command %1 with user: %2",
		"errorReponse": "%1 Can't do what you request",
		"IDNotFound": "%1 ID you import doesn't exist in database",
		"existBan": "[ Ban User ] User %1 has been banned before %2 %3",
		"notExistBan": "[ Unban User ] User hasn't been banned before",
		"missingCommandInput": "%1 You have to import the command you want to ban!",
		"notExistBanCommand": "[ UnbanCommand User ] User ID hasn't been banned before",

		"returnBan": "[ Ban User ] You are requesting to ban user:\n- User ID and name who you want to ban: %1%2\n\n❮ Reaction this message to complete ❯",
		"returnUnban": "[ Unban User ] You are requesting to unban user:\n- User ID and name who you want to ban: %1\n\n❮ Reaction this message to complete ❯",
		"returnBanCommand": "[ banCommand User ] You are requesting to ban command with user:\n - User ID and name who you want to ban: %1\n- Commands: %2\n\n❮ Reaction this message to complete ❯",
		"returnUnbanCommand": "[ UnbanCommand User ] You are requesting to unban command with user:\n - User ID and name: %1\n- Commands: %2\n\n❮ Reaction this message to complete ❯",
	
		"returnResult": "This is your result: \n",
		"returnNull": "There is no result with your input!",
		"returnList": "[ User List ]\There are %1 banned user, here are %2 user\n\n%3",
		"returnInfo": "[ Info User ] Here is some information about the user who you want to find:\n- User ID and name: %1n- Banned?: %2 %3 %4\n- Command banned?: %5"
	}
}

module.exports.handleReaction = async ({ event, api, Users, handleReaction, getText }) => {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
	const moment = require("moment-timezone");
	const { threadID } = event;
	const { messageID, type, targetID, reason, commandNeedBan, nameTarget } = handleReaction;
	
	const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
	global.client.handleReaction.splice(global.client.handleReaction.findIndex(item => item.messageID == messageID), 1);
	
	switch (type) {
		case "ban": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.banned = true;
				data.reason = reason || null;
				data.dateAdded = time;
				await Users.setData(targetID, { data });
				global.data.userBanned.set(targetID, { reason: data.reason, dateAdded: data.dateAdded });
				return api.sendMessage(getText("banSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch { return api.sendMessage(getText("errorReponse", "[ Ban User ]"), threadID) };
		}

		case "unban": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.banned = false;
				data.reason = null;
				data.dateAdded = null;
				await Users.setData(targetID, { data });
				global.data.userBanned.delete(targetID);
				return api.sendMessage(getText("unbanSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch { return api.sendMessage(getText("errorReponse", "[ Unban User ]"), threadID) };
		}

		case "banCommand": {
			try {	
				let data = (await Users.getData(targetID)).data || {};
				data.commandBanned = [...data.commandBanned || [], ...commandNeedBan];
				await Users.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				return api.sendMessage(getText("banCommandSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ banCommand User ]"), threadID) };
		}

		case "unbanCommand": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.commandBanned = [...data.commandBanned.filter(item => !commandNeedBan.includes(item))];
				await Users.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				if(data.commandBanned.length == 0) global.data.commandBanned.delete(targetID)
				return api.sendMessage(getText("unbanCommandSuccess", ((data.commandBanned.length == 0) ? getText("allCommand") : `${getText("commandList")}: ${commandNeedBan.join(", ")}`), `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ UnbanCommand User ]"), threadID) };
		}
	}
}

module.exports.run = async ({ event, api, args, Users, getText }) => {
	const { threadID, messageID } = event;
	const type = args[0];
	var targetID = String(args[1]);
	var reason = (args.slice(2, args.length)).join(" ") || null;

	if (isNaN(targetID)) {
		const mention = Object.keys(event.mentions);
		args = args.join(" ");
		targetID = String(mention[0]);
		reason = (args.slice(args.indexOf(event.mentions[mention[0]]) + (event.mentions[mention[0]] || "").length + 1, args.length)) || null;
	}

	switch (type) {
		case "ban":
		case "-b": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Ban User ]"), threadID, messageID);
			if (global.data.userBanned.has(targetID)) {
				const { reason, dateAdded } = global.data.userBanned.get(targetID) || {};
				return api.sendMessage(getText("existBan", targetID, ((reason) ? `${getText("reason")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")} ${dateAdded}` : "")), threadID, messageID);
			}
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnBan", `${targetID} - ${nameTarget}`, ((reason) ? `\n- ${getText("reason")}: ${reason}` : "")), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "ban",
					targetID,
					reason,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}

		case "unban":
		case "-ub": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Unban User ]"), threadID, messageID);
			if (!global.data.userBanned.has(targetID)) return api.sendMessage(getText("notExistBan"), threadID, messageID);
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnban", `${targetID} - ${nameTarget}`), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "unban",
					targetID,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}

		case "search":
		case "-s": {
			const contentJoin = reason || "";
			const getUsers = (await Users.getAll(['userID', 'name'])).filter(item => !!item.name);
			var matchUsers = [], a = '', b = 0;
			getUsers.forEach(i => {
				if (i.name.toLowerCase().includes(contentJoin.toLowerCase())) {
					matchUsers.push({
						name: i.name,
						id: i.userID
					});
				}
			});
			matchUsers.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
			(matchUsers.length > 0) ? api.sendMessage(getText("returnResult", a), threadID) : api.sendMessage(getText("returnNull"), threadID);
			return;
		}
		
		case "banCommand":
		case "-bc": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ BanCommand User ]"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ BanCommand User ]"), threadID, messageID);
			if (reason == "all") {
				var allCommandName = [];
				const commandValues = global.client.commands.keys();
				for (const cmd of commandValues) allCommandName.push(cmd);
				reason = allCommandName.join(" ");
			}
			const commandNeedBan = reason.split(" ");
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnBanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "banCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}

		case "unbanCommand":
		case "-ubc": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ UnbanCommand User ]"), threadID, messageID);
			if (!global.data.commandBanned.has(targetID)) return api.sendMessage(getText("notExistBanCommand"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ UnbanCommand User ]"), threadID, messageID);
			if (reason == "all") {
				reason = (global.data.commandBanned.get(targetID)).join(" ");
			}
			const commandNeedBan = reason.split(" ");
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnbanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == global.data.commandBanned.get(targetID).length) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "unbanCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}

		case "list":
		case "-l": {
			var listBan = [], i = 0;
			const threadData = global.data.userBanned.keys();
			for (; ;) {
				let idUser = String(threadData.next().value);
				if (typeof idUser == "undefined") {
					const userName = (await Users.getData(idUser)).name || "unknown";
					listBan.push(`${i+=1}/ ${idUser} - ${userName}`);
				}
				if (i == global.data.userBanned.size || i == (parseInt(reason) || 10)) break;
			}
			return api.sendMessage(getText("returnList",(global.data.userBanned.size || 0), listBan.length, listBan.join("\n")), threadID, messageID);
		}

		case "info":
		case "-i": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Info User ]"), threadID, messageID);
			if (global.data.commandBanned.has(targetID)) { var commandBanned = global.data.commandBanned.get(targetID) || [] };
			if (global.data.userBanned.has(targetID)) { var { reason, dateAdded } = global.data.userBanned.get(targetID) || {} };
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnInfo", `${targetID} - ${nameTarget}`, ((!dateAdded) ? "YES" : "NO"), ((reason) ? `${getText("reson")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")}: ${dateAdded}` : ""), ((commandBanned) ? `YES: ${(commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", ")}` : "NO")), threadID, messageID);
		}
	}
}