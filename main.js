const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
var log = require("./utils/log");
const { join, resolve } = require("path");
const chalkAnimation = require('chalkercli');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const gradient = require('gradient-string');
const CFonts = require('cfonts');
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const con = require('./config.json');
const login = require(con.NPM_FCA);
const moment = require("moment-timezone");
const timeStart = Date.now();
const axios = require("axios");
const os = require('os');
const theme = con.DESIGN.Theme;
let co;
let error;
if (theme.toLowerCase() === 'blue') {
  co = gradient([{color: "#1affa3", pos: 0.2},{color:"cyan",pos:0.4},{color:"pink",pos:0.6},{color:"cyan",pos:0.8},{color:'#1affa3',pos:1}]);
  error = chalk.red.bold;}

else if (theme=="dream2") 
{
  cra = gradient("blue","pink") 
  co = gradient("#a200ff","#21b5ff","#a200ff")
}
  else if (theme.toLowerCase() === 'dream') {
  co = gradient([{color: "blue", pos: 0.2},{color:"pink",pos:0.3},{color:"gold",pos:0.6},{color:"pink",pos:0.8},{color: "blue", pos:1}]);
  error = chalk.red.bold;
}
    else if (theme.toLowerCase() === 'test') {
  co = gradient("#243aff", "#4687f0", "#5800d4","#243aff", "#4687f0", "#5800d4","#243aff", "#4687f0", "#5800d4","#243aff", "#4687f0", "#5800d4");
  error = chalk.red.bold;
}

else if (theme.toLowerCase() === 'fiery') {
  co = gradient("#fc2803", "#fc6f03", "#fcba03");
  error = chalk.red.bold;
}
else if (theme.toLowerCase() === 'rainbow') {
  co = gradient.rainbow
  error = chalk.red.bold;}
  else if (theme.toLowerCase() === 'pastel') {
  co = gradient.pastel
  error = chalk.red.bold;}
  else if (theme.toLowerCase() === 'cristal') {
  co = gradient.cristal
  error = chalk.red.bold;
}else if (theme.toLowerCase() === 'red') {
  co = gradient("red", "orange");
  error = chalk.red.bold;
} else if (theme.toLowerCase() === 'aqua') {
  co = gradient("#0030ff", "#4e6cf2");
  error = chalk.blueBright;
} else if (theme.toLowerCase() === 'pink') {
  cra = gradient('purple', 'pink');
  co = gradient("#d94fff", "purple");
} else if (theme.toLowerCase() === 'retro') {
  cra = gradient("#d94fff", "purple");
  co = gradient.retro;
} else if (theme.toLowerCase() === 'sunlight') {
  cra = gradient("#f5bd31", "#f5e131");
  co = gradient("orange", "#ffff00", "#ffe600");
} else if (theme.toLowerCase() === 'teen') {
  cra = gradient("#00a9c7", "#853858","#853858","#00a9c7");
  co = gradient.teen;
} else if (theme.toLowerCase() === 'summer') {
  cra = gradient("#fcff4d", "#4de1ff");
  co = gradient.summer;
} else if (theme.toLowerCase() === 'flower') {
  cra = gradient("blue", "purple", "yellow", "#81ff6e");
  co = gradient.pastel;
} else if (theme.toLowerCase() === 'ghost') {
  cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
  co = gradient.mind;
} else if (theme === 'hacker') {
  cra = chalk.hex('#4be813');
  co = gradient('#47a127', '#0eed19', '#27f231');
}
else {
  co = gradient("#243aff", "#4687f0", "#5800d4");
  error = chalk.red.bold;
}
//////////////////////////////////////////////////////////////////////////////
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;

global.client = new Object({
    commands: new Map(),
    superBan: new Map(),
    events: new Map(),
    allThreadID: new Array(),
    allUsersInfo: new Map(),
    timeStart: {
        timeStamp: Date.now(),
        fullTime: ""
    },
    allThreadsBanned: new Map(),
    allUsersBanned: new Map(),
    cooldowns: new Map(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String(),
    getTime: function (option) {
        switch (option) {
            case "seconds":
                return `${moment.tz("Asia/Ho_Chi_minh").format("ss")}`;
            case "minutes":
                return `${moment.tz("Asia/Ho_Chi_minh").format("mm")}`;
            case "hours":
                return `${moment.tz("Asia/Ho_Chi_minh").format("HH")}`;
            case "date": 
                return `${moment.tz("Asia/Ho_Chi_minh").format("DD")}`;
            case "month":
                return `${moment.tz("Asia/Ho_Chi_minh").format("MM")}`;
            case "year":
                return `${moment.tz("Asia/Ho_Chi_minh").format("YYYY")}`;
            case "fullHour":
                return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss")}`;
            case "fullYear":
                return `${moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY")}`;
            case "fullTime":
                return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss DD/MM/YYYY")}`;
        }
    }
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();

global.account = new Object();

global.anti = resolve(process.cwd(),'anti.json');
///////////////////////////////////////
//== Find and get variable from Config =//
/////////////////////////////////////////
var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "config.json");
    configValue = require(global.client.configPath);
}
catch {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
    }

}

try {
    for (const key in configValue) global.config[key] = configValue[key];
}
catch { return logger.loader("Lỗi tải tệp config!", "error") }

const { Sequelize, sequelize } = require("./data_dongdev/database");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');
///////////////////////////////////////
//======== Load language use =====/////
///////////////////////////////////////

const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}

try {
    var appStateFile = resolve(join(global.client.mainPath,global.config.APPSTATEPATH || 'appstate.json')),
      appState = process.env.KEY && fs.readFileSync(appStateFile, 'utf8')[0] != '[' && global.config.encryptSt ? JSON.parse(decryptState(fs.readFileSync(appStateFile, 'utf8'), process.env.KEY)) : require(appStateFile)
    logger.loader(global.getText('mirai', 'foundPathAppstate'))
  } catch {
    logger.loader(global.getText('mirai', 'notFoundPathAppstate'), 'error')
  }
  ///////
// AUTO CLEAN CACHE CODE BY DONGDEV//
////////////////////////
if (con.autoCleanCache.Enable) {
  const folderPath = con.autoCleanCache.CachePath;
  const fileExtensions = con.autoCleanCache.AllowFileExtension;

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Lỗi khi đọc thư mục:', err);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fileExtensions.includes(path.extname(file).toLowerCase())) {

  fs.unlink(filePath, (err) => {
          if (err) {
logger(`Đã xoá các file jpg, mp4, gif, ttf, mp3`, "[ AUTO - CLEAN ]", err);
           } else {
         }
      });
    }
});
logger(`Đã xoá các file jpg, mp4, gif, ttf, mp3`, "[ AUTO - CLEAN ]");
  });
} else {
logger(`Auto Clean Cache Đã Bị Tắt`, "[ AUTO - CLEAN ]");
}
////////////////////////////////////////////////
//========= Đăng nhập tài khoản, bắt đầu Nghe Sự kiện && Nhận tự động Appstate từ cấu hình =========//
////////////////////////////////////////////////
async function loginAppstate() {
  const login = require(con.NPM_FCA),
    dataaccountbot = require('./config.json'),
    accountbot = {
      logLevel: 'silent',
      forceLogin: true,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
    }
  const Dataaccountbot = accountbot
  let email = dataaccountbot.EMAIL,
    password = dataaccountbot.PASSWORD,
    keyotp = dataaccountbot.OTPKEY.replace(/\s+/g, '').toLowerCase()
  const autologin = { email, password, keyotp }
  login(autologin, Dataaccountbot, async (autologinError, autologinDone) => {
    if (autologinError) {
      switch (autologinError.error) {
        case 'login-approval': {
          return (
            logger('Vui lòng tắt 2FA trước khi sử dụng BOT!', '[ LOGIN-2FA ]'),
            process.exit(0)
          )
        }
        default:
          logger('Không thể tiến hành đăng nhập qua mật khẩu, vui lòng thay thế appstate hoặc mật khẩu để tiếp tục!','[ LOGIN-ERROR ]')
          return process.exit(0)
      }
    }
    const loginagain = JSON.stringify(autologinDone.getAppState(), null, 4)
    return (
      writeFileSync('./' + dataaccountbot.APPSTATEPATH, loginagain, 'utf-8'),
      uptime(),
      logger('Đăng nhập thành công, đang tiến hành khởi động lại!', '[ LOGIN-ACCOUNT ]')
    )
  })
}
function onBot({ models }) {
  const loginData = {}
  loginData.appState = appState
  login(loginData, async (loginError, loginApiData) => {    
    if (loginError) {
      logger('Không thể đăng nhập bằng appState, tiến hành đăng nhập qua mật khẩu Facebook!','[ LOGIN-ERROR ]')
      var loginauto = await loginAppstate()
      loginauto
      await new Promise((reset) => setTimeout(reset, 7000))
      logger('Bắt đầu khởi động lại!', '[ RESTART ]')
      process.exit(1)
    }

loginApiData.setOptions(global.config.FCAOption)
    let loginState = loginApiData.getAppState()
    loginState = JSON.stringify(loginState, null, '\t')
    if (process.env.KEY && global.config.encryptSt) {
      loginState = await encryptState(loginState, process.env.KEY)
      writeFileSync(appStateFile, loginState)
    } else {
      writeFileSync(appStateFile, loginState)
    }
////////////////////////////////////////////
////////////////////////////////////////////
    global.client.api = loginApiData;
    global.config.version = '4.6.9'
    global.client.timeStart = new Date().getTime(),
    function() {
      const listCommand = readdirSync(global.client.mainPath + '/modules/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
      for (const command of listCommand) {
          try {
              var module = require(global.client.mainPath + '/modules/commands/' + command);
              if (!module.config || !module.run || !module.config.commandCategory) throw new Error(global.getText('mirai', 'errorFormat'));
              if (global.client.commands.has(module.config.name || '')) throw new Error(global.getText('mirai', 'nameExist'));
              if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                  for (const reqDependencies in module.config.dependencies) {
                      const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                      try {
                          if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                              if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                              else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                          } else '';
                      } catch {
                          var check = false;
                          var isError;
                          logger.loader(global.getText('mirai', 'notFoundPackage', reqDependencies, module.config.name), 'warn');
                          execSync('npm ---package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), {
                              'stdio': 'inherit',
                              'env': process['env'],
                              'shell': true,
                              'cwd': join(__dirname, 'nodemodules')
                          });
                          for (let i = 1; i <= 3; i++) {
                              try {
                                  require['cache'] = {};
                                  if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                  else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                  check = true;
                                  break;
                              } catch (error) {
                                  isError = error;
                              }
                              if (check || !isError) break;
                          }
                          if (!check || isError) throw global.getText('mirai', 'cantInstallPackage', reqDependencies, module.config.name, isError);
                      }
                  }
              }
              if (module.config.envConfig) try {
                  for (const envConfig in module.config.envConfig) {
                      if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                      if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                      if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                      else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                      if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                  }
              } catch (error) {
                  throw new Error(global.getText('mirai', 'loadedConfig', module.config.name, JSON.stringify(error)));
              }
              if (module.onLoad) {
                  try {
                      const moduleData = {};
                      moduleData.api = loginApiData;
                      moduleData.models = models;
                      module.onLoad(moduleData);
                  } catch (_0x20fd5f) {
                      throw new Error(global.getText('mirai', 'cantOnload', module.config.name, JSON.stringify(_0x20fd5f)), 'error');
                  };
              }
              if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
              global.client.commands.set(module.config.name, module);
          } catch (error) {
              logger.loader(global.getText('mirai', 'failLoadModule', module.config.name, error), 'error');
          };
      }
  }(),
  function() {
      const events = readdirSync(global.client.mainPath + '/modules/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
      for (const ev of events) {
          try {
              var event = require(global.client.mainPath + '/modules/events/' + ev);
              if (!event.config || !event.run) throw new Error(global.getText('mirai', 'errorFormat'));
              if (global.client.events.has(event.config.name) || '') throw new Error(global.getText('mirai', 'nameExist'));
              if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                  for (const dependency in event.config.dependencies) {
                      const _0x21abed = join(__dirname, 'nodemodules', 'node_modules', dependency);
                      try {
                          if (!global.nodemodule.hasOwnProperty(dependency)) {
                              if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                              else global.nodemodule[dependency] = require(_0x21abed);
                          } else '';
                      } catch {
                          let check = false;
                          let isError;
                          logger.loader(global.getText('mirai', 'notFoundPackage', dependency, event.config.name), 'warn');
                          execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), {
                              'stdio': 'inherit',
                              'env': process['env'],
                              'shell': true,
                              'cwd': join(__dirname, 'nodemodules')
                          });
                          for (let i = 1; i <= 3; i++) {
                              try {
                                  require['cache'] = {};
                                  if (global.nodemodule.includes(dependency)) break;
                                  if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                  else global.nodemodule[dependency] = require(_0x21abed);
                                  check = true;
                                  break;
                              } catch (error) {
                                  isError = error;
                              }
                              if (check || !isError) break;
                          }
                          if (!check || isError) throw global.getText('mirai', 'cantInstallPackage', dependency, event.config.name);
                      }
                  }
              }
              if (event.config.envConfig) try {
                  for (const configevent in event.config.envConfig) {
                      if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                      if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                      if (typeof global.config[event.config.name][configevent] !== 'undefined') global.configModule[event.config.name][configevent] = global.config[event.config.name][configevent];
                      else global.configModule[event.config.name][configevent] = event.config.envConfig[configevent] || '';
                      if (typeof global.config[event.config.name][configevent] == 'undefined') global.config[event.config.name][configevent] = event.config.envConfig[configevent] || '';
                  }
              } catch (error) {
                  throw new Error(global.getText('mirai', 'loadedConfig', event.config.name, JSON.stringify(error)));
              }
              if (event.onLoad) try {
                  const eventData = {};
                  eventData.api = loginApiData, eventData.models = models;
                  event.onLoad(eventData);
              } catch (error) {
                  throw new Error(global.getText('mirai', 'cantOnload', event.config.name, JSON.stringify(error)), 'error');
              }
              global.client.events.set(event.config.name, event);
          } catch (error) {
              logger.loader(global.getText('mirai', 'failLoadModule', event.config.name, error), 'error');
          }
      }
  }()
  console.log(chalk.bold(co(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)));
        logger.loader(`Commands Loaded: ${global.client.commands.size}`)
        logger.loader(`Events Loaded: ${global.client.events.size}`)
        logger.loader('Time start: ' + (Date.now() - global.client.timeStart) / 1000 + 's') 
    writeFileSync(global.client.configPath,JSON.stringify(global.config, null, 4),'utf8');
    const listenerData = { api: loginApiData, models: models }
    const listener = require('./data_dongdev/listen')(listenerData)
    async function listenerCallback(error, message) {
      if (error) {
        logger('Acc bị logout, đang tiến hành đăng nhập lại!', '[ LOGIN-ACCOUNT ]')
        var _0x50d0db = await loginAppstate()
        _0x50d0db
        await new Promise((data) => setTimeout(data, 7000))
        process.exit(1)
      }
      if (['presence', 'typ', 'read_receipt'].some((data) => data == message.type)) { return }
      return listener(message)
    }
    var _0x27b45c = setInterval(function (_0x5e6185) {
      uptime()
      process.exit(1)
    }, 1800000)
    _0x27b45c
    global.handleListen = loginApiData.listenMqtt(listenerCallback)
    global.client.api = loginApiData
  })
}

(async () => {
  try {
    await sequelize.authenticate()
    const authentication = { Sequelize, sequelize }
    const models = require('./data_dongdev/database/model')(authentication)
   logger(global.getText('mirai', 'successConnectDatabase'), '[ DATABASE ]')
    const botData = { models: models }
    onBot(botData)
  } catch (error) {
    logger(global.getText('mirai', 'successConnectDatabase', JSON.stringify(error)), '[ DATABASE ]')
  }
})()
process.on('unhandledRejection', (err, p) => {}).on('uncaughtException', err => { console.log(err);
});