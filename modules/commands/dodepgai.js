module.exports.config = {
  name: "setdepgai",
  version: "0.0.1",
  hasPermssion: 0,
  credits: "pcoder",
  description: "đo độ đẹp gái",
  commandCategory: "Tiện ích",
  cooldowns: 5
};

module.exports.run = function({ api, event }) {
  const percent = Math.floor(Math.random() * 100) + 1;
  return api.sendMessage(`Độ đẹp gái của bạn là ${percent}%`, event.threadID, event.messageID);
}