module.exports.config = {
  name: "antibd",
  eventType: ["log:user-nickname"],
  version: "0.0.2",
  credits: "ProCoderCyrus",
  description: "Chống đổi biệt danh của Bot"
};

module.exports.run = async function({ api, event, Users, Threads }) {
    var { logMessageData, threadID, author } = event;
    var botID = api.getCurrentUserID();
    var { BOTNAME, ADMINBOT, PREFIX } = global.config;
    if (!ADMINBOT) ADMINBOT = [];

    var threadInfo = await api.getThreadInfo(threadID);
    var botNickname = threadInfo.nicknames[botID] || BOTNAME;

    if (logMessageData.participant_id == botID && author != botID && !ADMINBOT.includes(author) && logMessageData.nickname !== botNickname) {
        api.changeNickname(`『 ${PREFIX} 』 ⪼ ${BOTNAME}`, threadID, botID);
        var userInfo = await Users.getData(author);
        return api.sendMessage(`⚠️ ${userInfo.name}, bạn không thể đổi biệt danh của bot!`, threadID);
    }  
};