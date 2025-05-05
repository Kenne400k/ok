module.exports.config = {
  name: "rs",
  version: "2.0.2",
  hasPermssion: 3,
  credits: "Dgk",
  description: "Khởi động lại bot",
  commandCategory: "Admin",
  usages: "restart",
  cooldowns: 5,
  dependencies: {
    "moment-timezone": ""
  }
};

module.exports.run = async function({ api, args, Users, event }) {
  const { threadID, senderID } = event;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  const name = await Users.getNameUser(senderID);
  const giay = 3; // Thời gian chờ trước khi restart (giây)

  // Kiểm tra nếu global.khanhdayr có phần tử, nếu không thì bỏ qua
  const attachment = Array.isArray(global.khanhdayr) && global.khanhdayr.length > 0 ? global.khanhdayr.splice(0, 1) : null;

  try {
    await api.sendMessage({
      body: `💟 Chào cậu chủ: ${name}\n🔰 Vui lòng chờ, bot sẽ khởi động lại sau ${giay} giây...`,
      attachment: attachment
    }, threadID); 

    await sleep(giay * 1000); // Chờ trước khi restart

    process.exit(1);

  } catch (error) {
    console.error("Lỗi khi restart bot:", error);
    return api.sendMessage("❌ Đã xảy ra lỗi khi thực hiện lệnh restart.", threadID);
  }
};
