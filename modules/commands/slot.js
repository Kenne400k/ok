    var request = require("request");const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");
    module.exports.config = {
        name: "slot",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "Q.Huy", // Mod từ baucua của Horizon
        description: "Cờ bạc hoa quả",
        commandCategory: "giải trí",
        usages: "slot + tên + tìn :v",
        cooldowns: 5
    };

    module.exports.onLoad = async function () {
        if (!existsSync(__dirname + '/cache/nho.jpg')) {
            request('https://i.imgur.com/tmKK6Yj.jpg').pipe(createWriteStream(__dirname + '/cache/nho.jpg'));
        }
        if (!existsSync(__dirname + '/cache/dua.jpg')) {
            request('https://i.imgur.com/mBTKhUW.jpg').pipe(createWriteStream(__dirname + '/cache/dua.jpg'));
        }
        if (!existsSync(__dirname + '/cache/dao.jpg')) {
            request('https://i.imgur.com/2qgYuDr.jpg').pipe(createWriteStream(__dirname + '/cache/dao.jpg'));
        }
        if (!existsSync(__dirname + '/cache/tao.jpg')) {
            request('https://i.imgur.com/tXG56lV.jpg').pipe(createWriteStream(__dirname + '/cache/tao.jpg'));
        }
        if (!existsSync(__dirname + '/cache/dau.jpg')) {
            request('https://i.imgur.com/PLQkfy3.jpg').pipe(createWriteStream(__dirname + '/cache/dau.jpg'));
        }
        if (!existsSync(__dirname + '/cache/bay.jpg')) {
            request('https://i.imgur.com/1UBI1nc.jpg').pipe(createWriteStream(__dirname + '/cache/bay.jpg'));
        }
        if (!existsSync(__dirname + '/cache/slot.gif')) {
            request('https://i.imgur.com/QP7xZz4.gif').pipe(createWriteStream(__dirname + '/cache/slot.gif'));
        }
    };

    async function get(one,two,three) {
        var x1;
            switch (one) {
                case "nho": x1 = "🍇";
                    break;
                case "dua": x1 = '🍉';
                    break;
                case "dao": x1 = '🍑';
                    break;
                case "tao": x1 = '🍎';
                    break;
                case "dau": x1 = '🍓';
                    break;
                case "bay": x1 = '➐';
                  
            }
        var x2;
            switch (two) {
                case "nho": x2 = "🍇";
                    break;
                case "dua": x2 = '🍉';
                    break;
                case "dao": x2 = '🍑';
                    break;
                case "tao": x2 = '🍎';
                    break;
                case "dau": x2 = '🍓';
                    break;
                case "bay": x2 = '➐';
                    
            }
        var x3;
            switch (three) {
                case "nho": x3 = "🍇";
                    break;
                case "dua": x3 = '🍉';
                    break;
                case "dao": x3 = '🍑';
                    break;
                case "tao": x3 = '🍎';
                    break;
                case "dau": x3 = '🍓';
                    break;
                case "bay": x3 = '➐';
                    
            }
        var all = [x1, x2, x3];
    return full = all;
    }
var full = [];
    module.exports.run = async function({ api, event, args, Currencies }) { var out = (msg) => api.sendMessage(msg,event.threadID, event.messageID);
        const slotItems = ["nho", "dua", "dao", "tao", "dau", "bay",];
            const moneyUser = (await Currencies.getData(event.senderID)).money;
                var moneyBet = parseInt(args[1]);
                    if (!args[0] || !isNaN(args[0])) return api.sendMessage("Hãy Bấm: /slot [nho/dưa/đào/táo/dâu/bảy] [số tiền]",event.threadID, event.messageID);
                    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage("Số tiền đặt cược không được để trống hoặc là số tiền âm", event.threadID, event.messageID);
                if (moneyBet > moneyUser) return api.sendMessage("Số tiền bạn đặt lớn hơn số dư của bạn!", event.threadID, event.messageID);
            if (moneyBet < 1000) return api.sendMessage("Số tiền đặt không được dưới 1000 đô!", event.threadID, event.messageID);
        var number = [], win = false;
    for (let i = 0; i < 3; i++) number[i] = slotItems[Math.floor(Math.random() * slotItems.length)];
        var itemm;
            var icon;
                switch (args[0]) {
                    case "nho":
                        case "Nho": itemm = "nho";
                                icon = '🍇';
                            break;
                    case "dưa": 
                        case "Dưa": itemm = "dua";
                                icon = '🍉';
                            break;
                    case "đào":
                        case "Đào": itemm = "dao";
                                icon = '🍑';
                            break;
                    case "táo":
                        case "Táo": itemm = "tao";
                                icon = '🍎';
                            break;
                    case "dâu": 
                        case "Dâu": itemm = "dau";
                                icon = '🍓';
                            break;
                    case "bảy":
                        case "Bảy": itemm = "bay";
                                icon = '➐';
                            
                            break;
                                default: return api.sendMessage("Hãy Bấm: /slot [nho/dưa/đào/táo/dâu/bảy] [số tiền]",event.threadID, event.messageID);
                }      
                await get(number[0],number[1],number[2]);
            api.sendMessage({body:"Đang Quay!…",attachment: createReadStream(__dirname + "/cache/slot.gif")},event.threadID,async (error,info) => {
                await new Promise(resolve => setTimeout(resolve, 5 * 1000));
                    api.unsendMessage(info.messageID);
                          await new Promise(resolve => setTimeout(resolve, 100));
    var array = [number[0],number[1],number[2]];
        var listimg = [];
           for (let string of array) {
               listimg.push(createReadStream(__dirname + `/cache/${string}.jpg`));
           }
        if (array.includes(itemm)) {
            var i = 0;
                if (array[0] == itemm) i+=1;
                    if (array[1] == itemm) i+=1;
                if (array[2] == itemm) i+=1;
            if (i == 1) {
                var mon = parseInt(args[1]) * 1;  
                    await Currencies.increaseMoney(event.senderID, mon); console.log("s1")
                        return api.sendMessage({body:`🎰  ${full.join(" | ")} 🎰\n→ Vì có 1 ${args[0].toLocaleLowerCase()} ${icon}\n→ Bạn chọn: ${args[0].toLocaleLowerCase()}\n→ Bạn đã thắng và nhận được: ${mon}$\n━━━━━━━━━━━━━━━━━━\n→ Số dư hiện tại là: ${[moneyUser + mon]}$`,attachment: listimg},event.threadID, event.messageID);
            }
            else if (i == 2) {
                var mon = parseInt(args[1]) * 2; 
                    await Currencies.increaseMoney(event.senderID, mon); console.log("s2")
                        return api.sendMessage({body:`🎰  ${full.join(" | ")} 🎰\n→ Vì có 2 ${args[0].toLocaleLowerCase()} ${icon}\n→ Bạn chọn: ${args[0].toLocaleLowerCase()}\n→ Bạn đã thắng và nhận được: ${mon}\n━━━━━━━━━━━━━━━━━━\n→ Số dư hiện là: ${[moneyUser + mon]}$`,attachment: listimg},event.threadID, event.messageID);
            }
            else if (i == 3) {
                var mon = parseInt(args[1]) * 3; 
                    await Currencies.increaseMoney(event.senderID, mon); console.log('s3')
                        return api.sendMessage({body:`🎰  ${full.join(" | ")} 🎰\n→ Vì có 3 ${args[0].toLocaleLowerCase()} ${icon}\n→ Bạn chọn: ${args[0].toLocaleLowerCase()}\n→ Bạn đã thắng và nhận được: ${mon}$\n━━━━━━━━━━━━━━━━━━\n→ Số dư hiện tại là: ${[moneyUser + mon]}$`,attachment: listimg},event.threadID, event.messageID);
            }
            else return api.sendMessage("Lỗi ! Code : XX1N",event.threadID,event.messageID);
        } else  {
            await Currencies.decreaseMoney(event.senderID, parseInt(args[1])); console.log('s4')
            return api.sendMessage({body:`🎰  ${full.join(" | ")} 🎰\n→ Vì có 0 ${args[0].toLocaleLowerCase()} ${icon}\n→ Bạn chọn: ${args[0].toLocaleLowerCase()}\n→ Bạn đã thua và mất đi: ${args[1]}$\n━━━━━━━━━━━━━━━━━━\n→ Số dư hiện tại là: ${[moneyUser -args[1]]}$`,attachment: listimg},event.threadID, event.messageID);
        }
            } ,event.messageID);
    };