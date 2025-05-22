module.exports.config = {
	name: "setname",
	version: "3.0.0",
	hasPermssion: 0,
	credits: "pcoder",
	description: "Đổi biệt danh trong nhóm của bạn hoặc đổi biệt danh của một ai đó bạn tag hoặc reply",
	commandCategory: "Nhóm",
	usages: "trống/tag/check/all/del/call + name",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args, Users }) => {
	let { threadID, messageReply, senderID, mentions, type, participantIDs } = event;
	const delayUnsend = 60; // giây

	switch (args[0]) {
		case 'call':
		case 'Call': {
			const dataNickName = (await api.getThreadInfo(threadID)).nicknames;
			const objKeys = Object.keys(dataNickName);
			const notFoundIds = participantIDs.filter(id => !objKeys.includes(id));
			let mentionsList = [];
			let tag = '';
			for (let i = 0; i < notFoundIds.length; i++) {
				const id = notFoundIds[i];
				const name = await Users.getNameUser(id);
				mentionsList.push({ tag: name, id });
				tag += `${i + 1}. @${name}\n`;
			}
			const bd = '📣 Vui lòng setname để mọi người nhận biết bạn dễ dàng hơn';
			const message = {
				body: `${bd}\n\n${tag}`,
				mentions: mentionsList
			};
			api.sendMessage(message, threadID);
			return;
		}

		case 'del':
		case 'Del': {
			const threadInfo = await api.getThreadInfo(threadID);
			if (!threadInfo.adminIDs.some(admin => admin.id === senderID)) {
				return api.sendMessage(`⚠️ Chỉ quản trị viên mới có thể sử dụng`, threadID);
			}
			const dataNickName = threadInfo.nicknames;
			const objKeys = Object.keys(dataNickName);
			const notFoundIds = participantIDs.filter(id => !objKeys.includes(id));
			for (const id of notFoundIds) {
				try {
					await api.removeUserFromGroup(id, threadID);
				} catch (e) {
					console.log(e);
				}
			}
			return api.sendMessage(`✅ Đã xóa thành công những thành viên không setname`, threadID);
		}

		case 'check':
		case 'Check': {
			const dataNickName = (await api.getThreadInfo(threadID)).nicknames;
			const objKeys = Object.keys(dataNickName);
			const notFoundIds = participantIDs.filter(id => !objKeys.includes(id));
			let msg = '📝 Danh sách các người dùng chưa setname\n';
			let num = 1;
			for (const id of notFoundIds) {
				const name = await Users.getNameUser(id);
				msg += `\n${num++}. ${name}`;
			}
			msg += `\n\n📌 Thả cảm xúc vào tin nhắn này để kick những người không setname ra khỏi nhóm`;
			return api.sendMessage(msg, threadID, (error, info) => {
				global.client.handleReaction.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					abc: notFoundIds
				});
			});
		}

		case 'help':
			return api.sendMessage(
				`1. "setname + name" -> Đổi biệt danh của bạn\n` +
				`2. "setname @tag + name" -> Đổi biệt danh của người dùng được đề cập\n` +
				`3. "setname all + name" -> Đổi biệt danh của tất cả thành viên\n` +
				`4. "setname check" -> Hiển thị danh sách người dùng chưa đặt biệt danh\n` +
				`5. "setname del" -> Xóa người dùng chưa setname (chỉ dành cho quản trị viên)\n` +
				`6. "setname call" -> Yêu cầu người dùng chưa đặt biệt danh đặt biệt danh`, threadID);

		case 'all':
		case 'All': {
			try {
				const name = (event.body).split('all')[1] || "";
				for (const i of participantIDs) {
					try {
						await api.changeNickname(name, threadID, i);
					} catch (e) {
						console.log(e);
					}
				}
				return api.sendMessage(`✅ Đã đổi biệt danh thành công cho tất cả thành viên`, threadID);
			} catch (e) {
				console.log(e, threadID);
				return;
			}
		}
	}

	// Trường hợp đổi cho bản thân, tag, hoặc reply
	if (type === "message_reply" && messageReply) {
		const name = args.join(' ');
		const name2 = await Users.getNameUser(messageReply.senderID);

		api.changeNickname(name, threadID, messageReply.senderID, (err) => {
			if (!err) {
				api.sendMessage(`✅ Đã đổi tên của ${name2} thành ${name || "tên gốc"}`, threadID, (error, info) => {
					if (!error) {
						setTimeout(() => {
							api.unsendMessage(info.messageID);
						}, delayUnsend * 1000);
					}
				});
			} else {
				api.sendMessage(`❎ Nhóm chưa tắt liên kết mời!!`, threadID);
			}
		});
	} else if (Object.keys(mentions).length > 0) {
		const mentionIDs = Object.keys(mentions);
		const name = args.slice(mentionIDs.length).join(' ').trim();
		for (const mentionID of mentionIDs) {
			const name2 = await Users.getNameUser(mentionID);
			api.changeNickname(name, threadID, mentionID, (err) => {
				if (!err) {
					api.sendMessage(`✅ Đã đổi tên của ${name2} thành ${name || "tên gốc"}`, threadID, (error, info) => {
						if (!error) {
							setTimeout(() => {
								api.unsendMessage(info.messageID);
							}, delayUnsend * 1000);
						}
					});
				} else {
					api.sendMessage(`❎ Nhóm chưa tắt liên kết mời!!`, threadID);
				}
			});
		}
	} else {
		const name = args.join(" ");
		api.changeNickname(name, threadID, senderID, (err) => {
			if (!err) {
				api.sendMessage(`✅ Đã đổi tên của bạn thành ${name || "tên gốc"}`, threadID, (error, info) => {
					if (!error) {
						setTimeout(() => {
							api.unsendMessage(info.messageID);
						}, delayUnsend * 1000);
					}
				});
			} else {
				api.sendMessage(`❎ Nhóm chưa tắt liên kết mời!!`, threadID);
			}
		});
	}
};

module.exports.handleReaction = async function({ api, event, handleReaction }) {
	if (event.userID != handleReaction.author) return;
	if (Array.isArray(handleReaction.abc) && handleReaction.abc.length > 0) {
		let errorMessage = '';
		let successMessage = `✅ Đã xóa thành công ${handleReaction.abc.length} thành viên không set name`;
		let errorOccurred = false;

		for (let i = 0; i < handleReaction.abc.length; i++) {
			const userID = handleReaction.abc[i];
			try {
				await api.removeUserFromGroup(userID, event.threadID);
			} catch (error) {
				errorOccurred = true;
				errorMessage += `⚠️ Lỗi khi xóa ${userID} từ nhóm\n`;
			}
		}
		api.sendMessage(errorOccurred ? errorMessage : successMessage, event.threadID);
	} else {
		api.sendMessage(`Không có ai!`, event.threadID);
	}
};