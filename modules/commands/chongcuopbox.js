module.exports.config = {
  name: "chongcuopbox",
  version: "1.0.1",
  credits: "pcoder",
  hasPermssion: 1,
  description: "Ngăn chặn việc thay đổi admin",
  usages: "",
  commandCategory: "Hệ thống",
  cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
  try {
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) {
      return api.sendMessage('» Bot cần quyền quản trị viên nhóm, vui lòng thêm và thử lại!', event.threadID, event.messageID);
    }
    const threadData = await Threads.getData(event.threadID);
    const data = threadData.data || {};

    // Toggle guard (bật/tắt)
    if (typeof data["guard"] !== "boolean") data["guard"] = true;
    else data["guard"] = !data["guard"];

    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(Number(event.threadID), data);

    return api.sendMessage(
      `» Đã ${(data["guard"]) ? "bật" : "tắt"} thành công chế độ chống cướp box!`,
      event.threadID,
      event.messageID
    );
  } catch (e) {
    return api.sendMessage(`Đã xảy ra lỗi: ${e.message}`, event.threadID, event.messageID);
  }
};