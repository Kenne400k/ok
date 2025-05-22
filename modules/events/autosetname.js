module.exports.config = {
	name: "autosetname",
	eventType: ["log:subscribe"],
	version: "1.0.3",
	credits: "Pcoder",
	description: "Tự động set biệt danh thành viên mới"
};

module.exports.run = async function({ api, event, Users }) {
	const { threadID } = event;
	const memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);

	const { readFileSync, writeFileSync, existsSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];
	const pathData = join(__dirname, "data", "autosetname.json");

	// Đảm bảo file tồn tại và đọc được
	let dataJson = [];
	if (existsSync(pathData)) {
		try {
			const raw = readFileSync(pathData, "utf-8");
			if (raw) dataJson = JSON.parse(raw);
		} catch (e) {
			dataJson = [];
		}
	}

	const thisThread = dataJson.find(item => item.threadID == threadID);

	// Chỉ set biệt danh nếu đã config cho thread này
	if (!thisThread || !thisThread.nameUser || thisThread.nameUser.length == 0) return;

	const setName = thisThread.nameUser[0];

	for (const idUser of memJoin) {
		await new Promise(resolve => setTimeout(resolve, 1000)); // Tránh spam đổi tên
		try {
			const userInfo = await api.getUserInfo(idUser);
			const nameUser = userInfo[idUser].name || '';
			await api.changeNickname(`${setName} ${nameUser}`, threadID, idUser);
		} catch (e) {
			console.log(`Lỗi khi set nickname cho ${idUser}: ${e.message || e}`);
		}
	}

	return api.sendMessage(`Đã set biệt danh tạm thời cho thành viên mới`, threadID, event.messageID);
}