const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SenThanh & mod by DongDev",
  description: "Thông tin từ nền tảng TikTok",
  commandCategory: "Tiện ích",
  usages: "",
  cooldowns: 5,
  images: [],
};

const roof = n => +n != +Math.floor(n) ? +Math.floor(n) + 1 : +n;
const localeStr = n => ((+n).toLocaleString()).replace(/,/g, '.');
const {
    get
} = require('axios'),
{
    createReadStream,
    mkdirSync,
  rmdirSync,
  unlinkSync
  } = require('fs-extra'),
  {
  image
  } = require('image-downloader');
  module.exports.handleReply = async ({ api, event, handleReply }) => {
  const $ = handleReply;
  if($.case == 'runListUserPost') {
      if(['list'].includes(event.args[0])){
          if(event.args[1] > roof($.data.length/6) || event.args[1]<1 || isNaN(event.args[1])) return api.sendMessage(`❎ Trang ${event.args[1]} không nằm trong danh sách`, event.threadID, event.messageID); else return runListUserPost(api, event, $.data, 6,+event.args[1],$.type ,$.author);
      } else return api.sendMessage({body: $.type?infoVideoUserPost($.data[event.args[0]-1]):infoMusicUserPost($.data[event.args[0]-1].music_info),attachment: await downStreamURL($.data[event.args[0]-1][$.type?'play':'music'],__dirname+`/cache/${event.messageID}.${$.type?'mp4':'mp3'}`)}, event.threadID, () => unlinkSync(__dirname+`/cache/${event.messageID}.${$.type?'mp4':'mp3'}`), event.messageID);
  };
  const { threadID, messageID, body } = event;
  if (handleReply.author != event.senderID || !body) return;
  let args = body.split(' ');
  switch (handleReply.type) {
  case 'trending':
    const lower1 = args[0].toLowerCase();
    const lower2 = !args[1] ? '' : args[1].toLowerCase();
    if (lower1 == 'trang') {
      if (isFinite(lower2) && lower2 <= roof(handleReply.data.data.length / 6)) return runInfoTrending(handleReply.data, api, event, this.config.name, 6, +lower2)
      else return api.sendMessage(`❎ Không tìm thấy trang ${lower2} trong danh sách`, threadID, messageID);
    }
    if (isFinite(lower1) && !!lower2 && !['wm'].includes(lower2)) return api.sendMessage(`⚠️ Vui lòng nhập đúng định dạng`, threadID, messageID);
    const data = handleReply.data.data[(+lower1) - 1];
    const info = { url: data[(!lower2 ? '' : lower2) + 'play'], msg: infoVideo(data) };
    axios.get(info.url, { responseType: 'stream' }).then(response => api.sendMessage({ body: info.msg, attachment: response.data }, threadID, messageID)).catch(e => api.sendMessage(e, threadID, messageID));
  case 'search':
    if (isNaN(body)) return;
    const { videoInfo } = handleReply;
    const index = parseInt(body) - 1;
    if (index < 0 || index >= videoInfo.length) return api.sendMessage("❎ Số thứ tự không hợp lệ", threadID, messageID);

      api.unsendMessage(handleReply.messageID);

    const { digg_count, comment_count, play_count, share_count, download_count, duration, region, title, nickname, unique_id } = videoInfo[index];
    axios.get(videoInfo[index].nowatermark, { responseType: "stream" }).then(res => {
      res.data.pipe(fs.createWriteStream(__dirname + "/cache/tiktok.mp4"));
      res.data.on("end", () => {
        api.sendMessage({ body: `[ TikTok - Video ]\n────────────────────\n🌍 Quốc gia: ${region}\n📝 Tiêu đề: ${title}\n🌾 Tên kênh: ${nickname}\n📌 ID người dùng: ${unique_id}\n❤️ Lượt tim: ${digg_count}\n💬 Tổng bình luận: ${comment_count}\n🔎 Lượt xem: ${play_count}\n🔀 Lượt chia sẻ: ${share_count}\n⬇️ Lượt tải: ${download_count}\n⏳ Thời gian: ${duration} giây`, attachment: fs.createReadStream(__dirname + "/cache/tiktok.mp4") }, threadID, () => fs.unlinkSync(__dirname + "/cache/tiktok.mp4"), messageID);
      });
    }).catch(err => console.log(err));
    break;
   }
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require('fs-extra');
  const tm = process.uptime(),Tm=(require('moment-timezone')).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY')
    h=Math.floor(tm / (60 * 60)),H=h<10?'0'+h:h,
    m=Math.floor((tm % (60 * 60)) / 60),M=m<10?'0'+m:m,
    s=Math.floor(tm % 60),S=s<10?'0'+s:s,$=':'
  const img = (await axios.get(`https://i.imgur.com/NnKG3KM.jpg`, { responseType: "stream"})).data;
  if (!args[0]) return api.sendMessage({body:"[ TIKTOK - Hướng Dẫn Sử Dụng ]\n────────────────────\n⁠.tiktok info + id: xem thông tin người dùng\n.tiktok video + link: tải video tiktok\n⁠.tiktok music + link: tải âm thanh của video\n-.tiktok search + từ khóa: tìm kiếm video thông qua từ khóa\n.tiktok trending: random trending tiktok\n⁠.tiktok post + id: xem những bài đăng của người dùng", attachment: img}, event.threadID, event.messageID);
  if (args[0] == 'post') return runListUserPost(api, event, (await get(`https://www.tikwm.com/api/user/posts?unique_id=${args[1]}`)).data.data.videos, 6, 1, true, event.senderID);
  const { threadID, messageID } = event;
  const type = args[0];
  const keyword = args[1];
  switch (type.toLowerCase()) {
    case "-i":
    case "info":
      if (!args[1]) return api.sendMessage("⚠️ Bạn chưa nhập tên tài khoản của người dùng cần xem thông tin", threadID);
      try {      axios.get(encodeURI(`https://www.tikwm.com/api/user/info?unique_id=${keyword}`)).then(async (res) => {
          if (res.data.erro == 1) return api.sendMessage("⚠️ Tên tài khoản không tồn tại", threadID);
          const { id, signature, uniqueId, nickname, region, relation } = res.data.data.user;
          const { followerCount, videoCount, heartCount, followingCount } = res.data.data.stats;
          var img =  res.data.data.user.avatarMedium;
        var path = __dirname + "/cache/1.png";
    let getimg = (await axios.get(`${img}`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(path, Buffer.from(getimg, "utf-8"));
  let msg = `[ TIKTOK INFO USER ]\n────────────────────\n👤 Tên tài khoản: ${uniqueId}\n✏️ ID: ${id}\n🫥 Tên người dùng: ${nickname}\n🌐 URL: https://www.tiktok.com/@${uniqueId}\n📝 Mô tả: ${signature}\n👫 Mối quan hệ: ${relation}\n😶 Lượt theo dõi: ${followerCount}\n📎 Đang theo dõi: ${followingCount}\n🔎 Tổng video: ${videoCount}\n❤️ Lượt tim: ${heartCount}\n────────────────────\n⏰ Time: ${Tm}`.replace(/^ +/gm, '')
            return api.sendMessage({
              body: msg,
              attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, event.messageID); 
        })
      } catch (error) { console.log(error) }
      break
    case 'search':
    case 'seach':
    case '-s':
      args.shift();
      const search = args.join(" ");
      if (!search) return api.sendMessage("⚠️ Bạn chưa nhập từ khóa tìm kiếm", threadID);
      axios.get(`https://www.tikwm.com/api/feed/search?keywords=${encodeURI(search)}`).then(async res => {
        const { videos: result } = res.data.data;
        if (result.length == 0) return api.sendMessage("⛔ Không tìm thấy kết quả nào", threadID);

        const lengthResult = result.length > 9 ? 9 : result.length;
        let videoInfo = [];
        let msg = `[ TikTok - Search ]\n────────────────────\n🔍 Hệ thống tìm thấy ${lengthResult} kết quả phù hợp với từ khóa của bạn:\n`;
        let nameATM = [], attachment = [];
        for (let i = 0; i < lengthResult; i++) {
          const { digg_count, comment_count, play_count, share_count, download_count, duration, region, title, play: nowatermark, origin_cover: cover } = result[i];
          const { nickname, unique_id } = result[i].author;
          let stream_ = await axios.get(encodeURI(cover), { responseType: 'arraybuffer' });
            const tempDir = __dirname + "/cache/" + Date.now() + ".png";
          fs.writeFileSync(tempDir, Buffer.from(stream_.data, 'utf8'));
          nameATM.push(tempDir);
          attachment.push(fs.createReadStream(tempDir));
          msg += `\n\n${i + 1}. ${nickname}\n📃 Tiêu đề: ${title}\n⏳ Thời gian: ${duration} giây`;
          videoInfo.push({ digg_count, comment_count, play_count, share_count, download_count, region, nickname, title, nowatermark, cover, unique_id, duration });
        }
        msg += `\n────────────────────\n📌 Phản hồi tin nhắn này theo số thứ tự của video cần tải\n⏳️ Time: ${Tm}`;

        api.sendMessage({body: msg, attachment}, threadID, (err, info) => {
          if (err) return console.log(err);
          nameATM.forEach(pa => fs.unlinkSync(pa));
          global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            videoInfo,
            type: "search"
          })
        })
      }).catch(err => console.log(err));
      break
    case "-v":
    case "video":
      try {   
        const res = await axios.get(`https://www.tikwm.com/api/?url=${keyword}`);
        const { play, author, digg_count, comment_count, play_count, share_count, download_count, title, duration, region } = res.data.data;
        var callback = () => api.sendMessage({ body: `[ TikTok - Video ]\n────────────────────\n🌍 Quốc gia: ${region}\n📝 Tiêu đề: ${title}\n👤 Tên kênh: ${author.nickname}\n🌾 ID người dùng: ${author.unique_id}\n❤️ Lượt tim: ${digg_count}\n💬 Tổng bình luận: ${comment_count}\n🔎 Lượt xem: ${play_count}\n🔀 Lượt chia sẻ: ${share_count}\n⬇️ Lượt tải: ${download_count}\n⏳ Thời gian: ${duration} giây`, attachment: fs.createReadStream(__dirname + "/cache/tkvd.mp4") }, threadID, () => fs.unlinkSync(__dirname + "/cache/tkvd.mp4"), messageID);
        request(encodeURI(`${play}`)).pipe(fs.createWriteStream(__dirname + '/cache/tkvd.mp4')).on('close', () => callback());
      }
      catch (err) {
        console.log(err)
        return api.sendMessage("Đã xảy ra lỗi...", event.threadID);
      }
      break;
    case "-m":
    case "music":
      try {
        const res = await axios.get(`https://www.tikwm.com/api/?url=${keyword}`);
        const { music, music_info } = res.data.data;
        var callback = () => api.sendMessage({ body: `[ Music - TikTok ]\n────────────────────\n📝 Tiêu đề audio: ${music_info.title}\n✏️ Album: ${music_info.album}\n👤 Tác giả: ${music_info.author}\n⏳ Thời gian: ${music_info.duration} giây`, attachment: fs.createReadStream(__dirname + "/cache/tkvd.mp3") }, threadID, () => fs.unlinkSync(__dirname + "/cache/tkvd.mp3"), messageID);
        request(encodeURI(`${music}`)).pipe(fs.createWriteStream(__dirname + '/cache/tkvd.mp3')).on('close', () => callback());
      }
      catch (err) {
        console.log(err)
        return api.sendMessage("❎ Đã xảy ra lỗi...", event.threadID);
      }
      break;
    case "-tr":
    case "trending":
      axios.get(`https://www.tikwm.com/api/feed/list?region=VN`).then(response_api => {
        runInfoTrending(response_api.data, api, event, this.config.name, 6, args[1] && isNaN(args[1]) ? args[1] : 1)
      }).catch(e => api.sendMessage(e, event.threadID, event.messageID));
    default:
      break
  }
}
module.exports.handleReaction = function({
    handleReaction: $, api, event
}){
    if($.case == 'runListUserPost') return runListUserPost(api, event, $.data, 6,1,$.type?false:true,$.author);
};
async function runInfoTrending(res, api, event, name, length, limit) {
  let dirTD = `${__dirname}/cache/tiktok_trending_${event.senderID}`;
  if (!fs.existsSync(dirTD)) fs.mkdirSync(dirTD, { recursive: true });
  const attachment = [];
  var txt = `[ TIKTOK TRENDING ]\n────────────────────\n`

  for (var i = (length * limit) - length; i < length * limit; i++) {
    if (!res.data || !res.data[i]) break;
    const { title, origin_cover, duration, video_id } = res.data[i];

    const dest = `${dirTD}/${video_id}.jpg`
    txt += `${i + 1}. ${title.split(' ').filter(i => !i.startsWith('#')).join(' ')}\n🔗 Hashtag: ${title.split(' ').filter(i => i.startsWith('#')).join(', ')}\n⏳ Thời gian: ${duration} giây\n\n`;
    await DownloadImage(origin_cover, dest);
    attachment.push(fs.createReadStream(dest));
  };
  txt += `\n────────────────────\n📝 Trang [ ${limit} | ${roof(res.data.length / length)} ]\n📌 Phản hồi tin nhắn này theo số thứ tự để tải video không logo hoặc số thứ tự + wm để tải video có logo\n✏️ Phản hồi tin nhắn này < trang + số trang > để chuyển trang`;

  api.sendMessage({ body: txt, attachment }, event.threadID, (err, info) => {
    if (err) return console.log(err);
    const obj = {
      name: name,
      messageID: info.messageID,
      author: event.senderID,
      data: res,
      type: 'trending'
    }
    global.client.handleReply.push(obj);
    fs.rmdirSync(dirTD, { recursive: true });
  });
};

function DownloadImage(url, path) {
  return new Promise((resolve, reject) => {
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('close', () => resolve())
      .on('error', reject);
  });
}

function infoVideo(data) {
  return `[ INFO VIDEO TIKTOK ]\n────────────────────\n🗺️ Quốc gia: ${data.region}\n📝 Tiêu đề: ${data.title.split(' ').filter(i => !i.startsWith('#')).join(' ')}\n📌 Hashtag: ${data.title.split(' ').filter(i => i.startsWith('#')).join(', ')}\n❤️ Lượt tim: ${localeStr(data.digg_count)}\n💬 Tổng bình luận: ${localeStr(data.comment_count)}\n🔀 Lượt chia sẻ: ${localeStr(data.share_count)}\n⬇️ Lượt tải: ${localeStr(data.download_count)}\n⏳ Thời gian: ${data.duration} giây\n🌾 ID người dùng: ${data.author.unique_id}\n👤 Tên người dùng: ${data.author.nickname}`;
};
function infoAudio(data) {
  return `[ INFO AUDIO TIKTOK ]\n────────────────────\n📝 Tiêu đề Audio: ${data.music_info.title}\n⏳ Thời gian: ${data.music_info.duration} giây\n👤 Tên tác giả: ${data.music_info.author}\n🎵 Âm thanh gốc: ${data.music_info.original == true ? 'Có' : 'Không'}`;
};
/* /// */
async function downStreamURL(a, b) {
    await image({
        url: a, dest: b
    });
    return createReadStream(b);
};
function infoMusicUserPost(a){
    return `[ INFO AUDIO TIKTOK ]\n────────────────────\n📌 ID: ${a.id}\n📝 Tiêu đề: ${a.title}\n- Thời gian: ${a.duration}s\n🎵 Nhạc gốc: ${a.original}\n👤 Tác giả: ${a.author}\n✏️ Album: ${a.album}`;
};
 function infoVideoUserPost(a){
     return `[ INFO VIDEO TIKTOK ]\n────────────────────\n📌 ID: ${a.video_id}\n📝 Tiêu đề: ${a.title}\n❤️ Lượt thích: ${a.digg_count}\n💬 Lượt bình luận: ${a.comment_count}\n🔀 Lượt chia sẻ: ${a.share_count}\n⬇️ Lượt tải: ${a.download_count}\n⏳ Thời gian: ${a.duration}s\n👤 Tên: ${a.author.nickname}\n🌾 ID: ${a.author.unique_id}`;
 };
 async function runListUserPost(a, b, c, d, e,g,h) {
     const dir = __dirname + '/cache/downStreamURL_'+b.messageID;
    mkdirSync(dir);
    var txt = '',
    atm = [],
    i = (d*e)-d,
    l = c.length;
    for (;i<d*e;i++){
        const j = g?c[i]:c[i].music_info;
        if(!j)break;
        txt += `${i+1}. ${j.title} (${j.duration}s)\n`;
        atm.push(await downStreamURL(g?j.origin_cover:j.cover, `${dir}/${g?j.video_id:j.id}.jpg`));
        };
        txt+=`\n📝 Trang [ ${e}/${roof(c.length/d)} ]\n\n📌 Phản hồi + < STT > để tải ${g?'video':'music'}\n👉 Phản hồi + < list > + < STT > để chuyển trang\n🔎 Reaction để chuyển qua danh sách ${g?'music':'video'}`;

a.sendMessage({body: txt, attachment: atm}, b.threadID, (err, data)=> {
    const opt = {
                name: 'tiktok', messageID: data.messageID, author: h, type: g, 'case': 'runListUserPost', data: c
            };
            global.client.handleReaction.push(opt), global.client.handleReply.push(opt);
        rmdirSync(dir, {
            recursive: true
        })
    });
};