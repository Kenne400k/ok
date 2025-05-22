/**
 * User Agent Manager - Quản lý tự động user agent
 * Cung cấp các hàm để quản lý user agent tự động, lưu cache, và tránh bị block API
 * Created by: Nguyễn Trương Thiện Phát (pcoder)
 * 
 * Cách sử dụng:
 * const { attachUserAgentToApi } = require('../utils/userAgentManager');
 * 
 * // Áp dụng user agent vào API
 * attachUserAgentToApi(api);
 * 
 * // Sau khi áp dụng, mọi request qua api sẽ tự động được gắn user agent khác nhau
 */

const { getRandomUserAgent, refreshUserAgentPool } = require('./userAgents');

// Lưu cache các API đã được áp dụng user agent
const attachedApis = new WeakMap();

// Tỷ lệ thay đổi user agent (0.0 - 1.0)
// 1.0 = đổi user agent mỗi request
// 0.5 = đổi user agent 50% số request
const AGENT_CHANGE_RATIO = 1.0;

/**
 * Áp dụng user agent vào tất cả các phương thức API của Facebook
 * @param {Object} api - API object từ Facebook-api
 * @returns {Object} - API object đã được áp dụng user agent
 */
function attachUserAgentToApi(api) {
    // Nếu đã áp dụng rồi thì bỏ qua
    if (attachedApis.has(api)) {
        return api;
    }
    
    // Danh sách các phương thức cần áp dụng user agent
    const methodsToAttach = [
        'sendMessage',
        'getUserInfo',
        'getThreadInfo',
        'getThreadList',
        'searchThreads',
        'getThreadHistory',
        'markAsRead',
        'markAsDelivered',
        'setMessageReaction',
        'addUserToGroup',
        'removeUserFromGroup',
        'changeThreadEmoji',
        'changeThreadColor',
        'changeNickname',
        'handleMessageRequest',
        'getThreadPictures',
        'forwardAttachment',
        'setPostReaction',
        'createNewGroup',
        'changeGroupImage',
        'changeAdminStatus',
        'changeApprovalMode',
        'setTitle',
        'muteThread',
        'unmuteThread',
        'deleteMessage',
        'deleteThread',
        'searchForThread',
        'unfriend'
    ];
    
    // Wrap các phương thức API với user agent tự động
    for (const methodName of methodsToAttach) {
        if (typeof api[methodName] === 'function') {
            const originalMethod = api[methodName];
            
            // Thay thế phương thức gốc bằng phương thức có user agent
            api[methodName] = async function(...args) {
                try {
                    // Kiểm tra xem có tham số options không
                    const lastArg = args[args.length - 1];
                    const hasOptions = lastArg && typeof lastArg === 'object' && !Array.isArray(lastArg);
                    
                    // Tạo user agent ngẫu nhiên
                    if (Math.random() <= AGENT_CHANGE_RATIO) {
                        const userAgent = getRandomUserAgent();
                        
                        // Nếu có options, thêm user agent vào options
                        if (hasOptions && !args[args.length - 1].userAgent) {
                            args[args.length - 1].userAgent = userAgent;
                        } 
                        // Nếu không có options, thêm options với user agent
                        else if (!hasOptions) {
                            if (methodName === 'sendMessage' && args.length >= 3) {
                                // sendMessage có cấu trúc (message, threadID, messageID, options)
                                args.push({ userAgent });
                            } else {
                                // Các phương thức khác, thêm options vào cuối
                                args.push({ userAgent });
                            }
                        }
                    }
                    
                    // Gọi phương thức gốc với các tham số đã được thêm user agent
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    // Xử lý lỗi khi API bị block
                    if (error && (error.message.includes('block') || 
                                error.message.includes('limit') || 
                                error.message.includes('spam') ||
                                error.message.includes('temporarily') ||
                                error.message.includes('rate'))) {
                        console.error(`[API Block Detected] ${methodName}: ${error.message}`);
                        // Thử lại với user agent khác
                        try {
                            // Đợi một khoảng thời gian ngắn trước khi thử lại
                            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
                            
                            // Tạo user agent mới và thử lại
                            const userAgent = getRandomUserAgent();
                            const lastIndex = args.length - 1;
                            
                            if (hasOptions) {
                                args[lastIndex].userAgent = userAgent;
                            } else {
                                if (methodName === 'sendMessage' && args.length >= 3) {
                                    args.push({ userAgent });
                                } else {
                                    args.push({ userAgent });
                                }
                            }
                            
                            return await originalMethod.apply(this, args);
                        } catch (retryError) {
                            // Nếu thử lại vẫn lỗi, ném lỗi ban đầu
                            throw error;
                        }
                    } else {
                        // Nếu không phải lỗi API block, ném lỗi ban đầu
                        throw error;
                    }
                }
            };
        }
    }
    
    // Đánh dấu API đã được áp dụng
    attachedApis.set(api, true);
    
    // Thiết lập tự động làm mới danh sách user agent
    setupAutoRefresh();
    
    return api;
}

/**
 * Thiết lập tự động làm mới user agent định kỳ
 */
function setupAutoRefresh() {
    // Làm mới user agent pool mỗi 6 giờ
    const refreshInterval = 6 * 60 * 60 * 1000; // 6 giờ
    
    // Nếu chưa có interval, tạo mới
    if (!global.userAgentRefreshInterval) {
        global.userAgentRefreshInterval = setInterval(() => {
            console.log('[User Agent] Refreshing user agent pool...');
            refreshUserAgentPool();
        }, refreshInterval);
    }
}

module.exports = {
    attachUserAgentToApi
};