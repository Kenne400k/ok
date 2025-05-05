const axios = require('axios');
const fs = require('fs');
const { join } = require("path");

module.exports.config = {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "Thjhn & KyPhan",
    description: "adc mọi loại raw",
    commandCategory: "Admin",
    usages: "[reply or text]",
    cooldowns: 0,
    usePrefix: false,
    dependencies: {
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }

    if (!text && !name) return api.sendMessage('❎ Vui lòng reply link muốn áp dụng code hoặc ghi tên file để up code lên!', threadID, messageID);

    if (!text && name) {
        var data = fs.readFile(
            `${__dirname}/${args[0]}.js`,
            "utf-8",
            async (err, data) => {
                if (err) return api.sendMessage(`❎ Lệnh ${args[0]} không tồn tại`, threadID, messageID);
                try {
                    const response = await axios.post("https://api.mocky.io/api/mock", {
                        "status": 200,
                        "content": data,
                        "content_type": "application/json",
                        "charset": "UTF-8",
                        "secret": "PhamMinhDong",
                        "expiration": "never"
                    });
                    const link = response.data.link;

                    
                    return api.sendMessage(link, threadID, messageID);

                } catch (error) {
                    return api.sendMessage(`⚠️ Lỗi khi tạo liên kết: ${error.message}`, threadID, messageID);
                }
            }
        );
        return;
    }

    const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    const url = text.match(urlR);

    if (url) {
        axios.get(url[0]).then(i => {
            var data = i.data;
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`⚠️ Đã xảy ra lỗi khi áp dụng code vào ${args[0]}.js`, threadID, messageID);
                    api.sendMessage(`✅ Đã áp dụng code vào ${args[0]}.js`, threadID, messageID);
                }
            );
        });
    }
};