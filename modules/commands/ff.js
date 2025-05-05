const axios = require("axios");

module.exports.config = {
  name: "ff",
  usePrefix: false,
  version: "4.0.1",
  hasPermssion: 0,
  credits: "hphong",
  description: "Lấy thông tin người chơi Free Fire bằng ID",
  commandCategory: "Tiện ích",
  usages: "ff <ID người chơi>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const playerId = args[0];

  if (!playerId) {
    return api.sendMessage("❌ Vui lòng nhập ID người chơi Free Fire.", threadID, messageID);
  }

  try {
    const { data } = await axios.get(`https://freefire-virusteam.vercel.app/info?uid=${playerId}`);

    if (!data?.["Account Name"]) {
      return api.sendMessage("⚠️ Không tìm thấy thông tin người chơi hoặc ID không hợp lệ.", threadID, messageID);
    }

    const now = new Date();
    const currentTime = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    let userName = "Không xác định";
    try {
      const userInfo = await api.getUserInfo(senderID);
      userName = userInfo[senderID]?.name || "Không xác định";
    } catch (e) {
      console.error("⚠️ Lỗi khi lấy thông tin người dùng:", e);
    }

    const message = `🎮 THÔNG TIN TÀI KHOẢN FREE FIRE 🎮
──────────────────
👤 Tên: ${data["Account Name"]}
🔹 UID: ${playerId}
🔺 Level: ${data["Account Level"]} (Exp: ${data["Account XP"]})
🌍 Khu vực: ${data["Account Region"]}
👍 Lượt thích: ${data["Account Likes"]}
📝 Chữ ký: ${data["Account Signature"] || "Không có"}

🐾 PET HIỆN TẠI:
📛 Tên: ${data["Equipped Pet Information"]?.["Pet Name"] || "Không có"}
🔹 ID: ${data["Equipped Pet Information"]?.["Pet ID"] || "Không có"}
🔺 Level: ${data["Equipped Pet Information"]?.["Pet Level"] || "Không có"}
🔄 EXP: ${data["Equipped Pet Information"]?.["Pet XP"] || "Không có"}
✅ Được chọn: ${data["Equipped Pet Information"] ? "Có" : "Không"}

🛡️ THÔNG TIN QUÂN ĐOÀN:
🏅 Tên: ${data["Guild Information"]?.["Guild Name"] || "Không có"}
🔹 ID: ${data["Guild Information"]?.["Guild ID"] || "Không có"}
🔺 Level: ${data["Guild Information"]?.["Guild Level"] || "Không có"}
👥 Thành viên: ${data["Guild Information"]?.["Guild Current Members"] || "0"}/${data["Guild Information"]?.["Guild Capacity"] || "0"}

👑 CHỦ QUÂN ĐOÀN:
👤 Tên: ${data["Guild Leader Information"]?.["Leader Name"] || "Không có"}
🔹 ID: ${data["Guild Leader Information"]?.["Leader ID"] || "Không có"}
🔺 Level: ${data["Guild Leader Information"]?.["Leader Level"] || "Không có"} (Exp: ${data["Guild Leader Information"]?.["Leader XP"] || "Không có"})
──────────────────
👥 Người dùng: ${userName}
🕒 Time: ${currentTime}`;

    global.khanhdayr = global.khanhdayr || [];
    const attachments = global.khanhdayr.length > 0 ? [global.khanhdayr.shift()] : [];

    api.sendMessage({ body: message, attachment: attachments }, threadID);
  } catch (error) {
    console.error("❌ Lỗi API:", error.response?.data || error.message);
    api.sendMessage(`⚠️ Lỗi khi lấy thông tin: ${error.message || "Không xác định"}`, threadID, messageID);
  }
};