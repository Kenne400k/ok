/**
* @author ProCoderMew
* @warn Do not edit code or edit credits
*/

module.exports.config = {
    name: "antiout",
    eventType: ["log:unsubscribe"],
    version: "1.0.7",
    credits: "ProCoderMew",
    description: "Listen events",
    dependencies: {
        "path": ""
    }
};

module.exports.run = async function ({ api, event, Users }) {
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, '../commands', 'cache', 'meewmeew.json');
    const { antiout } = require(path);
    const { logMessageData, author, threadID } = event;
    const id = logMessageData.leftParticipantFbId;
  const moment = require("moment-timezone");
     var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss")
  var fullYear = global.client.getTime("fullYear");
    if (author == id && id != api.getCurrentUserID()) {
        const name = await Users.getNameUser(id) || "Người dùng Facebook";
        if (antiout.hasOwnProperty(threadID) && antiout[threadID] == true) {
            try {
                await api.addUserToGroup(id, threadID);
                return api.sendMessage(`[ 𝐖𝐀𝐑𝐍 ] 𝐊𝐢́𝐜𝐡 𝐇𝐨𝐚̣𝐭 𝐀𝐧𝐭𝐢𝐨𝐮𝐭 𝐓𝐡𝐚̀𝐧𝐡 𝐂𝐨̂𝐧𝐠 𝐁𝐨𝐭 Đ𝐚̃ 𝐓𝐡𝐞̂𝐦 𝐍𝐠𝐮̛𝐨̛̀𝐢 𝐃𝐮̀𝐧𝐠 => ${name}\n𝐓𝐡𝐨̛̀𝐢 𝐆𝐢𝐚𝐧 𝐓𝐡𝐞̂𝐦 𝐋𝐚̣𝐢 𝐍𝐠𝐮̛𝐨̛̀𝐢 𝐃𝐮̀𝐧𝐠 𝐕𝐚̀𝐨 𝐁𝐨𝐱 : ${timeNow} - ${fullYear}`, event.threadID);

            }
            catch (e) {
                return api.sendMessage(`𝐊𝐡𝐨̂𝐧𝐠 𝐭𝐡𝐞̂̉ 𝐭𝐡𝐞̂𝐦 ${name} 𝐯𝐮̛̀𝐚 𝐨𝐮𝐭 𝐯𝐚̀𝐨 𝐥𝐚̣𝐢 𝐧𝐡𝐨́𝐦.`, threadID);
            }
        }
    }
    return;
}