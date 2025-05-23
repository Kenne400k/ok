const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "masoi",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "D-Jukie convert Kb2aBot (refactor & pro-upgrade: pcoder)",
    description: "Game Ma Sói siêu xịn trên mirai - auto tạo module nếu thiếu, lưu trạng thái, hỗ trợ nhiều phòng, UX đẹp, hồi đáp chi tiết.",
    commandCategory: "Game",
    usages: "[create/start/join/leave/end/status/help]",
    cooldowns: 0
};

// ==== AUTO CREATE MODULE FOLDER/FILE IF NOT EXISTS ====
const masoiDir = path.join(__dirname, "masoi");
const gameManagerJs = path.join(masoiDir, "GameManager.js");
const indexJs = path.join(masoiDir, "index.js");

const defaultGameManager = `class GameManager {
    constructor(games = {}) {
        this.items = [];
        for (const name in games) {
            const game = games[name];
            game.name = (name === "masoi") ? "Ma Sói" : name;
            this.items.push(game);
        }
    }
    run(name, options) {
        const game = this.items.find(i => i.name.toLowerCase() === (name === "masoi" ? "ma sói" : name));
        if (game && typeof game.onCommand === "function") {
            game.onCommand(options);
        }
    }
}
module.exports = GameManager;
`;

const defaultIndex = `
// === Siêu game Ma Sói, lưu trạng thái nhiều phòng, UX đẹp ===
if (!global.masoiRooms) global.masoiRooms = {}; // {threadID: {...}}
const ROLES = ["Dân thường", "Ma sói", "Tiên tri", "Bảo vệ", "Thợ săn"];
const shuffle = arr => arr.sort(() => Math.random() - 0.5);
function getStatus(room) {
    if (!room) return "❌ Phòng chưa tạo.";
    let msg = "🦊 𝗠𝗔 𝗦𝗢́𝗜 - Trạng thái phòng:\n";
    msg += "🌐 Phòng ID: " + room.threadID + "\\n";
    msg += "👤 Chủ phòng: " + (room.hostName || "Ẩn danh") + "\\n";
    msg += "👥 Người chơi: " + room.players.map(u => u.name).join(", ") + "\\n";
    msg += "⏳ Giai đoạn: " + (room.started ? "Đang chơi" : "Chờ bắt đầu") + "\\n";
    return msg;
}
async function getName(api, id) {
    if(global.Users && typeof global.Users.getNameUser === "function") return await global.Users.getNameUser(id);
    return id;
}
module.exports = {
    name: "Ma Sói",
    // Người chơi: [{id, name, role, alive}]
    async onCommand({ masterID, threadID, param, isGroup }) {
        const api = global.api;
        // Tạo phòng
        if(param[0] === "create"){
            if (global.masoiRooms[threadID]) return api.sendMessage("❌ Phòng đã tồn tại!", threadID);
            let name = await getName(api, masterID);
            global.masoiRooms[threadID] = {
                threadID,
                hostID: masterID,
                hostName: name,
                players: [{id: masterID, name, alive: true}],
                started: false,
                night: false,
                log: [],
                roles: [],
                result: null
            };
            return api.sendMessage(\`🟢 Tạo phòng thành công! Chủ phòng: \${name}.\\nAi muốn tham gia hãy /masoi join\`, threadID);
        }
        // Tham gia
        if(param[0] === "join"){
            let room = global.masoiRooms[threadID];
            if(!room) return api.sendMessage("❌ Phòng chưa tạo. /masoi create", threadID);
            if(room.started) return api.sendMessage("❌ Ván chơi đã bắt đầu!", threadID);
            if(room.players.find(p=>p.id===masterID)) return api.sendMessage("Bạn đã tham gia rồi!", threadID);
            let name = await getName(api, masterID);
            room.players.push({id: masterID, name, alive:true});
            return api.sendMessage(\`✅ \${name} đã tham gia phòng!\`, threadID);
        }
        // Rời phòng
        if(param[0] === "leave"){
            let room = global.masoiRooms[threadID];
            if(!room) return api.sendMessage("❌ Phòng chưa tạo.", threadID);
            if(room.started) return api.sendMessage("❌ Không thể rời khi đã bắt đầu!", threadID);
            room.players = room.players.filter(p => p.id !== masterID);
            if(room.players.length === 0) delete global.masoiRooms[threadID];
            return api.sendMessage("🚪 Bạn đã rời phòng.", threadID);
        }
        // Danh sách/Trạng thái phòng
        if(param[0] === "status"){
            let room = global.masoiRooms[threadID];
            return api.sendMessage(getStatus(room), threadID);
        }
        // Bắt đầu
        if(param[0] === "start"){
            let room = global.masoiRooms[threadID];
            if(!room) return api.sendMessage("❌ Phòng chưa tạo.", threadID);
            if(room.hostID !== masterID) return api.sendMessage("⚠️ Chỉ chủ phòng mới được bắt đầu.", threadID);
            if(room.started) return api.sendMessage("❌ Ván chơi đã bắt đầu!", threadID);
            if(room.players.length < 4) return api.sendMessage("Cần ít nhất 4 người để chơi!", threadID);
            // Gán role ngẫu nhiên
            let roles = shuffle([
                ...Array(room.players.length-2).fill("Dân thường"),
                "Ma sói", "Tiên tri"
            ]);
            room.players.forEach((p,i)=>{p.role=roles[i];p.alive=true;});
            room.started = true; room.night = false; room.log = [];
            // Thông báo role riêng
            for(const player of room.players) {
                api.sendMessage(\`🎭 Vai trò của bạn: \${player.role}\`, player.id);
            }
            api.sendMessage("🎲 Ván chơi bắt đầu! Đêm đầu tiên sẽ tới sau 10s.", threadID);
            setTimeout(()=>this.nextNight(threadID, api), 10000);
            return;
        }
        // End game
        if(param[0] === "end"){
            let room = global.masoiRooms[threadID];
            if(!room) return api.sendMessage("❌ Phòng chưa tạo.", threadID);
            if(room.hostID !== masterID) return api.sendMessage("⚠️ Chỉ chủ phòng được kết thúc!", threadID);
            delete global.masoiRooms[threadID];
            return api.sendMessage("🛑 Game đã kết thúc.", threadID);
        }
        // Help
        if(param[0] === "help" || !param[0]){
            return api.sendMessage(
\`=== 🐺 𝗠𝗔 𝗦𝗢́𝗜 𝗠𝗜𝗥𝗔𝗜 - Lệnh hỗ trợ ===

• /masoi create - Tạo phòng mới
• /masoi join   - Tham gia phòng
• /masoi leave  - Rời phòng
• /masoi start  - Chủ phòng bắt đầu
• /masoi status - Xem trạng thái phòng
• /masoi end    - Chủ phòng kết thúc game
• /masoi help   - Hướng dẫn

⚡ 4+ người để chơi. Game hỗ trợ nhiều phòng (nhiều nhóm).
Khi bắt đầu, bot sẽ gửi vai trò riêng cho từng người.
Vòng chơi tự động chuyển ngày/đêm, vote loại, v.v. (bản nâng cấp tiếp).
\`, threadID);
        }
        return api.sendMessage("❓ Không rõ lệnh, dùng /masoi help", threadID);
    },
    // Tự động sang đêm
    async nextNight(threadID, api){
        let room = global.masoiRooms[threadID];
        if(!room || !room.started) return;
        room.night = true;
        api.sendMessage("🌙 Đêm xuống. Ma sói hãy nhắn tin cho bot để chọn ai bị cắn!", threadID);
        // (Bạn có thể mở rộng xử lý DM với sói, tiên tri, bảo vệ ...)
        setTimeout(()=>this.nextDay(threadID, api), 20000);
    },
    async nextDay(threadID, api){
        let room = global.masoiRooms[threadID];
        if(!room || !room.started) return;
        room.night = false;
        api.sendMessage("🌞 Trời sáng rồi! Mọi người hãy thảo luận và vote loại ai là sói.", threadID);
        // (Bạn có thể mở rộng xử lý vote, check win ...)
        // Chuyển lại đêm sau 30s
        setTimeout(()=>this.nextNight(threadID, api), 30000);
    },
    // Nhận message trong game
    onMessage(event, reply){
        let room = global.masoiRooms[event.threadID];
        if(!room || !room.started) return;
        // Ma sói nhắn tin riêng
        let player = room.players.find(p=>p.id===event.senderID);
        if(!player || !player.alive) return;
        if(room.night && player.role === "Ma sói"){
            reply("🐺 Bạn là Ma sói, hãy chọn người để cắn (tính năng nâng cao)!");
            // (Bổ sung xử lý cắn người chơi ở đây)
        }
        // Có thể mở rộng chat tự do ban ngày
    }
};
`;

// Đảm bảo module masoi tồn tại đầy đủ
function ensureMasoiModule() {
    if (!fs.existsSync(masoiDir)) fs.mkdirSync(masoiDir, { recursive: true });
    if (!fs.existsSync(gameManagerJs)) fs.writeFileSync(gameManagerJs, defaultGameManager, "utf8");
    if (!fs.existsSync(indexJs)) fs.writeFileSync(indexJs, defaultIndex, "utf8");
}
ensureMasoiModule();

module.exports.onLoad = async () => {
    try {
        ensureMasoiModule();
        const GameManager = require('./masoi/GameManager');
        const loader = () => {
            var exportData = {};
            exportData['masoi'] = require('./masoi/index');
            return exportData;
        };
        var gameManager = new GameManager(loader());
        global.gameManager = gameManager;
    }
    catch(e) {console.log(e);}
}

module.exports.handleEvent = async function({ api, event }) {
    const reply = function(message) {
        return api.sendMessage(message, event.threadID, event.messageID);
    }
    if(!global.gameManager || !global.gameManager.items.some(i => i.name == "Ma Sói")) return;
    for (const game of global.gameManager.items) {
        if(!game.participants && !global.masoiRooms) continue;
        // Nhiều phòng: lấy room đúng thread
        if (global.masoiRooms && global.masoiRooms[event.threadID]) {
            game.onMessage(event, reply);
        }
    }
}
module.exports.run = async ({ event, args, Users }) => {
    global.Users = Users;
    if (typeof global.api === "undefined") global.api = {
        sendMessage: (...p) => {}
    }; // patch khi chạy test ngoài
    if(!global.gameManager) return global.api.sendMessage("❌ Lỗi load game Ma Sói!", event.threadID, event.messageID);
    global.gameManager.run(module.exports.config.name, {
        masterID: event.senderID,
        threadID: event.threadID,
        param: args,
        isGroup: event.isGroup
    });
}
