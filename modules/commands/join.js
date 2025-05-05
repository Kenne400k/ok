module.exports.config = {
    name: "join",
    version: "1.1.1",
    hasPermssion: 1,
    credits: "DC-Nam",
    description: "Bật/tắt thông báo tham gia nhóm",
    commandCategory: "Box chat",
    usages: "",
    cooldowns: 0
}
module.exports.run = async function({
    api: a,
    event: e,
    args: g,
    Threads: T
}) {
    const {
        threadID: t,
        messageID: m,
        senderID: s
    } = e
    let getDataThread = await T.getData(t) || {}
    const {
        data,
        threadInfo
    } = getDataThread
    if (typeof data.joinNoti == "undefined") {
        data.joinNoti = {
            status: true,
            storage: []
        }
        await T.setData(t, {
            data
        });
        await global.data.threadData.set(t, data)
    }
    const status = data.joinNoti.status == true ? false : true
    data.joinNoti.status = status
    await T.setData(t, {
        data
    });
    await global.data.threadData.set(t, data)
    var msg = `» Đã ${status == true ? "bật" : "tắt"} thông báo khi có người vào nhóm`
    a.sendMessage(msg, t, m)
}