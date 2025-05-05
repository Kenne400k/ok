const fs = require("fs");
const path = require("path");
const axios = require('axios');

module.exports.config = {
    name: "farm",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Gojo",
    description: "Trồng cây và chăn nuôi",
    commandCategory: "Game",
    usages: "[trong/thuhoach/choan/info/kho/shop/sell/level/bonphan]",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 300000
    }
};
// Tạo và lưu data
let plantSchema = {};
let cooldowns = {};
let playerData = {};
let cooperatives = {};

const dataPath = path.join(__dirname, "game", "farmData.json");
if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    plantSchema = data.plantSchema || {};
    cooldowns = data.cooldowns || {};
    playerData = data.playerData || {};
    cooperatives = data.cooperatives || {};
}

function saveData() {
    const data = { plantSchema, cooldowns, playerData, cooperatives };
    fs.writeFileSync(dataPath, JSON.stringify(data), "utf8");
}
async function getUserName(api, userID) {
    try {
        const userInfo = await api.getUserInfo(userID);
        return userInfo[userID].name;
    } catch (error) {
        console.error(`Error getting user name for ${userID}:`, error);
        return userID; // Trả về ID nếu không lấy được tên
    }
};
const CROPS = {
    "ot": { emoji: "🌶️", name: "Ớt", growTime: 1200000, yield: [2, 6], price: 500, exp: 15 },
    "ngo": { emoji: "🌽", name: "Ngô", growTime: 1200000, yield: [2, 6], price: 500, exp: 15 },
    "khoaitay": { emoji: "🥔", name: "Khoai tây", growTime: 1800000, yield: [2, 5], price: 750, exp: 30 },
    "caingot": { emoji: "🥬", name: "Cải ngọt", growTime: 1800000, yield: [2, 5], price: 750, exp: 30 },
    "dautay": { emoji: "🍓", name: "Dâu tây", growTime: 3600000, yield: [2, 4], price: 1000, exp: 50 },
    "dao": { emoji: "🍑", name: "Đào", growTime: 3600000, yield: [2, 4], price: 1000, exp: 55 },
    "duagang": { emoji: "🍈", name: "Dưa gang", growTime: 10800000, yield: [2, 3], price: 1250, exp: 100 }

};

const ANIMALS = {
    "ga": { emoji: "🐔", name: "Gà", feedTime: 3600000, feedCost: 200, product: "trung", productName: "Trứng", productEmoji: "🥚", productAmount: [2, 5], price: 180, exp: 30 },
    "ong": { emoji: "🐝", name: "Ong", feedTime: 3600000, feedCost: 200, product: "mat", productName: "Mật", productEmoji: "🍯", productAmount: [2, 5], price: 180, exp: 30 },
    "bo": { emoji: "🐄", name: "Bò", feedTime: 7200000, feedCost: 500, product: "sua", productName: "Sữa", productEmoji: "🥛", productAmount: [2, 4], price: 400, exp: 60 },
    "cuu": { emoji: "🐏", name: "Cừu", feedTime: 7200000, feedCost: 500, product: "long", productName: "Lông", productEmoji: "🐑", productAmount: [2, 4], price: 400, exp: 60 },
    "heo": { emoji: "🐷", name: "Heo", feedTime: 18000000, feedCost: 1000, product: "thit", productName: "Thịt", productEmoji: "🥩", productAmount: [1, 3], price: 800, exp: 100 },
};

const FERTILIZERS = {
    "npk": { name: "NPK", emoji: "🧪", price: 300, timeReduction: 0.2, yieldIncrease: 0.3 },
    "organic": { name: "Phân hữu cơ", emoji: "🍂", price: 400, timeReduction: 0.1, yieldIncrease: 0.2 },
    "super": { name: "Siêu phân bón", emoji: "⚡", price: 500, timeReduction: 0.3, yieldIncrease: 0.5 }
};
const TITLES = {
    1: "Nông dân tập sự 🌱",
    3: "Người làm vườn tài tử 🏡",
    5: "Nông dân chăm chỉ 🚜",
    7: "Người trồng cây熱心 🌳",
    10: "Nông dân lành nghề 🌾",
    13: "Chuyên gia canh tác 🌿",
    15: "Bậc thầy thu hoạch 🧺",
    17: "Nhà nông học 📚",
    20: "Vua của mùa màng 👑",
    23: "Người thuần hóa đất 🏞️",
    25: "Huyền thoại nông trại 🌟",
    27: "Phù thủy mùa màng 🧙‍♂️",
    30: "Á thần nông nghiệp 🏆",
    33: "Người cai quản thiên nhiên 🌍",
    35: "Bậc thầy sinh thái 🍃",
    37: "Kiến trúc sư của đồng ruộng 🏛️",
    40: "Đại sứ của mẹ thiên nhiên 🌺",
    43: "Người điều khiển thời tiết ☀️🌧️",
    45: "Thần nông tái sinh 🔄",
    47: "Người nắm giữ bí mật cổ xưa 📜",
    50: "Thần nông tối thượng 🌈",
    55: "Người cai quản vũ trụ xanh 🌌",
    60: "Đấng tạo hóa của thế giới thực vật 🌎",
    65: "Hóa thân của mẹ thiên nhiên 🌻",
    70: "Người kiến tạo sự sống 🧬",
    75: "Thần nông vượt thời gian ⏳",
    80: "Đấng tối cao của muôn loài thực vật 🌺🌳🍄",
    90: "Người nắm giữ chìa khóa của Eden 🔑🏞️",
    100: "Thần nông bất tử 🕊️✨"
};

const COOPERATIVE_LEVELS = {
    1: { maxMembers: 5, bonusYield: 1.05, bonusExp: 1.05, contributionRequired: 1000 },
    2: { maxMembers: 10, bonusYield: 1.1, bonusExp: 1.1, contributionRequired: 5000 },
    3: { maxMembers: 20, bonusYield: 1.15, bonusExp: 1.15, contributionRequired: 10000 },
    4: { maxMembers: 30, bonusYield: 1.2, bonusExp: 1.2, contributionRequired: 20000 },
    5: { maxMembers: 50, bonusYield: 1.25, bonusExp: 1.25, contributionRequired: 50000 }
};
////// LẤY THÔNG TIN DANH HIỆU//////
function getTitle(level) {
    let highestTitle = "Nông dân tập sự 🌱";
    let nextTitle = null;
    let nextTitleLevel = Infinity;

    for (let titleLevel in TITLES) {
        titleLevel = parseInt(titleLevel);
        if (level >= titleLevel) {
            highestTitle = TITLES[titleLevel];
        } else if (titleLevel > level && titleLevel < nextTitleLevel) {
            nextTitle = TITLES[titleLevel];
            nextTitleLevel = titleLevel;
            break;
        }
    }

    return { currentTitle: highestTitle, nextTitle, nextTitleLevel };
}
//// TẠO DATA HTX////////
function getCooperative(threadID) {
    if (!cooperatives[threadID]) {
        cooperatives[threadID] = {
            name: "",  // Sẽ được cập nhật sau
            level: 1,
            members: [],
            totalContribution: 0,
            weeklyContribution: {}
        };
    }
    return cooperatives[threadID];
}
///////////////////////CODE HTX////////////////////
// Update data HTX
async function updateCooperativeInfo(api, threadID) {
    const threadInfo = await api.getThreadInfo(threadID);
    const coop = getCooperative(threadID);
    coop.name = threadInfo.threadName;
    // Cập nhật thông tin thành viên và chức vụ
    coop.members = threadInfo.participantIDs.map(id => ({
        id: id,
        name: threadInfo.userInfo[id]?.name || "Unknown",
        role: threadInfo.adminIDs.includes(id) ? "Quản lý" : "Thành viên"
    }));
    if (threadInfo.adminIDs.includes(api.getCurrentUserID())) {
        coop.members.find(m => m.id === api.getCurrentUserID()).role = "Chủ tịch HTX";
    }
    saveData();
}
// HTX info
async function showCooperativeInfo(api, threadID) {
    await updateCooperativeInfo(api, threadID);
    const coop = getCooperative(threadID);
    let info = `
🏘️ Hợp tác xã: ${coop.name}
👥 Số thành viên: ${coop.members.length}/${COOPERATIVE_LEVELS[coop.level].maxMembers}
🏆 Cấp độ: ${coop.level}
💰 Tổng đóng góp: ${coop.totalContribution} xu
🌾 Hệ số sản lượng: x${COOPERATIVE_LEVELS[coop.level].bonusYield}
✨ Hệ số kinh nghiệm: x${COOPERATIVE_LEVELS[coop.level].bonusExp}

🔜 Cấp độ tiếp theo: ${coop.level < 5 ? `${COOPERATIVE_LEVELS[coop.level + 1].contributionRequired - coop.totalContribution} xu nữa` : 'Đã đạt cấp độ tối đa'}
    `;
    api.sendMessage(info, threadID);
}
// HTX donate
async function donateToCooperative(api, threadID, uid, amount, Currencies) {
    amount = parseInt(amount);
    if (isNaN(amount) || amount <= 0) {
        return api.sendMessage("Số tiền đóng góp không hợp lệ!", threadID);
    }

    const userMoney = await Currencies.getData(uid);
    if (userMoney.money < amount) {
        return api.sendMessage(`Bạn không đủ tiền để đóng góp ${amount} xu.`, threadID);
    }

    await Currencies.decreaseMoney(uid, amount);
    
    const coop = getCooperative(threadID);
    coop.totalContribution += amount;
    if (!coop.weeklyContribution[uid]) {
        coop.weeklyContribution[uid] = 0;
    }
    coop.weeklyContribution[uid] += amount;

    if (!coop.members.some(m => m.id === uid)) {
        const threadInfo = await api.getThreadInfo(threadID);
        const userName = threadInfo.userInfo[uid]?.name || "Unknown";
        const userRole = threadInfo.adminIDs.includes(uid) ? "Quản lý" : "Thành viên";
        coop.members.push({ id: uid, name: userName, role: userRole });
    }

    saveData();
       api.sendMessage(`Bạn đã đóng góp ${amount} xu cho Hợp tác xã ${coop.name}. Cảm ơn bạn!`, threadID);
    checkCooperativeUpgrade(api, threadID);
}
// Check exp HTX
function checkCooperativeUpgrade(api, threadID) {
    const coop = getCooperative(threadID);
    const nextLevel = coop.level + 1;
    if (COOPERATIVE_LEVELS[nextLevel] && 
        coop.totalContribution >= COOPERATIVE_LEVELS[nextLevel].contributionRequired) {
        coop.level = nextLevel;
        saveData();
        api.sendMessage(`🎉 Chúc mừng! Hợp tác xã ${coop.name} đã tự động nâng cấp lên cấp độ ${nextLevel}!`, threadID);
    }
}
//BONUS HTX
function getCooperativeBonus(threadID) {
    const coop = getCooperative(threadID);
    return {
        yieldBonus: COOPERATIVE_LEVELS[coop.level].bonusYield,
        expBonus: COOPERATIVE_LEVELS[coop.level].bonusExp
    };
}
//////////////////////////CODE BXH//////////////////////
//BXH HTX
async function showCooperativeLeaderboard(api, Users) {
    const sortedCooperatives = Object.entries(cooperatives)
        .sort(([, a], [, b]) => b.totalContribution - a.totalContribution)
        .slice(0, 10); // Lấy top 10

    let leaderboardMsg = "🏆 Bảng Xếp Hạng Hợp Tác Xã 🏆\n\n";

    for (let i = 0; i < sortedCooperatives.length; i++) {
        const [threadID, coop] = sortedCooperatives[i];
        const owner = await Users.getNameUser(coop.members.find(m => m.role === "Chủ tịch HTX").id);
        leaderboardMsg += `${i + 1}. ${coop.name}\n   🏆 Cấp độ: ${coop.level} | 💰 Tổng đóng góp: ${coop.totalContribution}\n   👑 Chủ tịch: ${owner}\n`;
    }

    for (let threadID of sortedCooperatives.map(([threadID]) => threadID)) {
        api.sendMessage(leaderboardMsg, threadID);
    }
}
//BXH FARM
async function showLeaderboard(api, threadID, Users) {
    const sortedPlayers = Object.entries(playerData)
        .sort(([, a], [, b]) => b.exp - a.exp)
        .slice(0, 10); // Lấy top 10

    let leaderboardMsg = "🏆 Bảng Xếp Hạng Cá Nhân 🏆\n\n";

    for (let i = 0; i < sortedPlayers.length; i++) {
        const [uid, data] = sortedPlayers[i];
        const name = await Users.getNameUser(uid);
        const { currentTitle } = getTitle(data.level);
        leaderboardMsg += `${i + 1}. ${name} - ${currentTitle}\n   💪 Level: ${data.level} | ✨ EXP: ${data.exp}\n`;
    }

    leaderboardMsg += "\n💡 Gõ 'farm level' để xem thông tin chi tiết của bạn!";

    api.sendMessage(leaderboardMsg, threadID);
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours} giờ ${minutes % 60} phút`;
    } else if (minutes > 0) {
        return `${minutes} phút`;
    } else {
        return `${seconds} giây`;
    }
}

function calculateLevel(exp) {
    return Math.floor(Math.sqrt(exp / 100)) + 1;
}
// TRỒNG CÂY
async function plantCrop(api, threadID, uid, cropName, Currencies) {
    if (!CROPS[cropName]) {
        return api.sendMessage("🚫 Cây trồng không hợp lệ! Vui lòng kiểm tra lại tên cây.", threadID);
    }
    
    if (!playerData[uid]) {
        playerData[uid] = { exp: 0, level: 1 };
    }
    const maxCrops = playerData[uid].level * 2;
    const currentCrops = Object.keys(plantSchema[uid] || {}).length;

    if (currentCrops >= maxCrops) {
        return api.sendMessage(`🚫 Bạn đã đạt giới hạn cây trồng cho level hiện tại. Hãy thu hoạch hoặc nâng cấp để trồng thêm!`, threadID);
    }

    if (plantSchema[uid] && plantSchema[uid][cropName]) {
        return api.sendMessage(`🌱 Bạn đã trồng ${CROPS[cropName].emoji} ${CROPS[cropName].name} rồi! Hãy đợi nó lớn lên nhé.`, threadID);
    }
    
    const userMoney = await Currencies.getData(uid);
    const cropPrice = CROPS[cropName].price;
    
    if (userMoney.money < cropPrice) {
        return api.sendMessage(`💰 Bạn không đủ tiền để mua hạt giống ${CROPS[cropName].emoji} ${CROPS[cropName].name}.\n🪙 Giá: ${cropPrice} xu\n💸 Số dư của bạn: ${userMoney.money} xu`, threadID);
    }
    
    await Currencies.decreaseMoney(uid, cropPrice);
    if (!plantSchema[uid]) plantSchema[uid] = {};
    plantSchema[uid][cropName] = { 
        plantedTime: Date.now(),
        fertilizer: null
    };

    const bonus = getCooperativeBonus(threadID);
    const [minYield, maxYield] = CROPS[cropName].yield;
    const adjustedMinYield = Math.floor(minYield * bonus.yieldBonus);
    const adjustedMaxYield = Math.floor(maxYield * bonus.yieldBonus);
    const avgYield = (adjustedMinYield + adjustedMaxYield) / 2;
    const adjustedExp = Math.floor(CROPS[cropName].exp * avgYield * bonus.expBonus);

    saveData();
    api.sendMessage(`
🌱 Trồng cây thành công!
${CROPS[cropName].emoji} Cây: ${CROPS[cropName].name}
💰 Chi phí: ${cropPrice} xu
⏳ Thời gian thu hoạch: ${formatTime(CROPS[cropName].growTime)}
📦 Sản lượng dự kiến: ${adjustedMinYield} - ${adjustedMaxYield} (Hệ số HTX: x${bonus.yieldBonus.toFixed(2)})
✨ EXP dự kiến: ${adjustedExp} (Hệ số HTX: x${bonus.expBonus.toFixed(2)})
💡 Mẹo: Sử dụng phân bón để tăng tốc sinh trưởng và sản lượng!
    `, threadID);
}
// TRỒNG NHANH
async function plantAllCrops(api, threadID, uid, Currencies) {
    if (!playerData[uid]) {
        playerData[uid] = { exp: 0, level: 1 };
    }
    
    const maxCrops = playerData[uid].level * 2;
    const currentCrops = Object.keys(plantSchema[uid] || {}).length;
    const availableSlots = maxCrops - currentCrops;

    if (availableSlots <= 0) {
        return api.sendMessage(`🚫 Bạn đã đạt giới hạn cây trồng cho level hiện tại. Hãy thu hoạch hoặc nâng cấp để trồng thêm!`, threadID);
    }

    const userMoney = await Currencies.getData(uid);
    let totalCost = 0;
    let cropsToPlant = [];

    for (let cropName in CROPS) {
        if (!plantSchema[uid] || !plantSchema[uid][cropName]) {
            if (userMoney.money >= CROPS[cropName].price + totalCost) {
                cropsToPlant.push(cropName);
                totalCost += CROPS[cropName].price;
                if (cropsToPlant.length >= availableSlots) break;
            }
        }
    }

    if (cropsToPlant.length === 0) {
        return api.sendMessage(`💰 Bạn không đủ tiền để trồng thêm cây nào.`, threadID);
    }

    await Currencies.decreaseMoney(uid, totalCost);
    if (!plantSchema[uid]) plantSchema[uid] = {};

    const bonus = getCooperativeBonus(threadID);

    let plantedMessage = `🌱 Đã trồng thành công ${cropsToPlant.length} loại cây:\n`;
    for (let crop of cropsToPlant) {
        plantSchema[uid][crop] = { 
            plantedTime: Date.now(),
            fertilizer: null
        };
        const [minYield, maxYield] = CROPS[crop].yield;
        const adjustedMinYield = Math.floor(minYield * bonus.yieldBonus);
        const adjustedMaxYield = Math.floor(maxYield * bonus.yieldBonus);
        const avgYield = (adjustedMinYield + adjustedMaxYield) / 2;
        const adjustedExp = Math.floor(CROPS[crop].exp * avgYield * bonus.expBonus);
        plantedMessage += `${CROPS[crop].emoji} ${CROPS[crop].name} (Sản lượng dự kiến: ${adjustedMinYield} - ${adjustedMaxYield}, EXP dự kiến: ${adjustedExp})\n`;
    }

    plantedMessage += `\n💰 Tổng chi phí: ${totalCost} xu`;
    plantedMessage += `\n⏳ Kiểm tra thời gian thu hoạch bằng lệnh 'farm info'`;

    saveData();
    api.sendMessage(plantedMessage, threadID);
}
// THU HOẠCH
function harvestCrop(api, threadID, uid, cropName) {
    if (!plantSchema[uid] || !plantSchema[uid][cropName]) return api.sendMessage(`🚫 Bạn chưa trồng ${CROPS[cropName].emoji} ${CROPS[cropName].name}!`, threadID);
    
    const now = Date.now();
    const crop = plantSchema[uid][cropName];
    const fertilizer = crop.fertilizer ? FERTILIZERS[crop.fertilizer] : null;

    let harvestTime = CROPS[cropName].growTime;
    let [minYield, maxYield] = CROPS[cropName].yield;

    if (fertilizer) {
        harvestTime *= (1 - fertilizer.timeReduction);
        minYield = Math.floor(minYield * (1 + fertilizer.yieldIncrease));
        maxYield = Math.floor(maxYield * (1 + fertilizer.yieldIncrease));
    }

    if (now - crop.plantedTime < harvestTime) {
        const timeLeft = harvestTime - (now - crop.plantedTime);
        return api.sendMessage(`
⏳ ${CROPS[cropName].emoji} ${CROPS[cropName].name} chưa sẵn sàng để thu hoạch!
⌛ Thời gian còn lại: ${formatTime(timeLeft)}
        `, threadID);
    }
    
    if (!plantSchema[uid].inventory) plantSchema[uid].inventory = {};
    if (!plantSchema[uid].inventory[cropName]) plantSchema[uid].inventory[cropName] = 0;

    const randomYield = Math.floor(Math.random() * (maxYield - minYield + 1)) + minYield;
    plantSchema[uid].inventory[cropName] += randomYield;
    delete plantSchema[uid][cropName];

    const expGain = CROPS[cropName].exp * randomYield;
    const bonus = getCooperativeBonus(threadID);
    const adjustedExp = Math.floor(expGain * bonus.expBonus);
    const levelUpMessage = updateExpAndLevel(uid, adjustedExp);

    saveData();
    let message = `
🎉 Thu hoạch thành công!
${CROPS[cropName].emoji} Cây: ${CROPS[cropName].name}
📦 Số lượng: ${randomYield}
💼 Đã thêm vào kho của bạn.
📊 EXP nhận được: ${adjustedExp}
    `;

    if (levelUpMessage) {
        message += levelUpMessage;
    }

    api.sendMessage(message, threadID);
}
//THU HOẠCH ALL
function harvestAllCrops(api, threadID, uid) {
    if (!plantSchema[uid]) {
        return api.sendMessage("Bạn chưa trồng cây nào cả!", threadID);
    }

    let harvestedCrops = [];
    let totalExp = 0;

    for (let cropName in plantSchema[uid]) {
        if (CROPS[cropName]) {
            const crop = plantSchema[uid][cropName];
            const fertilizer = crop.fertilizer ? FERTILIZERS[crop.fertilizer] : null;
            let growTime = CROPS[cropName].growTime;
            let [minYield, maxYield] = CROPS[cropName].yield;

            if (fertilizer) {
                growTime *= (1 - fertilizer.timeReduction);
                minYield = Math.floor(minYield * (1 + fertilizer.yieldIncrease));
                maxYield = Math.floor(maxYield * (1 + fertilizer.yieldIncrease));
            }

            if (Date.now() - crop.plantedTime >= growTime) {
                if (!plantSchema[uid].inventory) plantSchema[uid].inventory = {};
                if (!plantSchema[uid].inventory[cropName]) plantSchema[uid].inventory[cropName] = 0;

                const randomYield = Math.floor(Math.random() * (maxYield - minYield + 1)) + minYield;
                plantSchema[uid].inventory[cropName] += randomYield;

                const expGain = CROPS[cropName].exp * randomYield;
                const bonus = getCooperativeBonus(threadID);
                const adjustedExp = Math.floor(expGain * bonus.expBonus);
                totalExp += adjustedExp;

                harvestedCrops.push(`${CROPS[cropName].emoji} ${CROPS[cropName].name}: ${randomYield}`);
                delete plantSchema[uid][cropName];
            }
        }
    }

    if (harvestedCrops.length === 0) {
        return api.sendMessage("Không có cây nào sẵn sàng để thu hoạch!", threadID);
    }

    const levelUpMessage = updateExpAndLevel(uid, totalExp);

    let message = `
🎉 Thu hoạch thành công!
${harvestedCrops.join("\n")}

📊 EXP nhận được: ${totalExp}
    `;

    if (levelUpMessage) {
        message += `\n${levelUpMessage}`;
    }

    saveData();
    api.sendMessage(message, threadID);
}
// CHO ĐỘNG VẬT ĂN
async function feedAnimal(api, threadID, uid, animalName, Currencies) {
    if (!ANIMALS[animalName]) return api.sendMessage("🚫 Động vật không hợp lệ! Vui lòng kiểm tra lại tên động vật.", threadID);
    
    const now = Date.now();
    if (cooldowns[uid] && cooldowns[uid][animalName] && now - cooldowns[uid][animalName] < ANIMALS[animalName].feedTime) {
        const timeLeft = ANIMALS[animalName].feedTime - (now - cooldowns[uid][animalName]);
        return api.sendMessage(`
⏳ ${ANIMALS[animalName].emoji} ${ANIMALS[animalName].name} chưa đói!
⌛ Thời gian chờ: ${formatTime(timeLeft)}
        `, threadID);
    }
    
    const feedCost = ANIMALS[animalName].feedCost;
    const userMoney = await Currencies.getData(uid);
    
    if (userMoney.money < feedCost) {
        return api.sendMessage(`
💰 Bạn không đủ tiền để cho ${ANIMALS[animalName].emoji} ${ANIMALS[animalName].name} ăn.
🪙 Chi phí: ${feedCost} xu
💸 Số dư của bạn: ${userMoney.money} xu
        `, threadID);
    }
    
    await Currencies.decreaseMoney(uid, feedCost);
    if (!cooldowns[uid]) cooldowns[uid] = {};
    cooldowns[uid][animalName] = now;
    if (!plantSchema[uid]) plantSchema[uid] = {};
    if (!plantSchema[uid].inventory) plantSchema[uid].inventory = {};
    const productKey = ANIMALS[animalName].product;

    const [minProduct, maxProduct] = ANIMALS[animalName].productAmount;
    const randomProduct = Math.floor(Math.random() * (maxProduct - minProduct + 1)) + minProduct;

    if (!plantSchema[uid].inventory[productKey]) plantSchema[uid].inventory[productKey] = 0;
    plantSchema[uid].inventory[productKey] += randomProduct;

    const expGain = ANIMALS[animalName].exp * randomProduct;
    const bonus = getCooperativeBonus(threadID);
    const adjustedExp = Math.floor(expGain * bonus.expBonus);
    const levelUp = updateExpAndLevel(uid, adjustedExp);

    saveData();
    let message = `
🍽️ Cho ăn thành công!
${ANIMALS[animalName].emoji} Động vật: ${ANIMALS[animalName].name}
${ANIMALS[animalName].productEmoji} Nhận được: ${randomProduct} ${ANIMALS[animalName].productName}
💰 Chi phí: ${feedCost} xu
⏳ Thời gian chờ tiếp theo: ${formatTime(ANIMALS[animalName].feedTime)}
📊 EXP nhận được: ${adjustedExp}
    `;

    if (levelUp) {
        message += `\n🎊 Chúc mừng! Bạn đã lên level ${playerData[uid].level}!`;
    }

    api.sendMessage(message, threadID);
}
// CHO AN NHANH
async function feedAllAnimals(api, threadID, uid, Currencies) {
    if (!playerData[uid]) {
        playerData[uid] = { exp: 0, level: 1 };
    }

    const now = Date.now();
    let fedAnimals = [];
    let totalExp = 0;
    let totalFeedCost = 0;

    for (let animalName in ANIMALS) {
        if (!cooldowns[uid] || !cooldowns[uid][animalName] || now - cooldowns[uid][animalName] >= ANIMALS[animalName].feedTime) {
            const feedCost = ANIMALS[animalName].feedCost;
            totalFeedCost += feedCost;

            if (!cooldowns[uid]) cooldowns[uid] = {};
            cooldowns[uid][animalName] = now;
            if (!plantSchema[uid]) plantSchema[uid] = {};
            if (!plantSchema[uid].inventory) plantSchema[uid].inventory = {};
            const productKey = ANIMALS[animalName].product;

            const [minProduct, maxProduct] = ANIMALS[animalName].productAmount;
            const randomProduct = Math.floor(Math.random() * (maxProduct - minProduct + 1)) + minProduct;

            if (!plantSchema[uid].inventory[productKey]) plantSchema[uid].inventory[productKey] = 0;
            plantSchema[uid].inventory[productKey] += randomProduct;

            const expGain = ANIMALS[animalName].exp * randomProduct;
            const bonus = getCooperativeBonus(threadID);
            const adjustedExp = Math.floor(expGain * bonus.expBonus);
            totalExp += adjustedExp;

            fedAnimals.push(`${ANIMALS[animalName].emoji} ${ANIMALS[animalName].name}: ${randomProduct} ${ANIMALS[animalName].productName}`);
        }
    }

    if (fedAnimals.length === 0) {
        return api.sendMessage("Tất cả động vật đã được cho ăn!", threadID);
    }

    const userMoney = await Currencies.getData(uid);
    if (userMoney.money < totalFeedCost) {
        return api.sendMessage(`
💰 Bạn không đủ tiền để cho tất cả động vật ăn.
🪙 Chi phí: ${totalFeedCost} xu
💸 Số dư của bạn: ${userMoney.money} xu
        `, threadID);
    }

    await Currencies.decreaseMoney(uid, totalFeedCost);
    const levelUpMessage = updateExpAndLevel(uid, totalExp);

    let message = `
🍽️ Cho ăn thành công!
${fedAnimals.join("\n")}

💰 Tổng chi phí: ${totalFeedCost} xu
📊 EXP nhận được: ${totalExp}
    `;

    if (levelUpMessage) {
        message += `\n${levelUpMessage}`;
    }

    saveData();
    api.sendMessage(message, threadID);
}

// INFO TRANG TRẠI
function showField(api, threadID, uid) {
    let fieldStatus = "🏡 Trang trại của bạn:\n---------------\n";
    fieldStatus += "🌱 Cây trồng:\n";
    for (let crop in plantSchema[uid]) {
        if (CROPS[crop]) {
            const plantedCrop = plantSchema[uid][crop];
            const fertilizer = plantedCrop.fertilizer ? FERTILIZERS[plantedCrop.fertilizer] : null;
            let growTime = CROPS[crop].growTime;
            if (fertilizer) {
                growTime *= (1 - fertilizer.timeReduction);
            }
            const timeLeft = growTime - (Date.now() - plantedCrop.plantedTime);
            fieldStatus += `${CROPS[crop].emoji} ${CROPS[crop].name}: ${timeLeft > 0 ? formatTime(timeLeft) : "✅ Sẵn sàng thu hoạch!"}`;
            if (fertilizer) {
                fieldStatus += ` (${fertilizer.emoji})`;
            }
            fieldStatus += '\n';
        }
    }
    fieldStatus += "---------------\n";
    fieldStatus += "🐾 Động vật:\n";
    for (let animal in ANIMALS) {
        const timeLeft = ANIMALS[animal].feedTime - (Date.now() - (cooldowns[uid]?.[animal] || 0));
        fieldStatus += `${ANIMALS[animal].emoji} ${ANIMALS[animal].name}: ${timeLeft > 0 ? formatTime(timeLeft) : "🍽️ Cần cho ăn!"}\n`;
    }

    const level = playerData[uid]?.level || 1;
    const exp = playerData[uid]?.exp || 0;
    const nextLevelExp = (level * level * 100);
    const progressToNextLevel = Math.floor((exp / nextLevelExp) * 100);

    fieldStatus += `\n---------------\n`;
    fieldStatus += `📊 Level: ${level}\n`;
    fieldStatus += `📈 EXP: ${exp}/${nextLevelExp} (${progressToNextLevel}%)\n`;
    fieldStatus += `🌱 Số cây đang trồng: ${Object.keys(plantSchema[uid] || {}).length}/${level * 2}\n`;

    api.sendMessage(fieldStatus, threadID);
}
// KHO
async function showInventory(api, threadID, uid, Currencies) {
    if (!plantSchema[uid]?.inventory) plantSchema[uid].inventory = {};
    let inv = "💼 Kho của bạn:\n---------------\n";
    inv += "🌾 Nông sản:\n";
    for (let item in plantSchema[uid].inventory) {
        const cropInfo = CROPS[item];
        if (cropInfo) {
            inv += `${cropInfo.emoji} ${cropInfo.name}: ${plantSchema[uid].inventory[item]}\n`;
        }
    }
    inv += "---------------\n";
    inv += "🥚 Sản phẩm động vật:\n";
    for (let item in plantSchema[uid].inventory) {
        const animalInfo = Object.values(ANIMALS).find(animal => animal.product === item);
        if (animalInfo) {
            inv += `${animalInfo.productEmoji} ${animalInfo.productName}: ${plantSchema[uid].inventory[item]}\n`;
        }
    }
    const userMoney = await Currencies.getData(uid);
    inv += `\n💰 Số tiền: ${userMoney.money} xu`;
    api.sendMessage(inv, threadID);
}
// SHOP00
function showShop(api, threadID) {
    let shopList = "🏪 Cửa hàng Nông Trại 🏪\n\n";
    
    shopList += "🌱 Cây trồng:\n";
    for (let cropId in CROPS) {
        const crop = CROPS[cropId];
        shopList += `${crop.emoji} ${crop.name} (ID: ${cropId}) - 💰 ${crop.price} xu\n`;
    }
    
    shopList += "\n🐾 Động vật:\n";
    for (let animalId in ANIMALS) {
        const animal = ANIMALS[animalId];
        shopList += `${animal.emoji} ${animal.name} (ID: ${animalId}) - 💰 ${animal.feedCost} xu/lần cho ăn\n`;
    }

    shopList += "\n🧪 Phân bón:\n";
    for (let fertilizerId in FERTILIZERS) {
        const fertilizer = FERTILIZERS[fertilizerId];
        shopList += `${fertilizer.emoji} ${fertilizer.name} (ID: ${fertilizerId}) - 💰 ${fertilizer.price} xu\n`;
    }
    
    shopList += "\nℹ️ Thông tin chi tiết:\n";
    shopList += "Gõ 'farm shop cay' để xem thông tin cây trồng\n";
    shopList += "Gõ 'farm shop convat' để xem thông tin động vật\n";
    shopList += "Gõ 'farm shop phanbon' để xem thông tin phân bón\n";

    shopList += "\n🛒 Hướng dẫn mua hàng:\n";
    shopList += "• Mua hạt giống: 'farm trong [ID cây]'\n";
    shopList += "• Cho động vật ăn: 'farm choan [ID động vật]'\n";
    shopList += "• Sử dụng phân bón: 'farm bonphan [ID cây] [ID phân bón]'\n";

    api.sendMessage(shopList, threadID);
}
function showCropsInfo(api, threadID) {
    let cropInfo = "🌱 Thông tin cây trồng:\n\n";
    for (let cropId in CROPS) {
        const crop = CROPS[cropId];
        cropInfo += `${crop.emoji} ${crop.name} (ID: ${cropId})\n`;
        cropInfo += `   💰 Giá mua: ${crop.price} xu\n`;
        cropInfo += `   🕒 Thời gian trồng: ${formatTime(crop.growTime)}\n`;
        cropInfo += `   📦 Sản lượng: ${crop.yield[0]} - ${crop.yield[1]}\n`;
        cropInfo += `   💵 Giá bán: ${Math.floor(crop.price * 0.8)} xu/1\n`;
        cropInfo += `   🌟 EXP: ${crop.exp}\n\n`;
    }
    api.sendMessage(cropInfo, threadID);
}

function showAnimalsInfo(api, threadID) {
    let animalInfo = "🐾 Thông tin động vật:\n\n";
    for (let animalId in ANIMALS) {
        const animal = ANIMALS[animalId];
        animalInfo += `${animal.emoji} ${animal.name} (ID: ${animalId})\n`;
        animalInfo += `   💰 Chi phí cho ăn: ${animal.feedCost} xu/lần\n`;
        animalInfo += `   🕒 Thời gian cho ăn: ${formatTime(animal.feedTime)}\n`;
        animalInfo += `   📦 Sản lượng: ${animal.productAmount[0]} - ${animal.productAmount[1]} ${animal.productName}\n`;
        animalInfo += `   💵 Giá bán: ${animal.price} xu/${animal.productName}\n`;
        animalInfo += `   🌟 EXP: ${animal.exp}\n\n`;
    }
    api.sendMessage(animalInfo, threadID);
}

function showFertilizersInfo(api, threadID) {
    let fertilizerInfo = "🧪 Thông tin phân bón:\n\n";
    for (let fertilizerId in FERTILIZERS) {
        const fertilizer = FERTILIZERS[fertilizerId];
        fertilizerInfo += `${fertilizer.emoji} ${fertilizer.name} (ID: ${fertilizerId})\n`;
        fertilizerInfo += `   💰 Giá mua: ${fertilizer.price} xu\n`;
        fertilizerInfo += `   ⏰ Giảm thời gian trồng: ${fertilizer.timeReduction * 100}%\n`;
        fertilizerInfo += `   📈 Tăng sản lượng: ${fertilizer.yieldIncrease * 100}%\n\n`;
    }
    api.sendMessage(fertilizerInfo, threadID);
}
// BÁN ĐỒ
async function sellItem(api, threadID, uid, itemName, quantity, Currencies) {
    if (!plantSchema[uid] || !plantSchema[uid].inventory) {
        return api.sendMessage("❌ Bạn chưa có kho đồ nào. Hãy trồng cây hoặc nuôi động vật trước!", threadID);
    }
    
    let item;
    let itemKey;
    let isAnimalProduct = false;

    const normalizedItemName = itemName.toLowerCase().trim();
    quantity = parseInt(quantity);

    if (isNaN(quantity) || quantity <= 0) {
        return api.sendMessage("❌ Số lượng không hợp lệ. Vui lòng nhập một số dương.", threadID);
    }

    for (let crop in CROPS) {
        if (CROPS[crop].name.toLowerCase() === normalizedItemName) {
            item = CROPS[crop];
            itemKey = crop;
            break;
        }
    }

    if (!item) {
        for (let animal in ANIMALS) {
            if (ANIMALS[animal].productName.toLowerCase() === normalizedItemName || 
                ANIMALS[animal].product.toLowerCase() === normalizedItemName) {
                item = ANIMALS[animal];
                itemKey = ANIMALS[animal].product;
                isAnimalProduct = true;
                break;
            }
        }
    }

    if (!item) {
        return api.sendMessage(`❌ Không tìm thấy sản phẩm "${itemName}" trong cửa hàng!`, threadID);
    }

    const inventory = plantSchema[uid].inventory[itemKey] || 0;

    if (inventory < quantity) {
        return api.sendMessage(`❌ Bạn không đủ ${item.name || item.productName} để bán!
📦 Trong kho: ${inventory}
🛒 Muốn bán: ${quantity}`, threadID);
    }

    const price = isAnimalProduct ? item.price : Math.floor(item.price * 1.5);

    if (typeof price !== 'number' || isNaN(price)) {
        console.error(`Invalid price for item: ${itemName}, price: ${price}`);
        return api.sendMessage("❌ Có lỗi xảy ra khi tính giá sản phẩm. Vui lòng thử lại sau.", threadID);
    }

    const totalPrice = price * quantity;

    if (isNaN(totalPrice) || !isFinite(totalPrice)) {
        return api.sendMessage("❌ Có lỗi xảy ra khi tính tổng giá. Vui lòng thử lại sau.", threadID);
    }

    try {
        plantSchema[uid].inventory[itemKey] -= quantity;
        await Currencies.increaseMoney(uid, totalPrice);
        saveData();

        const itemEmoji = isAnimalProduct ? item.productEmoji : item.emoji;
        const itemDisplayName = isAnimalProduct ? item.productName : item.name;
        
        const userMoney = await Currencies.getData(uid);
        const newBalance = userMoney.money;

        const successMessage = `
💰 Bán hàng thành công!
${itemEmoji} Sản phẩm: ${itemDisplayName}
📦 Số lượng: ${quantity}
💵 Giá bán: ${price} xu/1
🪙 Tổng thu: ${totalPrice} xu
💼 Còn lại trong kho: ${plantSchema[uid].inventory[itemKey]}
💰 Số dư mới: ${newBalance} xu
        `;

        api.sendMessage(successMessage, threadID);
    } catch (error) {
        api.sendMessage("❌ Có lỗi xảy ra trong quá trình bán hàng. Vui lòng thử lại sau.", threadID);
    }
}
// BÁN NHANH
async function sellAllItems(api, threadID, uid, Currencies) {
    if (!plantSchema[uid] || !plantSchema[uid].inventory || Object.keys(plantSchema[uid].inventory).length === 0) {
        return api.sendMessage("Kho của bạn trống, không có gì để bán!", threadID);
    }

    let totalEarnings = 0;
    let soldItems = [];

    for (let itemKey in plantSchema[uid].inventory) {
        const quantity = plantSchema[uid].inventory[itemKey];
        let item, price;

        if (CROPS[itemKey]) {
            item = CROPS[itemKey];
            price = Math.floor(item.price * 1.5);
        } else {
            const animalProduct = Object.values(ANIMALS).find(animal => animal.product === itemKey);
            if (animalProduct) {
                item = animalProduct;
                price = item.price;
            }
        }

        if (item && price) {
            const earnings = price * quantity;
            totalEarnings += earnings;
            soldItems.push({
                name: item.name || item.productName,
                emoji: item.emoji || item.productEmoji,
                quantity: quantity,
                earnings: earnings
            });
            delete plantSchema[uid].inventory[itemKey];
        }
    }

    if (soldItems.length === 0) {
        return api.sendMessage("Không có vật phẩm nào có thể bán!", threadID);
    }

    await Currencies.increaseMoney(uid, totalEarnings);
    saveData();

    let message = "🎉 Đã bán tất cả vật phẩm trong kho:\n\n";
    for (let item of soldItems) {
        message += `${item.emoji} ${item.name}: ${item.quantity} cái - ${item.earnings} xu\n`;
    }
    message += `\n💰 Tổng thu: ${totalEarnings} xu`;

    const userMoney = await Currencies.getData(uid);
    message += `\n💼 Số dư mới: ${userMoney.money} xu`;

    api.sendMessage(message, threadID);
}
// BÓN PHÂN
async function useFertilizer(api, threadID, uid, cropName, fertilizerName, Currencies) {
    if (!plantSchema[uid] || !plantSchema[uid][cropName]) {
        return api.sendMessage(`❌ Bạn chưa trồng ${CROPS[cropName].name}!`, threadID);
    }

    if (plantSchema[uid][cropName].fertilizer) {
        return api.sendMessage(`❌ Bạn đã sử dụng phân bón cho ${CROPS[cropName].name} rồi!`, threadID);
    }

    const fertilizer = FERTILIZERS[fertilizerName];
    if (!fertilizer) {
        return api.sendMessage(`❌ Loại phân bón không hợp lệ!`, threadID);
    }

    const userMoney = await Currencies.getData(uid);
    if (userMoney.money < fertilizer.price) {
        return api.sendMessage(`❌ Bạn không đủ tiền để mua ${fertilizer.name}!`, threadID);
    }

    await Currencies.decreaseMoney(uid, fertilizer.price);
    plantSchema[uid][cropName].fertilizer = fertilizerName;
    saveData();

    api.sendMessage(`
✅ Đã sử dụng ${fertilizer.emoji} ${fertilizer.name} cho ${CROPS[cropName].emoji} ${CROPS[cropName].name}!
🚀 Thời gian sinh trưởng giảm ${fertilizer.timeReduction * 100}%
📈 Sản lượng tăng ${fertilizer.yieldIncrease * 100}%
    `, threadID);
}
// BÓN PHÂN NHANH
async function fertilizeAllCrops(api, threadID, uid, fertilizerName, Currencies) {
    if (!plantSchema[uid] || Object.keys(plantSchema[uid]).length === 0) {
        return api.sendMessage("Bạn chưa trồng cây nào cả!", threadID);
    }

    const fertilizer = FERTILIZERS[fertilizerName];
    if (!fertilizer) {
        return api.sendMessage(`❌ Loại phân bón không hợp lệ!`, threadID);
    }

    const userMoney = await Currencies.getData(uid);
    const totalCrops = Object.keys(plantSchema[uid]).filter(crop => CROPS[crop] && !plantSchema[uid][crop].fertilizer).length;
    const totalCost = fertilizer.price * totalCrops;

    if (userMoney.money < totalCost) {
        return api.sendMessage(`❌ Bạn không đủ tiền để bón phân cho tất cả cây! Cần ${totalCost} xu.`, threadID);
    }

    let fertilizedCrops = [];
    for (let cropName in plantSchema[uid]) {
        if (CROPS[cropName] && !plantSchema[uid][cropName].fertilizer) {
            plantSchema[uid][cropName].fertilizer = fertilizerName;
            fertilizedCrops.push(CROPS[cropName].name);
        }
    }

    if (fertilizedCrops.length === 0) {
        return api.sendMessage("Không có cây nào cần bón phân!", threadID);
    }

    await Currencies.decreaseMoney(uid, totalCost);
    saveData();

    const message = `
✅ Đã sử dụng ${fertilizer.emoji} ${fertilizer.name} cho ${fertilizedCrops.length} cây:
${fertilizedCrops.join(", ")}
💰 Tổng chi phí: ${totalCost} xu
🚀 Thời gian sinh trưởng giảm ${fertilizer.timeReduction * 100}%
📈 Sản lượng tăng ${fertilizer.yieldIncrease * 100}%
    `;

    api.sendMessage(message, threadID);
}
// THÔNG TIN CỦA BẠN
function showLevelInfo(api, threadID, uid) {
    if (!playerData[uid]) {
        playerData[uid] = { exp: 0, level: 1 };
    }

    const level = playerData[uid].level;
    const exp = playerData[uid].exp;
    const nextLevelExp = (level * level * 100);
    const progressToNextLevel = Math.floor((exp / nextLevelExp) * 100);
    const { currentTitle, nextTitle, nextTitleLevel } = getTitle(level);

    let infoMessage = `
📊 Thông tin Level của bạn:

🏆 Level hiện tại: ${level}
🎖️ Danh hiệu: ${currentTitle}
📈 EXP hiện tại: ${exp}
🎯 EXP cần để lên level tiếp theo: ${nextLevelExp}
🌟 Tiến độ: ${progressToNextLevel}%
🌱 Số cây có thể trồng: ${level * 2}

`;

    if (nextTitle) {
        infoMessage += `🔜 Danh hiệu tiếp theo: ${nextTitle} (Level ${nextTitleLevel})\n`;
    }

    infoMessage += `
💡 Mẹo: 
- Thu hoạch cây trồng để nhận EXP. Cây trồng lâu hơn thường cho nhiều EXP hơn.
- Chăm sóc động vật thường xuyên. Động vật lớn hơn cho nhiều EXP hơn mỗi lần cho ăn.
- Cân nhắc giữa thời gian đầu tư và EXP nhận được để tối ưu hóa việc nâng cấp.
- Hãy cố gắng đạt được danh hiệu cao nhất!
    `;

    api.sendMessage(infoMessage, threadID);
}

// LÊN CẤP VÀ DANH HIỆU
function updateExpAndLevel(uid, expGain) {
    if (!playerData[uid]) {
        playerData[uid] = { exp: 0, level: 1 };
    }
    const oldLevel = playerData[uid].level;
    playerData[uid].exp += expGain;
    const newLevel = calculateLevel(playerData[uid].exp);
    const { currentTitle: oldTitle } = getTitle(oldLevel);
    const { currentTitle: newTitle } = getTitle(newLevel);
    let levelUpMessage = "";

    if (newLevel > oldLevel) {
        playerData[uid].level = newLevel;
        levelUpMessage = `\n🎊 Chúc mừng! Bạn đã lên level ${newLevel}!`;
        if (newTitle !== oldTitle) {
            levelUpMessage += `\n🎖️ Bạn đã đạt được danh hiệu mới: ${newTitle}`;
        }
        return levelUpMessage;
    }
    return "";
}

module.exports.run = async function({ api, event, args, Currencies, Users }) {
    const { threadID, senderID, messageID } = event;
    const command = args[0];
    const uid = senderID;
    const image = 'https://files.catbox.moe/e04kzr.jpeg';
    console.log(`Received command: ${command}, args:`, args);

    try {
        if (!playerData[uid]) {
            playerData[uid] = { exp: 0, level: 1 };
        }

        switch(command) {
            case "trong":
                if (args[1] === "all") {
                    return plantAllCrops(api, threadID, uid, Currencies);
                } else {
                    return plantCrop(api, threadID, uid, args[1], Currencies);
                }
            case "thuhoach":
                if (args[1] === "all") {
                    return harvestAllCrops(api, threadID, uid);
                } else {
                    return harvestCrop(api, threadID, uid, args[1]);
                }
            case "choan":
             if (args[1] === "all") {
                   return feedAllAnimals(api, threadID, uid, Currencies);
                } else {
                return feedAnimal(api, threadID, uid, args[1], Currencies);
                }
            case "info":
                return showField(api, threadID, uid);
            case "kho":
                return showInventory(api, threadID, uid, Currencies);
           case "shop":
             if (args[1] === "cay") {
               return showCropsInfo(api, threadID);
             } else if (args[1] === "convat") {
               return showAnimalsInfo(api, threadID);
             } else if (args[1] === "phanbon") {
             return showFertilizersInfo(api, threadID);
             } else {
              return showShop(api, threadID);
             }
            case "sell":
                if (args[1] === "all") {
                    return sellAllItems(api, threadID, uid, Currencies);
                } else {
                    return sellItem(api, threadID, uid, args[1], parseInt(args[2]), Currencies);
                }
            case "level":
                return showLevelInfo(api, threadID, uid);
            case "bonphan":
                if (args[1] === "all") {
                    return fertilizeAllCrops(api, threadID, uid, args[2], Currencies);
                } else {
                    return useFertilizer(api, threadID, uid, args[1], args[2], Currencies);
                }
             case "htx":
                switch(args[1]) {
                    case "info":
                        return showCooperativeInfo(api, threadID);
                    case "góp":
                        if (args.length < 3) {
                            return api.sendMessage("Vui lòng nhập số tiền muốn đóng góp. Ví dụ: farm htx donate 1000", threadID);
                        }
                        return donateToCooperative(api, threadID, uid, args[2], Currencies);
                    default:
                        return api.sendMessage(`
Sử dụng lệnh htx:
- farm htx info: Xem thông tin HTX
- farm htx góp [số tiền]: Đóng góp cho HTX
                        `, threadID);
                }
             case "bxh":
                if (args[1] === "htx") {
                     return showCooperativeLeaderboard(api, Users);
                } else {
                     return showLeaderboard(api, threadID, Users);
                }

default:
    const response = await axios.get(image, { responseType: 'stream' });
    return api.sendMessage({ attachment: response.data }, event.threadID, event.messageID);        
}
    } catch (error) {
        return api.sendMessage(`❌ Đã xảy ra lỗi: ${error.message}`, threadID, messageID);
    }
};