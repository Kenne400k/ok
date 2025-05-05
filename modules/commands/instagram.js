module.exports.config = {
    name: 'instagram',
    version: '1.1.1',
    hasPermssion: 0,
    credits: '',
    description: 'Tiện ích về Instagram',
    commandCategory: 'ADMIN',
    usages: '< infouser|image|video|postuser >',
    cooldowns: 2,
    dependencies: {
        'image-downloader': '',
    }
};
const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];
const request = global.nodemodule["request"];
const downloader = require('image-downloader') 

module.exports.run = async function({
    api, event, args, Users, Threads
}) {
  try {
    const { threadID, messageID, senderID, body } = event;
    switch (!args[0] ?'':args[0].toLowerCase()) {
        case "info":
    case "i":{
      const username = args[1];
      if (!username) return api.sendMessage("con mẹ m info đâu", threadID);
       const res = await axios.get(`https://nguyenlienmanh.com/instagram/info?username=${username}`);
      var url1 = res.data.data.picture;
  var callback = () => api.sendMessage({body:`Name: ${res.data.data.fullname}\nUsername: ${res.data.data.username}\nTrang riêng tư: ${res.data.data.private}\nId: ${res.data.data.id}\nNgười theo dõi: ${res.data.data.followers}\nĐang theo do4i: ${res.data.data.following}\nSố bài đăng: ${res.data.data.post_cout}\nWeb: ${res.data.data.website}\nBio: ${res.data.data.bio}`,attachment: fs.createReadStream(__dirname + "/cache/ins.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ins.png"),event.messageID);
	 return request(encodeURI(`${url1}`)).pipe(fs.createWriteStream(__dirname+'/cache/ins.png')).on('close',() => callback());  
   }
  break; 

      case "post":
      case "p":{
    const link = args[1];
          if (!link) return api.sendMessage("link đâu", threadID);
const res = await axios.get(`https://nguyenlienmanh.com/instagram/videodl?url=${link}`);
var url = res.data.images[0].image_versions2.candidates[0].url;
       var callback = () => api.sendMessage({body:`Tên: ${res.data.user_full_name} ( ${res.data.username })\nTiêu đề: ${res.data.title}\nCMT: ${res.data.comment_count}\nLIKE: ${res.data.like_count}\n\nAuthor: ${res.data.author}`,attachment: fs.createReadStream(__dirname + "/cache/insta.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/insta.png"),event.messageID);
	 return request(encodeURI(`${url}`)).pipe(fs.createWriteStream(__dirname+'/cache/insta.png')).on('close',() => callback());  
    }
      break;
        
      case "video":
      case "v":{
    const
    axios = require('axios'),
    fs = require('fs');
    const
    link_video = args[1],//////'https://www.instagram.com/reel/CjneRcAJ6E8/?utm_source=ig_web_copy_link',
    data = (await axios.get(`https://nguyenlienmanh.com/instagram/videodl?url=${link_video}`)).data,
    buffer = (await axios.get(data.video_versions[0].url, {
        responseType: 'arraybuffer'
    })).data,
    path = __dirname+'/cache/basil.mp4';

    fs.writeFileSync(path, buffer);
    api.sendMessage({body:`nam mô a di đà phật à ra video giúp con đi`, 
        attachment: fs.createReadStream(path)}, event.threadID); 
      };
      break;

        case "music":
      case "a":
      case "m":{
    const
    axios = require('axios'),
    fs = require('fs');
    const
    link_video = args[1],//////'https://www.instagram.com/reel/CjneRcAJ6E8/?utm_source=ig_web_copy_link',
    data = (await axios.get(`https://nguyenlienmanh.com/instagram/videodl?url=${link_video}`)).data,
    buffer = (await axios.get(data.music_metadata.original_sound_info.progressive_download_url, {
        responseType: 'arraybuffer'
    })).data,
    path = __dirname+'/cache/basil.mp3';

    fs.writeFileSync(path, buffer);
    api.sendMessage({body:`mp3 test`, 
        attachment: fs.createReadStream(path)}, event.threadID); 
      };
      break;

        case "basil":{
    const
    axios = require('axios'),//|
    fs = require('fs');      //| khai báo package

    const
    link_post = args[1];

    if (!link_post.startsWith('https://www.instagram.com/p/')) return api.sendMessage('Link bài đăng không hợp lệ', event.threadID); // check link có bắt đầu bằng string(chuỗi) được ghi trong ('...')

    axios.get(`https://nguyenlienmanh.com/instagram/videodl?url=${link_post}`)/* request đến api */
    .then(async success=> { // .then kèm function, request thành công sẽ chạy function kèm data api

        const
        info = success.data, // lấy data
        body = `Tên: ${info.user_full_name} ( ${info.username } )\nTiêu Đề: ${info.title}\nCMT: ${info.comment_count} bình luận\nLIKE: ${info.like_count} lượt\nTổng ảnh của bài viết: ${info.carousel_media_count} ảnh`, // thông tin bài đăng
        allImage = info.images.map(el=>el.image_versions2.candidates[0].url), // tạo Array(mảng) mới với link ảnh đầu tiên
        length = allImage.length; // độ dài array

        var
        attachment = [], // array để tí gộp nhiều ảnh lại rồi gửi 1 lần
        index = 0; // biến index = 0 tí để đếm mỗi lần lặp của for

        for (; index < length; index++) {
            const
            url = allImage[index],// lấy link trong mảng tương ứng với số lần for lặp
            path = `${__dirname}/${index}.jpg`,// đường dẫn lưu ảnh
            buffer = (await axios.get(url, {
                responseType: 'arraybuffer'
            })).data; // buffer data

            fs.writeFileSync(path, buffer),// lưu data vào đường dẫn nãy tạo
            attachment.push(fs.createReadStream(path)); // stream data nãy lưu ở đường dẫn
        };

        /* gửi kết quả */
        return api.sendMessage({
            attachment,
            body
        }, event.threadID);
    })
    .catch(error=>(console.log(error), api.sendMessage(error.message, event.threadID))); // gửi lỗi nếu request đến API thất bại
    };
        break;

        default: api.sendMessage(`==> vd ( video/v )
        ==> mp3 ( music/s/a )
==> info ( i/info )
==> post ( ảnh )`, threadID)
    }
  }catch (erro){api.sendMessage(`${e}`,threadID);}
};
 