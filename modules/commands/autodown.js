const axios = require('axios');
const BASE_URL = 'http://dongdev.click/api/down/media';

this.config = {
  name: "autodown",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "DongDev", //Thay credit làm 🐶 
  description: "Autodown Facebook, Tiktok, YouTube, Instagram, Bilibili, Douyin, Capcut, Threads",
  commandCategory: "Tiện ích",
  usages: "[]",
  cooldowns: 5
};
this.handleEvent = async ({ api, event }) => {
  if (event.senderID == api.getCurrentUserID()) return;
  let stream = (url, ext = 'jpg') => require('axios').get(url, { responseType: 'stream' }).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  const head = app => `[ 𝐀𝐔𝐓𝐎𝐃𝐎𝐖𝐍 ${app} ]\n────────────────`;
  for (const url of event.args) {
    if (/(^https:\/\/)(\w+\.|m\.)?(facebook|fb)\.(com|watch)\//.test(url)) {
      const res = (await axios.get(`${BASE_URL}?url=${encodeURIComponent(url)}`)).data;
      if (res.attachments && res.attachments.length > 0) {
        let attachment = [];
        if (res.queryStorieID) {
            const match = res.attachments.find(item => item.id == res.queryStorieID);
            if (match && match.type === 'Video') {
                const videoUrl = match.url.hd || match.url.sd;
                attachment.push(await stream(videoUrl, 'mp4'));
            } else if (match && match.type === 'Photo') {
                const photoUrl = match.url;
                attachment.push(await stream(photoUrl, 'jpg'));
            }
        } else {
            for (const attachmentItem of res.attachments) {
                if (attachmentItem.type === 'Video') {
                    const videoUrl = attachmentItem.url.hd || attachmentItem.url.sd;
                    attachment.push(await stream(videoUrl, 'mp4'));
                } else if (attachmentItem.type === 'Photo') {
                    attachment.push(await stream(attachmentItem.url, 'jpg'));
                }
            }
        }
        send({ body: `${head('𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊')}\n⩺ Tiêu đề: ${res.message || "Không có tiêu đề"}\n${res.like ? `⩺ Lượt thích: ${res.like}\n` : ''}${res.comment ? `⩺ Bình luận: ${res.comment}\n` : ''}${res.share ? `⩺ Chia sẻ: ${res.share}\n` : ''}⩺ Tác giả: ${res.author || "unknown"}`.trim(), attachment });
      }
    } else if (/^(https:\/\/)(www\.|wt\.|vm\.|m\.|web\.|v\.|mobile\.)?(tiktok\.com|t\.co|twitter\.com|youtube\.com|instagram\.com|bilibili\.com|douyin\.com|capcut\.com|threads\.net)\//.test(url)) {
      const platform = /tiktok\.com/.test(url) ? '𝐓𝐈𝐊𝐓𝐎𝐊' : /twitter\.com/.test(url) ? '𝐓𝐖𝐈𝐓𝐓𝐄𝐑' : /youtube\.com/.test(url) ? '𝐘𝐎𝐔𝐓𝐔𝐁𝐄' : /instagram\.com/.test(url) ? '𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌' : /bilibili\.com/.test(url) ? '𝐁𝐈𝐋𝐈𝐁𝐈𝐋𝐈' : /douyin\.com/.test(url) ? '𝐃𝐎𝐔𝐘𝐈𝐍' : /threads\.net/.test(url) ? '𝐓𝐇𝐑𝐄𝐀𝐃𝐒' : /capcut\.com/.test(url) ? '𝐂𝐀𝐏𝐂𝐔𝐓' : 'UNKNOWN';
      const res = (await axios.get(`${BASE_URL}?url=${encodeURIComponent(url)}`)).data;
      let attachments = [];        
      if (res.attachments && res.attachments.length > 0) {
          for (const at of res.attachments) {
             if (at.type === 'Video') {
                  attachments.push(await stream(at.url, 'mp4'));
             } else if (at.type === 'Photo') {
                  attachments.push(await stream(at.url, 'jpg'));
             } else if (at.type === 'Audio') {
                  attachments.push(await stream(at.url, 'mp3'));
                }
           }
        send({ body: `${head(platform)}\n⩺ Tiêu đề: ${res.message || "Không có tiêu đề"}`, attachment: attachments });
      }
    }
  }
};

this.run = async () => {};