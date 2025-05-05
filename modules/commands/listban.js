module.exports.config = {
    name: "listban",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "ManhG",
    description: "Xem danh sách ban của nhóm hoặc của người dùng",
    commandCategory: "Admin",
    usages: "[thread/user]",
    cooldowns: 5
}, module.exports.handleReply = async function({
    api: n,
    args: e,
    Users: a,
    handleReply: t,
    event: s,
    Threads: d
}) {
    const {
        threadID: r,
        messageID: l
    } = s;
    let g = await a.getNameUser(s.senderID);
    if (parseInt(s.senderID) === parseInt(t.author)) switch (t
        .type) {
        case "unbanthread":
            var h = s.body.split(" "),
                i = "",
                o = "",
                c = "",
                u = h.map((n => parseInt(n)));
            for (let n of u) {
                var b = (p = t.listBanned[n - 1]).slice(
                3);
                let e = p.split(":");
                const a = e[e.length - 1].trim(),
                    s = (await d.getData(a)).data || {};
                s.banned = 0, s.reason = null, s
                    .dateAdded = null, await d.setData(
                    a, {
                        data: s
                    });
                var m = global.data.threadBanned.delete(a,
                    1);
                i += m + " " + p + "\n", o += " " + a +
                    "\n", c += " " + b + "\n"
            }
            n.sendMessage(
                `Thông báo từ Admin ${g}\n──────────────────\n→ Nhóm ${c} của bạn đã được Gỡ Ban\n→ Có thể sử dụng được bot ngay bây giờ`,
                o, (() => n.sendMessage(
                    `${global.data.botID}`, (() =>
                        n.sendMessage(
                            `Thực thi Unban(true/false)\n\n${i}`,
                            s.threadID, (() => n
                                .unsendMessage(t
                                    .messageID))))
                    )));
            break;
        case "unbanuser":
            h = s.body.split(" "), i = "", o = "", c = "",
                u = h.map((n => parseInt(n)));
            for (let n of u) {
                var p;
                b = (p = t.listBanned[n - 1]).slice(3);
                let e = p.split(":");
                const s = e[e.length - 1].trim(),
                    d = (await a.getData(s)).data || {};
                d.banned = 0, d.reason = null, d
                    .dateAdded = null, await a.setData(
                    s, {
                        data: d
                    });
                m = global.data.userBanned.delete(s, 1);
                i += m + " " + p + "\n", o += " " + s +
                    "\n", c += " " + b + "\n"
            }
            n.sendMessage(
                `Thực thi Unban(true/false)\n\n${i}`,
                s.threadID, (() => n.unsendMessage(t
                    .messageID)))
    }
}, module.exports.run = async function({
    event: n,
    api: e,
    Users: a,
    args: t,
    Threads: s
}) {
    const {
        threadID: d,
        messageID: r
    } = n;
    var l = [],
        g = [];
    i = 1, j = 1;
    switch (t[0]) {
        case "thread":
        case "t":
        case "-t": {
            const a = global.data.threadBanned.keys();
            for (const n of a) {
                const e = await global.data.threadInfo
                    .get(n).threadName ||
                    "Tên không tồn tại",
                    a = await global.data.threadBanned
                    .get(n).reason,
                    t = await global.data.threadBanned
                    .get(n).dateAdded;
                l.push(`${i++}. ${e}\n→ TID: ${n}`), g
                    .push(
                        `${j++}. ${e}\n→ TID: ${n}\n→ Lý do: ${a}\n→ Time: ${t}`
                        )
            }
            return e.sendMessage(0 != g.length ? e
                .sendMessage(
                    `Hiện tại đang có ${g.length} nhóm bị ban\n\n${g.join("\n\n")}\n──────────────────\nReply tin nhắn này + số thứ tự, có thể rep nhiều số, cách nhau bằng dấu cách để unban thread tương ứng`,
                    d, ((e, a) => {
                        client.handleReply.push({
                            name: this
                                .config
                                .name,
                            messageID: a
                                .messageID,
                            author: n
                                .senderID,
                            type: "unbanthread",
                            listBanned: l
                        })
                    }), r) :
                "Hiện tại không có nhóm nào bị ban!",
                d, r)
        }
        case "user":
        case "u":
        case "-u": {
            const t = global.data.userBanned.keys();
            for (const n of t) {
                const e = global.data.userName.get(n) ||
                    await a.getNameUser(n),
                    t = await global.data.userBanned.get(
                        n).reason,
                    s = await global.data.userBanned.get(
                        n).dateAdded;
                g.push(
                        `${i++}. ${e} \n→ UID: ${n}\n→ Lý do: ${t}\n→ Time: ${s}`),
                    l.push(`${j++}. ${e} \n→ UID: ${n}`)
            }
            return e.sendMessage(0 != g.length ? e
                .sendMessage(
                    `Hiện tại đang có ${g.length} người dùng bị ban\n\n${g.join("\n\n")}\n──────────────────\nReply tin nhắn này + số thứ tự, có thể rep nhiều số, cách nhau bằng dấu cách để unban user tương ứng`,
                    d, ((e, a) => {
                        global.client.handleReply
                            .push({
                                name: this
                                    .config
                                    .name,
                                messageID: a
                                    .messageID,
                                author: n
                                    .senderID,
                                type: "unbanuser",
                                listBanned: l
                            })
                    }), r) :
                "Hiện tại không có người dùng bị ban",
                d, r)
        }
        default:
            return global.utils.throwError(this.config
                .name, d, r)
    }
};