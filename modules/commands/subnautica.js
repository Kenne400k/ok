const path = require("path");
const axios = require("axios");
module.exports.config = {
    name: "subnautica",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Dàn code của D-Jukie, đàn cá của Heo Rừng UwU",
    description: "Game subnautica câu cá!",
    commandCategory: "game",
    usages: "help",
    cooldowns: 0,
    envConfig: {
        APIKEY: ""
    }
};

module.exports.checkPath = function (type, senderID) {
    const pathItem = path.join(__dirname, 'cache', 'cauca', `item.json`);
    const pathUser = path.join(__dirname, 'cache', 'cauca', 'datauser', `${senderID}.json`);
    const pathUser_1 = require("./cache/cauca/datauser/" + senderID + '.json');
    const pathItem_1 = require("./cache/cauca/item.json");
    if (type == 1) return pathItem
    if (type == 2) return pathItem_1
    if (type == 3) return pathUser
    if (type == 4) return pathUser_1
}

module.exports.onLoad = async () => {
    const fs = require("fs-extra");
    const axios = require("axios");

    const dir = __dirname + `/cache/cauca/`;
    const dirCache = __dirname + `/cache/cauca/cache/`;
    const dirData = __dirname + `/cache/cauca/datauser/`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
        recursive: true
    });
    if (!fs.existsSync(dirData)) fs.mkdirSync(dirData, {
        recursive: true
    });
    if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, {
        recursive: true
    });

    if (!fs.existsSync(dir + "data.json")) (await axios({
        url: "https://raw.githubusercontent.com/phamvandien1/abc/main/data.json",
        method: 'GET',
        responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dir + "data.json"));

    if (!fs.existsSync(dir + "item.json")) (await axios({
        url: "https://raw.githubusercontent.com/phamvandien1/abc/main/item.json",
        method: 'GET',
        responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dir + "item.json"));
    return;
}

module.exports.run = async function ({
    api,
    event,
    args,
    Users,
    Currencies
}) {
    const {
        threadID,
        messageID,
        senderID
    } = event;
    const {
        readFileSync,
        writeFileSync,
        existsSync,
        createReadStream,
        readdirSync
    } = require("fs-extra")
    const axios = require("axios")
    const pathData = path.join(__dirname, 'cache', 'cauca', 'datauser', `${senderID}.json`);
    switch (args[0]) {
    case 'register':
    case '-r': {
        const nDate = new Date().toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh'
        });
        if (!existsSync(pathData)) {
            var obj = {};
            obj.name = (await Users.getData(senderID)).name;
            obj.ID = senderID;
            obj.mainROD = null,
                obj.GPS = {};
            obj.GPS.locate = null,
                obj.GPS.area = null,
                obj.fishBag = [];
            obj.item = [];
            obj.timeRegister = nDate
            obj.fishBag.push({
                ID: 0,
                name: 'Cá Thách Đấu',
                category: 'Legendary',
                size: 999999,
                sell: 0
            });
            writeFileSync(pathData, JSON.stringify(obj, null, 4));
            var msg = {body: "[ Game Subnautica Câu Cá ]\n──────────────────\n✅ Đăng ký game thành công\n🏬 /subnautica shop/-s: Để mua vật phẩm câu cá!", attachment: await this.subnautica()}
            return api.sendMessage(msg, threadID, messageID);
        } else return api.sendMessage({body: "[ Game Subnautica Câu Cá ]\n──────────────────\n⚡ Bạn đã đăng ký game rồi!", attachment: await this.subnautica()}, threadID, messageID);
    }
    case 'shop':
    case '-s': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "[ Game Subnautica Câu Cá ]\n──────────────────\n🦈 Bạn chưa đăng ký tài khoản\n⚡ /subnautica register/-r: Để đăng ký game!", attachment: await this.subnautica()}, threadID, messageID);
        }
        return api.sendMessage({body: "[ Cửa Hàng Subnautica ]\n──────────────────\n1 » 💰 Mua vật phẩm\n2 » 💵 Bán vật phẩm câu được\n3 » ⚡ Nâng cấp/Sửa chửa vật phẩm\n──────────────────\n💬 Phản hồi tin nhắn này với lựa chọn của bạn!", attachment: await this.subnautica()}, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "shop"
            })
        }, messageID);
    }
    case 'bag':
    case '-b': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "[ Game Subnautica Câu Cá ]\n──────────────────\n🦈 Bạn chưa đăng ký tài khoản\n⚡ /subnautica register/-r: Để đăng ký game!", attachment: await this.subnautica()}, threadID, messageID);
        }
        var data = this.checkPath(4, senderID)

        return api.sendMessage({body: `[ Túi Đồ Subnautica ]\n──────────────────\n1 » 🦈 Số cá câu được: ${data.fishBag.length} con\n2 » 🎣 Số cần câu hiện có: ${data.item.length} cần\n──────────────────\n💬 Vui lòng phản hồi vật phẩm cần xem!`, attachment: await this.subnautica()}, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "choosebag"
            })
        }, messageID);
    }
    case 'custom':
    case '-c': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "[ Game Subnautica Câu Cá ]\n──────────────────\n🦈 Bạn chưa đăng ký tài khoản\n⚡ /subnautica register/-r: Để đăng ký game!", attachment: await this.subnautica()}, threadID, messageID);
        }
        if (args[1] == 'rod') {
            var data = this.checkPath(4, senderID)
            var listItem = '[ Subnautica Chọn Cần Câu ]\n──────────────────\n',
                number = 1;
            for (let i of data.item) {
                listItem += `${number++} » 🎣 Tên cần: ${i.name}\n⏱️ Thời gian chờ: ${i.countdown}s\n⚡ Độ bền: ${i.durability}\n──────────────────\n`
            }
            listItem += '💬 Vui lòng phản hồi để chọn cần câu chính của bạn!'
            return api.sendMessage(listItem, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "rodMain",
                    data: data,
                    item: data.item
                })
            }, messageID);
        }
        if (args[1] == 'locate') {
            return api.sendMessage({body: "[ Chọn Vùng Để Câu Cá ]\n──────────────────\n1 » The Crater\n\n2 » Sector Zero", attachment: await this.subnautica()}, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "location"
                })
            }, messageID);
        }
    }
    case 'help': {
            return api.sendMessage({body: "[ Hỗ Trợ Game Subnautica ]\n──────────────────\n🦈 /subnautica register/-r: Đăng ký game\n🏬 /subnautica shop/-s: Cửa hàng câu cá\n🌊 /subnautica custom/-c rod/custom locate: Lựa chọn khu vực câu cá\n🎒 /subnautica bag/-b: Xem túi đồ", attachment: await this.subnautica()}, threadID, messageID);
        }
    default: {
        async function checkTime(cooldown, dataTime) {
            if (cooldown - (Date.now() - dataTime) > 0) {

                var time = cooldown - (Date.now() - dataTime),
                    minutes = Math.floor(time / 60000),
                    seconds = ((time % 60000) / 1000).toFixed(0);
                return api.sendMessage(`⏰ Vui lòng mua cần câu cấp bậc cao hơn để câu liên tiếp trong thời gian ngắn!\n⌚ Chờ gian chờ còn lại: ${minutes}:${seconds}`, threadID, messageID);
            }
        }
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "[ Game Subnautica Câu Cá ]\n──────────────────\n⚡ /subnautica help: Để xem cách chơi!", attachment: await this.subnautica()}, threadID, messageID);
        }
        var data = this.checkPath(4, senderID)
        if (data.item.length == 0) return api.sendMessage(`⚡ Bạn chưa có cần câu, vui lòng vào shop để mua!`, threadID, messageID);
        if (data.mainROD == null) return api.sendMessage('⚡ Bạn chưa chọn cần câu để câu cá\n❗ Vui lòng nhập "/subnautica custom rod" để chọn cần câu!', threadID, messageID);
        if (data.GPS.locate == null || data.GPS.area == null) return api.sendMessage('⚡ Bạn chưa chọn địa điểm để câu cá\n❗ Vui lòng nhập "/subnautica custom locate" để chọn địa điểm câu!', threadID, messageID);
        var rod = data.mainROD
        var location = data.GPS.locate
        var area = data.GPS.area
        var type = this.getFish()
        var findRod = data.item.find(i => i.name == rod)
        if (findRod.durability <= 0) return api.sendMessage('⚡ Cần câu đã hỏng, bạn cần sửa chữa hoặc chọn cần câu mới!', threadID, messageID);
        await checkTime(findRod.countdown * 1000, findRod.countdownData)
        findRod.countdownData = Date.now();
        findRod.durability = findRod.durability - 10;
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        if (type == false) return api.sendMessage('❎ Bạn đã câu hụt không dính con cá nào cả!', threadID, messageID);
        var fil = (await this.dataFish(location, area)).filter(i => i.category == type)
        if (fil.length == 0) return api.sendMessage('❎ Bạn đã câu hụt không dính con cá nào cả!', threadID, messageID);
        var getData = fil[Math.floor(Math.random() * fil.length)];
        var IDF = ((this.checkPath(4, senderID)).fishBag)[parseInt(((this.checkPath(4, senderID)).fishBag).length - 1)].ID + 1;
        (this.checkPath(4, senderID)).fishBag.push({
            ID: IDF,
            name: getData.name,
            category: getData.category,
            size: getData.size,
            sell: getData.sell,
            image: getData.image
        });
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        var msg = {body: `[ Game Subnautica Câu Cá ]\n──────────────────\n🎣 Bạn đã câu dính cá\n🦈 Tên cá: ${getData.name}\n💵 Giá tiền: ${getData.sell}$\n📖 Loại cá: ${getData.category}\n📏 Size: ${getData.size}cm`, attachment: await this.image(getData.image)}
        return api.sendMessage(msg, threadID, messageID);
    }
    }
}
module.exports.data = async function () {
    const data = (await axios.get(`https://raw.githubusercontent.com/duongcongnam/subnautica/main/subnautica.json`)).data;  
    return data
}

module.exports.dataFish =async function (a, b) {
    const data = await this.data()
    console.log(data)
    var loc = data.find(i => i.location == a)
    var are = loc.area.find(i => i.name == b)
    
    return are.creature
}

module.exports.image = async function(link) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    var images = [];
    let download = (await axios.get(link, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/cache/cauca/cache/subnautica.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/cache/cauca/cache/subnautica.png`));
    return images
}
module.exports.subnautica = async function() {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    var images = [];
    let download = (await axios.get('https://i.imgur.com/2VPuOVI.png', { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/cache/cauca/cache/subnauticapage.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/cache/cauca/cache/subnauticapage.png`));
    return images
}

module.exports.getFish = function () {
    var rate = Math.floor(Math.random() * 100) + 1
    if (rate <= 4) return false
    if (rate > 4 && rate <= 34) return 'Common';
    if (rate > 34 && rate <= 59) return 'Uncommon';
    if (rate > 59 && rate <= 79) return 'Rare';
    if (rate > 79 && rate <= 94) return 'Epic';
    if (rate > 94 && rate <= 99) return 'Legendary';
    if (rate > 99 && rate <= 100) return 'Mythical';
}
module.exports.handleReply = async function ({
    event,
    api,
    Currencies,
    handleReply,
    Users
}) {

    const {
        body,
        threadID,
        messageID,
        senderID
    } = event;
    const axios = require("axios")
    const {
        readFileSync,
        writeFileSync,
        existsSync,
        createReadStream,
        unlinkSync,
        writeFile
    } = require("fs-extra")
    const pathItem = this.checkPath(2, senderID);
    async function checkDur(a, b, c) {
        var data = require("./cache/cauca/item.json");
        var find = data.find(i => i.name == a)
        if (c == 'rate') return (b / find.durability) * 100
        if (c == 'reset') return find.durability
        return `${b}/${find.durability} (${((b/find.durability)*100).toFixed(0)}%)`
    }
    switch (handleReply.type) {
    case 'shop': {
        if (body == 1) {
            api.unsendMessage(handleReply.messageID)
            var listItem = '[ Shop Cần Câu ]\n──────────────────\n',
                number = 1;
            for (let i of pathItem) {
                listItem += `${number++} » 🎣 Tên: ${i.name}\n💵 Giá tiền: ${i.price}$\n⏱️ Thời gian chờ: ${i.countdown}\n⚡ Độ bền: ${i.durability}\n──────────────────\n`
            }
            return api.sendMessage(listItem + '💬 Phản hồi tin nhắn này để chọn cần câu cho bạn, Mỗi lần câu trừ 10% độ bền!', threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "buyfishingrod"
                })
            }, messageID);
        }
        if (body == 2) {
            api.unsendMessage(handleReply.messageID)
            var data = this.checkPath(4, senderID).fishBag;
            if (data.length == 0) return api.sendMessage('⚡ Túi của bạn không có gì cả!', threadID, messageID);
            var Common = data.filter(i => i.category == 'Common')
            var Uncommon = data.filter(i => i.category == 'Uncommon')
            var Rare = data.filter(i => i.category == 'Rare')
            var Epic = data.filter(i => i.category == 'Epic')
            var Legendary = data.filter(i => i.category == 'Legendary')
            var Mythical = data.filter(i => i.category == 'Mythical')
            var listCategory = [Common, Uncommon, Rare, Epic, Legendary, Mythical];
            return api.sendMessage(`[ Subnautica Bán Cá ]\n──────────────────\n1 » Cá: Common\n🛍️ Số lượng: ${Common.length}\n\n2 » Cá: Uncommon\n🛍️ Số lượng: ${Uncommon.length}\n\n3 » Cá: Rare\n🛍️ Số lượng: ${Rare.length}\n\n4 » Cá: Epic\n🛍️ Số lượng: ${Epic.length}\n\n5 » Cá: Legendary\n🛍️ Số lượng: ${Legendary.length}\n\n6 » Cá:  Mythical\n🛍️ Số lượng: ${Mythical.length}\n──────────────────\n💬 Phản hồi chọn cá muốn bán!`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "chooseFish",
                    listCategory
                })
            }, messageID);
        }
        if (body == 3) {
            api.unsendMessage(handleReply.messageID)
            var data = this.checkPath(4, senderID).item;
            var msg = `[ Số Cần Câu Hiện Có ]\n──────────────────\n`,
                number = 1;
            for (let i of data) {
                msg += `${number++} » 🎣 Tên cần: ${i.name}\n⚡ Độ bền: ${await checkDur(i.name, i.durability, 0)}\n──────────────────\n`
            }
            return api.sendMessage(msg + '💬 Vui lòng phản hồi vật phẩm muốn sửa, giá sửa bằng 1/3 giá vật phẩm!', threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "fixfishingrod",
                    list: data
                })
            }, messageID);
        } else return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
    }
    case 'choosebag': {
        api.unsendMessage(handleReply.messageID)
        var data = this.checkPath(4, senderID)
        if (body == 1) {
            if (data.fishBag.length == 0) return api.sendMessage('⚡ Trong túi của bạn không có con cá nào!', threadID, messageID);
            var listFish = `[ Số Cá Câu Được ]\n──────────────────\n`,
                number = 1;
            for (let i of data.fishBag) {
                listFish += `${number++} » 🦈 Tên cá: ${i.name}\n❗ Độ dài: ${i.size}cm - ${i.category}\n💵 Giá tiền: ${i.sell}$\n──────────────────\n`
            }
            return api.sendMessage(listFish, threadID, messageID);
        }
        if (body == 2) {
            api.unsendMessage(handleReply.messageID)
            if (data.item.length == 0) return api.sendMessage('⚡ Trong túi của bạn không có vật phẩm nào!', threadID, messageID);
            var listItemm = `[ Số Cần Câu Hiện Có ]\n──────────────────\n`,
                number = 1;
            for (let i of data.item) {
                listItemm += `${number++} » 🎣 Tên cần: ${i.name}\n💵 Giá tiền: ${i.price}$\n⚡ Độ bền: ${i.durability}\n⏱️ Thời gian chờ: ${i.countdown}s\n──────────────────\n`
            }
            return api.sendMessage(listItemm, threadID, messageID);
        } else return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
    }
    case 'rodMain': {
        var data = handleReply.data;
        var item = handleReply.item;
        if (parseInt(body) > item.length || parseInt(body) <= 0) return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        data.mainROD = item[parseInt(body) - 1].name
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(data, null, 2));
        return api.sendMessage(`[ Chọn Cần Câu Thành Công ]\n──────────────────\n📌 Đặt cần câu: ${item[parseInt(body) - 1].name} làm cần câu chính thành công!`, threadID, messageID);
    }
    case 'location': {
        const data = require("./cache/cauca/data.json");
        if (body != 1 && body != 2) return api.sendMessage("⚡ Lựa chọn không hợp lệ!", threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        var listLoca = '[ Chọn Địa Điểm Câu Cá ]\n──────────────────\n',
            number = 1;
        for (let i of data[parseInt(body) - 1].area) {
            listLoca += `${number++} » 🌊 Tên: ${i.name}\n──────────────────\n`
        };
        (this.checkPath(4, senderID)).GPS.locate = data[parseInt(body) - 1].location
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        if(body == 1) var images = 'https://i.imgur.com/SJewp15.png'
        if(body == 2) var images = 'https://i.imgur.com/FtB2vWi.png'
        return api.sendMessage({body: listLoca + '⚡ Vui lòng chọn địa điểm bạn muốn câu!', attachment: await this.image(images)}, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "chooseArea",
                area: data[parseInt(body) - 1]
            })
        }, messageID);
    }
    case 'chooseArea': {
        var area = handleReply.area;
        var pathh = this.checkPath(4, senderID)
        var pathhh = this.checkPath(3, senderID)
        if (parseInt(body) > area.area.length || parseInt(body) <= 0) return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        pathh.GPS.area = area.area[parseInt(body) - 1].name
        writeFileSync(pathhh, JSON.stringify(pathh, null, 2));
        return api.sendMessage(`[ Game Subnautica Câu Cá ]\n──────────────────\n✅ Chuyển tới vùng: ${area.location} - ${area.area[parseInt(body) - 1].name} thành công!`, threadID, messageID);
    }
    case 'fixfishingrod': {
        if (parseInt(body) > handleReply.list.length || parseInt(body) <= 0) return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
        var rod = handleReply.list[parseInt(body) - 1]
        if (await checkDur(rod.name, rod.durability, 'rate') > 75) return api.sendMessage('⚡ Chỉ sửa được cần câu có độ bền dưới 75%!', threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        await checkMoney(senderID, parseInt((rod.price * (1 / 3)).toFixed(0)))
        await Currencies.decreaseMoney(senderID, parseInt((rod.price * (1 / 3)).toFixed(0)));
        rod.durability = await checkDur(rod.name, rod.durability, 'reset')
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        return api.sendMessage(`[ Sửa Chữa Thành Công ]\n──────────────────\n🎣 Cần câu: ${rod.name}\n💵 Giá sửa chữa: ${parseInt((rod.price*(1/3)).toFixed(0))}$`, threadID, messageID);
    }
    case 'buyfishingrod': {
        if (parseInt(body) > pathItem.length || parseInt(body) <= 0) return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
        var data = pathItem[parseInt(body) - 1]
        var checkM = await checkMoney(senderID, data.price);
        if ((this.checkPath(4, senderID)).item.some(i => i.name == data.name)) return api.sendMessage('⚡ Bạn đã sở hữu vật phẩm này rồi!', threadID, messageID);
        (this.checkPath(4, senderID)).item.push({
            name: data.name,
            price: data.price,
            durability: data.durability,
            countdown: data.countdown,
            countdownData: null,
            image: data.image
        })
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        api.unsendMessage(handleReply.messageID)
        var msg = { body: `[ Game Subnautica Câu Cá ]\n──────────────────\n✅ Mua thành công cần câu\n🎣 Tên cần: ${data.name}\n💵 Giá mua: ${data.price}$\n⚡ Độ bền: ${data.durability}\n⏱️ Thời gian chờ: ${data.countdown}`, attachment: await this.image(data.image)}
        return api.sendMessage(msg, threadID, messageID);
    }
    case 'chooseFish': {
        if (parseInt(body) > handleReply.listCategory.length || parseInt(body) <= 0) return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
        api.unsendMessage(handleReply.messageID);
        if (handleReply.listCategory[parseInt(body) - 1].length == 0) return api.sendMessage('⚡ Bạn không có con cá nào cả!', threadID, messageID);
        var fish = "[ Subnautica Bán Cá ]\n──────────────────\n",
            number = 1;
        for (let i of handleReply.listCategory[parseInt(body) - 1]) {
            fish += `${number++} » 🦈 Tên cá: ${i.name} - ${i.size}cm\n❗ Loại: ${i.category}\n💵 Giá tiền: ${i.sell}$\n──────────────────\n`
        }
        return api.sendMessage(fish + "💬 Phản hồi số thứ tự để bán ( có thể phản hồi nhiều số ) hoặc phản hồi 'all' để bán tất cả cá!", threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "sell",
                list: handleReply.listCategory[parseInt(body) - 1]
            })
        }, messageID);
    }
    case 'sell': {
        if ((parseInt(body) > handleReply.list.length || parseInt(body) <= 0) && body.toLowerCase() != 'all') return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        var bag = (this.checkPath(4, senderID)).fishBag
        var coins = 0;
        if (body.toLowerCase() == 'all') {
            for (let i of handleReply.list) {
                await Currencies.increaseMoney(senderID, parseInt(i.sell));
                coins += parseInt(i.sell)
                console.log(i.ID)
                var index = (this.checkPath(4, senderID)).fishBag.findIndex(item => item.ID == i.ID);
                bag.splice(index, 1);
                writeFileSync(this.checkPath(3, senderID), JSON.stringify((this.checkPath(4, senderID)), null, 2));
            }
            return api.sendMessage(`✅ Bán thành công: ${handleReply.list.length} con cá và thu về được: ${coins}$`, threadID, messageID);
        }
        else {
            var msg = 'Code_By_D-Jukie ' + body
            var chooses = msg.split(" ").map(n => parseInt(n));
            chooses.shift();
            var text = `[ Bán Cá Thành Công ]\n──────────────────\n`,
                number = 1;
            for (let i of chooses) {
                const index = (this.checkPath(4, senderID)).fishBag.findIndex(item => item.ID == handleReply.list[i - 1].ID);
                text += `${number++} » 🦈 Tên cá: ${bag[index].name}\n💵 Giá tiền: ${bag[index].sell}$\n──────────────────\n`
                coins += parseInt(bag[index].sell)
                await Currencies.increaseMoney(senderID, parseInt(bag[index].sell));
                bag.splice(index, 1);
                writeFileSync(this.checkPath(3, senderID), JSON.stringify((this.checkPath(4, senderID)), null, 2));
            }
            return api.sendMessage(text + `\n💵 Thu về được: ${coins}$`, threadID, messageID);
        }
    }
    default: {
        api.unsendMessage(handleReply.messageID)
        return api.sendMessage('⚡ Lựa chọn không hợp lệ!', threadID, messageID);
    }
    }
    async function checkMoney(senderID, maxMoney) {
        var i, w;
        i = (await Currencies.getData(senderID)) || {};
        w = i.money || 0
        if (w < parseInt(maxMoney)) return api.sendMessage('⚡ Bạn không đủ tiền để thực hiện giao dịch này!', threadID, messageID);
    }
                                   }
 