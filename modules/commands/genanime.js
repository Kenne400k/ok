const axios = require('axios');
const crypto = require('crypto');

function generateSessionHash() {
    return crypto.randomBytes(6).toString('hex');
}

async function taoanhdep(prompt) {
    const sessionHash = generateSessionHash();

    try {
        const url1 = `https://taoanhdep.com/public/gg-dich.php?tukhoa=${encodeURIComponent(prompt)}`;
        const response1 = await axios.get(url1);

        if (response1.status !== 200) {
            throw new Error(`Failed to retrieve data in step 1. Status code: ${response1.status}`);
        }
        const text = response1.data;
        const url2 = 'https://tuan2308-animagine-xl-3-1.hf.space/queue/join';
        const headers = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Access-Control-Request-Headers': 'content-type',
            'Access-Control-Request-Method': 'POST',
            'Origin': 'https://taoanhdep.com',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        };
        const optionsConfig = {
            method: 'OPTIONS',
            url: url2,
            headers: headers
        };

        const response2 = await axios(optionsConfig);

        if (response2.status !== 200) {
            throw new Error(`Failed in step 2. Status code: ${response2.status}`);
        }

        const postConfig = {
            method: 'POST',
            url: url2,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "data": [text, "", 1953943649, "1024", "1024", 7, 20, "Euler a", "1024 x 1024", "(None)", "Standard v3.1", false, 0.55, 1.5, true],
                "event_data": null,
                "fn_index": 5,
                "trigger_id": 49,
                "session_hash": sessionHash
            })
        };

        const response3 = await axios(postConfig);

        if (response3.status !== 200) {
            throw new Error(`Failed in step 3. Status code: ${response3.status}`);
        }

        const url4 = `https://tuan2308-animagine-xl-3-1.hf.space/queue/data?session_hash=${sessionHash}`;
        const headers4 = {
            'Accept': 'text/event-stream',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Cache-Control': 'no-cache',
            'Origin': 'https://taoanhdep.com',
            'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        };

        const response4 = await axios.get(url4, { 
            headers: headers4,
            responseType: 'stream' 
        });

        return new Promise((resolve, reject) => {
            let imageUrl = null;

            response4.data.on('data', (chunk) => {
                const events = chunk.toString().split('\n\n');
                events.forEach(event => {
                    if (event.trim() !== '') {
                        try {
                            const parsedEvent = JSON.parse(event.replace('data: ', ''));

                            if (parsedEvent.msg === 'process_completed' && parsedEvent.output && parsedEvent.output.data) {
                                imageUrl = parsedEvent.output.data[0][0].image.url;
                                resolve(imageUrl);
                            }
                        } catch (error) {
                            console.error("Error parsing event:", error);
                        }
                    }
                });
            });

            response4.data.on('end', () => {
                if (!imageUrl) {
                    reject(new Error("No image URL found in the event stream"));
                }
            });

            response4.data.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

let streamURL = (url, ext = 'jpg') => axios.get(url, {
    responseType: 'stream',
}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);

module.exports.config = {
    name: "genanime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Satoru",
    description: "Tạo ảnh đẹp từ prompt",
    commandCategory: "Tiện ích",
    usages: "[prompt]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    if (args.length === 0) {
        return api.sendMessage("Vui lòng nhập prompt để tạo ảnh.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    
    api.sendMessage("👾 Đang xử lý yêu cầu của bạn, vui lòng đợi...", event.threadID, event.messageID);

    try {
        const imageUrl = await taoanhdep(prompt);
        
        const attachment = await streamURL(imageUrl);
        
        if (!attachment) {
            return api.sendMessage("Có lỗi xảy ra khi tải ảnh, vui lòng thử lại sau.", event.threadID, event.messageID);
        }
        
        return api.sendMessage(
            {
                body: `🖼️ Đây là ảnh được tạo từ prompt: "${prompt}"`,
                attachment: attachment
            },
            event.threadID,
            event.messageID
        );
    } catch (error) {
        console.error(error);
        return api.sendMessage("Đã xảy ra lỗi trong quá trình tạo ảnh, vui lòng thử lại sau.", event.threadID, event.messageID);
    }
};