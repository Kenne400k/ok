module.exports.config = {
	name: "nasa",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Mirai Team mod by TDong",
	description: "What did Hubble see on your birthday?",
	commandCategory: "other",
	usages: "October-23",
	cooldowns: 5,
	dependencies: {
        "fs-extra": "",
        "path": "",
        "url": ""
    }
};

module.exports.onLoad = async () => {
    const { existsSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];

    const path = resolve(__dirname, "cache");
}

module.exports.run = async ({ event, api, args, }) => {
    const { readFileSync, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    const url = global.nodemodule["url"];

    const urlParsed = url.parse(args[0]);

    try {
        const path = __dirname + `/cache/${event.threadID}-${event.senderID}s.png`;
        await global.utils.downloadFile(`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/https://imagine.gsfc.nasa.gov/hst_bday/${args[0]}`, path);
        api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path));
    }
    catch {
        return api.sendMessage("Định dạng là [tên tiếng Anh của tháng]-[ngày]\n Ví dụ: October-23", event.threadID, event.messageID);
    }
}