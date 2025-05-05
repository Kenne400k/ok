module.exports.config = {
  name: "out",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Vdang mod lại by hphong",
  description: "out box",
  commandCategory: "Hệ Thống",
  usages: "[tid]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  var id;
  if (!args.join(" ")) {
    id = event.threadID;
  } else {
    id = parseInt(args.join(" "));
  }

  // Lấy file đầu tiên từ global.khanhdayr và gửi kèm tin nhắn
  const attachment = global.khanhdayr.splice(0, 1);

  return api.sendMessage({
    body: `\n┏━━━━━━━━━━━━━━━━━━━━┓\n┣➤ :( bot phải out rồi❌ \n┣➤🟢 Pai pai mọi người UwU\n┣➤⏰ Hẹn ngày gặp lại huhuhu\n┗━━━━━━━━━━━━━━━━━━━━┛\n`,
    attachment
  }, id, () => api.removeUserFromGroup(api.getCurrentUserID(), id));
};
