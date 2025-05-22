const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

const ITEMS_PER_PAGE = 30;
const DEFAULT_FONT = 'Arial';
const CACHE_DIR = path.join(__dirname, 'cache');
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}


module.exports.config = {
    name: "menu",
    version: "3.5.1",
    hasPermssion: 0,
    credits: "Pcoder",
    description: "Hiển thị menu lệnh hiện đại, phân trang dưới dạng ảnh canvas 2 cột.",
    usages: "[all | tên nhóm] [trang] | [trang] | next | back (khi đang xem menu)",
    commandCategory: "Tiện ích",
    usePrefix: false,
    cooldowns: 5,
    dependencies: {
        "canvas": ""
    }
};

async function createModernMenuImage(title, allItems, footerLines = [], totalCommandsInBot = 0, prefix = "/", currentPage = 1, itemsPerPage = ITEMS_PER_PAGE) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = allItems.slice(startIndex, endIndex);

    const canvasWidth = 1080;
    const columnCount = itemsToShow.length > 1 ? 2 : 1;
    const mainPadding = { top: 60, bottom: 70, left: 40, right: 40 };
    const headerHeight = 50;
    const titleSectionHeight = 80;

    const paginationFooterHeight = (allItems.length > itemsPerPage) ? 35 : 0;
    const baseFooterLineHeight = 28;
    const footerSectionHeight = footerLines.length * baseFooterLineHeight +
                                (totalCommandsInBot > 0 && title.toUpperCase().includes("TẤT CẢ LỆNH") ? baseFooterLineHeight : 0) +
                                paginationFooterHeight + 40;

    const itemCardSettings = {
        height: 80,
        padding: 18,
        borderRadius: 14,
        gapY: 22,
        gapX: 35
    };

    const contentWidth = canvasWidth - mainPadding.left - mainPadding.right;
    const columnWidth = (contentWidth - (columnCount - 1) * itemCardSettings.gapX) / columnCount;

    const itemsPerColumn = Math.ceil(itemsToShow.length / columnCount);
    const contentBodyHeight = itemsPerColumn > 0 ? (itemsPerColumn * (itemCardSettings.height + itemCardSettings.gapY) - itemCardSettings.gapY) : 50;

    let canvasHeight = mainPadding.top + headerHeight + titleSectionHeight + contentBodyHeight + footerSectionHeight + mainPadding.bottom;
    canvasHeight = Math.max(canvasHeight, 700);

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    const baseFont = DEFAULT_FONT;

    const colors = {
        bgGradientFrom: '#12161c',
        bgGradientTo: '#1a1f28',
        headerBg: 'rgba(20, 24, 30, 0.9)',
        cardBg: 'rgba(45, 52, 65, 0.8)',
        cardShadow: 'rgba(0, 0, 0, 0.4)',
        textPrimary: '#E8E8EE',
        textSecondary: '#B0B8C8',
        accentPrimary: '#58A6FF',
        accentSecondary: '#C975DC',
        titleColor: '#FFFFFF',
        footerText: '#C0C8D8',
        paginationText: '#9098A8',
    };

    const bgGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    bgGradient.addColorStop(0, colors.bgGradientFrom);
    bgGradient.addColorStop(1, colors.bgGradientTo);
    ctx.fillStyle = bgGradient;
    roundRect(ctx, 0, 0, canvasWidth, canvasHeight, 25);
    ctx.fill();

    ctx.fillStyle = colors.headerBg;
    roundRect(ctx, 0, 0, canvasWidth, headerHeight, { tl: 25, tr: 25, br: 0, bl: 0 });
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, headerHeight);
    ctx.lineTo(canvasWidth, headerHeight);
    ctx.stroke();

    const btnRadius = 10;
    const btnY = headerHeight / 2;
    const btnColors = ['#FF605C', '#FFBD44', '#00CA4E'];
    const btnXStart = mainPadding.left / 2 + 15;
    btnColors.forEach((color, i) => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(btnXStart + i * (btnRadius * 2 + 12), btnY, btnRadius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.font = `16px "${baseFont}"`;
    ctx.fillStyle = colors.textSecondary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(prefix + "menu", canvasWidth / 2, headerHeight / 2);

    let currentY = mainPadding.top + headerHeight + titleSectionHeight / 2;
    ctx.font = `bold 38px "${baseFont}"`;
    ctx.fillStyle = colors.titleColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText(title.toUpperCase(), canvasWidth / 2, currentY);
    ctx.shadowColor = 'transparent';
    currentY += titleSectionHeight / 2 + 35;

    itemsToShow.forEach((item, localIndex) => {
        const columnIndex = Math.floor(localIndex / itemsPerColumn);
        const rowIndex = localIndex % itemsPerColumn;

        const cardX = mainPadding.left + columnIndex * (columnWidth + itemCardSettings.gapX);
        const cardY = currentY + rowIndex * (itemCardSettings.height + itemCardSettings.gapY);

        ctx.fillStyle = colors.cardBg;
        ctx.shadowColor = colors.cardShadow;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        roundRect(ctx, cardX, cardY, columnWidth, itemCardSettings.height, itemCardSettings.borderRadius);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        roundRect(ctx, cardX, cardY, columnWidth, itemCardSettings.height, itemCardSettings.borderRadius);
        ctx.stroke();

        const innerCardX = cardX + itemCardSettings.padding;
        const innerCardY = cardY + itemCardSettings.padding;
        const innerCardWidth = columnWidth - 2 * itemCardSettings.padding;
        const innerCardHeight = itemCardSettings.height - 2 * itemCardSettings.padding;

        const globalItemIndex = startIndex + localIndex + 1;
        let keyText = "";
        let valueText = "";
        let icon = item.icon || "❖";

        if (typeof item === 'string') {
            const parts = item.split(':');
            keyText = `${globalItemIndex}. ${parts[0]?.trim()}`;
            valueText = parts.length > 1 ? parts.slice(1).join(':').trim() : "";
        } else if (typeof item === 'object' && item !== null) {
            const displayIndexStr = item.hasOwnProperty('indexOverride') && item.indexOverride === null ? "" : `${item.indexOverride || globalItemIndex}. `;
            keyText = `${displayIndexStr}${item.name || item.group || item.key}`;
            valueText = item.description || item.value || "";
        }

        ctx.fillStyle = colors.accentPrimary;
        ctx.font = `bold 20px "${baseFont}"`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';

        const fullKeyText = `${icon} ${keyText}`;
        let textYInCard = innerCardY;
        const keyLineHeight = 24;
        const maxKeyLines = valueText ? 1 : 2;

        const wrappedKey = wrapText(ctx, fullKeyText, innerCardWidth, `bold 20px "${baseFont}"`);
        wrappedKey.slice(0, maxKeyLines).forEach((line) => {
            if (textYInCard + keyLineHeight <= innerCardY + innerCardHeight) {
                 ctx.fillText(line, innerCardX, textYInCard);
                 textYInCard += keyLineHeight;
            }
        });

        if (valueText) {
            ctx.fillStyle = colors.textSecondary;
            ctx.font = `16px "${baseFont}"`;
            const valueLineHeight = 20;
            const maxDescLines = Math.max(0, Math.floor((innerCardY + innerCardHeight - textYInCard) / valueLineHeight));

            const wrappedValue = wrapText(ctx, valueText, innerCardWidth, `16px "${baseFont}"`);
            wrappedValue.slice(0, maxDescLines).forEach(line => {
                 if (textYInCard + valueLineHeight <= innerCardY + innerCardHeight - 2) {
                    ctx.fillText(line, innerCardX, textYInCard);
                    textYInCard += valueLineHeight;
                }
            });
        }
    });

    let footerStartY = canvasHeight - mainPadding.bottom - footerSectionHeight + 30;
    ctx.font = `17px "${baseFont}"`;
    ctx.fillStyle = colors.footerText;
    ctx.textAlign = 'center';

    footerLines.forEach(line => {
        ctx.fillText(line, canvasWidth / 2, footerStartY);
        footerStartY += baseFooterLineHeight;
    });

    if (totalCommandsInBot > 0 && title.toUpperCase().includes("TẤT CẢ LỆNH")) {
        ctx.font = `bold 18px "${baseFont}"`;
        ctx.fillStyle = colors.accentSecondary;
        ctx.fillText(`Tổng cộng: ${totalCommandsInBot} lệnh trong hệ thống`, canvasWidth / 2, footerStartY);
        footerStartY += baseFooterLineHeight;
    }

    if (allItems.length > itemsPerPage) {
        const totalPages = Math.ceil(allItems.length / itemsPerPage);
        ctx.font = `italic 16px "${baseFont}"`;
        ctx.fillStyle = colors.paginationText;
        const pageInfo = `Trang ${currentPage}/${totalPages}. Gửi "next" hoặc "back" để lật trang.`;
        ctx.fillText(pageInfo, canvasWidth / 2, footerStartY);
    }

    const imagePath = path.join(CACHE_DIR, `menu_modern_${Date.now()}.png`);
    return new Promise((resolve, reject) => {
        const out = fs.createWriteStream(imagePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => resolve(imagePath));
        out.on('error', (err) => {
            console.error("[MENU_CANVAS] Error writing PNG stream:", err);
            reject(err);
        });
        stream.on('error', (err) => {
            console.error("[MENU_CANVAS] Error in PNG stream:", err);
            reject(err);
        });
    });
}

function roundRect(ctx, x, y, width, height, radius) {
    if (typeof radius === 'undefined') radius = 5;
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (const side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
}

function wrapText(context, text, maxWidth, font) {
    if (!text) return [""];
    if (font) context.font = font;
    text = String(text);
    const words = text.split(' ');
    let lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        let testLine = currentLine ? currentLine + " " + word : word;
        const metrics = context.measureText(testLine);

        if (metrics.width < maxWidth || currentLine === "") {
            currentLine = testLine;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
            const wordMetrics = context.measureText(currentLine);
            if (wordMetrics.width > maxWidth) {
                let shortenedWord = currentLine;
                while (context.measureText(shortenedWord + "...").width > maxWidth && shortenedWord.length > 0) {
                    shortenedWord = shortenedWord.slice(0, -1);
                }
                if (shortenedWord.length > 0) lines.push(shortenedWord + "..."); else lines.push("...");
                currentLine = "";
            }
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines.length > 0 ? lines : [text];
}

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { commands, config: botConfig } = global.client;
    const prefix = botConfig.PREFIX || "/";
    const { messageID, threadID, body, senderID } = event; // Thêm senderID
    const { name, content } = handleReply;

    if (name !== this.config.name) return;
    if (senderID !== handleReply.author) { // Chỉ người gọi lệnh mới được reply
        return api.sendMessage("⚠️ Bạn không phải là người đã yêu cầu menu này.", threadID, messageID);
    }

    let {
        allItems, currentPage, itemsPerPage, totalPages,
        replyTypeForNextStep, originalArgs, menuTitle
    } = content;

    const input = body.trim().toLowerCase();

    if (input === "next" || input === "back") {
        if (!totalPages || totalPages <= 1) {
            return api.sendMessage("ℹ️ Menu này chỉ có một trang.", threadID, messageID);
        }
        if (input === "next") {
            currentPage = currentPage < totalPages ? currentPage + 1 : 1;
        } else {
            currentPage = currentPage > 1 ? currentPage - 1 : totalPages;
        }

        const footerForPaginatedView = [`Gửi STT để chọn hoặc "next"/"back" để chuyển trang.`];
        if (replyTypeForNextStep === "cmd_info" || originalArgs === "all") {
            footerForPaginatedView.push(`Dùng ${prefix}menu để quay lại menu chính.`);
        } else {
            footerForPaginatedView.push(`Dùng ${prefix}menu all để xem tất cả các lệnh.`);
        }

        try {
            const imagePath = await createModernMenuImage(
                menuTitle, allItems, footerForPaginatedView,
                commands.size, prefix, currentPage, itemsPerPage
            );
            const newMsgInfo = await api.sendMessage({ // Đổi tên biến để tránh trùng lặp
                body: `📄 Trang ${currentPage}/${totalPages} của "${menuTitle}"`,
                attachment: fs.createReadStream(imagePath)
            }, threadID);

            fs.unlinkSync(imagePath);

            global.client.handleReply.push({
                name: this.config.name,
                messageID: newMsgInfo.messageID, // Sử dụng messageID của tin nhắn mới
                author: senderID,
                content: { ...content, currentPage }
            });
        } catch (e) {
            console.error(`[MENU_HANDLE_REPLY] Error creating paginated menu image:`, e);
            api.sendMessage("❌ Lỗi khi tạo ảnh menu trang mới. Vui lòng thử lại.", threadID);
        }
        return;
    }

    const num = parseInt(body.trim());
    const itemsOnThisPage = allItems.length - (currentPage - 1) * itemsPerPage;
    const maxValidSelection = Math.min(itemsPerPage, itemsOnThisPage);

    if (isNaN(num) || num < 1 || num > maxValidSelection) {
        return api.sendMessage(`⚠️ Số bạn chọn không hợp lệ cho trang này (chỉ từ 1 đến ${maxValidSelection}). Gửi "next"/"back" hoặc thử lại.`, threadID, messageID);
    }

    const globalIndex = (currentPage - 1) * itemsPerPage + num - 1;
    const selectedItem = allItems[globalIndex];

    if (!selectedItem) {
        return api.sendMessage("⚠️ Không tìm thấy mục bạn chọn. Có thể menu đã cập nhật, vui lòng thử lại lệnh.", threadID, messageID);
    }

    if (replyTypeForNextStep === "cmd_group") {
        const groupData = selectedItem;
        let commandItems = [];

        groupData.cmds.forEach(cmdName => {
            const commandConfig = commands.get(cmdName)?.config;
            if (commandConfig && !commandConfig.hidden) {
                commandItems.push({
                    name: cmdName,
                    description: commandConfig.description || "Không có mô tả.",
                    icon: "⚙️",
                    originalCmdName: cmdName
                });
            }
        });
        commandItems.sort((a,b) => a.name.localeCompare(b.name));

        const subMenuTitle = `Lệnh Nhóm: ${groupData.group.toUpperCase()}`;
        const subTotalPages = Math.ceil(commandItems.length / ITEMS_PER_PAGE);
        let subFooter = [`Gửi STT lệnh để xem chi tiết.`];
        if (subTotalPages > 1) subFooter.push(`Dùng "next"/"back" để chuyển trang (nếu có nhiều lệnh).`);
        subFooter.push(`Gửi ${prefix}menu để quay lại menu chính.`);

        try {
            const imagePath = await createModernMenuImage(subMenuTitle, commandItems, subFooter, 0, prefix, 1, ITEMS_PER_PAGE);
            const newMsgInfo = await api.sendMessage({
                body: `╭─╮\n│📁 Nhóm lệnh: ${groupData.group.toUpperCase()}\n╰─╯ (Trang 1/${subTotalPages})`,
                attachment: fs.createReadStream(imagePath)
            }, threadID);

            fs.unlinkSync(imagePath);

            global.client.handleReply.push({
                name: this.config.name,
                messageID: newMsgInfo.messageID,
                author: senderID,
                content: {
                    allItems: commandItems,
                    currentPage: 1,
                    itemsPerPage: ITEMS_PER_PAGE,
                    totalPages: subTotalPages,
                    replyTypeForNextStep: "cmd_info",
                    originalArgs: `group_${groupData.group.toLowerCase().replace(/\s+/g, '_')}`,
                    menuTitle: subMenuTitle
                }
            });
        } catch (e) {
            console.error(`[MENU_HANDLE_REPLY] Error creating command group menu:`, e);
            api.sendMessage("❌ Lỗi khi tạo ảnh menu cho nhóm lệnh này.", threadID);
        }

    } else if (replyTypeForNextStep === "cmd_info") {
        const selectedCmdName = selectedItem.name || selectedItem.originalCmdName || selectedItem;
        const commandConfig = commands.get(selectedCmdName)?.config;

        if (!commandConfig) {
            return api.sendMessage(`❌ Lệnh "${selectedCmdName}" không còn tồn tại hoặc đã bị ẩn.`, threadID, messageID);
        }

        const cmdDetailTitle = "CHI TIẾT LỆNH";
        const cmdDetailItems = [
            { key: "Tên Lệnh", value: selectedCmdName, icon: "🏷️" },
            { key: "Mô Tả", value: commandConfig.description || "Không có.", icon: "📖" },
            { key: "Cách Dùng", value: `${prefix}${selectedCmdName} ${commandConfig.usages || ""}`.trim(), icon: "🛠️" },
            { key: "Cooldown", value: `${commandConfig.cooldowns || 3} giây`, icon: "⏳" },
            { key: "Quyền Hạn", value: `${commandConfig.hasPermssion == 0 ? "Mọi người dùng" : commandConfig.hasPermssion == 1 ? "Quản trị viên nhóm" : (commandConfig.hasPermssion == 2 ? "Quản trị viên Bot" : "Không rõ")}`, icon: "⚖️" },
            { key: "Credits", value: commandConfig.credits || "Không có", icon: "💡" }
        ].map(item => ({
            indexOverride: null,
            name: item.key,
            description: item.value,
            icon: item.icon
        }));

        const cmdDetailFooter = [`Gửi ${prefix}menu để quay lại.`];

        try {
            const imagePath = await createModernMenuImage(cmdDetailTitle, cmdDetailItems, cmdDetailFooter, 0, prefix, 1, cmdDetailItems.length);
            await api.sendMessage({
                body: `╭─╮\n│📌 Thông tin lệnh: ${selectedCmdName}\n╰─╯`,
                attachment: fs.createReadStream(imagePath)
            }, threadID);
            fs.unlinkSync(imagePath);
        } catch (e) {
            console.error(`[MENU_HANDLE_REPLY] Error creating command detail image:`, e);
            let fallbackMsg = `╭─╮\n│📌 𝗧𝗵𝗼̂𝗻𝗴 𝘁𝗶𝗻 𝗹𝗲̣̂𝗻𝗵: ${selectedCmdName}\n╰─╯\n`;
            fallbackMsg += `\n📖 𝗠𝗼̂ 𝘁𝗮̉: ${commandConfig.description || "N/A"}`;
            fallbackMsg += `\n🛠️ 𝗖𝗮́𝗰𝗵 𝗱𝘂̀𝗻𝗴: ${prefix}${selectedCmdName} ${commandConfig.usages || ""}`;
            fallbackMsg += `\n⏳ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${commandConfig.cooldowns || 3} giây`;
            fallbackMsg += `\n⚖️ 𝗤𝘂𝘆𝗲̂̀𝗻 𝗵𝗮̣𝗻: ${commandConfig.hasPermssion == 0 ? "Mọi người dùng" : commandConfig.hasPermssion == 1 ? "QTV Nhóm" : (commandConfig.hasPermssion == 2 ? "QTV Bot" : "Không rõ")}`;
            fallbackMsg += `\n💡 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: ${commandConfig.credits || "N/A"}`;
            api.sendMessage(fallbackMsg, threadID, messageID);
        }
    } else {
        api.sendMessage("⚠️ Lỗi: Không xác định được hành động tiếp theo. Vui lòng thử lại lệnh menu.", threadID, messageID);
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { commands, config: botConfig } = global.client;
    const { threadID, senderID } = event;
    const prefix = botConfig.PREFIX || "/";

    let allItemsForCanvas = [];
    let menuTitle = "DANH MỤC LỆNH";
    let footerLines = [];
    let replyTypeForNextStep;
    let currentContextArgs = "groups";

    let requestedPage = 1;
    if (args.length > 0 && /^\d+$/.test(args[args.length - 1])) {
        requestedPage = parseInt(args.pop());
        if (requestedPage <= 0) requestedPage = 1;
    }

    const primaryArg = args.length > 0 ? args.join(" ").toLowerCase() : "default";

    if (primaryArg === "all" || primaryArg === "-a") {
        menuTitle = "TẤT CẢ LỆNH";
        commands.forEach((cmd) => {
            if (cmd.config && cmd.config.name && !cmd.config.hidden && cmd.config.commandCategory !== "NSFW") {
                allItemsForCanvas.push({
                    name: cmd.config.name,
                    description: cmd.config.description || "Không có mô tả.",
                    icon: "🔹"
                });
            }
        });
        allItemsForCanvas.sort((a, b) => a.name.localeCompare(b.name));
        footerLines = [`Hiện có ${allItemsForCanvas.length} lệnh có thể sử dụng.`];
        replyTypeForNextStep = "cmd_info";
        currentContextArgs = "all";
    } else {
        menuTitle = "NHÓM LỆNH";
        let groupsData = {};
        let specificGroupRequested = false;

        commands.forEach(cmd => {
            if (cmd.config && cmd.config.commandCategory && cmd.config.name && !cmd.config.hidden && cmd.config.commandCategory !== "NSFW") {
                const category = cmd.config.commandCategory.trim();
                const categoryLower = category.toLowerCase();

                if (primaryArg !== "default" && categoryLower === primaryArg) {
                    specificGroupRequested = true;
                    menuTitle = `Lệnh Nhóm: ${category.toUpperCase()}`;
                    allItemsForCanvas.push({
                        name: cmd.config.name,
                        description: cmd.config.description || "Không có mô tả.",
                        icon: "🔸",
                        originalCmdName: cmd.config.name
                    });
                } else if (primaryArg === "default" && !specificGroupRequested) {
                    if (!groupsData[category]) {
                        groupsData[category] = {
                            group: category,
                            cmds: [],
                            icon: "📁"
                        };
                    }
                    groupsData[category].cmds.push(cmd.config.name);
                }
            }
        });

        if (specificGroupRequested) {
            allItemsForCanvas.sort((a,b) => a.name.localeCompare(b.name));
            footerLines = [`Các lệnh trong nhóm "${menuTitle}".`];
            replyTypeForNextStep = "cmd_info";
            currentContextArgs = `group_${primaryArg.replace(/\s+/g, '_')}`;
        } else {
             const sortedGroups = Object.values(groupsData).sort((a, b) => a.group.localeCompare(b.group));
             allItemsForCanvas = sortedGroups.map(g => ({
                group: g.group,
                description: `(${g.cmds.length} lệnh)`,
                icon: g.icon,
                cmds: g.cmds
            }));
            footerLines = [`Bot có ${commands.size} lệnh, được chia thành ${allItemsForCanvas.length} nhóm.`];
            replyTypeForNextStep = "cmd_group";
            currentContextArgs = "groups";
        }
    }

    if (allItemsForCanvas.length === 0) {
        return api.sendMessage(`ℹ️ Không có lệnh hoặc nhóm lệnh nào phù hợp với yêu cầu "${primaryArg}".`, threadID, event.messageID);
    }

    const totalItems = allItemsForCanvas.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (requestedPage > totalPages && totalPages > 0) requestedPage = totalPages;

    if (totalItems > ITEMS_PER_PAGE) {
        footerLines.push(`Gửi STT để chọn, hoặc "next"/"back" để chuyển trang.`);
    } else if (totalItems > 0) {
        footerLines.push(`Gửi STT để chọn mục bạn muốn.`);
    }
    footerLines.push(`Dùng ${prefix}help <tên lệnh> để xem nhanh chi tiết.`);

    try {
        const imagePath = await createModernMenuImage(
            menuTitle, allItemsForCanvas, footerLines,
            commands.size, prefix, requestedPage, ITEMS_PER_PAGE
        );

        let messageBody = `🌟 ${menuTitle} 🌟`;
        if (totalPages > 1) {
            messageBody += ` (Trang ${requestedPage}/${totalPages})`;
        }

        const msgInfo = await api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(imagePath)
        }, threadID);

        fs.unlinkSync(imagePath);

        if (totalItems > 0) {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: msgInfo.messageID,
                author: senderID,
                content: {
                    allItems: allItemsForCanvas,
                    currentPage: requestedPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    totalPages: totalPages,
                    replyTypeForNextStep: replyTypeForNextStep,
                    originalArgs: currentContextArgs,
                    menuTitle: menuTitle
                }
            });
        }
    } catch (e) {
        console.error(`[MENU_RUN] Error creating main menu image:`, e);
        api.sendMessage("❌ Rất tiếc, đã có lỗi xảy ra khi tạo menu ảnh. Vui lòng thử lại sau.", threadID, event.messageID);
        let fallbackText = `Lỗi tạo ảnh menu. Danh sách ${menuTitle}:\n`;
        allItemsForCanvas.slice((requestedPage-1)*ITEMS_PER_PAGE, requestedPage*ITEMS_PER_PAGE).forEach((item, idx) => {
            fallbackText += `${(requestedPage-1)*ITEMS_PER_PAGE + idx + 1}. ${item.name || item.group}\n`;
        });
        if(totalPages > 1) fallbackText += `\nTrang ${requestedPage}/${totalPages}. Gửi "next"/"back".`;
        api.sendMessage(fallbackText, threadID);
    }
};
