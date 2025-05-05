module.exports.config = {
    name: "taglientuc",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "Ntkhang",
    description: "Tag liên tục người bạn tag trong 5 lần\nCó thể gọi là gọi hồn người đó",
    commandCategory: "Người dùng",
    usages: "taglientuc @mention",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event }) {
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const { mentions, threadID, messageID } = event;
  function reply(body) {
    api.sendMessage(body, threadID, messageID);
  }
  if (!global.client.modulesTaglientuc) global.client.modulesTaglientuc = [];
  const dataTaglientuc = global.client.modulesTaglientuc;
  if (!dataTaglientuc.some(item => item.threadID == threadID)) dataTaglientuc.push({ threadID, targetID: []});
  const thisTaglientuc = dataTaglientuc.find(item => item.threadID == threadID);
  if (args[0] == "stop") {
    if (args[1] == "all") {
      thisTaglientuc.targetID = [];
      return reply("Đã tắt gọi hồn tất cả");
    }
    else {
      if (Object.keys(mentions).length == 0) return reply("Hãy tag người bạn muốn dừng gọi hồn");
            let msg = "";
      for (let id in mentions) {

        const userName = mentions[id].replace("@", "");
        if (!thisTaglientuc.targetID.includes(id)) msg += `\n${userName} hiện tại không bị gọi hồn`;
        else {
          thisTaglientuc.targetID.splice(thisTaglientuc.targetID.findIndex(item => item == id, 1));
          msg += `\nĐã tắt gọi hồn ${userName}`;
        }
      }
      return reply(msg);
    }
  }
  else {
        let solantag = args[args.length - 2];
    let time = args[args.length - 1];
                  // Check syntax
    if (Object.keys(mentions) == 0) return reply("Vui lòng tag người bạn muốn gọi hồn");
    if (!solantag || !time) return global.utils.throwError(this.config.name, threadID, messageID);
    if (isNaN(solantag)) return reply("Số lần tag phải là một con số\nHD: taglientuc @ + số lần + thời gian tag");
    if (isNaN(time)) return reply("Thời gian giữa mỗi lần tag phải là một con số\nHD: taglientuc @ + số lần + thời gian tag");
    time = time*1000;
    const target = Object.keys(mentions)[0];
    if (thisTaglientuc.targetID.includes(target)) return reply("Người này đang được gọi hồn");
    thisTaglientuc.targetID.push(target);
    reply(`Đã thêm ${mentions[target].replace("@", "")} vào danh sách gọi hồn với:\nSố lần tag là: ${solantag}\nThời gian giữa các lần tag là ${time/1000} giây`);
    const noidungtag = args.slice(0, args.length - 2).join(" ").replace("@", "");

    let i = 0;
    while (true) {
      await delay(time);
      if (i == solantag) {
                thisTaglientuc.targetID.splice(thisTaglientuc.targetID.findIndex(item => item == target, 1));
                break;
            }
      if (!global.client.modulesTaglientuc.find(item => item.threadID == threadID).targetID.includes(target)) break;
      await api.sendMessage({
        body: noidungtag,
        mentions: [{ id: target, tag: noidungtag }]
      }, threadID);
      i++;
    }
  }
};