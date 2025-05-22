/**
 * User Agents Generator Module
 * Module này cung cấp danh sách user agents để tránh bị block API
 * Created by: Nguyễn Trương Thiện Phát (pcoder)
 * 
 * Cách sử dụng:
 * const { getRandomUserAgent } = require('../utils/userAgents');
 * 
 * const userAgent = getRandomUserAgent();
 * // Sử dụng userAgent khi gọi API
 */

// Các thành phần để tạo User Agent
const devices = [
    // Mobile devices
    'iPhone', 'iPad', 'iPod', 'Pixel', 'Nexus', 'Galaxy S', 'Galaxy Note', 'Galaxy Tab', 
    'Xperia', 'LG', 'HTC', 'OnePlus', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme',
    // Desktop
    'Windows NT', 'Macintosh', 'X11'
];

const browsers = [
    'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Vivaldi', 'Brave',
    'SamsungBrowser', 'UCBrowser', 'YaBrowser', 'MiuiBrowser'
];

const osVersions = {
    'iPhone': ['15_0', '15_1', '15_2', '15_3', '14_8', '14_7', '14_6', '14_5', '14_4', '14_3', '14_2', '14_1', '14_0', '13_7', '13_6', '13_5'],
    'iPad': ['15_0', '15_1', '15_2', '15_3', '14_8', '14_7', '14_6', '14_5', '14_4', '14_3', '14_2', '14_1', '14_0', '13_7', '13_6', '13_5'],
    'iPod': ['15_0', '14_8', '14_7', '14_6', '14_5', '14_4', '14_3', '14_2', '14_1', '14_0', '13_7', '13_6', '13_5'],
    'Windows NT': ['10.0', '6.3', '6.2', '6.1', '6.0', '5.1'],
    'Macintosh': ['Intel Mac OS X 10_15', 'Intel Mac OS X 10_14', 'Intel Mac OS X 10_13', 'Intel Mac OS X 10_12'],
    'X11': ['Linux x86_64', 'Linux i686', 'Ubuntu; Linux', 'Fedora; Linux', 'Debian; Linux'],
    'Android': ['12', '11', '10', '9', '8.1.0', '8.0.0', '7.1.2', '7.1.1', '7.0', '6.0.1', '6.0', '5.1.1']
};

const mobileModels = {
    'Pixel': ['6 Pro', '6', '5a', '5', '4a 5G', '4a', '4 XL', '4', '3a XL', '3a', '3 XL', '3', '2 XL', '2'],
    'Nexus': ['6P', '5X', '6', '5', '4'],
    'Galaxy S': ['22 Ultra', '22+', '22', '21 Ultra', '21+', '21', '20 Ultra', '20+', '20', '10+', '10', '9+', '9'],
    'Galaxy Note': ['20 Ultra', '20', '10+', '10', '9', '8'],
    'Galaxy Tab': ['S8 Ultra', 'S8+', 'S8', 'S7+', 'S7', 'S6', 'A8', 'A7'],
    'Xperia': ['1 III', '1 II', '5 III', '5 II', '10 III', '10 II', 'XZ3', 'XZ2'],
    'LG': ['Wing', 'Velvet', 'V60 ThinQ', 'V50 ThinQ', 'G8 ThinQ', 'G7 ThinQ'],
    'HTC': ['U20', 'U12+', 'U11+', 'U11', '10', 'Desire 21 Pro'],
    'OnePlus': ['10 Pro', '9 Pro', '9', '8T', '8 Pro', '8', '7T Pro', '7T', '7 Pro', '7'],
    'Huawei': ['P50 Pro', 'P50', 'P40 Pro+', 'P40 Pro', 'P40', 'Mate 40 Pro', 'Mate 40', 'Mate 30 Pro', 'Mate 30'],
    'Xiaomi': ['12 Pro', '12', '11 Ultra', '11 Pro', '11', 'Mi 10 Ultra', 'Mi 10 Pro', 'Mi 10', 'Redmi Note 11', 'Redmi Note 10 Pro'],
    'Oppo': ['Find X5 Pro', 'Find X5', 'Find X3 Pro', 'Find X3', 'Reno7 Pro', 'Reno7', 'Reno6 Pro', 'Reno6'],
    'Vivo': ['X80 Pro', 'X80', 'X70 Pro+', 'X70 Pro', 'X70', 'X60 Pro+', 'X60 Pro', 'X60'],
    'Realme': ['GT 2 Pro', 'GT 2', 'GT Neo 3', 'GT Neo 2', 'GT Neo', 'GT', '9 Pro+', '9 Pro', '9', '8 Pro', '8']
};

const browserVersions = {
    'Chrome': ['99.0.4844.51', '98.0.4758.102', '97.0.4692.99', '96.0.4664.110', '95.0.4638.69', '94.0.4606.81', '93.0.4577.82', '92.0.4515.159', '91.0.4472.124', '90.0.4430.93'],
    'Firefox': ['98.0', '97.0', '96.0', '95.0', '94.0', '93.0', '92.0', '91.0', '90.0', '89.0', '88.0', '87.0', '86.0', '85.0'],
    'Safari': ['15.3', '15.2', '15.1', '15.0', '14.1.2', '14.1.1', '14.1', '14.0.3', '14.0.2', '14.0.1', '14.0', '13.1.2', '13.1.1', '13.1', '13.0.5', '13.0.4'],
    'Edge': ['99.0.1150.30', '98.0.1108.62', '97.0.1072.69', '96.0.1054.53', '95.0.1020.53', '94.0.992.50', '93.0.961.52', '92.0.902.78', '91.0.864.71', '90.0.818.66'],
    'Opera': ['84.0.4316.31', '83.0.4254.27', '82.0.4227.33', '81.0.4196.60', '80.0.4170.40', '79.0.4143.50', '78.0.4093.112', '77.0.4054.277', '76.0.4017.177'],
    'Vivaldi': ['5.1.2567.57', '5.0.2497.51', '4.3.2439.65', '4.2.2406.54', '4.1.2369.21', '4.0.2312.41', '3.8.2259.42', '3.7.2218.52', '3.6.2165.40'],
    'Brave': ['1.36.111', '1.35.103', '1.34.81', '1.33.106', '1.32.115', '1.31.91', '1.30.89', '1.29.81', '1.28.106', '1.27.111'],
    'SamsungBrowser': ['16.0', '15.0', '14.2', '14.0', '13.2', '13.0', '12.1', '12.0', '11.2', '11.0', '10.2', '10.1', '10.0'],
    'UCBrowser': ['13.3.8.1305', '13.2.8.1301', '13.1.8.1295', '13.0.8.1291', '12.13.5.1209', '12.12.8.1206', '12.10.5.1171', '12.9.10.1159'],
    'YaBrowser': ['22.1.3.899', '21.11.3.927', '21.9.2.169', '21.8.3.607', '21.6.2.656', '21.5.4.607', '21.3.4.59', '21.2.4.139'],
    'MiuiBrowser': ['13.6.15', '13.5.40', '13.4.30', '13.3.5', '13.2.1', '13.1.1', '12.11.5', '12.10.3', '12.9.3']
};

// Tạo ngẫu nhiên User Agent theo format phổ biến
function generateUserAgent() {
    const isMobile = Math.random() > 0.5;
    
    if (isMobile) {
        return generateMobileUserAgent();
    } else {
        return generateDesktopUserAgent();
    }
}

function generateMobileUserAgent() {
    const androidProbability = 0.7; // 70% là Android, 30% là iOS
    
    if (Math.random() < androidProbability) {
        // Android user agent
        const brand = ['Pixel', 'Nexus', 'Galaxy S', 'Galaxy Note', 'Galaxy Tab', 'Xperia', 'LG', 'HTC', 'OnePlus', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme'][Math.floor(Math.random() * 14)];
        const models = mobileModels[brand];
        const model = models[Math.floor(Math.random() * models.length)];
        const androidVersion = osVersions['Android'][Math.floor(Math.random() * osVersions['Android'].length)];
        const browser = Math.random() > 0.7 ? 'Chrome' : browsers[Math.floor(Math.random() * browsers.length)];
        const browserVersion = browserVersions[browser][Math.floor(Math.random() * browserVersions[browser].length)];
        
        const buildId = generateRandomString(8);
        
        return `Mozilla/5.0 (Linux; Android ${androidVersion}; ${brand} ${model}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/${browserVersion} Mobile Safari/537.36`;
    } else {
        // iOS user agent
        const device = ['iPhone', 'iPad', 'iPod'][Math.floor(Math.random() * 3)];
        const osVersion = osVersions[device][Math.floor(Math.random() * osVersions[device].length)];
        const safariVersion = browserVersions['Safari'][Math.floor(Math.random() * browserVersions['Safari'].length)];
        
        return `Mozilla/5.0 (${device}; CPU ${device} OS ${osVersion} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${safariVersion} Mobile/15E148 Safari/604.1`;
    }
}

function generateDesktopUserAgent() {
    const os = ['Windows NT', 'Macintosh', 'X11'][Math.floor(Math.random() * 3)];
    const osVersion = osVersions[os][Math.floor(Math.random() * osVersions[os].length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const browserVersion = browserVersions[browser][Math.floor(Math.random() * browserVersions[browser].length)];
    
    if (os === 'Windows NT') {
        return `Mozilla/5.0 (${os} ${osVersion}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/${browserVersion} Safari/537.36`;
    } else if (os === 'Macintosh') {
        return `Mozilla/5.0 (${os}; ${osVersion}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/${browserVersion} Safari/537.36`;
    } else {
        return `Mozilla/5.0 (${os}; ${osVersion}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/${browserVersion} Safari/537.36`;
    }
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

// Tạo trước 500 user agent để sử dụng
const userAgentPool = [];
for (let i = 0; i < 500; i++) {
    userAgentPool.push(generateUserAgent());
}

// Trả về một user agent ngẫu nhiên từ pool
function getRandomUserAgent() {
    const randomIndex = Math.floor(Math.random() * userAgentPool.length);
    return userAgentPool[randomIndex];
}

// Trả về tất cả 500 user agent
function getAllUserAgents() {
    return [...userAgentPool];
}

// Cập nhật lại pool (có thể gọi định kỳ để đổi user agent)
function refreshUserAgentPool() {
    for (let i = 0; i < 500; i++) {
        userAgentPool[i] = generateUserAgent();
    }
}

module.exports = {
    getRandomUserAgent,
    getAllUserAgents,
    refreshUserAgentPool,
    generateUserAgent
};