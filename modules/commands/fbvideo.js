module.exports.config = {
  name: "fbvideo",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "DC-Nam",
  description: "Donwload video từ link video facebook",
  commandCategory: "Phương tiện",
  usages: "fbvideo [Link video]",
  cooldowns: 5
};
const DownLoad = async (link, path) => {
  await require("image-downloader").image({
      url: link,
      dest: path
  })
  return require("fs-extra").createReadStream(path)
};
module.exports.run = async ({
  api,
  event,
  args
}) => {
  while (!args[0]) return api.sendMessage("[⚜️]➜ Thiếu link", event.threadID, event.messageID);
  let os = (await require("axios").get(`https://www.nguyenmanh.name.vn/api/fbDL?url=${args[0]}&apikey=DU6MdNmh`)).data
  const path = __dirname + "/cache/fbvideo.mp4";
  return api.sendMessage("[⚜️]➜ Đang tải xuống....xin chờ trong giây lát !!", event.threadID, async (err, info) => {
      await api.sendMessage({
          body: os.result.title,
          attachment: await DownLoad(os.result.sd, path)
      }, event.threadID);
      return api.unsendMessage(info.messageID);
  }, event.messageID);
};