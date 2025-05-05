const axios = require('axios');
const qs = require('qs');

async function getData(url) {
  try {
    const getToken = (await axios.get("https://fdownloader.net")).data;
    const k_exp = getToken.split('k_exp="')[1]?.split('"')[0];
    const k_token = getToken.split('k_token="')[1]?.split('"')[0];

    if (!k_exp || !k_token) throw new Error('Failed to retrieve tokens.');

    const data = qs.stringify({
      'k_exp': k_exp,
      'k_token': k_token,
      'q': url
    });

    const config = {
      method: 'post',
      url: 'https://v3.fdownloader.net/api/ajaxSearch?lang=en',
      headers: {
        "Accept": "*/*",
        "Origin": "https://fdownloader.net",
        "Referer": "https://fdownloader.net/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded",
        "Sec-Ch-Ua": '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183",
        "X-Requested-With": "XMLHttpRequest",
      },
      data: data
    };

    const res = await axios(config);
    const dataContent = res.data.data;

    const thumb = dataContent.split('<img src="')[1]?.split('">')[0]?.replace(/;/g, "&");
    const audio = dataContent.split('id="audioUrl" value="')[1]?.split('"')[0]?.replace(/;/g, "&");
    const time = dataContent.split('clearfix')[1]?.split('<p>')[1]?.split("</p>")[0];
    const HD = dataContent.split('" rel="nofollow"')[0]?.split('<td>No</td>')[1]?.split('"')[1]?.replace(/;/g, "&");
    const SD = dataContent.split('>360p (SD)</td>')[1]?.split('<a href="')[1]?.split('"')[0]?.replace(/;/g, "&");

    return {
      duration: time,
      thumb: thumb,
      url: HD || SD || null
    };
  } catch (e) {
    console.error(e);
    return 'Lỗi';
  }
}

this.config = {
    name: 'atdfb',
    version: '1.1.1',
    hasPermssion: 3,
    credits: 'hphong', // Đừng thay credit của hphong
    description: 'Tự động tải xuống khi phát hiện liên kết Facebook',
    commandCategory: 'Tiện ích',
    usages: '[]',
    cooldowns: 2
};

function urlify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex);
  return matches || []; 
}

this.handleEvent = async function({ api, event }) {    
    if (event.senderID == api.getCurrentUserID()) return;

    let streamURL = (url, ext = 'jpg') => axios.get(url, { responseType: 'stream' })
        .then(res => (res.data.path = `tmp.${ext}`, res.data))
        .catch(e => null);

    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    const head = app => `[ 𝐀𝐔𝐓𝐎𝐃𝐎𝐖𝐍 ${app} ]\n────────────────`;
    const urls = urlify(event.body);

    for (const str of urls) {
        if (/facebook\.com\//.test(str)) {
          const res = await getData(str);
          if (res && res.url) {
            let attachment = await streamURL(res.url, 'mp4' , 'jpg' , "png");
            send({body: `${head('𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊')}`, attachment});
          } else {
            send({body: 'Không thể tải xuống video.'});
          }
        }
    }
};