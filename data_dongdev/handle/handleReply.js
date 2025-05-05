module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        if (!event.messageReply) return;
        const { handleReply, commands, getText } = global.client;

        const { messageID, threadID, messageReply } = event;
        if (handleReply.length !== 0) {
            const indexOfHandle = handleReply.findIndex(e => e.messageID === messageReply.messageID);
            if (indexOfHandle < 0) return;

            const indexOfMessage = handleReply[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name);
            if (!handleNeedExec) return api.sendMessage(getText('handleReply', 'missingValue'), threadID, messageID);

            try {
                var getText2;
                if (handleNeedExec.languages && typeof handleNeedExec.languages === 'object') {
                    getText2 = (...value) => {
                        const reply = handleNeedExec.languages || {};
                        if (!reply.hasOwnProperty(global.config.language)) {
                            const errorMessage = getText('handleCommand', 'notFoundLanguage', handleNeedExec.config.name);
                            return api.sendMessage(errorMessage, threadID, messageID);
                        }

                        var lang = handleNeedExec.languages[global.config.language][value[0]] || '';
                        for (var i = value.length - 1; i >= 0; i--) {
                            const expReg = RegExp('%' + i, 'g');
                            lang = lang.replace(expReg, value[i]);
                        }
                        return lang;
                    };
                } else {
                    getText2 = () => {};
                }

                const Obj = {
                    api,
                    event,
                    models,
                    Users,
                    Threads,
                    Currencies,
                    handleReply: indexOfMessage,
                    getText: getText2,
                };

                handleNeedExec.handleReply(Obj);
                return;
            } catch (error) {
                return api.sendMessage(getText('handleReply', 'executeError', error), threadID, messageID);
            }
        }
    };
};