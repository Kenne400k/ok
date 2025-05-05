const fs = require('fs');
const path = require('path');

// Đọc dữ liệu JSON từ file
function readJsonFile(filePath) {
    const fullPath = path.resolve(__dirname, 'data_dongdev/datajson', filePath);
    return new Promise((resolve, reject) => {
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (parseErr) {
                    reject(parseErr);
                }
            }
        });
    });
}

// Lấy stream của attachment ngẫu nhiên từ file JSON
async function getRandomAttachmentStreamFromFile(filePath) {
    const data = await readJsonFile(filePath);
    if (Array.isArray(data) && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomItem = data[randomIndex];
        if (randomItem && randomItem.attachment) {
            const attachmentPath = path.resolve(__dirname, 'data_dongdev/datajson', randomItem.attachment);
            // Tạo một stream đọc từ đường dẫn attachment
            return fs.createReadStream(attachmentPath);
        } else {
            throw new Error('Không tìm thấy attachment trong dữ liệu JSON.');
        }
    } else {
        throw new Error('Dữ liệu JSON không hợp lệ hoặc trống.');
    }
}

// Cập nhật api để trả về stream của attachment
async function api(fileName) {
    return getRandomAttachmentStreamFromFile(fileName);
}

module.exports = api;
