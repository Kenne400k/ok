const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

async function streamURL(url, ext) {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const fileName = path.join(__dirname, 'cache', `cache_${Date.now()}.${ext}`);
    await fs.ensureDir(path.dirname(fileName));
    const fileStream = fs.createWriteStream(fileName);

    response.data.pipe(fileStream);

    return new Promise((resolve, reject) => {
      fileStream.on('finish', () => resolve(fileName));
      fileStream.on('error', reject);
    });
  } catch (error) {
    console.error(`Error streaming URL: ${error.message}`);
    throw error;
  }
}

async function getData(url) {
  try {
    const { data } = await axios({
      method: 'post',
      url: 'https://api.downloadsound.cloud/track',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'vi,en;q=0.9',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'https://downloadsound.cloud',
        'Priority': 'u=1, i',
        'Referer': 'https://downloadsound.cloud/',
        'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      },
      data: {
        url: url
      }
    });

    return {
      title: data.title,
      author: data.author.username,
      url: data.url
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return null;
  }
}

async function handleTikTok(mediaUrl, api, event) {
  try {
    const res = await axios.post('https://www.tikwm.com/api/', { url: mediaUrl });
    if (res.data.code !== 0) throw new Error('Error fetching TikTok data');

    const tiktok = res.data.data;
    const attachments = [];

    if (Array.isArray(tiktok.images)) {
      for (const imageUrl of tiktok.images) {
        try {
          const file = await streamURL(imageUrl, 'jpg');
          attachments.push(fs.createReadStream(file));
        } catch (error) {
          console.error(`Error downloading image ${imageUrl}: ${error.message}`);
        }
      }
    } else if (tiktok.play) {
      try {
        const file = await streamURL(tiktok.play, 'mp4');
        attachments.push(fs.createReadStream(file));
      } catch (error) {
        console.error(`Error downloading video ${tiktok.play}: ${error.message}`);
      }
    }

    if (attachments.length > 0) {
      api.sendMessage({
        body: "Đây là file của bạn:",
        attachment: attachments
      }, event.threadID, () => {
        attachments.forEach(fileStream => {
          if (fileStream.path) {
            fs.unlink(fileStream.path, (err) => {
              if (err) console.error(`Error deleting file ${fileStream.path}: ${err.message}`);
            });
          }
        });
      }, event.messageID);
    }

  } catch (error) {
    api.sendMessage(`Đã xảy ra lỗi khi xử lý TikTok URL: ${error.message}`, event.threadID, event.messageID);
  }
}

async function handleImgur(mediaUrl, api, event) {
  try {
    const ext = mediaUrl.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mp3'].includes(ext)) {
      throw new Error('Unsupported file type');
    }
    const file = await streamURL(mediaUrl, ext);
    api.sendMessage({
      body: "Đây là file của bạn:",
      attachment: fs.createReadStream(file)
    }, event.threadID, () => {
      fs.unlink(file, (err) => {
        if (err) console.error(`Error deleting file ${file}: ${err.message}`);
      });
    }, event.messageID);
  } catch (error) {
    api.sendMessage(`Đã xảy ra lỗi khi xử lý Imgur URL: ${error.message}`, event.threadID, event.messageID);
  }
}

async function handleGeneralMedia(mediaUrl, api, event) {
  const mediaPath = path.join(__dirname, 'cache', `media_${Date.now()}`);
  try {
    const response = await axios.get(mediaUrl, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(mediaPath))
      .on('finish', () => {
        api.sendMessage({
          body: "Media của bạn đây:",
          attachment: fs.createReadStream(mediaPath)
        }, event.threadID, () => {
          fs.unlink(mediaPath, (err) => {
            if (err) console.error(`Error deleting file ${mediaPath}: ${err.message}`);
          });
        }, event.messageID);
      })
      .on('error', (err) => {
        console.error(`Error streaming general media URL: ${err.message}`);
        fs.unlink(mediaPath, () => {});
        api.sendMessage(`Đã xảy ra lỗi: ${err.message}`, event.threadID, event.messageID);
      });
  } catch (err) {
    api.sendMessage(`Đã xảy ra lỗi: ${err.message}`, event.threadID, event.messageID);
  }
}

async function handleSoundCloud(str, api, event) {
  if (/soundcloud\.com\//.test(str)) {
    try {
      const res = await getData(str);
      if (res && res.url) {
        const attachment = await streamURL(res.url, 'mp3');
        api.sendMessage({
          body: `Here is your file: ${res.title} by ${res.author}`,
          attachment: fs.createReadStream(attachment)
        }, event.threadID, () => {
          fs.unlink(attachment, (err) => {
            if (err) console.error(`Error deleting file ${attachment}: ${err.message}`);
          });
        }, event.messageID);
      } else {
        api.sendMessage(`Could not fetch data for the URL: ${str}`, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(`Error handling SoundCloud URL: ${error.message}`);
      api.sendMessage(`An error occurred: ${error.message}`, event.threadID, event.messageID);
    }
  }
}

module.exports.config = {
  name: "sendlink",
  version: "1.2.0",
  hasPermission: 0,
  credits: "vdang",
  description: "Gửi video hoặc ảnh từ URL",
  commandCategory: "utility",
  usages: "sendlink <URL>",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  if (args.length === 0) return api.sendMessage("Vui lòng cung cấp URL của video hoặc ảnh.", event.threadID, event.messageID);

  const mediaUrl = args[0];

  try {
    if (/tiktok\.com/.test(mediaUrl)) {
      await handleTikTok(mediaUrl, api, event);
    } else if (/imgur\.com/.test(mediaUrl)) {
      await handleImgur(mediaUrl, api, event);
    } else if (/soundcloud\.com\//.test(mediaUrl)) {
      await handleSoundCloud(mediaUrl, api, event);
    } else {
      await handleGeneralMedia(mediaUrl, api, event);
    }
  } catch (error) {
    api.sendMessage(`Đã xảy ra lỗi: ${error.message}`, event.threadID, event.messageID);
  }
};