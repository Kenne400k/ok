module.exports.config = {
  name: "tx1",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "DungUwU",
  description: "taixiu nhiều người có ảnh",
  commandCategory: "game",
  usages: "[create/leave/start]\n[tài/xỉu]",
  cooldowns: 3,
};

const axios = require("axios");

module.exports.languages = {
  vi: {
    missingInput: "❎ Số Tiền Đặt Cược Không Phải Là Số Âm",
    wrongInput: "❎ Nhập liệu không hợp lệ",
    moneyBetNotEnough: "❎ Số tiền bạn đặt lớn hơn số dư của bạn",
    limitBet: "❎ Số coin đặt không được dưới 50$",
    alreadyHave: "❎ Đang có 1 ván tài xỉu diễn ra ở nhóm này!",
    alreadyBet: "✅ Bạn đã thay đổi mức cược là %1$ vào %2.",
    createSuccess:
      "✅ Tạo thành công để tham gia cược ghi: tài/xỉu + tiền cược\n\n📌 Có thể đặt nhiều con cùng lúc\n\n🎲 Trong một khoảng thời gian nếu nhà cái không xổ bàn tài xỉu sẽ tự hủy",
    noGame:
      "❎ Nhóm của bạn không có ván tài xỉu nào đang diễn ra cả!",
    betSuccess: "✅ Đặt thành công %1$ vào %2",
    notJoined: "❎ Bạn chưa tham gia tài xỉu ở nhóm này!",
    outSuccess: "✅ Đã rời ván tài xỉu thành công, bạn sẽ được hoàn tiền!",
    shaking: "Đang lắc...",
    final: "━━━━ [ KẾT QUẢ ] ━━━━",
    notAuthor: "❎ Bạn không phải chủ phòng.",
    unknown: "❎ Câu lệnh không hợp lệ, để xem cách dùng, sử dụng: %1help %2",
    noPlayer: "❎ Hiện không có người đặt cược",
    info: "[ TAIXIU ]\n💁 Chủ phòng: %1\n\n💁 Người tham gia:\n%2",
  },
};

const dice_images = [
"https://i.imgur.com/ruaSs1C.png",
"https://i.imgur.com/AIhuSxL.png",
"https://i.imgur.com/JB4vTVj.png",
"https://i.imgur.com/PGgsDAO.png",
"https://i.imgur.com/RiaMAHX.png",
"https://i.imgur.com/ys9PwAV.png",
];

module.exports.run = async function ({
  api,
  event,
  args,
  getText,
  Users,
  Threads,
  Currencies,
}) {
  const request = require("request");
  const fs = require("fs");
  if (!global.client.taixiu_ca) global.client.taixiu_ca = {};

  //DEFINE SOME STUFF HERE..
  const { senderID, messageID, threadID } = event;
  if (args.length == 0) {
    var abcd = `🎲 GAME LẮC TÀI XỈU 🎲\n────────────────\n${global.config.PREFIX}${this.config.name} create → Tạo bàn tài xỉu\n${global.config.PREFIX}${this.config.name} leave → Rời khỏi bàn tài xỉu\n${global.config.PREFIX}${this.config.name} xổ → Bắt đầu lắc xúc xắc\n${global.config.PREFIX}${this.config.name} info → Xem thông tin bàn\n${global.config.PREFIX}${this.config.name} end → Kết thúc bàn tài xỉu`
    return api.sendMessage({body: abcd, attachment: (await require('axios').get(`https://i.imgur.com/i2woeoT.jpeg`, {
        responseType: 'stream'
    })).data
}, threadID, messageID);
  }
  const { increaseMoney, decreaseMoney, getData } = Currencies;
  const moneyUser = (await getData(senderID)).money;
  const sendC = (msg, callback) =>
    api.sendMessage(msg, threadID, callback, messageID);
  const sendTC = async (msg, callback) =>
    api.sendMessage(msg, threadID, callback);
  const sendT = (msg) => sendTC(msg, () => {});
  const send = (msg) => sendC(msg, () => {});
  const threadSetting =
    (await Threads.getData(String(event.threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  console.log(global.client.taixiu_ca[threadID])
  //HERE COMES SWITCH CASE...
  switch (args[0]) {
    case "create": {
      if (threadID in global.client.taixiu_ca) {
        if (!global.client.taixiu_ca[threadID].play) {
          if (global.client.taixiu_ca[threadID].id === senderID) {
            if (global.client.taixiu_ca[threadID].create === "false") {
              return sendC(
                "Bàn cũ end chưa được 2p\nVui lòng chờ hết 2p hãy tạo bàn mới\n\nBạn có thể thả ❤️ tin nhắn này để dùng 10% số tiền để tạo bàn nhanh (Lưu ý bạn phải có số dư trên  1,000,000$)",
                (e, info) => {
                  global.client.handleReaction.push({
                    type: "create",
                    name: this.config.name,
                    author: senderID,
                    messageID: info.messageID,
                    moneyUser,
                  });
                }
              );
            }
          } else {
            sendTC(getText("createSuccess"), () => {
              global.client.taixiu_ca[threadID] = {
                players: 0,
                data: {},
                play: true,
                status: "pending",
                author: senderID,
              };
            });
            timeStart();
            return;
          }
        }

        if (global.client.taixiu_ca[threadID].play) {
          return send(getText("alreadyHave"));
        }
        return;
      }
      sendTC(getText("createSuccess"), () => {
        global.client.taixiu_ca[threadID] = {
          players: 0,
          data: {},
          play: true,
          status: "pending",
          author: senderID,
        };
      });
      timeStart();
      return;
    }
    case "leave": {
      //SMALL CHECK...
      if (!global.client.taixiu_ca[threadID]) return send(getText("noGame"));
      if (!global.client.taixiu_ca[threadID].data[senderID])
        return send(getText("notJoined"));
      else {
        //REMOVING PLAYER
        global.client.taixiu_ca[threadID].players--;
        global.client.taixiu_ca[threadID].data[senderID].forEach(async (e) => {
          await increaseMoney(senderID, e.bet);
        });
        delete global.client.taixiu_ca[threadID].data[senderID];
        send(getText("outSuccess"));
      }
      return;
    }
    case "xổ": {
      //SMALL CHECK...
      if (!global.client.taixiu_ca[threadID]) return send(getText("noGame"));
      if (global.client.taixiu_ca[threadID].author != senderID)
        return send(getText("notAuthor"));
      if (global.client.taixiu_ca[threadID].players == 0)
        return send(getText("noPlayer"));

      //GET SHAKING DICES GIF AND SEND
      //let shakingGif = (await axios.get('https://i.ibb.co/hMPgMT7/shaking.gif', { responseType: "stream" }).catch(e => console.log(e))).data;
      await api.sendMessage(
        {
         body: getText("shaking"),
          //attachment: (await require('axios').get(`https://i.ibb.co/hMPgMT7/shaking.gif`, {
        //responseType: 'stream'
   // })).data
        },
        threadID,
        (err, info) =>
          setTimeout(
            async () =>
              await api.unsendMessage(info.messageID).then(async () => {
                await new Promise((resolve) => setTimeout(resolve, 500)); //A LITTLE DELAY...

                //GET DICES
                let _1st = Math.ceil(Math.random() * 6);
                let _2nd = Math.ceil(Math.random() * 6);
                let _3rd = Math.ceil(Math.random() * 6);

                //MAKING MSG...
                let name = "";
                let msg = getText("final");

                //GET IMAGES
                let dice_one_img = (
                  await axios
                    .get(dice_images[_1st - 1], { responseType: "stream" })
                    .catch((e) => console.log(e))
                ).data;
                let dice_two_img = (
                  await axios
                    .get(dice_images[_2nd - 1], { responseType: "stream" })
                    .catch((e) => console.log(e))
                ).data;
                let dice_three_img = (
                  await axios
                    .get(dice_images[_3rd - 1], { responseType: "stream" })
                    .catch((e) => console.log(e))
                ).data;
                let atms = [dice_one_img, dice_two_img, dice_three_img]; //ADD TO ARRAY

                //SPLIT 2 TYPE OF PLAYERS
                let tai = [],
                  xiu = [],
                  result;
                for (i in global.client.taixiu_ca[threadID].data) {
                  name = (await Users.getNameUser(i)) || "Player"; //GET NAME
                  results =
                    (_1st == _2nd) == _3rd
                      ? "Lose"
                      : _1st + _2nd + _3rd <= 10
                      ? ["xỉu", "xiu"].includes(
                          global.client.taixiu_ca[threadID].data[i].name
                        )
                        ? "Win"
                        : "Lose"
                      : ["tài", "tai"].includes(
                          global.client.taixiu_ca[threadID].data[i].name
                        )
                      ? "Win"
                      : "Lose";
                  if (results == "Win") {
                    if (
                      ["xỉu", "xiu"].includes(
                        global.client.taixiu_ca[threadID].data[i].name
                      )
                    ) {
                      xiu.push(
                        `👤 ${name}: +${formatNumber(
                          global.client.taixiu_ca[threadID].data[i].bet * 2
                        )}$`
                      );
                    } else
                      tai.push(
                        `👤 ${name}: +${formatNumber(
                          global.client.taixiu_ca[threadID].data[i].bet * 2
                        )}$`
                      );
                    await increaseMoney(
                      i,
                      global.client.taixiu_ca[threadID].data[i].bet * 2
                    );
                  } else {
                    // await decreaseMoney(i, global.client.taixiu_ca[threadID].data[i].bet)
                    if (
                      ["xỉu", "xiu"].includes(
                        global.client.taixiu_ca[threadID].data[i].name
                      )
                    ) {
                      xiu.push(
                        `👤 ${name}: -${formatNumber(
                          global.client.taixiu_ca[threadID].data[i].bet
                        )}$`
                      );
                    } else {
                      tai.push(
                        `👤 ${name}: -${formatNumber(
                          global.client.taixiu_ca[threadID].data[i].bet
                        )}$`
                      );
                    }
                  }
                }
                msg += `\n\n[ NHỮNG NGƯỜI ĐẶT TÀI ]\n${tai.join(
                  "\n"
                )}\n────────────────\n[ NHỮNG NGƯỜI ĐẶT XỈU ]\n${xiu.join("\n")}\n`;
                //FINAL SEND
                sendC(
                  {
                    body: msg,
                    attachment: atms,
                  },
                  () => delete global.client.taixiu_ca[threadID]
                );
                global.client.taixiu_ca[threadID] = {
                  id: senderID,
                  create: "false",
                };
                timeCreate(threadID);
                return;
              }),
            2400
          )
      );
    }
    case "end": {
      if (!global.client.taixiu_ca[threadID].author === senderID)
        return send(getText("notAuthor"));
      delete global.client.taixiu_ca[threadID];
      global.client.taixiu_ca[threadID] = {
        id: senderID,
        create: "false",
      };
      send("Đã xóa bàn thành công!");
      timeCreate(threadID);
      break;
    }
    case "info": {
      //SMALL CHECK
      if (!global.client.taixiu_ca[threadID]) return send(getText("noGame"));
      if (global.client.taixiu_ca[threadID].players == 0)
        return send(getText("noPlayer"));

      let name = "";
      let tempL = [];
      let nameAuthor =
        (await Users.getNameUser(global.client.taixiu_ca[threadID].author)) ||
        "Player"; //GET NAME AUTHOR
      for (e in global.client.taixiu_ca[threadID].data) {
        name = (await Users.getNameUser(e)) || "Player"; //GET NAME PLAYER
        tempL.push(
          `👤 ${name}: ${global.client.taixiu_ca[threadID].data[e].name} - ${global.client.taixiu_ca[threadID].data[e].bet}$`
        );
      }
      send(getText("info", nameAuthor, tempL.join("\n")));
      return;
    }
    default: {
    }
  }
  async function timeStart() {
    setTimeout(async () => {
      var tong = 0,
        msg = 'Thông tin';
      if(!global.client.taixiu_ca[threadID].data) return 
      for (i in global.client.taixiu_ca[threadID].data) {
        var name = (await Users.getNameUser(i)) || "Player";
        await increaseMoney(
          i,
          global.client.taixiu_ca[threadID].data[i].bet * 2
        );
        msg += `\n👤 ${name}: ${formatNumber(global.client.taixiu_ca[threadID].data[i].bet * 2)}`
        tong = tong + global.client.taixiu_ca[threadID].data[i].bet;
      }
      await decreaseMoney(senderID, tong);
      msg += "\n\nChủ bàn đã bị trừ " + formatNumber(tong) + "$"
      api.sendMessage(
        msg,
        threadID
      );
      delete global.client.taixiu_ca[threadID]
    }, 60 * 1000 * 2);
  }
};

module.exports.handleEvent = async function ({
  api,
  event,
  args,
  Currencies,
  getText,
}) {
  const { increaseMoney, decreaseMoney, getData } = Currencies;
  const { senderID, threadID, messageID, body } = event;
  if (!global.client.taixiu_ca) return;
  if (!global.client.taixiu_ca[threadID]) return;
  if (!global.client.taixiu_ca[threadID].play) return;
  const moneyUser = (await getData(senderID)).money;
  const sendC = (msg, callback) =>
    api.sendMessage(msg, threadID, callback, messageID);
  const sendTC = async (msg, callback) =>
    api.sendMessage(msg, threadID, callback);
  const sendT = (msg) => sendTC(msg, () => {});
  const send = (msg) => sendC(msg, () => {});
  const bod = body.split(" ");
  var input = bod[0],
    money = bod[1],
    moneyBet;
  if (["tài", "xỉu"].includes(input.toLowerCase())) {
    //LITTLE CHECK...
    if (!["Tài", "tai", "tài", "Xỉu", "xỉu", "xiu"].includes(input))
      return send("Vui lòng chọn tài or xỉu");
    if (!global.client.taixiu_ca[threadID]) return send(getText("noGame"));
    if (bod.length < 2) return send(getText("wrongInput"));
    moneyBet = money === "all" ? moneyUser : parseInt(money);
    

    if (isNaN(moneyBet) || moneyBet <= 0) return send(getText("missingInput"));
    if (moneyBet > moneyUser) return send(getText("moneyBetNotEnough"));
    if (moneyBet < 50) return send(getText("limitBet"));

    if (threadID in global.client.taixiu_ca) {
      if (global.client.taixiu_ca[threadID].status == "pending") {
        var luachon = input;

        //CHECK INPUT
        if (["Xỉu", "xiu", "xỉu"].includes(luachon)) luachon = "xỉu";
        if (["Tài", "tài", "tai"].includes(luachon)) luachon = "tài";

        if (!global.client.taixiu_ca[threadID].data[senderID])
          global.client.taixiu_ca[threadID].players++;

        if (global.client.taixiu_ca[threadID].data[senderID]) {
          return sendC(
            `Bạn đã đặt cược ${global.client.taixiu_ca[threadID].data[senderID].name}\nBạn chắc chắn muốn thay đổi thành ${luachon}?\nVui lòng thả ❤ để xác nhận thay đổi`,
            (e, info) => {
              global.client.handleReaction.push({
                type: "confirm",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                luachon,
                moneyBet,
              });
            }
          );
        } else {
          return sendC(
            getText("betSuccess", formatNumber(moneyBet), luachon),
            async () => {
              await decreaseMoney(senderID, moneyBet);
              global.client.taixiu_ca[threadID].data[senderID] = {
                name: luachon,
                bet: moneyBet,
              };
            }
          );
        }
      }
    }
    return;
  }
};

module.exports.handleReaction = async ({
  api,
  event,
  handleReaction,
  getText,
  Currencies,
}) => {
  const { increaseMoney, decreaseMoney, getData } = Currencies;
  const { author, moneyBet, luachon, moneyUser, type } = handleReaction;
  const { threadID, userID, messageID, reaction, senderID } = event;
  const sendC = (msg, callback) =>
    api.sendMessage(msg, threadID, callback, messageID);
  if (userID !== author) return;
  if (reaction !== "❤") return;
  if (type === "create") {
    if (moneyUser < 1000000)
      return api.sendMessage(
        "Số dư của bạn ít hơn 1,000,000$ nên không đủ điều kiện để tạo bàn!",
        threadID
      );
    var money_output = moneyUser * (10 / 100);
    await decreaseMoney(userID, money_output);
    global.client.taixiu_ca[threadID] = {
      create: true,
    };
    setTimeout(async () => {
      var tong = 0,
        msg = 'Thông tin';
      if(!global.client.taixiu_ca[threadID].data) return 
      for (i in global.client.taixiu_ca[threadID].data) {
        var name = (await Users.getNameUser(i)) || "Player";
        await increaseMoney(
          i,
          global.client.taixiu_ca[threadID].data[i].bet * 2
        );
        msg += `\n👤 ${name}: ${formatNumber(global.client.taixiu_ca[threadID].data[i].bet * 2)}`
        tong = tong + global.client.taixiu_ca[threadID].data[i].bet;
      }
      await decreaseMoney(senderID, tong);
      msg += "\n\nChủ bàn đã bị trừ " + formatNumber(tong) + "$"
      api.sendMessage(
        msg,
        threadID
      );
      delete global.client.taixiu_ca[threadID]
    }, 60 * 1000 * 2);
    
    return sendC(getText("createSuccess"), () => {
      global.client.taixiu_ca[threadID] = {
        players: 0,
        data: {},
        play: true,
        status: "pending",
        author: userID,
      };
    });
  }
  return sendC(
    getText("alreadyBet", formatNumber(moneyBet), luachon),
    async () => {
      await increaseMoney(
        author,
        global.client.taixiu_ca[threadID].data[author].bet
      );
      await decreaseMoney(author, moneyBet);
      global.client.taixiu_ca[threadID].data[author] = {
        name: luachon,
        bet: moneyBet,
      };
    }
  );
};

function formatNumber(number) {
  return number.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function timeCreate(threadID) {
  setTimeout(() => {
    global.client.taixiu_ca[threadID] = {
      create: true,
    };
  }, 60 * 1000 * 3);
}