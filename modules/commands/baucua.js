 var request = require("request");const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");
    module.exports.config = {
        name: "baucua",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "Horizon Lucius Synthesis I",
        description: "Game bầu cua có đặt cược",
        commandCategory: "game",
        usages: "<[gà/tôm/bầu/cua/cá/nai] hoặc[🐓/🦞/🍐/🦀/🐬/🦌]> <Số tiền cược (lưu ý phải trên 100$)>",
        cooldowns: 2
    };

    module.exports.onLoad = async function () {
        if (!existsSync(__dirname + '/cache/ga.jpg')) {
            request('https://i.imgur.com/Vz17qhg.jpg').pipe(createWriteStream(__dirname + '/cache/ga.jpg'));
        }
        if (!existsSync(__dirname + '/cache/tom.jpg')) {
            request('https://i.imgur.com/Ep0MukF.jpg').pipe(createWriteStream(__dirname + '/cache/tom.jpg'));
        }
        if (!existsSync(__dirname + '/cache/bau.jpg')) {
            request('https://i.imgur.com/Qp3StfB.jpg').pipe(createWriteStream(__dirname + '/cache/bau.jpg'));
        }
        if (!existsSync(__dirname + '/cache/cua.jpg')) {
            request('https://i.imgur.com/J5MPPMW.jpg').pipe(createWriteStream(__dirname + '/cache/cua.jpg'));
        }
        if (!existsSync(__dirname + '/cache/ca.jpg')) {
            request('https://i.imgur.com/JNQr0qI.jpg').pipe(createWriteStream(__dirname + '/cache/ca.jpg'));
        }
        if (!existsSync(__dirname + '/cache/nai.jpg')) {
            request('https://i.imgur.com/UYhUZf8.jpg').pipe(createWriteStream(__dirname + '/cache/nai.jpg'));
        }
        if (!existsSync(__dirname + '/cache/baucua.gif')) {
            request('https://i.imgur.com/dlrQjRL.gif').pipe(createWriteStream(__dirname + '/cache/baucua.gif'));
        }
    };

    async function get(one,two,three) {
        var x1;
            switch (one) {
                case "ga": x1 = "🐓";
                    break;
                case "tom": x1 = '🦞';
                    break;
                case "bau": x1 = '🍐';
                    break;
                case "cua": x1 = '🦀';
                    break;
                case "ca": x1 = '🐬';
                    break;
                case "nai":x1 = '🦌';
            }
        var x2;
            switch (two) {
                case "ga": x2 = "🐓";
                    break;
                case "tom": x2 = '🦞';
                    break;
                case "bau": x2 = '🍐';
                    break;
                case "cua": x2 = '🦀';
                    break;
                case "ca": x2 = '🐬';
                    break;
                case "nai": x2 = '🦌';
            }
        var x3;
            switch (three) {
                case "ga": x3 = "🐓";
                    break;
                case "tom": x3 = '🦞';
                    break;
                case "bau": x3 = '🍐';
                    break;
                case "cua": x3 = '🦀';
                    break;
                case "ca": x3 = '🐬';
                    break;
                case "nai":x3 = '🦌';
            }
        var all = [x1, x2, x3];
    return full = all;
    }
var full = [];
    module.exports.run = async function({ api, event, args, Currencies }) { var out = (msg) => api.sendMessage(msg,event.threadID, event.messageID);
        const slotItems = ["ga", "tom", "bau", "cua", "ca", "nai"];
            const moneyUser = (await Currencies.getData(event.senderID)).money;
                var moneyBet = parseInt(args[1]);
                    if (!args[0] || !isNaN(args[0])) return api.sendMessage("Hãy Bấm : #baucua [bầu/cua/cá/nai/gà/tôm] [số tiền]",event.threadID, event.messageID);
                    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage("Số tiền đặt cược không được để trống hoặc là số tiền âm", event.threadID, event.messageID);
                if (moneyBet > moneyUser) return api.sendMessage("Số tiền bạn đặt lớn hơn số dư của bạn!", event.threadID, event.messageID);
            if (moneyBet < 100) return api.sendMessage("Số tiền đặt không được dưới 100 đô!", event.threadID, event.messageID);
        var number = [], win = false;
    for (let i = 0; i < 3; i++) number[i] = slotItems[Math.floor(Math.random() * slotItems.length)];
        var itemm;
            var icon;
                switch (args[0]) {
                    case "bầu":
                        case "Bầu": itemm = "bau";
                                icon = '🍐';
                            break;
                    case "cua": 
                        case "Cua": itemm = "cua";
                                icon = '🦀';
                            break;
                    case "cá":
                        case "Cá": itemm = "ca";
                                icon = '🐟';
                            break;
                    case "nai":
                        case "Nai": itemm = "nai";
                                icon = '🦌';
                            break;
                    case "gà": 
                        case "Gà": itemm = "ga";
                                icon = '🐓';
                            break;
                    case "tôm":
                        case "Tôm": itemm = "tom";
                                icon = '🦞';
                            break;
                                default: return api.sendMessage("Hãy Bấm : #baucua [bầu/cua/cá/nai/gà/tôm] [số tiền]",event.threadID, event.messageID);
                }      
                await get(number[0],number[1],number[2]);
            api.sendMessage({body:"𝐂𝐡𝐨 𝐛𝐨𝐭 𝐥𝐚𝐜 𝐜𝐡𝐮𝐜 𝐛𝐚𝐧 𝐦𝐚𝐲 𝐦𝐚𝐧💝",attachment: createReadStream(__dirname + "/cache/baucua.gif")},event.threadID,async (error,info) => {
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
                var mon = parseInt(args[1]) + 300;  
                    await Currencies.increaseMoney(event.senderID, mon); console.log("s1")
                        return api.sendMessage({body:`𝐊𝐞𝐭 𝐪𝐮𝐚: ${full.join(" | ")}\n𝐁𝐚𝐧 𝐭𝐡𝐚𝐧𝐠 𝐯𝐚 𝐧𝐡𝐚𝐧 𝐯𝐞 𝐬𝐨 𝐭𝐢𝐞𝐧 ${mon}$ \n➢ 𝐁𝐨𝐭 𝐥𝐚𝐜 𝐫𝐚 𝐦𝐨𝐭 𝐜𝐨𝐧 ${icon}`,attachment: listimg},event.threadID, event.messageID);
            }
            else if (i == 2) {
                var mon = parseInt(args[1]) * 2; 
                    await Currencies.increaseMoney(event.senderID, mon); console.log("s2")
                        return api.sendMessage({body:`𝐊𝐞𝐭 𝐪𝐮𝐚: ${full.join(" | ")}\n𝐁𝐚𝐧 𝐭𝐡𝐚𝐧𝐠 𝐯𝐚 𝐧𝐡𝐚𝐧 𝐯𝐞 𝐬𝐨 𝐭𝐢𝐞𝐧 ${mon}$ \n➢ 𝐁𝐨𝐭 𝐥𝐚𝐜 𝐫𝐚 𝐡𝐚𝐢 𝐜𝐨𝐧 ${icon}`,attachment: listimg},event.threadID, event.messageID);
            }
            else if (i == 3) {
                var mon = parseInt(args[1]) * 3; 
                    await Currencies.increaseMoney(event.senderID, mon); console.log('s3')
                        return api.sendMessage({body:`𝐊𝐞𝐭 𝐪𝐮𝐚: ${full.join(" | ")}\n𝐁𝐚𝐧 𝐭𝐡𝐚𝐧𝐠 𝐯𝐚 𝐧𝐡𝐚𝐧 𝐯𝐞 𝐬𝐨 𝐭𝐢𝐞𝐧 ${mon}$ \n➢ 𝐁𝐨𝐭 𝐥𝐚𝐜 𝐫𝐚 𝐛𝐚 𝐜𝐨𝐧 ${icon}`,attachment: listimg},event.threadID, event.messageID);
            }
            else return api.sendMessage("𝐋𝐨𝐢 𝐫𝐨𝐢 𝐛𝐚𝐮 𝐜𝐮𝐚 𝐜𝐨𝐧 𝐜𝐚𝐜 𝐛𝐨𝐭 𝐧𝐠𝐡𝐢𝐞𝐧 𝐥𝐚𝐢",event.threadID,event.messageID);
        } else  {
            await Currencies.decreaseMoney(event.senderID, parseInt(args[1])); console.log('s4')
            return api.sendMessage({body:`𝐊𝐞𝐭 𝐪𝐮𝐚: ${full.join(" | ")}\n𝐁𝐚𝐧 𝐝𝐚 𝐭𝐡𝐮𝐚 𝐯𝐚 𝐛𝐢 𝐭𝐫𝐮 ${args[1]}$ 💸\n𝐯𝐢 𝐤𝐡𝐨𝐧𝐠 𝐜𝐨 𝐜𝐨𝐧 ${icon}`,attachment: listimg},event.threadID, event.messageID);
        }
            } ,event.messageID);
    };