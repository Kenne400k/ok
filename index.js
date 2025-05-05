const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
//let http = require('http');
const fs = require("fs"); 
const axios = require("axios");
var deviceID = require('uuid');
var adid = require('uuid');
const totp = require('totp-generator');
const semver = require("semver");
const logger = require("./utils/log");
const chalk = require('chalk');
const chalk1 = require('chalkercli');
const CFonts = require('cfonts');
const moment = require("moment-timezone");
const gradient = require('gradient-string');
const con = require("./config.json");
const theme = con.DESIGN.Theme;
let co;
let error;
if (theme.toLowerCase() === 'blue') {
  co = gradient([{color: "#1affa3", pos: 0.2},{color:"cyan",pos:0.4},{color:"pink",pos:0.6},{color:"cyan",pos:0.8},{color:'#1affa3',pos:1}]);
  error = chalk.red.bold;
}
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
var job = [
"FF9900","FFFF33","33FFFF","FF99FF","FF3366","FFFF66","FF00FF","66FF99","00CCFF","FF0099","FF0066","0033FF","FF9999","00FF66","00FFFF","CCFFFF","8F00FF","FF00CC","FF0000","FF1100","FF3300","FF4400","FF5500","FF6600","FF7700","FF8800","FF9900","FFaa00","FFbb00","FFcc00","FFdd00","FFee00","FFff00","FFee00","FFdd00","FFcc00","FFbb00","FFaa00","FF9900","FF8800","FF7700","FF6600","FF5500","FF4400","FF3300","FF2200","FF1100"
];
var random = 
job[Math.floor(Math.random() * job.length)]      
//var express = require('express');
//const app = express();

/*const port = process.env.PORT || 3000;
app.get('/', async function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.listen(port, function () {
  console.log(chalk.hex("#" + random)(`[ MIRAI SECURITY ] -> Máy chủ đang khởi động...`));
});*/
///////////////////////////////////////
///////////////////////////////////////
//////////// Check Package ////////////
fs.readFile('package.json', 'utf8', (err, data) => {
  if (err) {   
    return;
  }
try {
    const packageJson = JSON.parse(data);
    const dependencies = packageJson.dependencies || {};
    const totalDependencies = Object.keys(dependencies).length;
logger(`Hiện tại tổng có ${totalDependencies} Package`, '[ PACKAGE ]');
  } catch (parseError) {
      };

///////////////////////////////////////
////////// CHECK LỖI MODULES //////////
///////////////////////////////////////
try {
  var files = fs.readdirSync('./modules/commands');
  files.forEach(file => {
    if (file.endsWith('.js')) {     require(`./modules/commands/${file}`);
    }
}); 
logger('Tiến Hành Check Lỗi', '[ AUTO-CHECK ]');
logger('Các Modules Hiện Không Có Lỗi', '[ AUTO-CHECK ]');
   } catch (error) {
logger('Đã Có Lỗi Tại Lệnh:', '[ AUTO-CHECK ]');
console.log(error);
   }
});
function startBot(message) {
    (message) ? logger(message, "[ Bắt đầu ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
    child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Mirai Loading - Tiến Hành Khởi Động Lại");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ Bắt đầu ]");
    });
};
const logacc = require('./acc.json');
const config = require('./config.json');
async function login(){
  if(config.ACCESSTOKEN !== "") return
  if (logacc === "") {
      return console.log('Thiếu email tài khoản');
    }
    var uid = logacc.EMAIL
    var password = logacc.PASSWORD
    var fa = logacc.OTPKEY

    var form = {
        adid: adid.v4(),
        email: uid,
        password: password,
        format: 'json',
        device_id: deviceID.v4(),
        cpl: 'true',
        family_device_id: deviceID.v4(),
        locale: 'en_US',
        client_country_code: 'US',
        credentials_type: 'device_based_login_password',
        generate_session_cookies: '1',
        generate_analytics_claim: '1',
        generate_machine_id: '1',
        currently_logged_in_userid: '0',
        try_num: "1",
        enroll_misauth: "false",
        meta_inf_fbmeta: "NO_FILE",
        source: 'login',
        machine_id: randomString(24),
        meta_inf_fbmeta: '',
        fb_api_req_friendly_name: 'authenticate',
        fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
        api_key: '882a8490361da98702bf97a021ddc14d',
        access_token: '275254692598279|585aec5b4c27376758abb7ffcb9db2af'
    }

    form.sig = encodesig(sort(form))
    var options = {
        url: 'https://b-graph.facebook.com/auth/login',
        method: 'post',
        data: form,
        transformRequest: [
            (data, headers) => {
                return require('querystring').stringify(data)
            },
        ],
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            "x-fb-friendly-name": form["fb_api_req_friendly_name"],
            'x-fb-http-engine': 'Liger',
            'user-agent': 'Mozilla/5.0 (Linux; Android 12; TECNO CH9 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/339.0.0.10.100;]',
        }
    }
    axios(options).then(i => {
      var sessionCookies = i.data.session_cookies;
        var cookies = sessionCookies.reduce((acc, cookie) => {
            acc += `${cookie.name}=${cookie.value};`
            return acc
        }, "");
            if(i.data.access_token){
              config.ACCESSTOKEN = i.data.access_token
              saveConfig(config)
            }
    }).catch(async function (error) {
        var data = error.response.data.error.error_data;
        form.twofactor_code = totp(decodeURI(fa).replace(/\s+/g, '').toLowerCase())
        form.encrypted_msisdn = ""
        form.userid = data.uid
        form.machine_id = data.machine_id
        form.first_factor = data.login_first_factor
        form.credentials_type = "two_factor"
        await new Promise(resolve => setTimeout(resolve, 2000));
        delete form.sig
        form.sig = encodesig(sort(form))
        var option_2fa = {
            url: 'https://b-graph.facebook.com/auth/login',
            method: 'post',
            data: form,
            transformRequest: [
                (data, headers) => {
                    return require('querystring').stringify(data)
                },
            ],
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-fb-http-engine': 'Liger',
                'user-agent': 'Mozilla/5.0 (Linux; Android 12; TECNO CH9 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/339.0.0.10.100;]',
            }
        }
        axios(option_2fa).then(i => {
          var sessionCookies = i.data.session_cookies;
        var cookies = sessionCookies.reduce((acc, cookie) => {
            acc += `${cookie.name}=${cookie.value};`
            return acc
        }, "");
            if(i.data.access_token){
              config.ACCESSTOKEN = i.data.access_token
              saveConfig(config)
            }
        }).catch(function (error) {
            console.log(error.response.data)

        })

    });

}

function saveConfig(data) {
  setTimeout(()=>{
    const json = JSON.stringify(data,null,4);
  fs.writeFileSync(`./config.json`, json);

  },50)
}
function randomString(length) {
    length = length || 10
    var char = 'abcdefghijklmnopqrstuvwxyz'
    char = char.charAt(
        Math.floor(Math.random() * char.length)
    )
    for (var i = 0; i < length - 1; i++) {
        char += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(
            Math.floor(36 * Math.random())
        )
    }
    return char
}
function getRandomAOV(input) {
  const randomIndex = Math.floor(Math.random() * input.length);
  return input[randomIndex];
}
function encodesig(string) {
    var data = ''
    Object.keys(string).forEach(function (info) {
        data += info + '=' + string[info]
    })
    data = md5(data + '62f8ce9f74b12f84c123cc23437a4a32')
    return data
}

function md5(string) {
    return require('crypto').createHash('md5').update(string).digest('hex')
}

function sort(string) {
    var sor = Object.keys(string).sort(),
        data = {},
        i
    for (i in sor)
        data[sor[i]] = string[sor[i]]
    return data
}
/////////////////////////////////////
const logo = 
    "██████╗░░█████╗░░█████╗░██████╗░███████╗██████╗░\n" +
    "██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗\n" +
    "██████╔╝██║░░╚═╝██║░░██║██║░░██║█████╗░░██████╔╝\n" +
    "██╔═══╝░██║░░██╗██║░░██║██║░░██║██╔══╝░░██╔══██╗\n" +
    "██║░░░░░╚█████╔╝╚█████╔╝██████╔╝███████╗██║░░██║\n" +
    "╚═╝░░░░░░╚════╝░░╚════╝░╚═════╝░╚══════╝╚═╝░░╚═╝\n";

function getRandomColors() {
  const colors1 = [
    "FF0000", 
  "FF7F00", // Cam
  "FFFF00", // Vàng
  "00FF00", // Xanh lá
  "0000FF", // Xanh dương
  "4B0082", // Chàm
  "9400D3"
  ];
  
  const randomColors = [];
  while (randomColors.length < 7) {
    const randomIndex = Math.floor(Math.random() * colors1.length);
    const randomColor = colors1[randomIndex];
    if (!randomColors.includes(randomColor)) {
      randomColors.push(randomColor);
    }
  }
  return randomColors;
}

const randomColors = getRandomColors();
const coloredData = gradient(...randomColors).multiline(logo);
console.log(chalk(coloredData));
////////////////////////////////////////////
async function startb(){
  if(config.ACCESSTOKEN !== "") {
    startBot();
  } else {
    login()
    setTimeout(()=>{
      startBot();
    },7000)
  }
}
startb()
