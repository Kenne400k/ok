module.exports.config = {
  name: "covid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Thiệu Trung Kiên",
  description: "Xem thông tin covid19",
  commandCategory: "Tiện Ích",
  usages: "[Tên quốc gia]",
  cooldowns: 5
};

module.exports.run = async (
{
  api,
  event,
  args
}) =>
{
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  var tip = args.join(" ");
  if (!tip) return api.sendMessage(`𝗡𝗵𝗮̣̂𝗽 𝘁𝗲̂𝗻 𝗾𝘂𝗼̂́𝗰 𝗴𝗶𝗮 🌎`, event.threadID, event.messageID);
  else
  {
    axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(tip)}`).then(res =>
    {
      let nhiem = res.data.cases,
        chet = res.data.deaths,
        dieutri = res.data.recovered,
        danso = res.data.population,
        chauluc = res.data.continent,
        quocgia = res.data.country
      var flag = res.data.countryInfo.flag;
      let callback = function ()
      {
        api.sendMessage(
        {
          body: `🌎𝗤𝘂𝗼̂́𝗰 𝗴𝗶𝗮 : ${quocgia}\n\n🦠𝗡𝗵𝗶𝗲̂̃𝗺: ${nhiem}\n☠️𝗧𝘂̛̉ 𝘃𝗼𝗻𝗴: ${chet} \n❤️𝗖𝗵𝘂̛̃𝗮 𝘁𝗿𝗶̣ : ${dieutri}\n📝𝗗𝗮̂𝗻 𝘀𝗼̂́ : ${danso}\n🔎𝗖𝗵𝗮̂𝘂 𝗹𝘂̣𝗰: ${chauluc}\n`,
          attachment: fs.createReadStream(__dirname + `/cache/covidtk.png`)
        }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/covidtk.png`), event.messageID);
      };
      request(encodeURI(flag)).pipe(fs.createWriteStream(__dirname + `/cache/covidtk.png`)).on("close", callback);
    })
  }
}