module.exports.config = {
  name: 'busy',
  version: '10.02',
  hasPermssion: 0,
  credits: 'DC-Nam',
  description: 'Tự thông báo bạn đang bận khi có người tag',
  commandCategory: 'Tiện ích',
  usages: '[]',
  cooldowns: 3,
}
const { readFileSync, writeFileSync, existsSync } = require('fs-extra')
dest = __dirname + '/hethong/busy.json'
convertTime = (a) => new Date(a).toLocaleString()
module.exports.onLoad = function () {
  if (!existsSync(dest)) {
    writeFileSync(dest, '{}')
  }
}
module.exports.handleEvent = async function ({ api, event }) {
  const moment = require('moment-timezone')
  const timeNow = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')
  const out = (a, b, c) =>
      api.sendMessage(
        `${a}`,
        event.threadID,
        c ? c : null,
        b ? event.messageID : null
      ),
    data = JSON.parse(readFileSync(dest)),
    tags = Object.keys(event.mentions),
    now = Date.now(),
    z = data[event.senderID]
  if (!!z) {
    if (z.timeEnd < now) {
      await out(`→ 𝗖𝗵𝗮̀𝗼 𝗺𝘂̛̀𝗻𝗴 𝘃𝘂̛̀𝗮 𝗾𝘂𝗮𝘆 𝘁𝗿𝗼̛̉ 𝗹𝗮̣𝗶 👋`, true)
      out(
        z.dataTags.length == 0
          ? '\u2192 \uD835\uDDE7\uD835\uDDFF\uD835\uDDFC\uD835\uDDFB\uD835\uDDF4 \uD835\uDDF9\uD835\uDE02́\uD835\uDDF0 \uD835\uDDEF\uD835\uDDEẸ\uD835\uDDFB đ\uD835\uDDF6 \uD835\uDE03\uD835\uDDEĔ́\uD835\uDDFB\uD835\uDDF4 \uD835\uDDF8\uD835\uDDF5\uD835\uDDFĈ\uD835\uDDFB\uD835\uDDF4 \uD835\uDDF0\uD835\uDDFĆ \uD835\uDDEE\uD835\uDDF6 \uD835\uDE01\uD835\uDDEE\uD835\uDDF4 \uD835\uDDEF\uD835\uDDEẸ\uD835\uDDFB \uD835\uDDF0\uD835\uDDEẺ'
          : `=== [ 𝗔𝗙𝗞 ] ===\n→ 𝗗𝘂̛𝗼̛́𝗶 đ𝗮̂𝘆 𝗹𝗮̀ 𝗱𝗮𝗻𝗵 𝘀𝗮́𝗰𝗵  ${
              z.dataTags.length
            } 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝘃𝘂̛̀𝗮 𝘁𝗮𝗴 𝗯𝗮̣𝗻\n${z.dataTags
              .map(
                (i, c) =>
                  `( ${c + 1} ) 𝗨𝘀𝗲𝗿 ${global.data.userName.get(
                    i.id
                  )}\n→ 𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/profile.php?id=${
                    i.id
                  }\n→ 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${convertTime(i.time)}\n→ 𝗧𝗲̂𝗻 𝗻𝗵𝗼́𝗺 : ${
                    global.data.threadInfo.get(i.idT).threadName
                  }\n→ 𝗡𝗼̣̂𝗶 𝗱𝘂𝗻𝗴: ${i.msg}\n`
              )
              .join('\n\n')}`
      )
    }
    z.timeEnd = now + z.delay * 60000
  }
  if (tags.length != 0) {
    tags.forEach((i) => {
      const x = data[i]
      if (!!x && x.timeEnd < now) {
        x.dataTags.push({
          id: event.senderID,
          idT: event.threadID,
          msg: event.body,
          time: Date.now() + 25200000,
        })
        out(
          `💻━━━━━ [ 𝗜'𝗠 𝗕𝗨𝗦𝗬 ] ━━━━━💻\n\n→ 𝗛𝗶𝗲̣̂𝗻 𝗧𝗮̣𝗶 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴\n→ 𝗟𝗶𝗻𝗸 𝗳𝗯: https://www.facebook.com/profile.php?id=${i}\n→ Đ𝗮𝗻𝗴 𝗯𝗮̣̂𝗻 𝘃𝗼̛́𝗶 𝗹𝗶́ 𝗱𝗼: ${
            x.msg
          }\n→ 𝗧𝘂̛𝗼̛𝗻𝗴 𝘁𝗮́𝗰 𝗹𝗮̂̀𝗻 𝗰𝘂𝗼̂́𝗶 𝘃𝗮̀𝗼 𝗹𝘂́𝗰: ${convertTime(
            x.timeEnd - x.delay * 60000 + 25200000
          )}\n===== 「${timeNow}」=====`,
          true
        )
      }
    })
  }
  writeFileSync(dest, JSON.stringify(data, 0, 4))
}
module.exports.run = function ({ api, event, args }) {
  try {
    const out = (a, b, c) =>
        api.sendMessage(
          `${a}`,
          event.threadID,
          c ? c : null,
          b ? event.messageID : null
        ),
      data = JSON.parse(readFileSync(dest))
    if (!!args[0]) {
      const str = args.join(' '),
        arg = str.split('&'),
        msg = arg[0],
        delay = arg[1]
      if (!msg || !delay || isNaN(delay)) {
        return out(
          !!delay && isNaN(delay)
            ? '\u2192 \uD835\uDDE7\uD835\uDDF5\uD835\uDDFC̛̀\uD835\uDDF6 \uD835\uDDF4\uD835\uDDF6\uD835\uDDEE\uD835\uDDFB \uD835\uDDEF\uD835\uDDEẸ\uD835\uDDFB \uD835\uDDF0\uD835\uDDF5\uD835\uDDFC̣\uD835\uDDFB \uD835\uDDFD\uD835\uDDF5\uD835\uDDEẺ\uD835\uDDF6 \uD835\uDDF9\uD835\uDDEÈ 1 \uD835\uDDF0\uD835\uDDFC\uD835\uDDFB \uD835\uDE00\uD835\uDDFĈ́ \uD835\uDDF5\uD835\uDDFC̛̣\uD835\uDDFD \uD835\uDDF9\uD835\uDDF2̣̂'
            : `→ 𝗩𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝗻𝗵𝗮̣̂𝗽 đ𝘂́𝗻𝗴 đ𝗶̣𝗻𝗵 𝗱𝗮̣𝗻𝗴: 𝗹𝗶́ 𝗱𝗼 & 𝘁𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 đ𝗲̂́𝗺 𝗻𝗴𝘂̛𝗼̛̣𝗰 𝘁𝘂̛̣ 𝗯𝗮̣̂𝘁 (𝗽𝗵𝘂́𝘁)`,
          true
        )
      }
      data[event.senderID] = {
        delay,
        timeEnd: Date.now() + delay * 60000,
        msg,
        dataTags: [],
      }
      out(
        `[=== [ 𝗕𝗨𝗦𝗬 ] === ]\n━━━━━━━━━━━━━━━\n→ 𝗩𝘂̛̀𝗮 𝘁𝗵𝗶𝗲̂́𝘁 𝗹𝗮̣̂𝗽 𝗯𝘂𝘀𝘆 𝗰𝗵𝗼 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 𝗩𝗼̛́𝗶 𝗹𝗶́ 𝗱𝗼: ${msg}\n→ 𝗧𝘂̛̣ 𝗯𝗮̣̂𝘁 𝘀𝗮𝗼 ${
          delay % 60
        } 𝗽𝗵𝘂́𝘁 𝗸𝗲̂̉ 𝘁𝘂̛̀ 𝗸𝗵𝗶 𝗯𝗮̣𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝘁𝘂̛𝗼̛𝗻𝗴 𝘁𝗮́𝗰`,
        true
      )
    } else {
      if (!data[event.senderID]) {
        return out(
          `→ 𝗕𝗮̣𝗻 𝗰𝗵𝘂̛𝗮 𝘁𝗵𝗶𝗲̂́𝘁 𝗹𝗮̣̂𝗽 𝗯𝘂𝘀𝘆\n→ đ𝗲̂̉ 𝘁𝗵𝗶𝗲̂́𝘁 𝗹𝗮̣̂𝗽 𝗻𝗵𝗮̣̂𝗽 !𝗯𝘂𝘀𝘆 𝗹𝗶́ 𝗱𝗼 & 𝘁𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 ( 𝗽𝗵𝘂́𝘁 ) 𝘁𝘂̛̣ 𝗯𝗮̣̂𝘁 𝘀𝗮𝗼 𝗸𝗵𝗶 𝗯𝗮̣𝗻 𝗿𝗼̛̀𝗶 𝗸𝗵𝗼̉𝗶`,
          true
        )
      }
      out(
        `→ đ𝗮̃ 𝘅𝗼𝗮́ 𝘁𝗵𝗶𝗲̂́𝘁 𝗹𝗮̣̂𝗽 
 ${this.config.name}`,
        true
      )
      delete data[event.senderID]
    }
    writeFileSync(dest, JSON.stringify(data, 0, 4))
  } catch (err) {
    out(err, true)
  }
}