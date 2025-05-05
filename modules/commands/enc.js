module.exports.config = {
  name: "enc",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "NTKhang",
  description: "encode obf!",
  commandCategory: "Tiện ích",
  cooldowns: 5,
  dependencies: {
    "javascript-obfuscator": ""
  }
};

module.exports.languages = {
  "vi": {},
  "en": {}
};

module.exports.run = async ({ event, api, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  let codes = [];
  if (args[0]) {
    for (let file of args) {
      if (!file.endsWith(".js"))
        file += ".js";
      codes.push(fs.readFileSync(__dirname + '/' + file, 'utf8'));
    }
    return encObfuscate(codes, api, event);
  }
  else if (event.attachments.length > 0) {
    for (const attachment of event.attachments) {
      const getCode = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      codes.push(getCode.data.toString('utf8'));
    }
    return encObfuscate(codes, api, event);
  }
  else
    api.sendMessage(`Phản hồi tin nhắn này kèm tên file lệnh hoặc đính kèm file .txt chứa code muốn obf!`, event.threadID, (e, i) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: i.messageID,
        author: event.senderID
      });
    });
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  if (event.senderID != handleReply.author)
    return;
  const axios = require('axios');
  let codes = [];
  if (event.body) {
    codes = [event.body];
    return encObfuscate(codes, api, event);
  }
  else if (event.attachments.length > 0) {
    for (const attachment of event.attachments) {
      const getCode = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      codes.push(getCode.data.toString('utf8'));
    }
    return encObfuscate(codes, api, event);
  }
  else
    return api.sendMessage(`Sai cú pháp!`, event.threadID, event.messageID);
};

function encObfuscate(codes, api, event) {
  const fs = require('fs-extra');
  const JavaScriptObfuscator = require('javascript-obfuscator');
  const attachment = [];
  const success = [];
  const failed = [];

  for (let i = 0; i < codes.length; i++) {
    const filePath = `${__dirname}/cache/codeEnc${i}.txt`;
    const codeEnc = JavaScriptObfuscator.obfuscate(codes[i], {
      compact: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      debugProtectionInterval: 0,
      disableConsoleOutput: false,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: false,
      renameGlobals: false,
      selfDefending: false,
      simplify: true,
      splitStrings: false,
      stringArray: true,
      stringArrayCallsTransform: false,
      stringArrayCallsTransformThreshold: 0.5,
      stringArrayEncoding: [],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: 'variable',
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false
    });
    fs.writeFileSync(filePath, codeEnc.getObfuscatedCode(), 'utf8');
    attachment.push(fs.createReadStream(filePath));
    success.push(filePath);
  }

  const form = {
    body: success.length > 0 ? `Đã obf thành công ${success.length} file!` : ''
      + failed.length > 0 ? `\nĐã obf thất bại ${failed.length} file!` : ''
  };

  if (attachment.length > 0)
    form.attachment = attachment;

  api.sendMessage(form, event.threadID, (e, i) => {
    for (const file of success)
      fs.unlinkSync(file);
  }, event.messageID);
}
