module.exports.config = {
  name: "cc",
  version: "1.0.0",
  hasPermssion: 0,
  credit: "Vdang",
  description: "chửi gửi sticker",
  commandCategory: "Tiện ích",
  usages: "[text]",
  cooldowns: 5
}

module.exports.handleEvent = async ({ event, api, Users }) => {
  let KEY = [ 
    "cc", "cl", "dcmm", "cặc", "lồn", "sủa", "dmm", "lol","clm","co cc","Dcmm","Clm","Lồn","Cặc"
  ];
  let thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["bye"] == "undefined", thread["bye"] == false) return
  else {
  if (KEY.includes(event.body.toLowerCase()) !== false) {
    let d = [
      "526214684778630",
      "526220108111421",
      "526220308111401",
      "526220484778050",
      "526220691444696",
      "526220814778017",
      "526220978111334",
      "526221104777988",
      "526221318111300",
      "526221564777942",
      "526221711444594",
      "526221971444568",
     "2041011389459668", "2041011569459650", "2041011726126301", "2041011836126290", "2041011952792945", "2041012109459596", "2041012262792914", "2041012406126233", "2041012539459553", "2041012692792871", "2041014432792697", "2041014739459333", "2041015016125972", "2041015182792622", "2041015329459274", "2041015422792598", "2041015576125916", "2041017422792398", "2041020049458802", "2041020599458747", "2041021119458695", "2041021609458646", "2041022029458604", "2041022286125245"
    ];
    let sticker = d[Math.floor(Math.random() * d.length)];
    let name = await Users.getNameUser(event.senderID);
    let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    })
    let msg = {body: `😤 [ 𝘼𝙪𝙩𝙤 𝙘𝙝𝙪̛̉𝙞 ] 😤
━━━━━━━━━━━━━━
😾 𝙏𝙝𝙞́𝙘𝙝 𝙘𝙝𝙪̛̉𝙞 𝙖̀ ${name}, 𝙘𝙖̂𝙢 𝙢𝙚̣ 𝙢𝙤̂̀𝙢 𝙫𝙖̀𝙤
🤨 𝙏𝙝𝙞́𝙘𝙝 𝙘𝙝𝙪̛̉𝙞 𝙩𝙝𝙞̀ 𝙗𝙤̂́ 𝙢𝙖̀𝙮 𝙘𝙝𝙪̛̉𝙞 𝙢𝙖̀𝙮 𝙘𝙝𝙤 ${name}🖕`, mentions}
    api.sendMessage(msg, event.threadID, (e, info) => {
      setTimeout(() => {
        api.sendMessage({sticker: sticker}, event.threadID);
      }, 100)
    }, event.messageID)
  }
      }
}

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
    "successText": `${this.config.name} thành công`,
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success!",
  }
}

module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["bye"] == "undefined" || data["bye"] == true) data["bye"] = false;
  else data["bye"] = true;
  await Threads.setData(threadID, {
    data
  });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["bye"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
    }