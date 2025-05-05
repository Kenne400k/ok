const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const DATA_FOLDER = path.join(__dirname, "../../lekhanh/datajson/");
const DOWNLOAD_FOLDER = path.join(__dirname, "../../lekhanh/datajson/");

exports.config = {
  name: "api",
  version: "0.0.9",
  hasPermission: 0,
  credits: "Harin",
  description: "",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 5,
  dependencies: ""
};

exports.run = async function (_) {
  const command = _.args[0];

  if (_.event.senderID != 61565047375172) {
    return _.api.sendMessage("Xin lỗi! Lệnh này chỉ admin mới dùng được.", _.event.threadID);
  }

  switch (command) {
    case "list":
      return await exports.getJsonList(_);
    case "add":
      return await exports.addUrlToJson(_);
    case "get":
      return _.api.sendMessage("Vui lòng reply để sử dụng lệnh 'get'.", _.event.threadID);
    case "del":
      return _.api.sendMessage("Vui lòng reply để sử dụng lệnh 'del'.", _.event.threadID);
    default:
      return _.api.sendMessage("Lệnh không hợp lệ.", _.event.threadID);
  }
};

exports.handlerReply = async function (_, reply) {
  const [action, index] = reply.split(" ");

  if (!index || isNaN(index)) {
    return _.api.sendMessage("❌ Vui lòng cung cấp số thứ tự hợp lệ.", _.event.threadID);
  }

  switch (action.toLowerCase()) {
    case "get":
      return await exports.getRandomVideoUrl(_, _.args[index - 1]);
    case "del":
      return await exports.deleteJsonFile(_, index);
    default:
      return _.api.sendMessage("❌ Lệnh không hợp lệ. Vui lòng sử dụng 'get' hoặc 'del' với số thứ tự.", _.event.threadID);
  }
};

exports.getJsonList = async function (_) {
  try {
    const files = await getJsonFiles();
    if (files.length === 0) {
      return _.api.sendMessage("❌ Không tìm thấy tệp JSON nào.", _.event.threadID);
    }

    const fileDetails = await Promise.all(files.map(async (file, index) => {
      const count = await exports.countLinksInFile(file);
      return `${index + 1}. ${file} - ${count} link${count === 1 ? '' : 's'}`;
    }));

    const totalLinks = await exports.countTotalLinks(files);
    _.api.sendMessage(
      `🗂️ Tổng có ${files.length} file trong kho lưu trữ:\n──────────────────\n${fileDetails.join("\n")}\n──────────────────\n📊 Tổng số link: ${totalLinks}\n📌 Reply:\n- Gửi "del" + STT (ví dụ: del 1) để xóa file.\n- Gửi "get" + STT để xem video từ API.`,
      _.event.threadID,
      (error, info) => _.handleReply = { name: "api", messageID: info.messageID }
    );
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu:", error);
    _.api.sendMessage("❌ Đã xảy ra lỗi khi xử lý yêu cầu", _.event.threadID);
  }
};

exports.addUrlToJson = async function (_) {
  const fileName = _.args[1];
  const urls = getUrlsFromText(_.event.messageReply?.body || _.args.slice(2).join(" "));

  if (!fileName || urls.length === 0) {
    return _.api.sendMessage("❌ Bạn cần cung cấp tên tệp JSON và ít nhất một URL hợp lệ.", _.event.threadID);
  }

  const filePath = path.join(DATA_FOLDER, `${fileName}.json`);

  try {
    let data = await readJsonFile(filePath);
    data.push(...urls);
    await fs.writeFile(filePath, JSON.stringify(data, null, 4), "utf-8");
    _.api.sendMessage(`✅ Đã thêm URL vào ${fileName}.json`, _.event.threadID);
  } catch (error) {
    handleError(error, _, _.event.threadID);
  }
};

exports.getRandomVideoUrl = async function (_, fileName) {
  const filePath = path.join(DATA_FOLDER, `${fileName}.json`);

  try {
    const data = await readJsonFile(filePath);
    if (!Array.isArray(data) || data.length === 0) {
      return _.api.sendMessage("❌ Không tìm thấy URL video nào trong tệp JSON.", _.event.threadID);
    }

    const randomUrl = data[Math.floor(Math.random() * data.length)];
    await exports.downloadAndSendVideo(randomUrl, `video_${fileName}.mp4`, _);
  } catch (error) {
    handleError(error, _, _.event.threadID);
  }
};

exports.deleteJsonFile = async function (_, index) {
  try {
    const files = await getJsonFiles();
    if (files.length >= index) {
      const fileToDelete = path.join(DATA_FOLDER, files[index - 1]);
      await fs.remove(fileToDelete);
      _.api.sendMessage(`✅ Đã xóa tệp ${files[index - 1]}.`, _.event.threadID);
    } else {
      _.api.sendMessage("❌ Chỉ số không hợp lệ.", _.event.threadID);
    }
  } catch (error) {
    handleError(error, _, _.event.threadID);
  }
};

exports.downloadAndSendVideo = async function (url, fileName, _) {
  try {
    const filePath = await downloadFile(url, fileName);
    _.api.sendMessage(
      { body: "✅ Video đã được tải xuống thành công!", attachment: fs.createReadStream(filePath) },
      _.event.threadID,
      () => fs.unlinkSync(filePath)
    );
  } catch (error) {
    handleError(error, _, _.event.threadID);
  }
};

// Helper functions

async function getJsonFiles() {
  const files = await fs.readdir(DATA_FOLDER);
  return files.filter(file => path.extname(file) === ".json");
}

async function readJsonFile(filePath) {
  if (await fs.pathExists(filePath)) {
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  }
  return [];
}

async function downloadFile(url, fileName) {
  const response = await axios({ url, method: "GET", responseType: "stream" });
  const filePath = path.join(DOWNLOAD_FOLDER, fileName);
  await fs.ensureDir(path.dirname(filePath));
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
}

function getUrlsFromText(text) {
  const regex = /(https?:\/\/[^\s]+)/g;
  return text.match(regex) || [];
}

function handleError(error, _, threadID) {
  console.error("Lỗi khi xử lý yêu cầu:", error);
  _.api.sendMessage("❌ Đã xảy ra lỗi khi xử lý yêu cầu", threadID);
}

exports.countLinksInFile = async function (fileName) {
  const filePath = path.join(DATA_FOLDER, fileName);
  try {
    const data = await readJsonFile(filePath);
    return Array.isArray(data) ? data.length : 0;
  } catch (error) {
    console.error("Lỗi khi đếm liên kết trong tệp:", error);
    return 0;
  }
};

exports.countTotalLinks = async function (files) {
  const counts = await Promise.all(files.map(file => exports.countLinksInFile(file)));
  return counts.reduce((acc, count) => acc + count, 0);
};