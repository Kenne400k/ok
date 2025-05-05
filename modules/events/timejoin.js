const fs = require("fs");
const path = __dirname + "/../commands/data/timejoin.json";

module.exports.config = {
    name: "timejoin",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "Nam & DongDev fix",
    description: "Tự xóa dữ liệu thời gian tham gia của người dùng khi thoát"
};

module.exports.run = async function ({ event: e }) {
    const { threadID: t, logMessageData: l } = e;
    const { writeFileSync: w, readFileSync: r } = fs;
    const { stringify: s, parse: p } = JSON;

    const v = l.leftParticipantFbId;
    let a = p(r(path));
    delete a[v + t];
    w(path, s(a, null, 2));
};