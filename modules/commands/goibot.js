const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibotv2",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "JRT",
  description: "goibot",
  commandCategory: "noprefix",
  usages: "noprefix",
  cooldowns: 5,
};
module.exports.handleEvent = function({ api, event }) {
  var { threadID, messageID } = event;
  var tl = ["𝑿𝒊𝒏 𝒄𝒉𝒂̀𝒐,𝑩𝒐𝒕 𝒔𝒂̆̃𝒏 𝒔𝒂̀𝒏𝒈 𝒑𝒉𝒖̣𝒄 𝒗𝒖̣ 𝒂̣", "𝑫𝒛𝒂𝒂 𝒃𝒐𝒕 𝒅𝒂𝒚 𝒂𝒂 :𝟑𝟑", "𝑨𝒅𝒎𝒊𝒏 𝒃𝒐𝒕: 𝒉𝒕𝒕𝒑𝒔://www.facebook.com/lekhanhhihi 𝑪𝒂̂̀𝒏 𝒈𝒊̀ 𝒕𝒉𝒊̀ 𝒍𝒊𝒆̂𝒏 𝒍𝒂̣𝒄 𝒏𝒉𝒂𝒂", "𝑩𝒐𝒕 𝒔𝒂̆̃𝒏 𝒔𝒂̀𝒏𝒈 𝒏𝒉𝒂̣̂𝒏 𝒍𝒆̣̂𝒏𝒉 𝒕𝒖̛̀ 𝒃𝒂̣𝒏 ", "𝑰 𝒍𝒐𝒗𝒆 𝒚𝒐𝒖𝒖", "𝒀𝒆̂𝒖 𝒆𝒎𝒔 :𝒗", "𝒀𝒆̂𝒖 𝒂𝒏𝒉𝒔 :𝒗", "𝑯𝒊, 𝒄𝒉𝒂̀𝒐 𝒄𝒐𝒏 𝒗𝒐̛̣ 𝒃𝒆́:𝟑", "𝑩𝒔𝒗𝒗 𝒏𝒉𝒂𝒂", "𝑺𝒖̛̉ 𝒅𝒖̣𝒏𝒈 𝒄𝒂𝒍𝒍𝒂𝒅 𝒅𝒆̂̉ 𝒍𝒊𝒆̂𝒏 𝒍𝒂̣𝒄 𝒗𝒐̛́𝒊 𝒂𝒅𝒎𝒊𝒏 𝒏𝒆̂́𝒖 𝒃𝒂̣𝒏 𝒄𝒂̂̀𝒏 𝒉𝒐̂̃ 𝒕𝒓𝒐̛̣!", "𝑬𝒎 𝒍𝒂̀ 𝒃𝒐𝒕 𝒄𝒖𝒕𝒆 𝒏𝒉𝒂̂́𝒕 𝒉𝒂̀𝒏𝒉 𝒕𝒊𝒏𝒉", "𝑵𝒐́𝒊 𝒈𝒊̀ 𝒕𝒉𝒆̂́ 𝒄𝒐𝒏 𝒍𝒐̛̣𝒏 𝒕 𝒗𝒂̂̃𝒏 𝒍𝒖𝒐̂𝒏 𝒐̛̉ 𝒅𝒂̂𝒚 𝒏𝒉𝒆́ 😏", "𝑩𝒕𝒗𝒗 𝒏𝒉𝒂𝒂", "𝒀𝒆̂𝒖 𝒄𝒂̣̂𝒖 𝒏𝒉𝒂̂́𝒕💟", "𝑻𝒉𝒖̛𝒐̛𝒏𝒈 𝒄𝒂̣̂𝒖 𝒏𝒉𝒂̂́𝒕 🥺", "𝑼𝒘𝑼", "𝒙𝒂𝒐 𝒕𝒉𝒆̂́ 𝒄𝒐̂𝒏𝒈 𝒄𝒉𝒖́𝒂𝒂", "𝑪𝒂̣̂𝒖 𝒃𝒂̉𝒐 𝒗𝒆̣̂ 𝒕𝒉𝒆̂́ 𝒈𝒊𝒐̛́𝒊, 𝒕𝒐̛́ 𝒃𝒂̉𝒐 𝒗𝒆̣̂ 𝒄𝒂̣̂𝒖", "Chăm chỉ học hành đi", "𝑩𝒂𝒆 𝒂̆𝒏 𝒄𝒐̛𝒎 𝒄𝒉𝒖̛𝒂?", "𝑪𝒐́ 𝒕𝒂̂́𝒕 𝒄𝒂̉ 𝒏𝒉𝒖̛𝒏𝒈 𝒕𝒉𝒊𝒆̂́𝒖 𝒆𝒎 :<", "𝑵𝒆̂́𝒖 𝒄𝒂̣̂𝒖 𝒅𝒂𝒏𝒈 𝒄𝒐̂ 𝒅𝒐̛𝒏 𝒕𝒉𝒊̀ 𝒄𝒉𝒖́𝒏𝒈 𝒕𝒂 𝒄𝒐́ 𝒕𝒉𝒆̂̉ 𝒕𝒉𝒂̀𝒏𝒉 𝒅𝒐̂𝒊 :𝟑", "𝑫𝒂𝒏𝒈 𝒍𝒂̀𝒎 𝒈𝒊̀ 𝒗𝒂̣̂𝒚?", "𝑫𝒖̛𝒐̛̣𝒄 𝒄𝒖̉𝒂 𝒍𝒐́ :)))", "𝑬𝒎 𝒅𝒕𝒉𝒘 𝒏𝒉𝒖̛ 𝒄𝒉𝒖̉ 𝒄𝒖̉𝒂 𝒆𝒎 𝒂̣", "𝑫𝒖̛̀𝒏𝒈 𝒌𝒉𝒆𝒏 𝒆𝒎 𝒏𝒈𝒂̣𝒊 𝒒𝒖𝒂́ 𝒉𝒊́ 𝒉𝒊́" , "𝑫𝒖̛̀𝒏𝒈 𝒔𝒑𝒂𝒎 𝒆𝒎 𝒏𝒉𝒂 :<<, 𝒄𝒂̣̂𝒖 𝒄𝒉𝒖̉ 𝒆𝒎 𝒎𝒆̣̂𝒕 𝒍𝒂̆́𝒎 𝒐̛̀𝒊", "𝑪𝒖́𝒕 𝒏𝒈𝒂𝒚 𝒔𝒑𝒂𝒎 𝒄𝒄", "𝑪𝒐̂𝒏𝒈 𝒄𝒉𝒖́𝒂 𝒄𝒖̉𝒂 𝒃𝒐𝒕 𝒔𝒂𝒐 𝒅𝒂̂́𝒚?", "𝑯𝒐𝒂̀𝒏𝒈 𝒕𝒖̛̉ 𝒄𝒖̉𝒂 𝒃𝒐𝒕 𝒔𝒂𝒐 𝒅𝒂̂́𝒚?", "𝑺𝒑𝒂𝒎 𝒄𝒄 𝒄𝒖́𝒕", "𝒀𝒆̂𝒖 𝒆𝒎 𝒌𝒉𝒐̂𝒏𝒈?", "𝑩𝒂̣𝒏 𝒃𝒊̣ 𝒍𝒂̀𝒎 𝒔𝒂𝒐 𝒊́@@", "𝑵𝒉𝒂̂́𝒕 𝒃𝒂̣𝒏,𝒃𝒂̣𝒏 𝒍𝒂̀ 𝒏𝒉𝒂̂́𝒕!!!", "𝑲𝒆̂𝒖 𝒄𝒉𝒊 𝒍𝒂̆́𝒎 𝒕𝒉𝒆̂́? 𝑩𝒐̣̂ 𝒕𝒉𝒊́𝒄𝒉 𝒕𝒂𝒐 𝒓𝒐̂̀𝒊 𝒂̀ :𝒗", "𝑬𝒎... 𝑺𝒂𝒐 𝒆𝒎 𝒍𝒂̣𝒊 𝒏𝒐́𝒊 𝒏𝒉𝒖̛̃𝒏𝒈 𝒄𝒂́𝒊 𝒍𝒐̛̀𝒊 𝒅𝒐́ 𝒄𝒉𝒊 𝒛𝒂𝒚 𝒆𝒎?", "𝒀𝒆𝒖 𝒆𝒎 𝒓𝒂𝒕 𝒏𝒉𝒊𝒆𝒖 ^^", "𝑩𝒂𝒃𝒚, 𝒕𝒂𝒌𝒆 𝒎𝒚 𝒉𝒂𝒏𝒅. 𝑰 𝒘𝒂𝒏𝒕 𝒚𝒐𝒖 𝒕𝒐 𝒃𝒆 𝒎𝒚 𝒉𝒖𝒔𝒃𝒂𝒏𝒅. 𝑪𝒂𝒖𝒔𝒆 𝒚𝒐𝒖'𝒓𝒆 𝒎𝒚 𝑰𝒓𝒐𝒏 𝑴𝒂𝒏. 𝑨𝒏𝒅 𝑰 𝒍𝒐𝒗𝒆 𝒚𝒐𝒖 𝟑𝟎𝟎𝟎 <𝟑", "𝑪𝒉𝒊̉ 𝒄𝒂̂̀𝒏 𝒂𝒏𝒉 𝒏𝒐́𝒊 𝒚𝒆̂𝒖, 𝒆𝒎 𝒔𝒆̃ 𝒃𝒂́𝒎 𝒕𝒉𝒆𝒐 𝒂𝒏𝒉 𝒔𝒖𝒐̂́𝒕 𝒅𝒐̛̀𝒊", "𝑫𝒖̛̀𝒏𝒈 𝒒𝒖𝒂́ 𝒚𝒆̂𝒖 𝒎𝒐̣̂𝒕 𝒂𝒊 𝒅𝒐́, 𝒌𝒉𝒊 𝒄𝒉𝒊́𝒏𝒉 𝒃𝒂̉𝒏 𝒕𝒉𝒂̂𝒏 𝒃𝒂̣𝒏 𝒗𝒂̂̃𝒏 𝒃𝒊̣ 𝒕𝒐̂̉𝒏 𝒕𝒉𝒖̛𝒐̛𝒏𝒈!", "𝑩𝒂𝒆, 𝒆𝒎 𝒏𝒉𝒖 𝒃𝒐𝒏𝒈 𝒉𝒐𝒂. 𝑵𝒉𝒖𝒏𝒈 𝒏𝒈𝒖𝒐𝒊 𝒉𝒂𝒊 𝒅𝒂𝒖 𝒑𝒉𝒂𝒊 𝒕𝒂 💔", "𝑶𝒗𝒆𝒓𝒏𝒊𝒈𝒉𝒕 𝒌𝒉𝒐̂𝒏𝒈?", "𝑯𝒂̃𝒚 𝒈𝒐̣𝒊 𝒄𝒉𝒐 𝒆𝒎 𝒅𝒆̂̉ 𝒅𝒖̛𝒐̛̣𝒄 𝒚𝒆̂𝒖 𝒕𝒉𝒖̛𝒐̛𝒏𝒈<𝟑", "𝑯𝒂́𝒕 𝒅𝒊 𝒄𝒉𝒐 𝒌𝒆̣𝒐 🍭"];
  var rand = tl[Math.floor(Math.random() * tl.length)]

  if ((event.body.toLowerCase() == "bot chó") || (event.body.toLowerCase() == "bot cho")) {
    return api.sendMessage("𝑪𝒉𝒐́ 𝒏𝒂̀𝒐 𝒗𝒖̛̀𝒂 𝒏𝒐́𝒊 𝒙𝒂̂́𝒖 𝒕𝒂𝒐 𝒅𝒂̂́𝒚, 𝒎𝒖𝒐̂́𝒏 𝒄𝒉𝒆̂́𝒕 𝒉𝒂̉😠", threadID);
  };

  if ((event.body.toLowerCase() == "bot óc chó") || (event.body.toLowerCase() == "bot óc cho")) {
    return api.sendMessage("𝑪𝒉𝒐́ 𝒏𝒂̀𝒐 𝒗𝒖̛̀𝒂 𝒏𝒐́𝒊 𝒙𝒂̂́𝒖 𝒕𝒂𝒐 𝒅𝒂̂́𝒚, 𝒎𝒖𝒐̂́𝒏 𝒄𝒉𝒆̂́𝒕 𝒉𝒂̉😠", threadID);
  };

  if ((event.body.toLowerCase() == "ôi") || (event.body.toLowerCase() == "ôii")) {
    return api.sendMessage("𝑶̂𝒊?... 𝑨̀. \𝒏𝑶̂𝒊 𝒉𝒂̀𝒏𝒈 𝒄𝒂̂𝒚 𝒙𝒂𝒏𝒉 𝒕𝒉𝒂̆́𝒎 𝒅𝒖̛𝒐̛́𝒊 𝒕𝒓𝒖̛𝒐̛̀𝒏𝒈 𝒎𝒆̂́𝒏 𝒚𝒆̂𝒖, 𝑪𝒐́ 𝒍𝒐𝒂̀𝒊 𝒄𝒉𝒊𝒎 𝒅𝒂𝒏𝒈 𝒉𝒐́𝒕 𝒂̂𝒎 𝒕𝒉𝒂̂̀𝒎 𝒕𝒖̛̣𝒂 𝒏𝒉𝒖̛ 𝒏𝒐́𝒊", threadID);
  };

  if ((event.body.toLowerCase() == "ối") || (event.body.toLowerCase() == "ốii")) {
    return api.sendMessage("𝒐̂́𝒊 𝒄𝒄 𝒕𝒖̛𝒐̛𝒏𝒈 𝒕𝒂́𝒄 𝒅𝒊 𝒄𝒐𝒏 𝒍𝒐̛̣𝒏", threadID);
  };

  if ((event.body.toLowerCase() == "ơi") || (event.body.toLowerCase() == "ới")) {
    return api.sendMessage("𝑶̛𝒊𝒊𝒊𝒊𝒊𝒊! 𝒐̛́𝒊 𝒐̛𝒊 𝒌𝒉𝒐𝒂𝒏 𝒉𝒐̀ 𝒌𝒉𝒐𝒂𝒏 𝒕𝒊𝒆̂́𝒏𝒈 𝒉𝒂́𝒕 𝒃𝒐𝒕 𝒗𝒂𝒏𝒈 𝒄𝒂̉ 𝒏𝒉𝒐́𝒎 𝒄𝒉𝒂𝒕.", threadID);
  };

  if ((event.body.toLowerCase() == "ỏ") || (event.body.toLowerCase() == "o")) {
    return api.sendMessage("𝑶̉ 𝒉𝒐̂𝒎 𝒏𝒂𝒚 𝒕𝒓𝒐̛̀𝒊 𝒅𝒆̣𝒑 𝒕𝒉𝒆̂́ 𝒏𝒉𝒐̛̀", threadID);
  };

  if ((event.body.toLowerCase() == "ừm") || (event.body.toLowerCase() == "um")) {
    return api.sendMessage("𝑼̛̀𝒎, 𝒂̀, 𝒐̛̀...𝒃𝒐𝒕 𝒎𝒂̂́𝒕 𝒐̛̀...", threadID);
  };

  if ((event.body.toLowerCase() == "à") || (event.body.toLowerCase() == "àa")) {
    return api.sendMessage("𝑨̀ 𝒕𝒉𝒆̂́ 𝒍𝒂̀𝒎 𝒔𝒂𝒐 𝒎𝒂̀ 𝒂̀", threadID);
  };

  if ((event.body.toLowerCase() == "ừ") || (event.body.toLowerCase() == "u")) {
    return api.sendMessage("𝒖̉𝒂 𝒔𝒂𝒐 𝒆𝒎 𝒄𝒖𝒕𝒆 𝒕𝒉𝒆̂́ 𝒏𝒉𝒐̛̉ :>", threadID);
  };

  if ((event.body.toLowerCase() == "ủa") || (event.body.toLowerCase() == "ua")) {
    return api.sendMessage("𝒖̉𝒂 𝒔𝒂𝒐 𝒆𝒎 𝒄𝒖𝒕𝒆 𝒕𝒉𝒆̂́ 𝒏𝒉𝒐̛̉ :>", threadID);
  };

  if ((event.body.toLowerCase() == "uk") || (event.body.toLowerCase() == "uk")) {
    return api.sendMessage("Ừ", threadID);
  };

  if ((event.body.toLowerCase() == "dạ") || (event.body.toLowerCase() == "da")) {
    return api.sendMessage("𝒆𝒃𝒆 𝒄𝒖̛ 𝒕𝒆̂ 𝒛𝒂𝒚𝒚 :𝒗", threadID);
  };

  if ((event.body.toLowerCase() == "yêu") || (event.body.toLowerCase() == "yeu")) {
    return api.sendMessage("𝒀𝒆̂𝒖 𝒃𝒐𝒕 𝒏𝒆̀𝒆", threadID);
  };

  if ((event.body.toLowerCase() == "đmm") || (event.body.toLowerCase() == "dm")) {
    return api.sendMessage("𝑻𝒉𝒂̆̀𝒏𝒈 𝒏𝒂̀𝒚 𝒎𝒂̂́𝒕 𝒅𝒂̣𝒚 𝒄𝒉𝒖̛̉𝒊 𝒃𝒂̣̂𝒚 𝒍𝒂̀ 𝒌 𝒅𝒖̛𝒐̛̣𝒄 𝒓", threadID);
  };

  if ((event.body.toLowerCase() == "đmm bot") || (event.body.toLowerCase() == "dmm bot")) {
    return api.sendMessage("𝑪𝒂́𝒊 𝒍𝒐𝒏 𝒎𝒂́, 𝒃𝒐̣𝒏 𝒎 𝒅𝒖̛̀𝒏𝒈 𝒄𝒂̉𝒏 𝒕𝒂𝒐 𝒉𝒐̂𝒎 𝒏𝒂𝒚 𝒕 𝒑𝒉𝒂̉𝒊 𝒅𝒂̂́𝒎 𝒄𝒄𝒎𝒏", threadID);
  };

  if ((event.body.toLowerCase() == "chửi cmm") || (event.body.toLowerCase() == "chui cmm")) {
    return api.sendMessage("𝑻𝒂𝒐 𝒕𝒉𝒊́𝒄𝒉", threadID);
  };

  if ((event.body.toLowerCase() == "cmm bot") || (event.body.toLowerCase() == "cmm bot loll")) {
    return api.sendMessage("𝑪𝒉𝒖̛̉𝒊 𝒄𝒄 𝒈𝒊̀ ? 𝒅𝒂̂́𝒎 𝒏𝒉𝒂𝒖 𝒌𝒐?", threadID);
  };

  if ((event.body.toLowerCase() == "địt") || (event.body.toLowerCase() == "dit")) {
    return api.sendMessage("mất dạy", threadID);
  };

  if ((event.body.toLowerCase() == "địt cc") || (event.body.toLowerCase() == "dit cc")) {
    return api.sendMessage("dmm", threadID);
  };

  if ((event.body.toLowerCase() == "bot yeu") || (event.body.toLowerCase() == "bot yêu")) {
    return api.sendMessage("then kiu", threadID);
  };

  if ((event.body.toLowerCase() == "a yeu") || (event.body.toLowerCase() == "a yêu")) {
    return api.sendMessage("Gọi ai đó", threadID);
  };

  if ((event.body.toLowerCase() == "sim") || (event.body.toLowerCase() == "simp")) {
    return api.sendMessage("Gọi ᴍɪ ɴʜᴏɴ hả", threadID);
  };

  if ((event.body.toLowerCase() == "@𝕀'𝕞 𝕗𝕚𝕟𝕖") || (event.body.toLowerCase() == "@Duy")) {
    return api.sendMessage("Gọi gì á", threadID);
  };

  if ((event.body.toLowerCase() == "bot ơi") ||  (event.body.toLowerCase() == "bot oi")) {
    return api.sendMessage("Sao thế", threadID);
  };

  if ((event.body.toLowerCase() == "yêu bot") || (event.body.toLowerCase() == "yeu bot")) {
    return api.sendMessage("Hmm... ", threadID);
  };

   if ((event.body.toLowerCase() == "yêu anh") || (event.body.toLowerCase() == "yeu anh")) {
    return api.sendMessage("Anh cũng yêu em <3", threadID);
  };

  if ((event.body.toLowerCase() == "chửi cc") || (event.body.toLowerCase() == "chui cc")) {
    return api.sendMessage("️chửi ai thế thanglon, tao có súng đó 👉", threadID);
  };

  if ((event.body.toLowerCase() == "hentai") || (event.body.toLowerCase() == "hentaiz")) {
    return api.sendMessage("Hả 😋, em thích coi lắm", threadID);
  };

  if ((event.body.toLowerCase() == "cc cút") || (event.body.toLowerCase() == "cc cut")) {
    return api.sendMessage("Sao mày ko cút? Mà bảo tao :) mệt lồn ghê :>", threadID);
  };

  if ((event.body.toLowerCase() == "vãi") || (event.body.toLowerCase() == "vai")) {
    return api.sendMessage("Vãi gì?", threadID);
  };

  if ((event.body.toLowerCase() == "alo") || (event.body.toLowerCase() == "a lô")) {
    return api.sendMessage("Ừ !! biết rồi", threadID);
  };

  if ((event.body.toLowerCase() == "aloo") || (event.body.toLowerCase() == "alooo")) {
    return api.sendMessage("Alo", threadID);
  };

  if ((event.body.toLowerCase() == "link") || (event.body.toLowerCase() == "linh")) {
    return api.sendMessage("Link bao nhiêu phút á cho e xem với nào 🤤", threadID);
  };

  if ((event.body.toLowerCase() == "cứu") || (event.body.toLowerCase() == "cuu")) {
    return api.sendMessage("chetmm", threadID);
  };

  if ((event.body.toLowerCase() == "anime") || (event.body.toLowerCase() == "Anime")) {
    return api.sendMessage("cosplay anime", threadID);
  };

  if ((event.body.toLowerCase() == "đi gây war") || (event.body.toLowerCase() == "di gay war")) {
    return api.sendMessage("thôi bạn ơi, lại đây bot thwng❤", threadID);
  };

  if ((event.body.toLowerCase() == "thích gây war à") || (event.body.toLowerCase() == "thich gay war a")) {
    return api.sendMessage("thôi bạn ơi, lại đây bot iu😘", threadID);
  };  

  if ((event.body.toLowerCase() == "hát đi mng") || (event.body.toLowerCase() == "hat di mng")) {
    return api.sendMessage("Thôi để bot hát trước cho 3 2 1\n Ở phương trời xa xôi , ngày tháng dần trôi vô tình. Có khi nào dừng lại và anh nhớ. Nhớ em như hằng ngày , lòng em vẫn luôn nhớ người. Nhớ như in nụ cười ngày gặp nhauu....😊", threadID);
  };

  if ((event.body.toLowerCase() == "hát đi") || (event.body.toLowerCase() == "hat di")) {
    return api.sendMessage("Thôi để bot hát trước cho 3 2 1\n Ở phương trời xa xôi , ngày tháng dần trôi vô tình. Có khi nào dừng lại và anh nhớ. Nhớ em như hằng ngày , lòng em vẫn luôn nhớ người. Nhớ như in nụ cười ngày gặp nhauu....😊", threadID);
  };  

  if ((event.body.toLowerCase() == "bot hát đi") || (event.body.toLowerCase() == "bot hat di")) {
    return api.sendMessage("Thôi để bot hát trước cho 3 2 1\n Ở phương trời xa xôi , ngày tháng dần trôi vô tình. Có khi nào dừng lại và anh nhớ. Nhớ em như hằng ngày , lòng em vẫn luôn nhớ người. Nhớ như in nụ cười ngày gặp nhauu....😊", threadID);
  };

  if ((event.body.toLowerCase() == "hát đi nào") || (event.body.toLowerCase() == "hát đi nào")) {
    return api.sendMessage("Thôi để bot hát trước cho 3 2 1\n Ở phương trời xa xôi , ngày tháng dần trôi vô tình. Có khi nào dừng lại và anh nhớ. Nhớ em như hằng ngày , lòng em vẫn luôn nhớ người. Nhớ như in nụ cười ngày gặp nhauu....😊", threadID);
  };

  if ((event.body.toLowerCase() == "hát đi bot") || (event.body.toLowerCase() == "hat di bot")) {
    return api.sendMessage("Oke nghe nè\n Ở phương trời xa xôi , ngày tháng dần trôi vô tình. Có khi nào dừng lại và anh nhớ. Nhớ em như hằng ngày , lòng em vẫn luôn nhớ người. Nhớ như in nụ cười ngày gặp nhauu....😊", threadID);
  };

  if ((event.body.toLowerCase() == "tt di mng") || (event.body.toLowerCase() == "tt đi mng")) {
    return api.sendMessage("️ko tt thì kick", threadID);
  };

  if ((event.body.toLowerCase() == "tt đi nào mng") || (event.body.toLowerCase() == "tt di nao mng")) {
    return api.sendMessage("️Ai ko tt thì kick đê", threadID);
  };

  if ((event.body.toLowerCase() == "tt mng ơi") || (event.body.toLowerCase() == "tt mng oi")) {
    return api.sendMessage("️tt lẹ", threadID);
  };

  if ((event.body.toLowerCase() == "nn nha mn") || (event.body.toLowerCase() == "nn nha mng")) {
    return api.sendMessage("️Ngủ ngon😴 Chúc bạn có giấc mơ siêu đẹp <3", threadID);
  };

  if ((event.body.toLowerCase() == "admin m là ai v bot") || (event.body.toLowerCase() == "admin m la ai v bot")) {
    return api.sendMessage("bot ko có admin 🥺, ai nhận nuôi bot đi <3", threadID);
  };

  if ((event.body.toLowerCase() == "admin m là ai vậy bot") || (event.body.toLowerCase() == "admin m la ai vậy bot")) {
    return api.sendMessage("bot ko có admin 🥺, ai nhận nuôi bot đi", threadID);
  };

  if ((event.body.toLowerCase() == "tt di mn") || (event.body.toLowerCase() == "tt đi mn")) {
    return api.sendMessage("️tt nhiều lên nào mọi người", threadID);
  };

  if ((event.body.toLowerCase() == "flop quá") || (event.body.toLowerCase() == "flop qua")) {
    return api.sendMessage("️đưa qtv đây bot kick all cho nhanh", threadID);
  };

  if ((event.body.toLowerCase() == "con cặc") || (event.body.toLowerCase() == "con cac")) {
    return api.sendMessage("️Đm móc ra bố check hàng :)))", threadID);
  };

  if ((event.body.toLowerCase() == "cai lồn") || (event.body.toLowerCase() == "cai lon")) {
    return api.sendMessage("️Mày bẩn vừa thôi con lồn :)))", threadID);
  };

  if ((event.body.toLowerCase() == "clozz") || (event.body.toLowerCase() == "clozz")) {
    return api.sendMessage("️Mày bẩn vừa thôi con lồn :)))", threadID);
  };

  if ((event.body.toLowerCase() == "clmm bot lon") || (event.body.toLowerCase() == "clmm bot")) {
    return api.sendMessage("️Chửi gì đấy con dog :) bố m mày nhịn mày lâu lắm rồi đấy nhá", threadID);
  };

  if ((event.body.toLowerCase() == "bot ncc") || (event.body.toLowerCase() == "bot cc")) {
    return api.sendMessage("️Chửi gì đấy con dog :) bố mmày nhịn mày lâu lắm rồi đấy nhá", threadID);
  };

  if ((event.body.toLowerCase() == "cc bot ngu") || (event.body.toLowerCase() == "cc bot")) {
    return api.sendMessage("️Chửi gì đấy con dog :) bố mmày nhịn mày lâu lắm rồi đấy nhá", threadID);
  };

  if ((event.body.toLowerCase() == "cac") || (event.body.toLowerCase() == "cặc")) {
    return api.sendMessage("️Văn minh chút đi bạn ơi lớn rồi đừng để ăn chửi :)", threadID);
  };

  if ((event.body.toLowerCase() == "why") || (event.body.toLowerCase() == "why")) {
    return api.sendMessage("️i đôn nôu éng lít", threadID);
  };

  if ((event.body.toLowerCase() == "woa") || (event.body.toLowerCase() == "woaa")) {
    return api.sendMessage("️to thế", threadID);
  };

  if ((event.body.toLowerCase() == "bot dthw quá") || (event.body.toLowerCase() == "bot dthw qua")) {
    return api.sendMessage("️dạ quá khen ạ hihi :>", threadID);
  };

  if ((event.body.toLowerCase() == "hahaha") || (event.body.toLowerCase() == "haha")) {
    return api.sendMessage("️cười dê quá à đm:))", threadID);
  };

  if ((event.body.toLowerCase() == "kkkk") || (event.body.toLowerCase() == "kkk")) {
    return api.sendMessage("️Cười dê quá à đm:))", threadID);
  };

  if ((event.body.toLowerCase() == "con nay") || (event.body.toLowerCase() == "con này")) {
    return api.sendMessage("️là con mèo", threadID);
  };

  if ((event.body.toLowerCase() == "cái lồn") || (event.body.toLowerCase() == "cái lon")) {
    return api.sendMessage("mày matday vừa thôi:))", threadID);
  };

  if ((event.body.toLowerCase() == "lồn") || (event.body.toLowerCase() == "lon")) {
    return api.sendMessage("️Văn minh chút đi bạn ơi lớn rồi đừng để ăn chửi :)", threadID);
  };

  if ((event.body.toLowerCase() == "đm") || (event.body.toLowerCase() == "dm")) {
    return api.sendMessage("️Văn minh chút đi bạn ơi lớn rồi đừng để ăn chửi :)", threadID);
  };

  if ((event.body.toLowerCase() == "đm bot") || (event.body.toLowerCase() == "dm bot")) {
    return api.sendMessage("️Chửi cc gì đấy sủa lại bố mày nghe nào :) nít ranh mà cứ thích sồn :)", threadID);
  };

  if ((event.body.toLowerCase() == "lozz") || (event.body.toLowerCase() == "lozzz")) {
    return api.sendMessage("️Văn minh chút đi bạn ơi lớn rồi đừng để ăn chửi :)", threadID);
  };

  if ((event.body.toLowerCase() == "clmm") || (event.body.toLowerCase() == "bot clmm")) {
    return api.sendMessage("️Bớt chửi thề cho nên người đi bạn êi :))) ko tao vả chetmemay giờ", threadID);
  };

  if ((event.body.toLowerCase() == "ko ai thương t hết") || (event.body.toLowerCase() == "ko ai thuong t het")) {
    return api.sendMessage("️Thôi ngoan nào bot thương bạn mà <3 <3 ", threadID);
  };

  if ((event.body.toLowerCase() == "bot có yêu em không") || (event.body.toLowerCase() == "bot yeu em khong")) {
    return api.sendMessage("Hi, Bot yêu em hơn cả ny em cơ, yêu bot đi <3", threadID);
  };

  if ((event.body.toLowerCase() == "bot có yêu admin bot không") || (event.body.toLowerCase() == "bot co yeu admin bot khong")) {
    return api.sendMessage("ko", threadID);
  };

  if ((event.body.toLowerCase() == "bot có người yêu chưa") || (event.body.toLowerCase() == "bot co nguoi yeu chua")) {
    return api.sendMessage("Rồi ạ, là cậu đấy <3", threadID);
  };

  if ((event.body.toLowerCase() == "bot im đi") || (event.body.toLowerCase() == "bot im di")) {
    return api.sendMessage("dạ", threadID);
  };

  if ((event.body.toLowerCase() == "bot cút đi") || (event.body.toLowerCase() == "bot cut di")) {
    return api.sendMessage("Mày cút rồi bố mày cút, ko khiến mày lên tiếng :))))", threadID);
  };

  if ((event.body.toLowerCase() == "bot chửi cái lon gì") || (event.body.toLowerCase() == "bot chui cai lon gi")) {
    return api.sendMessage("Chửi mày đấy, nhục vãi hahaha :>>, còn hỏi", threadID);
  };

  if ((event.body.toLowerCase() == "bot có buồn ko") || (event.body.toLowerCase() == "bot co buon ko")) {
    return api.sendMessage("Có mọi người sao bé buồn đc <3 yêu lắm <3", threadID);
  };

  if ((event.body.toLowerCase() == "bot có yêu t ko") || (event.body.toLowerCase() == "bot co yeu t ko")) {
    return api.sendMessage("𝑫𝒂̣ 𝒄𝒐́ 𝒚𝒆̂𝒖 𝒄𝒂̣̂𝒖 𝒗𝒂̀ 𝒎𝒐̣𝒊 𝒏𝒈𝒖̛𝒐̛̀𝒊 𝒏𝒉𝒊𝒆̂̀𝒖 𝒍𝒂̆́𝒎", threadID);
  };

  if ((event.body.toLowerCase() == "bot đi ngủ đi") || (event.body.toLowerCase() == "bot di ngu di")) {
    return api.sendMessage("𝑻𝒐̛́ 𝒍𝒂̀ 𝒃𝒐𝒕, 𝒄𝒂̣̂𝒖 𝒍𝒂̀ 𝒏𝒈𝒖̛𝒐̛̀𝒊 𝒏𝒆̂𝒏 𝒄𝒂̂̀𝒏 𝒅𝒊 𝒏𝒈𝒖̉ 𝒏𝒆̀ <𝟑", threadID);
  };

  if ((event.body.toLowerCase() == "bot ăn cơm chưa") || (event.body.toLowerCase() == "bot an com chua")) {
    return api.sendMessage("𝑴𝒊̀𝒏𝒉 𝒏𝒉𝒊̀𝒏 𝒄𝒂̣̂𝒖 𝒂̆𝒏 𝒍𝒂̀ 𝒕𝒉𝒂̂́𝒚 𝒏𝒐 𝒓𝒐̂̀𝒊 <𝟑", threadID);
  };

  if ((event.body.toLowerCase() == "bot có thương tui ko") || (event.body.toLowerCase() == "bot co thuong tui ko")) {
    return api.sendMessage("𝑫𝒛𝒂𝒂 𝒄𝒐́ 𝒂̣ <3", threadID);
  };

  if ((event.body.toLowerCase() == "bot có thương t ko") || (event.body.toLowerCase() == "bot co thuong t ko")) {
    return api.sendMessage("𝑫𝒛𝒂𝒂 𝒄𝒐́ 𝒂̣<3", threadID);
  };

  if ((event.body.toLowerCase() == "Hong be oi") || (event.body.toLowerCase() == "Hong bé ơi")) {
    return api.sendMessage("𝑰 𝒍𝒐𝒗𝒆 𝒚𝒐𝒖 𝒊𝒖 𝒄𝒂̣̂𝒖 𝒄𝒉𝒖̉ 𝒆𝒎 𝒏𝒉𝒂 😻", threadID);
  };

  if ((event.body.toLowerCase() == "bot làm thơ đi") ||  (event.body.toLowerCase() == "bot lam tho di")) {
    return api.sendMessage("𝟎 𝒑𝒑", threadID);
  };

  if ((event.body.toLowerCase() == "clmm bot lon") ||  (event.body.toLowerCase() == "clmm bot lon")) {
    return api.sendMessage("𝑴𝒂̀𝒚 𝒄𝒉𝒖̛̉𝒊 𝒈𝒊̀ 𝒅𝒂̂́𝒚 𝒏𝒐́𝒊 𝒓𝒐̃ 𝒍𝒆̂𝒏 𝒃𝒐̂́ 𝒎𝒂̀𝒚 𝒏𝒈𝒉𝒆 𝒍𝒂̣𝒊 𝒙𝒆𝒎 𝒏𝒂̀𝒐 :))?", threadID);
  };

 if ((event.body.toLowerCase() == "bot mới à") || (event.body.toLowerCase() == "Bot mới à")) {
    return api.sendMessage("𝑫𝒂̣ 𝒗𝒂̂𝒏𝒈 𝒆𝒎 𝒍𝒂̀ 𝒃𝒐𝒕 𝒎𝒐̛́𝒊 𝒄𝒖̉𝒂 𝒃𝒐𝒙 𝒂̣ :𝒗", threadID);
  };

  if ((event.body.toLowerCase() == "cc") ||  (event.body.toLowerCase() == "cc")) {
    return api.sendMessage(" 𝑻𝒉𝒖̛́ 𝒎𝒂̂́𝒕 𝒏𝒆̂́𝒕 𝒄𝒖́𝒕 𝒎𝒆̣ 𝒎 𝒅𝒊", threadID);
  };

  if (event.body.indexOf("bot") == 0 || (event.body.indexOf("Bot") == 0)) {
    var msg = {
      body: rand
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = async function ( { api, event } ) {
api.sendMessage(`Tự động trả lời khi có chữ bot dầu tiên`,event.threadID,event.messageID)
}