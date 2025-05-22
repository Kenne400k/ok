module.exports.config = {
  name: "antibd",
  eventType: ["log:user-nickname"],
  version: "0.0.3",
  credits: "Pcoder",
  description: "Chống đổi biệt danh của Bot"
};

module.exports.run = async function({ api, event, Users }) {
  const { logMessageData, threadID, author } = event;
  let { BOTNAME, ADMINBOT, PREFIX } = global.config;
  BOTNAME = BOTNAME || "Bot";
  ADMINBOT = ADMINBOT || [];

  const botID = api.getCurrentUserID();
  // Nếu người đổi là bot thì bỏ qua
  if (author == botID) return;
  // Nếu người đổi là admin bot thì bỏ qua
  if (ADMINBOT.includes(author)) return;
  // Nếu biệt danh bị đổi không phải của bot thì bỏ qua
  if (logMessageData.participant_id != botID) return;

  // Lấy biệt danh hiện tại của bot (nếu chưa được set thì lấy BOTNAME)
  let botNickname = "";
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    botNickname = threadInfo.nicknames?.[botID] || `『 ${PREFIX} 』⪼ ${BOTNAME}`;
  } catch {
    botNickname = `『 ${PREFIX} 』⪼ ${BOTNAME}`;
  }

  // Nếu biệt danh mới khác biệt danh chuẩn thì đổi lại
  if (logMessageData.nickname !== botNickname) {
    try {
      await api.changeNickname(botNickname, threadID, botID);
      let userInfo = {};
      try {
        userInfo = await Users.getData(author);
      } catch { userInfo.name = "Ai đó"; }
      return api.sendMessage(
        `⚠️ ${userInfo.name || "Ai đó"}, bạn không thể đổi biệt danh của bot! Biệt danh đã được đặt lại.`,
        threadID
      );
    } catch (e) {
      // Nếu lỗi thì ghi log, không gửi gì cả
      console.log("[antibd]", e);
    }
  }
};