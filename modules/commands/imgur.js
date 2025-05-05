const axios = require("axios");
class Imgur {
  constructor() {
    this.clientId = "fc9369e9aea767c", this.client = axios.create({
      baseURL: "https://api.imgur.com/3/",
      headers: {
        Authorization: `Client-ID ${this.clientId}`
      }
    })
  }
  async uploadImage(url) {
    return (await this.client.post("image", {
      image: url
    })).data.data.link
  }
}
class Modules extends Imgur {
  constructor() {
    super()
  }
  get config() {
    return {
      name: "imgur",
      description: "Upload image to imgur",
      version: "1.0.0",
      credits: "Thiệu Trung Kiên",
      cooldown: 5,
      usage: "imgur <url>",
      commandCategory: "Công cụ",
      hasPermssion: 0
    }
  }
  run = async ({ api, event }) => {
    var array = [];
    if ("message_reply" != event.type || event.messageReply.attachments.length < 0) return api.sendMessage("[⚜️]➜ Vui lòng reply vào bức ảnh bạn cần tải lên", event.threadID, event.messageID);
    for (let { url } of event.messageReply.attachments) await this.uploadImage(url).then((res => array.push(res))).catch((err => console.log(err)));
    return api.sendMessage(`[ 𝗜𝗠𝗚𝗨𝗥 𝗨𝗣𝗟𝗢𝗔𝗗 ]\n➝ 𝗧𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴: ${array.length} ảnh\n➝ 𝗧𝗵𝗮̂́𝘁 𝗯𝗮̣𝗶: ${array.length - event.messageReply.attachments.length}\n➝ Link ảnh:\n${array.join("\n")}`, event.threadID, event.messageID)
  }
}
module.exports = new Modules;
