module.exports = function ({ Users, Threads, Currencies }) {
  const logger = require("../../utils/log.js");
  return async function ({ event }) {
      const { allUserID, allCurrenciesID, allThreadID, userName, threadInfo } = global.data;
      const { autoCreateDB } = global.config;

      if (!autoCreateDB) return;

      const { senderID, threadID, isGroup } = event;
      const stringSenderID = String(senderID);
      const stringThreadID = String(threadID);

try {
    if (!allThreadID.includes(stringThreadID) && isGroup) {
              const threadInfo = await Threads.getInfo(stringThreadID);

              const setting = {
                  threadName: threadInfo.threadName,
                  adminIDs: threadInfo.adminIDs,
                  nicknames: threadInfo.nicknames,
              };

              allThreadID.push(stringThreadID);
              global.data.threadInfo.set(stringThreadID, setting);

              const setting2 = {
                  threadInfo: setting,
                  data: {},
              };

              await Threads.setData(stringThreadID, setting2);

              for (const singleData of threadInfo.userInfo) {
                  const stringUserID = String(singleData.id);

                  userName.set(stringUserID, singleData.name);

try {
   if (allUserID.includes(stringUserID)) {
         await Users.setData(stringUserID, {
    name: singleData.name,
                          });
            } else {
 await Users.createData(stringUserID, {
                  name: singleData.name,
                  data: {},
                          });
                          allUserID.push(stringUserID);

  logger(`Load Data Người Dùng Mới - [ UID: ${stringUserID} | NAME: ${singleData.name} ]`, "〘 LOADING DATABASE 〙");
                      }
                  } catch (e) {
                      console.log(e);
                  }
              }

 logger(`Load Data Nhóm Mới - [ TID: ${stringThreadID} | Tên Nhóm: ${setting.threadName} ]`, "〘 LOADING DATABASE 〙");
          }

          if (!allUserID.includes(stringSenderID) || !userName.has(stringSenderID)) {
              const infoUsers = await Users.getInfo(stringSenderID);
              const setting3 = {
                  name: infoUsers.name,
              };

              await Users.createData(stringSenderID, setting3);
              allUserID.push(stringSenderID);
              userName.set(stringSenderID, infoUsers.name);

  logger(`Load Data Người Dùng Mới - [ UID: ${stringSenderID} | NAME: ${infoUsers.name} ]`, "〘 LOADING DATABASE 〙");
          }

   if (!allCurrenciesID.includes(stringSenderID)) {
              const setting4 = {
                  data: {},
              };

  await Currencies.createData(stringSenderID, setting4);
              allCurrenciesID.push(stringSenderID);
             }
          return;
    } catch (err) {
          console.log(err);
      }
  };
};
/////////// FIX and MODE BY DONGDEV ///////////