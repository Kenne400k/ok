const fs = require("fs");
const { resolve } = require("path");

module.exports.config = {
    name: "antiqtv",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "DongDev",
    description: "Ngăn chặn việc thay đổi admin",
};


module.exports.run = async function ({ event, api }) {
    const { logMessageType, logMessageData, author, threadID } = event;
const botID = api.getCurrentUserID();
    // Kiểm tra xem người gửi sự kiện có phải là bot không bị ảnh hưởng
    if (author === botID) return;

    const path = resolve(__dirname, '../commands', 'data', 'antiqtv.json');

    try {
        const dataA = JSON.parse(fs.readFileSync(path));

        const foundGroup = Object.keys(dataA).find(groupID => groupID === threadID);

        // Kiểm tra xem dataA tồn tại và foundGroup không phải là undefined
        if (dataA && foundGroup !== undefined && dataA[foundGroup] === true) {
            switch (logMessageType) {
                case "log:thread-admins": {
                    if (logMessageData.ADMIN_EVENT === "add_admin" || logMessageData.ADMIN_EVENT === "remove_admin") {
                        if (logMessageData.TARGET_ID === botID) return; // Bot không bị ảnh hưởng

                        if (logMessageData.ADMIN_EVENT === "remove_admin") {
                            // Gỡ quyền admin của người trực tiếp thực hiện gỡ quyền admin
   api.changeAdminStatus(threadID, author, false); 
                          api.changeAdminStatus(threadID, logMessageData.TARGET_ID, true);

                            // Thêm lại quyền admin cho người bị gỡ quyền admin
                          
                        } else if (logMessageData.ADMIN_EVENT === "add_admin") {
                            // Gỡ quyền admin của cả người thêm và người được thêm
                            api.changeAdminStatus(threadID, author, false);
                            api.changeAdminStatus(threadID, logMessageData.TARGET_ID, false);
                        }

                        function editAdminsCallback(err) {
                            if (err) return api.sendMessage("» Hihihihih! ", threadID, event.messageID);
                            return api.sendMessage("» Kích hoạt chế độ chống cướp box", threadID, event.messageID);
                        }
                    }
                    break;
                }
            }
        } else {
            // Xử lý khi ID nhóm không tồn tại trong dữ liệu hoặc đang ở trạng thái false (nếu cần)
        }
    } catch (error) {
        
    }
};
