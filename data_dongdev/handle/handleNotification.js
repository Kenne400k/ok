module.exports = function ({ api }) {
    const moment = require("moment-timezone");
    const botID = api.getCurrentUserID();
    const form = {
        av: botID,
        fb_api_req_friendly_name: "CometNotificationsDropdownQuery",
        fb_api_caller_class: "RelayModern",
        doc_id: "5025284284225032",
        variables: JSON.stringify({
            "count": 5,
            "environment": "MAIN_SURFACE",
            "menuUseEntryPoint": true,
            "scale": 1
        })
    };
try {

api.httpPost("https://www.facebook.com/api/graphql/", form, (error, response) => {
            const data = JSON.parse(response).data.viewer;
            const getMinutesOfTime = (d1, d2) => Math.ceil((d2.getTime() - d1.getTime()) / (60 * 1000));

            for (const notification of data.notifications_page.edges) {
                if (notification.node.row_type !== 'NOTIFICATION') continue;

                const audio = data.notifications_sound_path[1];
                const count = data.notifications_unseen_count;
                const body = notification.node.notif.body.text;
                const link = notification.node.notif.url;
                const timestamp = notification.node.notif.creation_time.timestamp;
                const time = moment.tz(timestamp * 1000, "Asia/Ho_Chi_minh").format("HH:mm:ss || DD/MM/YYYY");

                if (getMinutesOfTime(new Date(timestamp * 1000), new Date()) <= 1) {
                    const msg = `===〘『 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 』〙===
━━━━━━━━━━━━━━━━━━━━
[⏰] → 𝗧𝗶𝗺𝗲: ${time}
[💬] → 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${body}
━━━━━━━━━━━━━━━━━━━━
[🔗] → 𝗟𝗶𝗻𝗸 𝗯𝗮̀𝗶: ${link}`;

      api.sendMessage(msg, global.config.NDH[0]);
                }
            }
        });
    } catch (e) {
      //  console.error(`Đã xảy ra lỗi khi gửi thông báo: ${e}`);
    }
};