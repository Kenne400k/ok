const chalk = require("chalk");
const gradient = require("gradient-string");
const boxen = require("boxen");
const moment = require("moment-timezone");

module.exports.config = {
    name: "console",
    version: "2.1.0",
    hasPermssion: 3,
    credits: "JRT",
    description: "Console siêu đẹp, sinh động, chuyên nghiệp, branding Pcoder",
    commandCategory: "Hệ thống",
    usages: "console",
    cooldowns: 5
};

// Lấy thứ tiếng Việt
function getThuVN(date) {
    const d = moment.tz(date, "Asia/Ho_Chi_Minh").format("dddd");
    switch (d) {
        case "Monday": return "Thứ Hai";
        case "Tuesday": return "Thứ Ba";
        case "Wednesday": return "Thứ Tư";
        case "Thursday": return "Thứ Năm";
        case "Friday": return "Thứ Sáu";
        case "Saturday": return "Thứ Bảy";
        case "Sunday": return "Chủ Nhật";
        default: return d;
    }
}

// Gradient cho tag và footer
const tagGradient = gradient(["#00c3ff", "#ffff1c", "#ff4e62", "#00c3ff"]);
const footerGradient = gradient.rainbow;

// Random màu đậm tươi
function randomBrightColor() {
    const colors = [
        "#00eaff","#ff45c0","#ffe156","#ff5e62","#61e786","#5f5fff","#e85d04","#f72585","#560bad","#38b6ff"
    ];
    return colors[Math.floor(Math.random()*colors.length)];
}

module.exports.handleEvent = async function ({ api, event, Users }) {
    const { configPath } = global.client;
    const { DeveloperMode } = global.config;
    // Reload config mỗi khi event
    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    const modDev = config.DeveloperMode;
    if (this.config.credits !== "JRT") return;
    if (modDev === true) return;

    // Thông tin
    const now = moment.tz("Asia/Ho_Chi_Minh");
    const gio = now.format("D/MM/YYYY || HH:mm:ss");
    const thu = getThuVN(now);
    const msg = event.body || chalk.italic.gray("Ảnh, video hoặc ký tự đặc biệt");
    const threadInfo = await api.getThreadInfo(event.threadID);
    const threadName = threadInfo.threadName || "Tên đã bị gạch sổ";
    const name = await Users.getNameUser(event.senderID);

    // Các gradient/màu cho từng dòng
    const colorBox = randomBrightColor();
    const colorUser = randomBrightColor();
    const colorMsg = randomBrightColor();
    const colorTime = randomBrightColor();
    const colorThread = randomBrightColor();

    // Emoji sinh động
    const emojiBox = "💬";
    const emojiUser = "👤";
    const emojiMsg = "📝";
    const emojiTime = "🕒";
    const emojiThread = "🧩";
    const emojiPcoder = "🚀";

    // Nội dung hiển thị
    let content = [
        `${emojiThread}  ${chalk.hex(colorThread).bold("BOX:")}      ${tagGradient(threadName)}`,
        `${emojiUser}  ${chalk.hex(colorUser).bold("NAME:")}     ${gradient.instagram(name)}`,
        `${emojiMsg}  ${chalk.hex(colorMsg).bold("MESSAGE:")}  ${chalk.hex(colorMsg)(msg)}`,
        `${emojiTime}  ${chalk.hex(colorTime).bold("TIME:")}    ${chalk.hex(colorTime)(`${thu} || ${gio}`)}`
    ].join('\n');

    // Footer & Tag
    const footer = footerGradient(`${emojiPcoder}━━━━━━━━━━━━━| 𝐏𝐜𝐨𝐝𝐞𝐫 |━━━━━━━━━━━━━🚀`);
    const tag = tagGradient("★ Pcoder Console ★");

    // Tạo box siêu nổi bật
    const boxContent = boxen(content, {
        title: tag,
        titleAlignment: "center",
        padding: { top: 1, bottom: 1, left: 3, right: 3 },
        margin: { top: 1, bottom: 1 },
        borderStyle: "double",
        borderColor: "cyan",
        backgroundColor: "#1a1a1a"
    });

    // In ra console
    console.log(boxContent + "\n" + footer + "\n");
};

module.exports.run = async function ({ api, event }) {
    if (this.config.credits !== "JRT") {
        return api.sendMessage(`cre`, event.threadID, event.messageID);
    }
    const { configPath } = global.client;
    const { DeveloperMode } = global.config;
    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    const modDev = config.DeveloperMode;

    if (modDev === true) {
        api.sendMessage(`→ DeveloperMode: ${modDev}\n→ Vui lòng chỉnh về false để sử dụng!!!`, event.threadID);
    } else {
        api.sendMessage(`→ DeveloperMode: ${modDev}\n→ Console spcder đã sẵn sàng!`, event.threadID);
    }
};
