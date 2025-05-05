module.exports.config = {
    name: "setmoney",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "CatalizCS",
    description: "Điều chỉnh thông tin của người dùng",
    commandCategory: "Admin",
    usages: "[add/all/set/clean] [Số tiền] [Tag người dùng/reply]",
    cooldowns: 5
};

module.exports.run = async function ({ event, api, Currencies, args,Users }) {
    const { threadID, messageID, senderID, messageReply } = event;
if (args.length == 0) return api.sendMessage(`===== [ 𝗦𝗘𝗧𝗠𝗢𝗡𝗘𝗬 ] =====\n──────────────────\n/setmoney add + số tiền: Cộng tiền cho bản thân hoặc người được [tag/reply]\n──────────────────\n/setmoney uid + id + số tiền: cộng thêm số tiền của người khác\n──────────────────\n/setmoney clean: Xóa toàn bộ số tiền của bản thân hoặc người được [tag/reply]\n──────────────────\n/setmoney set + số tiền: Thay đổi toàn bộ số tiền của bản thân hoặc người được [tag/reply]\n──────────────────\n/setmoney all + số tiền: cộng tiền cho toàn bộ thành viên trong nhóm`, event.threadID, event.messageID);
    const { throwError } = global.utils;
    const { increaseMoney, decreaseMoney, getData } = Currencies;
   const mentionID = Object.keys(event.mentions);
    const money = parseInt(args[1]);
    var message = [];
    var error = [];

    switch (args[0]) {
        case "add": {
          if (event.type == "message_reply") {
            var name = (await Users.getData(event.messageReply.senderID)).name;
          await Currencies.increaseMoney(event.messageReply.senderID, money); console.log("done");
   
          return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Đã cộng tiền cho ${name} thành công ${money}$` ,event.threadID)  
            
          } else if (mentionID.length != 0) {
                for (singleID of mentionID) {
                if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
                try {
                    await Currencies.increaseMoney(singleID, money);
                    message.push(singleID);
                } catch (e) { error.push(e); console.log(e) };
                }
                return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Đã cộng thêm ${money}$ cho ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[ Lỗi ] → Không thể thể cộng thêm tiền cho ${error.length} người!`, threadID) }, messageID);
            } else {
                if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
                try {
                await Currencies.increaseMoney(senderID, money);
                message.push(senderID);
                } catch (e) { error.push(e) };
                return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Đã cộng thêm ${money}$ cho bản thân`, threadID, function () { if (error.length != 0) return api.sendMessage(`[ Lỗi ] → Không thể thể cộng thêm tiền cho bản thân!`, threadID) }, messageID);
            }
        }

        case "set": {
            if (mentionID.length != 0) {
                for (singleID of mentionID) {
                if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
                try {
                    await Currencies.setData(singleID, { money });
                    message.push(singleID);
                } catch (e) { error.push(e) };
                }
                return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Đã set thành công ${money}$ cho ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[ Lỗi ] → Không thể set tiền cho ${error.length} người!`, threadID) }, messageID);
            } else if (args[2]) {
                if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
                try {
                await Currencies.setData(args[2], { money });
                message.push(args[2]);
                } catch (e) { error.push(e) };
                return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Đã set thành công ${money}$ cho ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[ Lỗi ] → Không thể set tiền cho ${error.length} người!`, threadID) }, messageID);
            }
            else {
                if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
                try {
                await Currencies.setData(senderID, { money });
                message.push(senderID);
                } catch (e) { error.push(e) };
                return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Đã set thành công ${money}$ cho bản thân`, threadID, function () { if (error.length != 0) return api.sendMessage(`[ Lỗi ] → Không thể set tiền cho bản thân!`, threadID) }, messageID);
            }
        }

        case "clean": {
            if (mentionID.length != 0) {
                for (singleID of mentionID) {
                try {
                    await Currencies.setData(singleID, { money: 0 });
                    message.push(singleID);
                } catch (e) { error.push(e) };
            }
                return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Đã xóa thành công toàn bộ tiền của ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[ Lỗi ] → Không thể xóa toàn bộ tiền của ${error.length}`, threadID) }, messageID)
            } else {
                try {
                await Currencies.setData(senderID, { money: 0 });
                message.push(senderID);
                } catch (e) { error.push(e) };
                return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Đã xóa thành công tiền của cho bản thân`, threadID, function () { if (error.length != 0) return api.sendMessage(`[ Lỗi ]  → Không thể xóa toàn bộ tiền của bản thân!`, threadID) }, messageID);
            }
        }
        
        case "all": {
           var name = (await Users.getData(event.senderID)).name
            if(!args[1]) return api.sendMessage("Lệnh sử dung: setmoney\nBạn chưa nhập số tiền cần set !!!", threadID, messageID);
            if(isNaN(args[1])) return api.sendMessage("Thôi Khỏi Sài Đi Mày Ngu Vcl !!! :)", threadID, messageID);
            if(args[1] > 1000000000000) return api.sendMessage("Lệnh sử dụng: setmoney\nSố tiền phải nhỏ < 1000000000000", threadID, messageID);
            let { participantIDs } = await api.getThreadInfo(threadID);
            for(let i of participantIDs) {
                try {
                    await increaseMoney(parseInt(i), parseInt(args[1]));
                    message.push(i);
                } catch(e) { error.push(e) }
            }
            return api.sendMessage(`${name} đã cộng thêm ${args[1]}$ cho ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] → Không thể cộng thêm tiền cho ${error.length} người!`, threadID) }, messageID);
        }

        case "uid": {
           var id = args[1];
		var cut = args[2];
		let nameeee = (await Users.getData(id)).name
		   return api.sendMessage(`[ 𝗠𝗼𝗻𝗲𝘆 ] →  Đã cộng thêm ${nameeee} thành ${cut}$`, event.threadID, () => Currencies.increaseMoney(id, parseInt(cut)), event.messageID)	
          }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}