const { loadImage, createCanvas, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

// Tùy biến font Việt hóa, bạn có thể thêm font khác vào thư mục fonts/
const fontPath = path.join(__dirname, "fonts", "SVN-ProductSans-Bold.otf");
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: "ProductSans" });
}

const bgPath = path.join(__dirname, "workbg.jpg");

// Cấu hình nghề nghiệp và emoji
const jobs = [
  { name: "Bắn Free Fire", emoji: "⚔️", color: "#ff995e" },
  { name: "Làm thuê", emoji: "🏢", color: "#86b8fa" },
  { name: "Chặt gỗ", emoji: "🪵", color: "#a9d08e" },
  { name: "Rèn kiếm", emoji: "🛠️", color: "#f5c242" },
  { name: "Thử thách", emoji: "📑", color: "#ff90c2" },
  { name: "Rèn giáp", emoji: "⚒️", color: "#a5816f" },
  { name: "Giết người", emoji: "🗡️", color: "#d94862" },
  { name: "Khai thác", emoji: "⛏️", color: "#9be7ff" }
];

module.exports.config = {
  name: "workcanvas",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Pcoder",
  description: "Làm việc kiếm tiền, trả kết quả bằng ảnh canvas đẹp chuẩn game",
  commandCategory: "Kiếm Tiền",
  cooldowns: 5
};

function randomArr(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function drawText(ctx, text, x, y, maxWidth, fontSize, fontFamily = "ProductSans", color = "#fff", shadow = true) {
  ctx.font = `bold ${fontSize}px "${fontFamily}"`;
  ctx.fillStyle = color;
  if (shadow) {
    ctx.shadowColor = "#222";
    ctx.shadowBlur = 6;
  }
  ctx.fillText(text, x, y, maxWidth);
  ctx.shadowBlur = 0;
}

async function makeWorkCanvas({ name, avatarUrl, job, money, jobDesc, streak, level, lastMoney, color }) {
  // Chuẩn bị ảnh nền
  let bg;
  if (fs.existsSync(bgPath)) {
    bg = await loadImage(bgPath);
  } else {
    // Nếu chưa có ảnh nền thì dùng màu đơn giản
    bg = null;
  }
  // Tạo canvas
  const canvas = createCanvas(800, 450);
  const ctx = canvas.getContext("2d");

  // Vẽ nền
  if (bg) {
    ctx.drawImage(bg, 0, 0, 800, 450);
  } else {
    ctx.fillStyle = color || "#1b2028";
    ctx.fillRect(0, 0, 800, 450);
  }
  // Overlay bóng mờ
  ctx.fillStyle = "rgba(0,0,0,0.37)";
  ctx.fillRect(0, 0, 800, 450);

  // Avatar
  let avatar = null;
  try {
    const avaData = await loadImage(avatarUrl);
    avatar = avaData;
  } catch {}
  if (avatar) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(108, 120, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 48, 60, 120, 120);
    ctx.restore();
    // viền avatar
    ctx.beginPath();
    ctx.arc(108, 120, 62, 0, Math.PI * 2, true);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color || "#fff";
    ctx.stroke();
  }

  // Info user
  drawText(ctx, name, 200, 120, 530, 38, "ProductSans", "#fff", true);
  drawText(ctx, `Level: ${level}   |   Chuỗi ngày: ${streak}🔥`, 200, 162, 530, 26, "ProductSans", "#ffe57f", true);
  drawText(ctx, `Tiền trước: ${lastMoney}$  ➜  Tiền hiện tại: ${money}$`, 200, 200, 570, 26, "ProductSans", "#a1e7ff", true);

  // Nghề và kết quả
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = color || "#ff995e";
  ctx.roundRect(50, 240, 700, 140, 40);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  drawText(ctx, `${job.emoji}  ${job.name.toUpperCase()}  ${job.emoji}`, 80, 290, 700, 38, "ProductSans", "#fff", true);
  drawText(ctx, jobDesc, 80, 335, 690, 30, "ProductSans", "#fff", false);
  drawText(ctx, `+${job.money}$`, 80, 380, 700, 34, "ProductSans", "#aaff6f", true);

  // Watermark
  drawText(ctx, "Tường AI Canvas | Kenne400k", 500, 435, 290, 18, "ProductSans", "#ffffff99", false);

  return canvas.toBuffer();
}

module.exports.run = async function({ api, event, Users, Currencies }) {
  const { threadID, senderID, messageID } = event;
  // Lấy tên user
  let name = (await Users.getNameUser(senderID)) || "Người chơi";
  // Avatar
  let avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=256&height=256`;
  // Chọn nghề random
  const job = randomArr(jobs);
  const workActs = [
    "Top 1", "Cày thuê", "AFK", "Bốc vác", "Fix module", "X2 Gỗ", "X19 Gỗ", "Kiếm sắt", "Giáp kim cương", "Đánh bại boss", "Chơi cả ngày", "Cày xuyên đêm", "Up story", "Dính drama"
  ];
  const act = randomArr(workActs);
  const money = Math.floor(Math.random() * 25000) + 1000;
  let userData = (await Currencies.getData(senderID)).data || {};
  let streak = userData.streak || 1;
  let level = userData.level || 1;
  let lastMoney = (await Currencies.getData(senderID)).money || 0;

  // Cộng tiền
  await Currencies.increaseMoney(senderID, money);

  // Lưu streak/profile đơn giản (nâng cấp thêm nhiều chỉ số nếu thích)
  userData.streak = streak + 1;
  userData.level = (level + (Math.random() > 0.75 ? 1 : 0));
  await Currencies.setData(senderID, { data: userData });

  // Chuẩn bị canvas
  const img = await makeWorkCanvas({
    name,
    avatarUrl,
    job,
    money: lastMoney + money,
    lastMoney,
    jobDesc: `Bạn vừa ${job.name} với kết quả: ${act}`,
    streak: userData.streak,
    level: userData.level,
    color: job.color
  });

  return api.sendMessage({
    body: `💸 Bạn vừa làm việc "${job.name}"!\n+${money}$\nTiền hiện tại: ${lastMoney + money}$\nStreak: ${userData.streak} ngày | Level: ${userData.level}`,
    attachment: img
  }, threadID, messageID);
};
