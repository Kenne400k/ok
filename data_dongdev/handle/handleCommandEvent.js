module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");

    return function ({ event }) {
        const { allowInbox } = global.config;
        const { userBanned, threadBanned } = global.data;
        const { commands, eventRegistered } = global.client;

        const { senderID, threadID } = event;
        const fixUserIB = true;

        if ((userBanned.has(String(senderID)) || threadBanned.has(String(threadID))) && fixUserIB) {
            return;
        }

        for (const eventReg of eventRegistered) {
            const cmd = commands.get(eventReg);
            let getText2;

            if (cmd.languages && typeof cmd.languages === 'object') {
                getText2 = (...values) => {
                    const commandModule = cmd.languages || {};

                    if (!commandModule.hasOwnProperty(global.config.language)) {
                        api.sendMessage(global.getText('handleCommand', 'notFoundLanguage', cmd.config.name), threadID);
                        return;
                    }

                    let lang = cmd.languages[global.config.language][values[0]] || '';
                    for (let i = values.length - 1; i >= 0; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, values[i]);
                    }

                    return lang;
                };
            } else {
                getText2 = () => {};
            }

            try {
                const Obj = {
                    event,
                    api,
                    models,
                    Users,
                    Threads,
                    Currencies,
                    getText: getText2,
                };

                if (cmd) {
                    cmd.handleEvent(Obj);
                }
            } catch (error) {
                logger(global.getText('handleCommandEvent', 'moduleError', cmd.config.name), 'error');
            }
        }
    };
};