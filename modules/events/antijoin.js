module.exports.config = {
 name: "antijoin",
 eventType: ["log:subscribe"],
 version: "1.0.0",
 credits: "D-Jukie",
 description: "Cấm thành viên mới vào nhóm"
};

module.exports.run = async function ({ event, api, Threads, Users }) {
 	let data = (await Threads.getData(event.threadID)).data
 	if (data.newMember == false) return;
 	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return
    else if(data.newMember == true) {
    var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId)
			for (let idUser of memJoin) {
					await new Promise(resolve => setTimeout(resolve, 1000));
					api.removeUserFromGroup(idUser, event.threadID, async function (err) {
                        if (err) return data["newMember"] = false;
                            await Threads.setData(event.threadID, { data });
                              global.data.threadData.set(event.threadID, data);
                    })
			}
 	return api.sendMessage(`» 𝗡𝗵𝗼́𝗺 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗵𝗶𝗲̣̂𝗻 𝗯𝗮̣̂𝘁 𝗺𝗼𝗱𝗲 𝗔𝗻𝘁𝗶 𝗝𝗼𝗶𝗻, 𝘃𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝘁𝗮̆́𝘁 𝘁𝗿𝘂̛𝗼̛́𝗰 𝗸𝗵𝗶 𝘁𝗵𝗲̂𝗺 𝘁𝗵𝗮̀𝗻𝗵 𝘃𝗶𝗲̂𝗻 𝗺𝗼̛́𝗶 👻`, event.threadID);
 }
}