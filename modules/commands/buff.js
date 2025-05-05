const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "buff",
  version: "1.0.0",
  hasPermssion: 0,
  Rent: 1,
  credits: "Dũngkon || vtuan",
  description: "Buff like, cảm xúc, follow",
  commandCategory: "Tiện ích",
  usages: "buff like/cx/sub",
  cooldowns: 6,
};

const fetchTDSAccounts = async () => {
  const tokens = [
    'TDS0nI5IXZ2V2ciojIyVmdlNnIsIyMzEzZnlHTiojIyV2c1Jye'
  ];
  var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
  const accountPromises = tokens.map(token =>
    axios.get(`https://traodoisub.com/api/?fields=profile&access_token=${token}`)
      .then(response => response.data)
      .catch(error => ({ error: error.message }))
  );
  return Promise.all(accountPromises);
};

const getAccountInfo = (accounts) => {
  return accounts.map(acc => `🛡TÀI KHOẢN: ${acc.data.user}\n💰SỐ XU HIỆN TẠI: ${parseInt(acc.data.xu).toLocaleString()}`).join('\n');
};

const getResponseMessage = (data, link, sl, cost, accounts) => {
  return `[ BUFF ]\nTRẠNG THÁI: ${data.data}\nLINK/ID: ${link}\nSỐ LƯỢNG: ${sl}\nSố Tiền Đã Trừ Là: ${parseInt(cost).toLocaleString()} VNĐ\n${getAccountInfo(accounts)}\nLưu Ý: Buff này được lấy nguồn từ website trao đổi sub nên là lên không nhanh`;
};

const filePath = "./modules/commands/cache/DATA_MONEY.json";
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));

const money1 = 10;
const money2 = 13;
const money3 = 13;
const money4 = 7;
const money5 = 35;
const money6 = 25;

const checkBalance = (mn, required) => {
  return mn && mn.input >= required;
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply, mentions } = event;
const { PREFIX } = global.config; 
 const threadSetting = global.data.threadData.get(threadID) || {};
 const prefix = threadSetting.PREFIX || PREFIX; 
  const out = (msg) => api.sendMessage(msg, threadID, messageID);

  let read = fs.readFileSync(filePath, 'utf-8');
  let checkmn = read ? JSON.parse(read) : [];

  let mn = checkmn.find(e => e.senderID === parseInt(senderID));

  if (args[0] === 'set') {
    const { ADMINBOT } = global.config;
    if (!ADMINBOT.includes(senderID)) return out(`Bạn không thể dùng!`);

    let newSenderID, input;
    if (messageReply) {
      newSenderID = parseInt(messageReply.senderID);
      input = parseInt(args[1].trim());
    } else if (mentions && Object.keys(mentions).length > 0) {
      newSenderID = parseInt(Object.keys(mentions)[0]);
      input = parseInt(args[2]);
    } else {
      [newSenderID, input] = args.slice(1).join(' ').split('|').map(str => parseInt(str.trim()));
    }

    const e = checkmn.findIndex(entry => entry.senderID === newSenderID);
    if (e !== -1) {
      checkmn[e].input += input;
      checkmn[e].lsnap.push({ time: Date.now(), input: input });
    } else {
      const newEntry = {
        senderID: newSenderID,
        input: input,
        historic: [],
        db: false,
        lsnap: [{ time: Date.now(), input: input }]
      };
      checkmn.push(newEntry);
    }
    fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
    return out(`Đã cộng tiền cho user với ID: ${newSenderID}`);
  } else if (args[0] == 'check') {
    if (args[1] && args[1].toLowerCase() === 'all') {
      let allData = "";
      for (let i = 0; i < checkmn.length; i++) {
        const user = checkmn[i];
        let history = user.historic.map((item, index) => `${index + 1}. Lệnh: ${item.type} | ID/Link: ${item.idOrLink} | Số Lượng: ${item.sl}`).join('\n');

        // Dữ liệu từ lsnap
        let lsnapData = "";
        if (user.lsnap && user.lsnap.length > 0) {
          lsnapData = user.lsnap.map((snap, index) => `${index + 1}. Thời gian: ${snap.time}, Số Tiền: ${parseInt(snap.input).toLocaleString()}`).join('\n');
        } else {
          lsnapData = "Không có dữ liệu nạp.";
        }

        allData += `Người dùng: ${user.senderID}\nSố dư: ${parseInt(user.input).toLocaleString()} VNĐ\nLịch sử sử dụng:\n${history}\nLịch sử nạp:\n${lsnapData}\n\n`;
      }
      return out(`Tất cả dữ liệu người dùng:\n${allData}`);
    }

    const uid = messageReply && messageReply.senderID || (mentions && Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : event.senderID);
    let dt = checkmn.find(e => e.senderID === parseInt(uid));

    if (!dt) {
      return out('Tài khoản của bạn chưa có dữ liệu.');
    }

    const history = dt.historic.map((item, index) => `${index + 1}. Lệnh: ${item.type} | ID/Link: ${item.idOrLink} | Số Lượng: ${item.sl}`).join('\n');

    // Hiển thị dữ liệu từ lsnap
    let lsnapData = "";
    if (dt.lsnap && dt.lsnap.length > 0) {
      lsnapData = dt.lsnap.map((snap, index) => `${index + 1}. Thời gian: ${snap.time}, Số Tiền: ${parseInt(snap.input).toLocaleString()}`).join('\n');
    } else {
      lsnapData = "Không có dữ liệu nạp.";
    }

    return out(`Số dư: ${parseInt(dt.input).toLocaleString()} VNĐ\nLịch sử sử dụng:\n${history}\nLịch sử nạp:\n${lsnapData}`);
  }

  else if (args[0] == "del") {
    const { ADMINBOT } = global.config;
    if (!ADMINBOT.includes(senderID)) return out("Bạn không thể dùng!");

    let newSenderID, input;
    if (messageReply) {
      newSenderID = parseInt(messageReply.senderID);
      input = args[1].trim() === 'all' ? 'all' : parseInt(args[1].trim());
    } else if (mentions && Object.keys(mentions).length > 0) {
      newSenderID = parseInt(Object.keys(mentions)[0]);
      input = args[2] === 'all' ? 'all' : parseInt(args[2]);
    } else {
      [newSenderID, input] = args.slice(1).join(" ").split("|").map(str => str.trim() === 'all' ? 'all' : parseInt(str.trim()));
    }

    const e = checkmn.findIndex(entry => entry.senderID === newSenderID);
    if (e !== -1) {
      if (input === 'all') {
        checkmn[e].input = 0;
      } else {
        if (checkmn[e].input < input) {
          return out("Tài khoản không đủ.");
        }
        checkmn[e].input -= input;
      }
    } else {
      return out("Tài khoản không đủ.");
    }

    fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), "utf-8");
    return out(input === 'all' ? `Đã xóa hết VNĐ của user với ID: ${newSenderID}` : `Đã trừ ${parseInt(input).toLocaleString()} VNĐ từ user với ID: ${newSenderID}`);
  }
  //   } else if (args[0] == 'đb') {
  //     const { ADMINBOT } = global.config;
  //     if (!ADMINBOT.includes(senderID)) return out("Bạn không thể dùng!");

  //     const uid = messageReply && messageReply.senderID || (mentions && Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : event.senderID);

  //     const e = checkmn.findIndex(entry => entry.senderID === uid);
  //     if (e !== -1) {
  //         checkmn[e].db = !checkmn[e].db;
  //         fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
  //         return out(`Trạng thái database của người dùng với ID ${uid} đã được chuyển đổi thành: ${checkmn[e].db}`);
  //     } else {
  //         return out("Không tìm thấy dữ liệu của người dùng.");
  //     }
  // }




  const accounts = await fetchTDSAccounts();

  const url = `https://img.vietqr.io/image/MB-1234567897749-print.png?addInfo=${senderID}&accountName=NGUYEN%20DINH%20TIEN%20DUNG`;

  const imagePath = `./modules/commands/cache/anh_${senderID}.png`;

  if (!args.join(" ")) {
    return out(`===== Hướng Dẫn =====
        + FACEBOOK +
⥤ ${prefix}buff cx | số lượng | id | loại cảm xúc LOVE(Tim), HAHA(cười), CARE(thương thương), SAD(buồn), ANGRY(phẫn nộ), WOW(wow) | tốc độ (điền số, 1 nhanh 2 chậm)
⥤ ${prefix}buff like | số lượng | id | tốc độ (điền số, 1 nhanh 2 chậm) | album (có album điền ok, không có album điền not)
⥤ ${prefix}buff sub | số lượng | uid
⥤ ${prefix}buff cmt | số lượng | id | nội dung cmt
        + TIKTOK +
⥤ ${prefix}buff yeuthichtt | số lượng | link
⥤ ${prefix}buff timtt | số lượng | link
        + HỆ THỐNG +
⥤ ${prefix}buff check (Kiểm tra lịch sử và số dư)
⥤ ${prefix}buff set + id | số tiền (Add tiền)
⥤ ${prefix}buff del + id | all (Xoá all tiền)
\n\n===== Thông Tin Acc TDS =====\n\n${getAccountInfo(accounts)}`);
  }

  if (!mn) {
    return axios.get(url, { responseType: "stream" })
      .then(response => {
        response.data.pipe(fs.createWriteStream(imagePath))
          .on('finish', () => {
            api.sendMessage({
              body: `Tài Khoản Của Bạn Không Đủ Vui Lòng Nạp Thêm Tiền Để Sử Dụng Dịch Vụ\nLưu Ý: Nội Dung Đúng Uid Facebook (Min nạp 10k).\nSố dư: 0 VND`,
              attachment: fs.createReadStream(imagePath)
            }, threadID);
          });
      });
  }

  const [command, sl, idOrLink, loaicx, sp] = args.join(" ").trim().replace(/\s+/g, " ").split("|").map(s => s.trim());

  try {
    let data;
    switch (command) {
      
      case 'timtt':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 70) return out("Số lượng không được quá 70 tim");
        if (!checkBalance(mn, money1 * sl)) {
          return axios.get(url, { responseType: "stream" }).then(response => {
            response.data.pipe(fs.createWriteStream(imagePath)).on('finish', () => {
              api.sendMessage({
                body: `Tài Khoản Của Bạn Không Đủ Vui Lòng Nạp Thêm Tiền Để Sử Dụng Dịch Vụ\nLưu Ý: Nội Dung Đúng Uid Facebook (Min nạp 10k).\nSố dư: ${parseInt(mn.input).toLocaleString()} VND`,
                attachment: fs.createReadStream(imagePath)
              }, threadID);
            });
          });
        }
        data = await global.utils.getContent(`https://vmlwb.io.vn/tt/tim?sl=${sl}&link=${idOrLink}&cookie=${cookie}`);
        console.log(data);
        console.log(`https://vmlwb.io.vn/tt/tim?sl=${sl}&link=${idOrLink}&cookie=${cookie}`);

        if (data.data == "Mua thành công!") {
          mn.input -= money1 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'timtt', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
        }else {
          return out(`Xin vui lòng thử lại!!`);
        }

        return out(getResponseMessage(data, idOrLink, sl, money1 * sl, accounts));

      case 'yeuthichtt':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 200) return out("Số lượng không được quá 200 cảm xúc");
        if (!checkBalance(mn, money2 * sl)) {
          return axios.get(url, { responseType: "stream" })
            .then(response => {
              response.data.pipe(fs.createWriteStream(imagePath))
                .on('finish', () => {
                  api.sendMessage({
                    body: `Tài Khoản Của Bạn Không Đủ Vui Lòng Nạp Thêm Tiền Để Sử Dụng Dịch Vụ\nLưu Ý: Nội Dung Đúng Uid Facebook (Min nạp 10k).\nSố dư: ${parseInt(mn.input).toLocaleString()} VND`,
                    attachment: fs.createReadStream(imagePath)
                  }, threadID);
                });
            });
        }
        data = await global.utils.getContent(`https://vmlwb.io.vn/tt/yeuthich?sl=${sl}&link=${idOrLink}&cookie=${cookie}`);
        console.log(data.data);
        console.log(`https://vmlwb.io.vn/tt/yeuthich?sl=${sl}&link=${idOrLink}&cookie=${cookie}`);

        if (data.data == "Mua thành công!") {
          mn.input -= money2 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'yeuthichtt', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
        }else {
          return out(`Xin vui lòng thử lại!!`);
        }

        return out(getResponseMessage(data, idOrLink, sl, money2 * sl, accounts));

      case 'sub':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 70) return out("Số lượng không được quá 70 tim");
        if (!checkBalance(mn, money5 * sl)) {
          return axios.get(url, { responseType: "stream" }).then(response => {
            response.data.pipe(fs.createWriteStream(imagePath)).on('finish', () => {
              api.sendMessage({
                body: `Tài Khoản Của Bạn Không Đủ Vui Lòng Nạp Thêm Tiền Để Sử Dụng Dịch Vụ\nLưu Ý: Nội Dung Đúng Uid Facebook (Min nạp 10k).\nSố dư: ${parseInt(mn.input).toLocaleString()} VND`,
                attachment: fs.createReadStream(imagePath)
              }, threadID);
            });
          });
        }
        data = await global.utils.getContent(`https://vmlwb.io.vn/fbfl?sl=${sl}&uid=${idOrLink}&cookie=${cookie}`);
        console.log(data.data);
        console.log(`https://vmlwb.io.vn/fbfl?sl=${sl}&uid=${idOrLink}&cookie=${cookie}`);

        if (data.data == "Mua thành công!") {
          mn.input -= money5 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'sub', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
        }else {
          return out(`Xin vui lòng thử lại!!`);
        }

        return out(getResponseMessage(data, idOrLink, sl, money5 * sl, accounts));

      case 'cx':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 70) return out("Số lượng không được quá 70 cảm xúc");
        if (!checkBalance(mn, money3 * sl)) {
          return axios.get(url, { responseType: "stream" })
            .then(response => {
              response.data.pipe(fs.createWriteStream(imagePath))
                .on('finish', () => {
                  api.sendMessage({
                    body: `Tài Khoản Của Bạn Không Đủ Vui Lòng Nạp Thêm Tiền Để Sử Dụng Dịch Vụ\nLưu Ý: Nội Dung Đúng Uid Facebook (Min nạp 10k).\nSố dư: ${parseInt(mn.input).toLocaleString()} VND`,
                    attachment: fs.createReadStream(imagePath)
                  }, threadID);
                });
            });
        }

        data = await global.utils.getContent(`https://vmlwb.io.vn/fbcx?sl=${sl}&id=${idOrLink}&loaicx=${loaicx}&sp=${sp}&cookie=${cookie}`);
        console.log(data);
        console.log(`https://vmlwb.io.vn/fbcx?sl=${sl}&id=${idOrLink}&loaicx=${loaicx}&sp=${sp}&cookie=${cookie}`);

        if (data.data == "Mua thành công!") {
          mn.input -= money3 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'cx', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
          return out(getResponseMessage(data, idOrLink, sl, money3 * sl, accounts));
        } else {
          return out(`Xin vui lòng thử lại!!`);
        }

      case 'cmt':
        var cookies = [
    "TDS0nI5IXZ2V2ciojIyVmdlNnIsIyMzEzZnlHTiojIyV2c1Jye"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 40) return out("Số lượng không được quá 40 bình luận");
        if (!checkBalance(mn, money6 * sl)) {
          return axios.get(url, { responseType: "stream" })
            .then(response => {
              response.data.pipe(fs.createWriteStream(imagePath))
                .on('finish', () => {
                  api.sendMessage({
                    body: `Tài Khoản Của Bạn Không Đủ Vui Lòng Nạp Thêm Tiền Để Sử Dụng Dịch Vụ\nLưu Ý: Nội Dung Đúng Uid Facebook (Min nạp 10k).\nSố dư: ${parseInt(mn.input).toLocaleString()} VND`,
                    attachment: fs.createReadStream(imagePath)
                  }, threadID);
                });
            });
        }

        data = await global.utils.getContent(`https://vmlwb.io.vn/fbcmt?sl=${sl}&id=${idOrLink}&noidung=${noidung}&cookie=${cookie}`);
        console.log(data.data);
        console.log(`https://vmlwb.io.vn/fbcmt?sl=${sl}&id=${idOrLink}&noidung=${sp}&cookie=${cookie}`);

        if (data.data == "Mua thành công!") {
          mn.input -= money6 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'cx', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
          return out(getResponseMessage(data, idOrLink, sl, money6 * sl, accounts));
        } else {
          return out(`Xin vui lòng thử lại!!`);
        }

      case 'like':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 70) return out("Số lượng không được quá 70 like");
        if (!checkBalance(mn, money4 * sl)) {
          return axios.get(url, { responseType: "stream" })
            .then(response => {
              response.data.pipe(fs.createWriteStream(imagePath))
                .on('finish', () => {
                  api.sendMessage({
                    body: `Tài Khoản Của Bạn Không Đủ Vui Lòng Nạp Thêm Tiền Để Sử Dụng Dịch Vụ\nLưu Ý: Nội Dung Đúng Uid Facebook (Min nạp 10k).\nSố dư: ${parseInt(mn.input).toLocaleString()} VND`,
                    attachment: fs.createReadStream(imagePath)
                  }, threadID);
                });
            });
        }

        data = await global.utils.getContent(`https://vmlwb.io.vn/fblike?sl=${sl}&id=${idOrLink}&sp=${sp}&alb=${loaicx}&cookie=${cookie}`);
        console.log(data.data);
        console.log(`https://vmlwb.io.vn/fblike?sl=${sl}&id=${idOrLink}&sp=${sp}&alb=${loaicx}&cookie=${cookie}`)

        if (data.data == "Mua thành công!") {
          mn.input -= money4 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'like', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
          return out(getResponseMessage(data, idOrLink, sl, money4 * sl, accounts));
        } else {
          console.log(data.data)
          console.log(`https://vmlwb.io.vn/fblike?sl=${sl}&id=${idOrLink}&sp=${sp}&alb=${loaicx}&cookie=${cookie}`)
          return out(`Xin vui lòng thử lại!!`);
        }

      default:
        return out("Lệnh không hợp lệ.");
    }
  } catch (error) {
    console.log(error)
    api.setMessageReaction("❌", messageID, () => { }, true);
  }
};