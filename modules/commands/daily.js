module.exports.config = {
	name: "daily",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Nhận 50000 coins mỗi ngày!",
	commandCategory: "Tiện ích",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 43200000,
        rewardCoin: 50000
    }
};

module.exports.languages = {
    "vi": {
        "cooldown": "Bạn đang trong thời gian chờ\nVui lòng thử lại sau: %1 giờ %2 phút %3 giây!",
        "rewarded": "Bạn đã nhận 50000, để có thể tiếp tục nhận, vui lòng quay lại sau 12 tiếng"
    },
    "en": {
        "cooldown": "You received today's rewards, please come back after: %1 hours %2 minutes %3 seconds.",
        "rewarded": "You received %1$ and %2 times to use bot, to continue to receive, please try again after 12 hours"
    }
}

const fs = require("fs");
const path = __dirname + '/../../includes/handle/usages.json';

module.exports.onLoad = () => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
}

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { daily } = global.configModule,
        cooldownTime = daily.cooldownTime,
        rewardCoin = daily.rewardCoin;

    var { senderID, threadID } = event;

    let data = (await Currencies.getData(senderID)).data || {};
    if (typeof data !== "undefined" && cooldownTime - (Date.now() - (data.dailyCoolDown || 0)) > 0) {
        var time = cooldownTime - (Date.now() - data.dailyCoolDown),
            seconds = Math.floor( (time/1000) % 60 ),
            minutes = Math.floor( (time/1000/60) % 60 ),
            hours = Math.floor( (time/(1000*60*60)) % 24 );

		return api.sendMessage(getText("cooldown", hours, minutes, (seconds < 10 ? "0" : "") + seconds), threadID);
    }

    else return api.sendMessage(getText("rewarded", rewardCoin, 20), threadID, async () => {
        let dataM = JSON.parse(fs.readFileSync(path));
        dataM[senderID].usages += 20;
        fs.writeFileSync(path, JSON.stringify(dataM, null, 4));
        await Currencies.increaseMoney(senderID, rewardCoin);
        data.dailyCoolDown = Date.now();
        await Currencies.setData(senderID, { data });
        return;
    });
}