const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const fs = require('fs'); 
const path = require('path'); 
const sharp = require('sharp');
const stream = require('stream'); // Đã có từ bản trước

// Helper function to format large numbers
function formatNumber(num) {
  if (isNaN(num) || num === null || num === undefined) return '0';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 10000) return (num / 1000).toFixed(0) + 'K';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(num);
}

// Helper function to draw multiline text
function drawTextSimple(ctx, text, x, y, maxWidth, lineHeight, textAlign = 'center', maxLines = 3) {
    if (!text || typeof text !== 'string' || text.trim() === '') return y - lineHeight;
    ctx.textAlign = textAlign;
    const words = text.split(' ');
    let line = '';
    let linesDrawn = 0;
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLineCurrentWord = line + words[n] + ' ';
        const metricsCurrentWord = ctx.measureText(testLineCurrentWord);

        if (metricsCurrentWord.width > maxWidth && n > 0 && line !== '') {
            if (linesDrawn + 1 >= maxLines && maxLines !== null) {
                let trimLine = line.trim();
                while (ctx.measureText(trimLine + "...").width > maxWidth && trimLine.length > 0) {
                    trimLine = trimLine.slice(0, -1).trim();
                }
                ctx.fillText(trimLine + "...", x, currentY);
                linesDrawn++;
                currentY += lineHeight;
                line = ''; 
                break; 
            }
            ctx.fillText(line.trim(), x, currentY);
            linesDrawn++;
            currentY += lineHeight;
            line = words[n] + ' ';
        } else {
            line = testLineCurrentWord;
        }

        if (n === words.length - 1 && line.trim() !== '') { 
            if (linesDrawn >= maxLines && maxLines !== null && !line.endsWith("...")) {
                let trimLine = line.trim();
                while (ctx.measureText(trimLine + "...").width > maxWidth && trimLine.length > 0) {
                     trimLine = trimLine.slice(0, -1).trim();
                }
                ctx.fillText(trimLine + "...", x, currentY);
            } else { 
                ctx.fillText(line.trim(), x, currentY);
            }
            linesDrawn++;
            currentY += lineHeight;
        }
    }
     return currentY - lineHeight;
}


module.exports.config = {
  name: "ptok",
  version: "1.2.6", // Cập nhật phiên bản
  hasPermssion: 0,
  credits: "Nguyễn Trương Thiện Phát (pcoder) & Gemini (AI Assistant) - Debugged v6",
  description: "Hiển thị thông tin TikTok dạng canvas mô phỏng giao diện iPhone (dùng API tikwm.com).",
  commandCategory: "tools",
  usages: "ptok @username",
  cooldowns: 7,
};

module.exports.run = async function ({ api, event, args }) {
  const mainFont = 'Arial';

  let usernameInput = args[0];
  if (!usernameInput) {
    return api.sendMessage("👉 Vui lòng nhập username TikTok (ví dụ: @nguyenvana hoặc nguyenvana)", event.threadID, event.messageID);
  }

  const username = usernameInput.trim().replace(/^@/, '');
  const apiUrl = `https://www.tikwm.com/api/user/info?unique_id=${username}`;

  // Sử dụng try...finally để đảm bảo tin nhắn "đang xử lý" được gỡ (nếu bot hỗ trợ)
  let processingMessageID;
  try {
    const processingMsgInfo = await api.sendMessage(`⏳ Đang lấy thông tin của @${username}, vui lòng đợi một lát...`, event.threadID, event.messageID);
    if (processingMsgInfo && processingMsgInfo.messageID) {
        processingMessageID = processingMsgInfo.messageID;
    }
  } catch (initMsgErr) {
      console.error("[PTok] Không thể gửi tin nhắn 'đang xử lý':", initMsgErr);
      // Vẫn tiếp tục dù không gửi được tin nhắn này
  }


  let res;
  try {
    console.log(`[PTok] Gọi API: ${apiUrl}`);
    res = await axios.get(apiUrl, { timeout: 20000 });
  } catch (e) {
    console.error(`[PTok] Lỗi khi gọi API TikTok cho @${username}: ${e.message}${e.stack ? ('\nStack: ' + e.stack) : ''}`);
    return api.sendMessage(`❌ Lỗi khi gọi API TikTok cho @${username}. Username có thể không tồn tại, API gặp sự cố hoặc timeout. Vui lòng thử lại sau.`, event.threadID, event.messageID);
  }

  if (!res.data || res.data.code !== 0 || !res.data.data || !res.data.data.user) {
    let reason = `🤷 Không tìm thấy thông tin người dùng TikTok @${username}.`;
    if (res.data && res.data.msg && typeof res.data.msg === 'string' && res.data.msg.toLowerCase() !== "success") {
        reason = `API báo cho @${username}: ${res.data.msg}`;
    } else if (res.data && res.data.code !== 0) {
        reason = `API trả về mã lỗi ${res.data.code} cho @${username}. ${res.data.msg || '(Không có thông báo lỗi cụ thể từ API)'}`;
    }
    console.log(`[PTok] API không trả về dữ liệu hợp lệ cho ${username}:`, reason, "\n Dữ liệu API:", JSON.stringify(res.data, null, 2));
    return api.sendMessage(reason, event.threadID, event.messageID);
  }

  const user = res.data.data.user;
  const stats = res.data.data.stats;

  if (!user.uniqueId || !user.nickname) {
      console.log(`[PTok] Dữ liệu user từ API thiếu thông tin cơ bản cho ${username}. Dữ liệu: ${JSON.stringify(user)}`);
      return api.sendMessage(`🤷 Thông tin trả về từ API cho @${username} không đầy đủ (thiếu uniqueId hoặc nickname).`, event.threadID, event.messageID);
  }

  // --- Phần vẽ canvas giữ nguyên như bản 1.2.5 ---
  const canvasWidth = 750;
  const themeColor = '#161823';
  const secondaryColor = '#757575';
  const backgroundColor = '#FFFFFF';
  const verifiedColor = '#20D5EC';

  let bioText = user.signature || "";
  const bioLineHeight = 23;
  let actualBioDrawingHeight = 0;

  if (bioText) {
      const tempCanvas = createCanvas(1,1);
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.font = `18px ${mainFont}`;
      const words = bioText.split(' ');
      let line = '';
      let linesCount = 0;
      for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          if (tempCtx.measureText(testLine).width > (canvasWidth - 80) && n > 0) {
              linesCount++;
              line = words[n] + ' ';
          } else {
              line = testLine;
          }
      }
      if (line.trim() !== '') linesCount++;
      actualBioDrawingHeight = Math.min(linesCount, 3) * bioLineHeight;
  }
  
  let canvasHeight = 600; 
  if (actualBioDrawingHeight > 0) {
      canvasHeight += actualBioDrawingHeight + 25;
  } else {
      canvasHeight += 5; 
  }
  canvasHeight = Math.max(canvasHeight, 600);

  console.log(`[PTok] Tạo canvas kích thước: ${canvasWidth}x${canvasHeight} cho ${username}. Bio height: ${actualBioDrawingHeight}`);
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = themeColor;
  ctx.font = `bold 26px ${mainFont}`;
  ctx.textAlign = 'center';
  ctx.fillText(user.uniqueId, canvasWidth / 2, 55);

  const avatarSize = 130;
  const avatarY = 55 + 30 + avatarSize / 2;
  const avatarX = canvasWidth / 2;

  if (user.avatarLarger) {
    try {
        const avatarUrl = user.avatarLarger.startsWith('http:') ? user.avatarLarger.replace('http:', 'https:') : user.avatarLarger;
        console.log(`[PTok] Đang tải avatar cho ${username}: ${avatarUrl}`);
        const imageResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const originalImageBuffer = Buffer.from(imageResponse.data, 'binary');
        let imageToLoadBuffer;
        try {
            console.log(`[PTok] Cố gắng chuyển đổi avatar sang PNG cho ${username}`);
            imageToLoadBuffer = await sharp(originalImageBuffer).png().toBuffer();
            console.log(`[PTok] Avatar đã được chuyển đổi sang PNG cho ${username}.`);
        } catch (conversionError) {
            console.warn(`[PTok] Không thể chuyển đổi avatar sang PNG cho ${username}: ${conversionError.message}. Sử dụng buffer gốc.`);
            imageToLoadBuffer = originalImageBuffer; 
        }
        const avatar = await loadImage(imageToLoadBuffer);
        ctx.save(); ctx.beginPath(); ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2, true); ctx.closePath(); ctx.clip();
        ctx.drawImage(avatar, avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize);
        ctx.restore(); console.log(`[PTok] Avatar cho ${username} đã được vẽ.`);
        if (user.verified) {
            ctx.save(); const tickSize = 36; const tickOffsetX = avatarSize / 2 * 0.707; const tickOffsetY = avatarSize / 2 * 0.707; 
            const tickCenterX = avatarX + tickOffsetX - tickSize / 2.5; const tickCenterY = avatarY + tickOffsetY - tickSize / 2.5;
            ctx.beginPath(); ctx.arc(tickCenterX, tickCenterY, tickSize / 2 + 3, 0, Math.PI * 2, true); ctx.fillStyle = backgroundColor; ctx.fill();
            ctx.beginPath(); ctx.arc(tickCenterX, tickCenterY, tickSize / 2, 0, Math.PI * 2, true); ctx.fillStyle = verifiedColor; ctx.fill();
            ctx.beginPath(); ctx.moveTo(tickCenterX - tickSize * 0.25, tickCenterY - tickSize * 0.05); ctx.lineTo(tickCenterX - tickSize * 0.05, tickCenterY + tickSize * 0.2);
            ctx.lineTo(tickCenterX + tickSize * 0.25, tickCenterY - tickSize * 0.2); ctx.lineWidth = 3.5; ctx.strokeStyle = backgroundColor; ctx.stroke();
            ctx.restore(); console.log(`[PTok] Dấu tick verified cho ${username} đã được vẽ.`);
        }
    } catch (e) {
        console.error(`[PTok] Lỗi khi tải hoặc vẽ avatar cho ${username}: ${e.message}${e.stack ? ('\nStack: ' + e.stack) : ''}`);
        ctx.fillStyle = '#E0E0E0'; ctx.beginPath(); ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2, true); ctx.fill();
        ctx.fillStyle = themeColor; ctx.font = `20px ${mainFont}`; ctx.fillText("N/A", avatarX, avatarY + 7);
    }
  } else {
    console.log(`[PTok] Không có URL avatar cho ${username}. Vẽ placeholder.`);
    ctx.fillStyle = '#E0E0E0'; ctx.beginPath(); ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2, true); ctx.fill();
    ctx.fillStyle = themeColor; ctx.font = `20px ${mainFont}`; ctx.fillText("No Avatar", avatarX, avatarY + 7);
  }

  const nameY = avatarY + avatarSize / 2 + 45;
  ctx.fillStyle = themeColor; ctx.font = `bold 28px ${mainFont}`; ctx.textAlign = 'center';
  ctx.fillText(user.nickname || user.uniqueId, canvasWidth / 2, nameY);

  const statsY = nameY + 70; const statBoxWidth = canvasWidth / 3.5;
  ctx.font = `bold 24px ${mainFont}`; ctx.fillStyle = themeColor; ctx.textAlign = 'center';
  ctx.fillText(formatNumber(stats.followingCount), canvasWidth / 2 - statBoxWidth, statsY);
  ctx.fillText(formatNumber(stats.followerCount), canvasWidth / 2, statsY);
  ctx.fillText(formatNumber(stats.heartCount), canvasWidth / 2 + statBoxWidth, statsY);

  const statLabelY = statsY + 28; ctx.font = `19px ${mainFont}`; ctx.fillStyle = secondaryColor;
  ctx.fillText('Following', canvasWidth / 2 - statBoxWidth, statLabelY);
  ctx.fillText('Followers', canvasWidth / 2, statLabelY);
  ctx.fillText('Likes', canvasWidth / 2 + statBoxWidth, statLabelY);

  let currentContentY = statLabelY + 35;
  if (bioText) {
    ctx.font = `18px ${mainFont}`; ctx.fillStyle = themeColor;
    const bioTextActualYStart = currentContentY + (bioLineHeight * 0.7); 
    const bioEndY = drawTextSimple(ctx, bioText, canvasWidth / 2, bioTextActualYStart, canvasWidth - 80, bioLineHeight, 'center', 3);
    currentContentY = bioEndY + bioLineHeight + 25;
  } else { currentContentY = statLabelY + 25; }

  const buttonY = currentContentY; const buttonHeight = 48; const buttonWidth = (canvasWidth - 80 - 20) / 2; const buttonRadius = 8;
  ctx.lineWidth = 1.5; ctx.strokeStyle = '#DCDCDC';
  const editProfileX = 40;
  ctx.beginPath(); ctx.moveTo(editProfileX + buttonRadius, buttonY); ctx.lineTo(editProfileX + buttonWidth - buttonRadius, buttonY); ctx.quadraticCurveTo(editProfileX + buttonWidth, buttonY, editProfileX + buttonWidth, buttonY + buttonRadius); ctx.lineTo(editProfileX + buttonWidth, buttonY + buttonHeight - buttonRadius); ctx.quadraticCurveTo(editProfileX + buttonWidth, buttonY + buttonHeight, editProfileX + buttonWidth - buttonRadius, buttonY + buttonHeight); ctx.lineTo(editProfileX + buttonRadius, buttonY + buttonHeight); ctx.quadraticCurveTo(editProfileX, buttonY + buttonHeight, editProfileX, buttonY + buttonHeight - buttonRadius); ctx.lineTo(editProfileX, buttonY + buttonRadius); ctx.quadraticCurveTo(editProfileX, buttonY, editProfileX + buttonRadius, buttonY); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = themeColor; ctx.font = `bold 19px ${mainFont}`; ctx.textAlign = 'center';
  ctx.fillText('Edit Profile', editProfileX + buttonWidth / 2, buttonY + buttonHeight / 2 + 7);

  const shareProfileX = editProfileX + buttonWidth + 20;
  ctx.beginPath(); ctx.moveTo(shareProfileX + buttonRadius, buttonY); ctx.lineTo(shareProfileX + buttonWidth - buttonRadius, buttonY); ctx.quadraticCurveTo(shareProfileX + buttonWidth, buttonY, shareProfileX + buttonWidth, buttonY + buttonRadius); ctx.lineTo(shareProfileX + buttonWidth, buttonY + buttonHeight - buttonRadius); ctx.quadraticCurveTo(shareProfileX + buttonWidth, buttonY + buttonHeight, shareProfileX + buttonWidth - buttonRadius, buttonY + buttonHeight); ctx.lineTo(shareProfileX + buttonRadius, buttonY + buttonHeight); ctx.quadraticCurveTo(shareProfileX, buttonY + buttonHeight, shareProfileX, buttonY + buttonHeight - buttonRadius); ctx.lineTo(shareProfileX, buttonY + buttonRadius); ctx.quadraticCurveTo(shareProfileX, buttonY, shareProfileX + buttonRadius, buttonY); ctx.closePath(); ctx.stroke();
  ctx.fillText('Share Profile', shareProfileX + buttonWidth / 2, buttonY + buttonHeight / 2 + 7);

  const videoCountY = buttonY + buttonHeight + 40;
  ctx.font = `17px ${mainFont}`; ctx.fillStyle = secondaryColor; ctx.textAlign = 'center';
  ctx.fillText(`${formatNumber(stats.videoCount)} videos`, canvasWidth / 2, videoCountY);

  ctx.font = `13px ${mainFont}`; ctx.fillStyle = '#B0B0B0'; ctx.textAlign = 'center';
  ctx.fillText('Canvas by ptok | Credits: NTT Phát & Gemini', canvasWidth / 2, canvasHeight - 20);

  console.log(`[PTok] Hoàn tất vẽ canvas cho ${username}.`);
  // --- HẾT PHẦN VẼ CANVAS ---


  try { // Khối try...catch cho việc gửi ảnh
    const buffer = canvas.toBuffer('image/png');
    console.log(`[PTok] Buffer được tạo cho ${username}, kích thước: ${buffer.length} bytes.`);

    if (buffer && buffer.length > 0) {
        let messageBody = `✨ Thông tin TikTok của @${user.uniqueId} ✨\n`;
        if (user.signature) {
            messageBody += `📝 Bio: ${user.signature}\n`;
        }
        messageBody += `🔗 https://www.tiktok.com/@${user.uniqueId}`;

        const readableStream = stream.Readable.from(buffer);
        console.log(`[PTok] ReadableStream được tạo cho ${username}. Chuẩn bị gửi...`);

        const messagePayload = {
            body: messageBody,
            attachment: readableStream
        };

        // --- ĐIỀU CHỈNH QUAN TRỌNG: Sử dụng Promise để quản lý việc gửi tin ---
        return new Promise((resolve, reject) => {
            const sendMessageCallback = (err, messageInfo) => {
                if (err) {
                    console.error(`[PTok] Lỗi từ callback của api.sendMessage cho ${username}:`, JSON.stringify(err, null, 2));
                    // Nếu có tin nhắn "đang xử lý", gỡ nó đi khi có lỗi
                    if (processingMessageID && api.unsendMessage) {
                        api.unsendMessage(processingMessageID).catch(unsendErr => console.error("[PTok] Lỗi khi gỡ tin nhắn 'đang xử lý':", unsendErr));
                    }
                    return reject(err); // Reject Promise này để khối catch bên ngoài bắt được
                }
                if (messageInfo && messageInfo.messageID) {
                    console.log(`[PTok] Ảnh đã được gửi thành công cho ${username} (callback). Message ID: ${messageInfo.messageID}`);
                    // Gỡ tin nhắn "đang xử lý" nếu thành công
                     if (processingMessageID && api.unsendMessage) {
                        api.unsendMessage(processingMessageID).catch(unsendErr => console.error("[PTok] Lỗi khi gỡ tin nhắn 'đang xử lý' sau thành công:", unsendErr));
                    }
                } else {
                    console.log(`[PTok] api.sendMessage cho ${username} (callback) hoàn tất nhưng không có messageInfo/messageID. Response: ${JSON.stringify(messageInfo, null, 2)}`);
                }
                resolve(messageInfo); // Resolve Promise này
            };

            // Gọi api.sendMessage, truyền messageID để reply nếu có
            if (event.messageID) {
                api.sendMessage(messagePayload, event.threadID, sendMessageCallback, event.messageID);
            } else {
                api.sendMessage(messagePayload, event.threadID, sendMessageCallback);
            }
        });
        // --- KẾT THÚC ĐIỀU CHỈNH ---

    } else {
        console.error(`[PTok] Buffer ảnh cho ${username} rỗng hoặc không hợp lệ sau khi tạo.`);
        if (processingMessageID && api.unsendMessage) { // Gỡ tin nhắn "đang xử lý" nếu có lỗi buffer
            api.unsendMessage(processingMessageID).catch(unsendErr => console.error("[PTok] Lỗi khi gỡ tin nhắn 'đang xử lý':", unsendErr));
        }
        return api.sendMessage(`❌ Đã xảy ra lỗi khi tạo ảnh cho @${username}. Buffer không hợp lệ.`, event.threadID, event.messageID);
    }
  } catch (finalError) { // Khối catch này sẽ bắt lỗi từ Promise reject hoặc lỗi đồng bộ khác
    if (processingMessageID && api.unsendMessage) { // Gỡ tin nhắn "đang xử lý" nếu có lỗi ở đây
        api.unsendMessage(processingMessageID).catch(unsendErr => console.error("[PTok] Lỗi khi gỡ tin nhắn 'đang xử lý':", unsendErr));
    }
    // Khối log lỗi chi tiết giữ nguyên như bản 1.2.5
    let errorDetailsForLog = "Unknown error object during send/buffer finalization.";
    let userVisibleErrorMessage = "Lỗi không rõ khi gửi ảnh.";
    if (finalError) {
        if (typeof finalError === 'string') { /* ... (giữ nguyên logic log lỗi chi tiết) ... */ errorDetailsForLog = finalError; userVisibleErrorMessage = finalError; }
        else { 
            if (finalError.message) { errorDetailsForLog = `Message: ${finalError.message}`; userVisibleErrorMessage = finalError.message; }
            if (finalError.error) { 
                if (typeof finalError.error === 'string') { errorDetailsForLog += ` | ErrorProperty: ${finalError.error}`; if (userVisibleErrorMessage === "Lỗi không rõ khi gửi ảnh." || !finalError.message) userVisibleErrorMessage = finalError.error; }
                else if (typeof finalError.error === 'object' && finalError.error.message) { errorDetailsForLog += ` | NestedErrorMessage: ${finalError.error.message}`; if (userVisibleErrorMessage === "Lỗi không rõ khi gửi ảnh." || !finalError.message) userVisibleErrorMessage = finalError.error.message; if(finalError.error.code) errorDetailsForLog += ` | NestedErrorCode: ${finalError.error.code}`; if(finalError.error.error_subcode) errorDetailsForLog += ` | NestedErrorSubcode: ${finalError.error.error_subcode}`; }
            }
            if (finalError.code && (typeof finalError.code === 'string' || typeof finalError.code === 'number')) { errorDetailsForLog += ` | Code: ${finalError.code}`; }
            if (finalError.error_description && typeof finalError.error_description === 'string'){ errorDetailsForLog += ` | ErrorDescription: ${finalError.error_description}`; if (userVisibleErrorMessage === "Lỗi không rõ khi gửi ảnh." || !finalError.message) userVisibleErrorMessage = finalError.error_description; }
            if (errorDetailsForLog === "Unknown error object during send/buffer finalization." && (!finalError.message && !finalError.error && !finalError.error_description)) {
                 try { const fullErrorString = JSON.stringify(finalError, Object.getOwnPropertyNames(finalError), 2); errorDetailsForLog = `Full Error Object: ${fullErrorString}`; }
                 catch (stringifyError) { errorDetailsForLog = "Error object (non-standard) could not be stringified, but it exists."; }
            }
            if (finalError.stack) { errorDetailsForLog += `\nStack: ${finalError.stack}`; }
        }
    }
    console.error(`[PTok] Lỗi nghiêm trọng (trong main catch) khi tạo buffer hoặc gửi ảnh cho ${username}: ${errorDetailsForLog}`);
    const userMessageToReply = `❌ Đã xảy ra lỗi nghiêm trọng khi xử lý ảnh cho @${username}. Vui lòng thử lại sau hoặc báo cho admin. (Chi tiết catch: ${userVisibleErrorMessage})`;
    return api.sendMessage(userMessageToReply, event.threadID, event.messageID);
  }
};