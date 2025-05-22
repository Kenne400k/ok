/**
 * API Proxy và Anti-Block Module
 * Module này giúp tránh bị block khi gọi API liên tục
 * Created by: Nguyễn Trương Thiện Phát (pcoder)
 * 
 * Cách sử dụng:
 * const { sendRequest, setRequestOptions } = require('../utils/apiProxy');
 * 
 * // Gửi request với user agent ngẫu nhiên
 * const response = await sendRequest('https://api.example.com/data');
 * 
 * // Hoặc tùy chỉnh options
 * const options = {
 *    headers: { 'Custom-Header': 'value' },
 *    timeout: 10000,
 *    retries: 3
 * };
 * const response = await sendRequest('https://api.example.com/data', options);
 */

const https = require('https');
const http = require('http');
const url = require('url');
const { getRandomUserAgent, refreshUserAgentPool } = require('./userAgents');

// Danh sách proxy nếu cần (có thể để trống nếu không dùng proxy)
const proxies = [
    // Format: { host: 'proxy.example.com', port: 8080, auth: 'username:password' }
    // Nếu có proxy, hãy thêm vào đây
];

// Cấu hình mặc định
const defaultOptions = {
    timeout: 30000, // 30 giây
    retries: 3,     // Số lần thử lại khi request thất bại
    retryDelay: 1000, // Độ trễ giữa các lần thử lại (ms)
    useProxy: false,  // Mặc định không dùng proxy
    rotateUserAgent: true, // Luôn thay đổi user agent
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    }
};

let currentOptions = { ...defaultOptions };

/**
 * Cài đặt tùy chọn mới cho API request
 * @param {Object} options - Các tùy chọn mới
 */
function setRequestOptions(options) {
    currentOptions = { ...defaultOptions, ...options };
    return currentOptions;
}

/**
 * Lấy một proxy ngẫu nhiên từ danh sách
 * @returns {Object|null} - Thông tin proxy hoặc null nếu không có
 */
function getRandomProxy() {
    if (!proxies.length) return null;
    return proxies[Math.floor(Math.random() * proxies.length)];
}

/**
 * Thực hiện HTTP request với các biện pháp tránh bị block
 * @param {string} requestUrl - URL cần gọi
 * @param {Object} options - Tùy chọn cho request
 * @returns {Promise<Object>} - Promise chứa response
 */
async function sendRequest(requestUrl, options = {}) {
    // Kết hợp tùy chọn mặc định và tùy chọn người dùng
    const requestOptions = { ...currentOptions, ...options };
    
    // Thử lại nếu có lỗi
    let lastError = null;
    for (let attempt = 0; attempt < requestOptions.retries; attempt++) {
        try {
            // Nếu không phải lần thử đầu tiên, đợi một khoảng thời gian
            if (attempt > 0) {
                await new Promise(resolve => setTimeout(resolve, requestOptions.retryDelay));
            }
            
            // Lấy user agent ngẫu nhiên nếu được yêu cầu
            if (requestOptions.rotateUserAgent) {
                requestOptions.headers = {
                    ...requestOptions.headers,
                    'User-Agent': getRandomUserAgent()
                };
            }
            
            // Lấy proxy nếu được yêu cầu
            let proxyConfig = null;
            if (requestOptions.useProxy && proxies.length > 0) {
                proxyConfig = getRandomProxy();
            }
            
            // Thực hiện request
            const response = await makeRequest(requestUrl, requestOptions, proxyConfig);
            return response;
        } catch (error) {
            lastError = error;
            
            // Nếu lỗi là do bị chặn (status 403, 429, v.v.), đổi user agent và proxy
            if (error.statusCode === 403 || error.statusCode === 429) {
                // Đổi user agent và thử lại
                if (requestOptions.rotateUserAgent) {
                    requestOptions.headers['User-Agent'] = getRandomUserAgent();
                }
                
                // Tăng thời gian chờ giữa các request
                await new Promise(resolve => setTimeout(resolve, requestOptions.retryDelay * 2));
            }
        }
    }
    
    // Nếu tất cả các lần thử đều thất bại, ném lỗi cuối cùng
    throw lastError || new Error('Request failed after multiple attempts');
}

/**
 * Thực hiện HTTP request
 * @param {string} requestUrl - URL cần gọi
 * @param {Object} options - Tùy chọn cho request
 * @param {Object|null} proxy - Thông tin proxy
 * @returns {Promise<Object>} - Promise chứa response
 */
function makeRequest(requestUrl, options, proxy = null) {
    return new Promise((resolve, reject) => {
        // Parse URL để lấy thông tin protocol, hostname, path
        const parsedUrl = url.parse(requestUrl);
        
        // Xác định module HTTP/HTTPS dựa vào protocol
        const httpModule = parsedUrl.protocol === 'https:' ? https : http;
        
        // Chuẩn bị tùy chọn cho request
        const requestOptions = {
            method: options.method || 'GET',
            headers: options.headers || {},
            timeout: options.timeout || 30000
        };
        
        // Thêm thông tin proxy nếu có
        if (proxy) {
            requestOptions.host = proxy.host;
            requestOptions.port = proxy.port;
            requestOptions.path = requestUrl; // Dùng URL đầy đủ khi dùng proxy
            
            // Thêm xác thực proxy nếu có
            if (proxy.auth) {
                requestOptions.headers['Proxy-Authorization'] = 'Basic ' + Buffer.from(proxy.auth).toString('base64');
            }
        } else {
            requestOptions.host = parsedUrl.hostname;
            requestOptions.port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80);
            requestOptions.path = parsedUrl.path;
        }
        
        // Thực hiện request
        const req = httpModule.request(requestOptions, (res) => {
            let data = '';
            
            // Nhận dữ liệu
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            // Hoàn thành
            res.on('end', () => {
                // Xử lý các mã trạng thái khác nhau
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        // Thử phân tích JSON
                        const contentType = res.headers['content-type'] || '';
                        if (contentType.includes('application/json')) {
                            resolve({
                                statusCode: res.statusCode,
                                headers: res.headers,
                                body: JSON.parse(data),
                                rawBody: data
                            });
                        } else {
                            // Không phải JSON, trả về dạng text
                            resolve({
                                statusCode: res.statusCode,
                                headers: res.headers,
                                body: data,
                                rawBody: data
                            });
                        }
                    } catch (error) {
                        // Lỗi khi phân tích JSON
                        resolve({
                            statusCode: res.statusCode,
                            headers: res.headers,
                            body: data,
                            rawBody: data,
                            error: 'JSON parse error'
                        });
                    }
                } else {
                    // Lỗi HTTP
                    const error = new Error(`HTTP Error ${res.statusCode}: ${data}`);
                    error.statusCode = res.statusCode;
                    error.headers = res.headers;
                    error.body = data;
                    reject(error);
                }
            });
        });
        
        // Xử lý lỗi
        req.on('error', (error) => {
            reject(error);
        });
        
        // Xử lý timeout
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
        
        // Thêm dữ liệu nếu là POST, PUT, PATCH
        if (options.body && ['POST', 'PUT', 'PATCH'].includes(requestOptions.method)) {
            const body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
            
            // Tự động thêm content-type nếu không có
            if (!requestOptions.headers['content-type']) {
                requestOptions.headers['content-type'] = 'application/json';
            }
            
            req.write(body);
        }
        
        // Kết thúc request
        req.end();
    });
}

// Cập nhật user agent pool mỗi 6 giờ
setInterval(() => {
    refreshUserAgentPool();
}, 6 * 60 * 60 * 1000);

module.exports = {
    sendRequest,
    setRequestOptions
};