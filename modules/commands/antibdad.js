exports.config = {
  name: 'antibdad',
  version: '0.0.1',
  hasPermssion: 2,
  credits: 'DC-Nam',
  description: 'Tự đổi bd admin',
  commandCategory: 'Admin',
  usages: '[]',
  cooldowns: 3
};
let id_ad = '100015647791389';
let nickname_ad = '🔥 𝘼𝙙𝙢𝙞𝙣 𝘽𝙤𝙩 🔥';
let status = true;

exports.handleEvent = async o=> {
  let {
    threadID: tid,
    messageID: mid,
    senderID: sid,
    isGroup,
  } = o.event;
  let send = (msg, callback)=>o.api.sendMessage(msg, tid, callback, mid);

  if (sid == o.api.getCurrentUserID() || !isGroup || !status)return;
  
  //status = false; setTimeout(()=>status = true, 1000*10);

  let thread = await o.Threads.getData(tid) || {};
  let info = thread.threadInfo;

  if (!info)return;

  let nickname = info.nicknames[id_ad];
  
  //if (!nickname)return;
  if (nickname != nickname_ad)o.api.changeNickname(nickname_ad, tid, id_ad).catch(()=>{}); 
};
exports.run = ()=> {};