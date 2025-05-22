module.exports.config = {
	name: "antijoin",
	eventType: ["log:subscribe"],
	version: "1.0.0",
	credits: "D-Jukie",
	description: "Cấm thành viên mới vào nhóm"
};

module.exports.run = async function ({ event, api, Threads }) {
	const threadID = event.threadID;
	const dataThread = (await Threads.getData(threadID)).data || {};
	if (dataThread.newMember === false) return;
	const botID = api.getCurrentUserID();
	const addedUsers = event.logMessageData.addedParticipants.map(u => u.userFbId);
	// Nếu bot tự thêm, bỏ qua
	if (addedUsers.includes(botID)) return;

	if (dataThread.newMember === true) {
		for (const idUser of addedUsers) {
			// Kick từng user, delay 1s để tránh spam
			await new Promise(resolve => setTimeout(resolve, 1000));
			try {
				await api.removeUserFromGroup(idUser, threadID);
			} catch (err) {
				// Nếu lỗi (ví dụ không đủ quyền), tắt chế độ antijoin
				dataThread["newMember"] = false;
				await Threads.setData(threadID, { data: dataThread });
				global.data.threadData.set(threadID, dataThread);
				return api.sendMessage("⚠️ Không thể kick thành viên mới do không đủ quyền. Antijoin đã bị tắt.", threadID);
			}
		}
		return api.sendMessage(
			"» 𝗡𝗵𝗼́𝗺 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗵𝗶𝗲̣̂𝗻 𝗯𝗮̣̂𝘁 𝗺𝗼𝗱𝗲 𝗔𝗻𝘁𝗶 𝗝𝗼𝗶𝗻, 𝘃𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝘁𝗮̆́𝘁 𝘁𝗿𝘂̛𝗼̛́𝗰 𝗸𝗵𝗶 𝘁𝗵𝗲̂𝗺 𝘁𝗵𝗮̀𝗻𝗵 𝘃𝗶𝗲̂𝗻 𝗺𝗼̛́𝗶 👻",
			threadID
		);
	}
};