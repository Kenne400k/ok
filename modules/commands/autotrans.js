let r = require('axios').get,
    f = require('fs'),
    api = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=',
   robin = 'itz.robin.0',
    db = {};

class Module {
    constructor(a) {
        this.config = a;
    }

    run(o) {
        let t = o.event.threadID;
        db[t] = db[t] ? false : true;
        f.writeFileSync(__dirname + `/cache/statusAutoTrans_${t}.json`, JSON.stringify({ enabled: db[t] }));
        o.api.sendMessage(`${db[t] ? 'Turned on✅' : 'Turned off❎'} ${this.config.name} in this chat 💬`, t);
    }

    handleEvent(o) {
        let a = o.event.body,
            t = o.event.threadID,
            data;

        if (!a || a.startsWith(global.config.PREFIX) || !db[t] || o.api.getCurrentUserID() == o.event.senderID || o.event.senderID === robin) return;

        try {
            data = JSON.parse(f.readFileSync(__dirname + `/cache/statusAutoTrans_${t}.json`));
            db[t] = data.enabled;
        } catch (e) {
            db[t] = false;
            f.writeFileSync(__dirname + `/cache/statusAutoTrans_${t}.json`, JSON.stringify({ enabled: false }));
        }

        if (db[t]) {
            r(api + encodeURI(a)).then(s => {
                if (s.data && s.data[0] && s.data[0][0] && s.data[0][0][0]) {
                    o.api.sendMessage(s.data[0][0][0], t, o.event.messageID);
                }
            }).catch(console.log);
        }
    }
}

module.exports = new Module({
    name: 'autotrans=vi',
    version: '1.1',
    hasPermssion: 0,
    credits: 'ToXic Robin',
    description: 'Automatically translates any message to english',
    commandCategory: 'group',
    usages: '.',
    cooldowns: 0
});
