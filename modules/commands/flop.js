module.exports.config = {
    name: "flop",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "",
    description: "Xóa tất cả thành viên trong nhóm.",
    commandCategory: "Box Chat",
    usages: "",
    cooldowns: 5
};
module.exports.run = async function({ api, event, getText,args }) {
  const { participantIDs } = await api.getThreadInfo(event.threadID)
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const botID = api.getCurrentUserID();
  const listUserID = participantIDs.filter(ID => ID != botID);
  return api.getThreadInfo(event.threadID, (err, info) => {
    if (err) return api.sendMessage("» Có lỗi xảy ra!", event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
      return api.sendMessage(`» Cần quyền quản trị nhóm\nVui lòng thêm và thử lại!`, event.threadID, event.messageID);
    if (info.adminIDs.some(item => item.id == event.senderID)) {
      setTimeout(function() { api.removeUserFromGroup(botID, event.threadID) }, 3000000);
      return api.sendMessage(`» Bắt đầu flop`, event.threadID, async (error, info) => {
        for (let id in listUserID) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          api.removeUserFromGroup(listUserID[id], event.threadID)
        }
      })
    } else return api.sendMessage('» Chỉ quản trị viên nhóm mới có thể sử dụng lệnh này!', event.threadID, event.messageID);
  })
}