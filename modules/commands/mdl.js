module.exports.config = {
    name: "mdl",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "D-Jukie",
    description: "Áp dụng code từ buildtooldev và pastebin",
    commandCategory: "Admin",
    usages: "[reply or text]",
    cooldowns: 0,
    dependencies: {
        "pastebin-api": "",
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
  const permission = ["100090073282948"];
	if (!permission.includes(event.senderID)) return api.sendMessage("báo cáo admin có đứa tính trộm mdl nè 😏", event.threadID, event.messageID);
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
    const { join, resolve } = require("path");
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }
    if(!text && !name) return api.sendMessage('🌸 Vui lòng phản hồi để up lên pastebin', threadID, messageID);
    if(!text && name) {
        var data = fs.readFile(
          `${__dirname}/${args[0]}.js`,
          "utf-8",
          async (err, data) => {
            if (err) return api.sendMessage(`[ 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 ] → 𝗟𝗲̣̂𝗻𝗵 ${args[0]} 𝗸𝗵𝗼̂𝗻𝗴 𝘁𝗼̂̀𝗻 𝘁𝗮̣𝗶!.`, threadID, messageID);
            const { PasteClient } = require('pastebin-api')
            const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
            async function pastepin(name) {
              const url = await client.createPaste({
                code: data,
                expireDate: 'N',
                format: "javascript",
                name: name,
                publicity: 1
              });
              var id = url.split('/')[3]
              return 'https://pastebin.com/raw/' + id
            }
            var link = await pastepin(args[1] || 'noname')
            return api.sendMessage(link, threadID, messageID);
          }
        );
        return
    }
    var urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    var url = text.match(urlR);
    if (url[0].indexOf('pastebin') !== -1) {
        axios.get(url[0]).then(i => {
            var data = i.data
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`[ 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 ] → Đ𝗮̃ 𝘅𝗮̉𝘆 𝗿𝗮 𝗹𝗼̂̃𝗶 𝗸𝗵𝗶 𝗮́𝗽 𝗱𝘂̣𝗻𝗴 𝗰𝗼𝗱𝗲 𝘃𝗮̀𝗼 ${args[0]}.js`, threadID, messageID);
                    api.sendMessage(`[ 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 ] → Đ𝗮̃ 𝗮́𝗽 𝗱𝘂̣𝗻𝗴 𝗰𝗼𝗱𝗲 𝘃𝗮̀𝗼 ${args[0]}.js, 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗹𝗼𝗮𝗱 đ𝗲̂̉ 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴!`, threadID, messageID);
                }
            );
        })
    }

    if (url[0].indexOf('buildtool') !== -1 || url[0].indexOf('tinyurl.com') !== -1) {
        const options = {
            method: 'GET',
            url: messageReply.body
        };
        request(options, function (error, response, body) {
            if (error) return api.sendMessage('[ 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 ] → 𝗩𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝗰𝗵𝗶̉ 𝗿𝗲𝗽𝗹𝘆 𝗹𝗶𝗻𝗸 (𝗸𝗵𝗼̂𝗻𝗴 𝗰𝗵𝘂̛́𝗮 𝗴𝗶̀ 𝗸𝗵𝗮́𝗰 𝗻𝗴𝗼𝗮̀𝗶 𝗹𝗶𝗻𝗸)', threadID, messageID);
            const load = cheerio.load(body);
            load('.language-js').each((index, el) => {
                if (index !== 0) return;
                var code = el.children[0].data
                fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8",
                    function (err) {
                        if (err) return api.sendMessage(`[ 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 ] → Đ𝗮̃ 𝘅𝗮̉𝘆 𝗿𝗮 𝗹𝗼̂̃𝗶 𝗸𝗵𝗶 𝗮́𝗽 𝗱𝘂̣𝗻𝗴 𝗰𝗼𝗱𝗲 𝗺𝗼̛́𝗶 𝗰𝗵𝗼 "${args[0]}.js".`, threadID, messageID);
                        return api.sendMessage(`[ 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 ] → Đ𝗮̃ 𝘁𝗵𝗲̂𝗺 𝗰𝗼𝗱𝗲 𝗻𝗮̀𝘆 𝘃𝗮̀𝗼 "${args[0]}.js", 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗹𝗼𝗮𝗱 đ𝗲̂̉ 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴!`, threadID, messageID);
                    }
                );
            });
        });
        return
    }
    if (url[0].indexOf('drive.google') !== -1) {
      var id = url[0].match(/[-\w]{25,}/)
      const path = resolve(__dirname, `${args[0]}.js`);
      try {
        await utils.downloadFile(`https://drive.google.com/u/0/uc?id=${id}&export=download`, path);
        return api.sendMessage(`[ 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 ] → Đ𝗮̃ 𝘁𝗵𝗲̂𝗺 𝗰𝗼𝗱𝗲 𝗻𝗮̀𝘆 𝘃𝗮̀𝗼 "${args[0]}.js" 𝗻𝗲̂́𝘂 𝘅𝗮̉𝘆 𝗿𝗮 𝗹𝗼̂̃𝗶 𝘁𝗵𝗶̀ đ𝗼̂̉𝗶 𝗳𝗶𝗹𝗲 𝗱𝗿𝗶𝘃𝗲 𝘁𝗵𝗮̀𝗻𝗵 𝘁𝘅𝘁 𝗻𝗵𝗲́!`, threadID, messageID);
      }
      catch(e) {
        return api.sendMessage(`[ 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 ] → Đ𝗮̃ 𝘅𝗮̉𝘆 𝗿𝗮 𝗹𝗼̂̃𝗶 𝗸𝗵𝗶 𝗮́𝗽 𝗱𝘂̣𝗻𝗴 𝗰𝗼𝗱𝗲 𝗺𝗼̛́𝗶 𝗰𝗵𝗼 "${args[0]}.js".`, threadID, messageID);
      }
    }
  } 