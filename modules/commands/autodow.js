const axios = require('axios');
const fs = require('fs');
const isURL = u => /^http(|s):\/\//.test(u);
const convertHMS = (value) => new Date(value * 1000).toISOString().slice(11, 19);
exports.handleEvent = async function(o) {
  try {
   /* var {
      url: str
    } = this.checkLink(o.event.body); */
      const str = o.event.body;
    let send = (msg, tid_, typ = typeof tid_ == 'object') => new Promise(r => (o.api.sendMessage(msg, typ ? tid_.event.threadID : (tid_ || o.event.threadID), (err, res) => r(res || err), typ ? tid_.event.messageID : (tid_ ? undefined : o.event.messageID))));
    const head = app => `[  ${app} - DownLoad  ]\n`;
    if (isURL(str)) {
      const isProfile = /^https:\/\/(?:(www|m|mbasic|mobile|web)\.)?facebook\.com\/(?!(?:watch|photo|groups|share|stories|reel|videos|pages|story.php|permalink.php))(?:(?!profile\.php\?id=\d+\?)[^\/?]+|profile\.php\?id=\d+\?(?!id=).*|\profile\.php\?id=\d+$)\/?\??[^\/?]*$/.test(o.event.body);
      const isFbURL = /\b(?:https?:\/\/(?:www\.)?(?:facebook\.com|mbasic\.facebook\.com|m\.facebook\.com|mobile\.facebook\.com|fb\.watch|web\.facebook)[^\s]*)\b/g.test(o.event.body);
      if (isFbURL && !isProfile) {
    const url = o.event.body.match(/\b(?:https?:\/\/(?:www\.)?(?:facebook\.com|mbasic\.facebook\.com|m\.facebook\.com|mobile\.facebook\.com|fb\.watch|web\.facebook)[^\s]*)\b/g)[0];
    const res = (await axios.get(`điền api vào đây${encodeURIComponent(url)}`)).data;
    let attachment = [];
   if (res.attachments && res.attachments.length > 0) {
    if (res.queryStorieID) {
        const match = res.attachments.find(item => item.id == res.queryStorieID);
        if (match) {
            if (match.type === 'Video') {
                const videoUrl = match.url.sd || match.url.hd;
                attachment.push(await streamURL(videoUrl, 'mp4'));
            }
        }
    }
   else {
        for (const attachmentItem of res.attachments) {
            if (attachmentItem.type === 'Video') {
                const videoUrl = attachmentItem.url.sd || attachmentItem.url.hd;
                attachment.push(await streamURL(videoUrl, 'mp4'));
            } else if (attachmentItem.type === 'Photo') {
                attachment.push(await streamURL(attachmentItem.url, 'jpg'));
            }
        }
    }

    send({
        body: `📝 Title: ${res.message || "Không Có Tiêu Đề"}\n`,
        attachment
    });
}
}

/* TẢI ẢNH VÀ VIDEO TIKTOK */
else if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
    const res = (await axios.post(`https://tikwm.com/api/`, { url: str }, { headers: { 'Content-Type': 'application/json' } })).data.data;
    let attachment = [];

    if (res.images !== undefined) {
        for (const $ of res.images) {
            attachment.push(await streamURL($, 'png'));
        }
    } else {
        attachment = await streamURL(res.play, 'mp4');
    }
    let callback = async () => {
        send({
            body: `📝 Title: ${res.music_info.title}\n👤 Tác Giả: ${res.music_info.author}\n`,
            attachment: await streamURL(res.music, 'mp3')
        })
    };

    send({
        body: `📝 Title: ${res.title || "Không Có Tiêu Đề"}\n📌 Thả Cảm Xúc Để Tải Nhạc`,
        attachment
    }).then(res => (res.name = this.config.name, res.callback = callback, res.o = o, global.client.handleReaction.push(res)));
}
      /* TỰ ĐỘNG TẢI NHẠC TRÊN YOUTUBE */
      else if (/(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//.test(str)) {
        var path = __dirname + "/cache/ytb.m4a",
          data = await ytb(str, path);
        send({
          body: `📝 Title: ${data.title} (${convertHMS(data.dur)})\n⏰ Ngày Tải Lên: ${data.uploadDate}\n📻 Kênh: ${data.author} (${data.sub})\n👁️‍🗨️ Lượt Xem: ${data.viewCount} view\n💠 Lượt Thích: ${data.likes}\n⏳ Thời Gian Xử Lí: ${Math.floor((Date.now() - data.timestart) / 1000)} giây\n`,
          attachment: fs.createReadStream(path)
        })
        setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
      }
      /*AUTODOWN CAPCUT VIIDEO */
/*else if (/capcut\.com/.test(str)) {
                var res = (await axios.get(`https://api.sumiproject.net/capcutdowload?url=${str}`))
                  send({body: `${head('CAPCUT')}\n📝 Tiêu Đề: ${res.data.title}\n→ Description : ${res.data.description}\n👁️ Lượt Xem : ${res.data.usage}\n`,attachment: await streamURL(res.data.video, 'mp4')})*/

        else if (/(?:https?:\/\/)?(?:www\.)?capcut\.com\/(?:t\/|template-detail\/)([a-zA-Z0-9]+)(?:\/)?/.test(str)) {
        const data = await capcutDl(str);
        send({
          body: `📝 Title: ${data.title}\n✏️ Mô Tả: ${data.description}\n📥 Lượt Dùng: ${data.usage}\n`,
          attachment: await streamURL(data.video, 'mp4')
        });
                }      /* TỰ DỘNG TẢI ẢNH , GIF , VIDEO PINTERES */
   /*   if (/(^https:\/\/)((www)\.)?(pinterest|pin)*\.(com|it)\//.test(str)) {
        const res = await axios.get(`https://api-0703.0703-opa.repl.co/pin/down?url=${str}`);
        send({
          body: `📝 Title: ${res.data.title}\n🔗 Link: ${res.data.url}`,
          attachment: await streamURL(res.data.url, res.data.url.substring(res.data.url.lastIndexOf(".") + 1))
        });
      }
      /* TỰ ĐỘNG TẢI VD + ẢNH INSTA */
     else if (/(https:\/\/www\.instagram\.com\/(stories|p|reel|tv)\/[a-zA-Z0-9_\-\/?=]+)(?=\s|$)/g.test(str)) {
    const res = (await axios.get(`http://dongdev.click/api/down/media?url=${str}`)).data;
    let attachment = [];
     if (res.attachments && res.attachments.length > 0) {
        for (const at of res.attachments) {
            if (at.type === 'Video') {
                attachment.push(await streamURL(at.url, 'mp4'));
            } else if (at.type === 'Photo') {
                attachment.push(await streamURL(at.url, 'jpg'));
            }
        }
        send({
            body: `📝 Title: ${res.message || "Không Có Tiêu Đề"}`,
            attachment
        });
    }
}

      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO TWITTER | X */

      /* TỰ ĐỘNG TẢI NHẠC TRÊN SOUNDCLOUD */
   /*   else if (/^(https?:\/\/)?(www\.)?(m\.)?(on\.)soundcloud\.com\/[\w\-\.]+(\/[\w\-\.]+)?$/.test(str,)) 
        {const res = await axios.get(`https://nguyenmanh.name.vn/api/scDL?url=${str}&apikey=QC4SGHJV`,);
                send({
                    body: `📝 Tiêu Đề: ${res.data.result.title}\n✏️ Mô Tả: ${res.data.result.data.description}\n👁️‍🗨️ Lượt Xem: ${res.data.result.data.playback_count}`,
                    attachment: await streamURL(res.data.result.audio, "mp3"),
                });
      /* TỰ ĐỘNG TẢI NHẠC ZINGMP3 */
 /*   else if (/zingmp3\.vn/.test(str)) {
        const res = await axios.get(`https://nguyenmanh.name.vn/api/zMp3DL?url=${str}apikey=HSKAHruq`);
        const tz = await axios.get(`https://hoanghao.me/api/zingmp3/info?link=${str}`);
        send({
          body: `${head('ZingMp3')}Tiêu Đề : ${tz.data.title}\n`,
          attachment: await streamURL(res.data.resuilt, 'mp3')
        });
      }*/
      /* TỰ ĐOONGJ TẢI NHẠC SPOTIFY */
    /*  else if (/spotify|open/.test(str)) {
        const res = await axios.get(`https://joshweb.click/api/spotify2?q=${str}`);
        send({
          body: `${head('Spotify')}${res.data.result}\n`,
          attachment: await streamURL(res.data.av, 'mp3')
        });
      }*/
    }
  } catch (e) {
    console.log(e);  
  }
};
exports.run = () => {};
exports.config = {
  name: 'autodown',
  version: '1',
  hasPermssion: 0,
  credits: 'Công Nam',
  description: '[]',
  commandCategory: 'Tiện ích',
  usages: '[]',
  cooldowns: 3
};

function streamURL(url, type) {
  return axios.get(url, {
    responseType: 'arraybuffer'
  }).then(res => {
    const path = __dirname + `/cache/${Date.now()}.${type}`;
    fs.writeFileSync(path, res.data);
    setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
    return fs.createReadStream(path);
  });
}
this.handleReaction = async (o) => {
  let s = o.handleReaction;
  o.api.unsendMessage(s.messageID);
  if (s.o.event.senderID == o.event.userID) s.callback(o);
};
this.checkLink = function(url) {
    const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    const found = url.match(regex);

    if (found && found.length > 0) {
        const media = ['tiktok', 'facebook', 'douyin', 'youtube', 'youtu', 'twitter', 'instagram', 'capcut', 'fb', 'zingmp3', 'cdn', 'pinterest', 'spotify', 'soundcloud'];
        for (const urlPart of found) {
            if (media.some(item => urlPart.includes(item))) {
                return {
                    url: urlPart
                };
            }
        }
    }

    return false;
}

this.isValidUrl = function(url) {
    const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return url.match(regex) !== null;
}
async function capcutDl(url) {
  try {
    if (!url) throw new Error('Thiếu dữ liệu để khởi chạy chương trình');
    const getUrl = await axios.get("https://ssscap.net/api/download/get-url?url=" + url);
    const get = getUrl.data.url;
    const urls = get.split("/")[4].split("?")[0];
    const options = {
      method: 'GET',
      url: 'https://ssscap.net/api/download/' + urls,
      headers: {
        'Connection': 'keep-alive',
        'If-None-Match': 'W/\"b5g46esu4owe\"',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'Cookie': 'device-time=1689832206038; sign=35455ecfd6b5b5e1cc76167c3efb033a; __gads=ID=213a51ccbc3e8cae-2232104a6ee20085:T=1689832121:RT=1689832121:S=ALNI_MaUG-o0pLuBRphxaRt_Q-pvbaFehg; __gpi=UID=00000c227e4bec29:T=1689832121:RT=1689832121:S=ALNI_Majvgt2Z1isgWbx_YqPFXcuzjYtww',
        'Referer': 'https://ssscap.net/vi',
        'Host': 'ssscap.net',
        'Accept-Language': 'vi-VN,vi;q=0.9',
        'Accept': 'application/json, text/plain, */*',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors'
      }
    };
    const response = await axios.request(options);
    const getData = response.data;
    const tieude = getData.title;
    const mota = getData.description;
    const usage = getData.usage;
    const video = 'https://ssscap.net' + getData.originalVideoUrl;
    return {
      title: tieude,
      video: video,
      description: mota,
      usage: usage
    };
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error('Không tìm thấy dữ liệu video này');
  }
}

function ytb(link, path) {
  var timestart = Date.now();
  if (!link) return 'Thiếu link';
  var resolveFunc = function() {},
    rejectFunc = function() {},
    returnPromise = new Promise(function(resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });
  require('@distube/ytdl-core')(link, {
    filter: format => format.quality == 'tiny' && format.audioBitrate == 128 && format.hasAudio == true
  }).pipe(fs.createWriteStream(path)).on("close", async () => {
    var data = await require('@distube/ytdl-core').getInfo(link);
    var result = {
      title: data.videoDetails.title,
      dur: Number(data.videoDetails.lengthSeconds),
      viewCount: data.videoDetails.viewCount,
      likes: data.videoDetails.likes,
      uploadDate: data.videoDetails.uploadDate,
      sub: data.videoDetails.author.subscriber_count,
      author: data.videoDetails.author.name,
      timestart
    };
    resolveFunc(result);
  });
  return returnPromise;
}
//https://j2download.net/api/facebook/media?url=
//https://bacninh.me/api/instagram/media?url=