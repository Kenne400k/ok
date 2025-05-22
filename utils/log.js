const chalk = require('chalk');
const gradient = require('gradient-string');
const con = require('./../config.json');
const theme = con.DESIGN.Theme;
let co;
let error;

switch ((theme || '').toLowerCase()) {
  case 'blue':
    co = gradient([{color: "#1affa3", pos: 0.2},{color:"cyan",pos:0.4},{color:"pink",pos:0.6},{color:"cyan",pos:0.8},{color:'#1affa3',pos:1}]);
    error = chalk.red.bold;
    break;
  case 'dream2':
    co = gradient("#a200ff","#21b5ff","#a200ff");
    error = chalk.red.bold;
    break;
  case 'dream':
    co = gradient([{color: "blue", pos: 0.2},{color:"pink",pos:0.3},{color:"gold",pos:0.6},{color:"pink",pos:0.8},{color: "blue", pos:1}]);
    error = chalk.red.bold;
    break;
  case 'test':
    co = gradient("#243aff", "#4687f0", "#5800d4", "#243aff", "#4687f0", "#5800d4", "#243aff", "#4687f0", "#5800d4", "#243aff", "#4687f0", "#5800d4");
    error = chalk.red.bold;
    break;
  case 'fiery':
    co = gradient("#fc2803", "#fc6f03", "#fcba03");
    error = chalk.red.bold;
    break;
  case 'rainbow':
    co = gradient.rainbow;
    error = chalk.red.bold;
    break;
  case 'pastel':
    co = gradient.pastel;
    error = chalk.red.bold;
    break;
  case 'cristal':
    co = gradient.cristal;
    error = chalk.red.bold;
    break;
  case 'red':
    co = gradient("red", "orange");
    error = chalk.red.bold;
    break;
  case 'aqua':
    co = gradient("#0030ff", "#4e6cf2");
    error = chalk.blueBright;
    break;
  case 'pink':
    co = gradient("#d94fff", "purple");
    error = chalk.red.bold;
    break;
  case 'retro':
    co = gradient.retro;
    error = chalk.red.bold;
    break;
  case 'sunlight':
    co = gradient("orange", "#ffff00", "#ffe600");
    error = chalk.red.bold;
    break;
  case 'teen':
    co = gradient.teen;
    error = chalk.red.bold;
    break;
  case 'summer':
    co = gradient.summer;
    error = chalk.red.bold;
    break;
  case 'flower':
    co = gradient.pastel;
    error = chalk.red.bold;
    break;
  case 'ghost':
    co = gradient.mind;
    error = chalk.red.bold;
    break;
  case 'hacker':
    co = gradient('#47a127', '#0eed19', '#27f231');
    error = chalk.green.bold;
    break;
  default:
    co = gradient("#243aff", "#4687f0", "#5800d4");
    error = chalk.red.bold;
    break;
}


// Main logger function
module.exports = (data, option = "INFO") => {
  let icon = '';
  let tag = '';
  let msg = '';
  switch ((option || '').toLowerCase()) {
    case 'warn':
      icon = chalk.bgYellow.black.bold('⚠');
      tag = co('[ WARN ]');
      msg = chalk.bgYellow.black.bold(` ${data} `);
      break;
    case 'error':
      icon = chalk.bgRed.white.bold('✖');
      tag = co('[ ERROR ]');
      msg = chalk.bgRed.white.bold(` ${data} `);
      break;
    case 'success':
      icon = chalk.bgGreen.white.bold('✔');
      tag = co('[ SUCCESS ]');
      msg = chalk.bgGreen.white.bold(` ${data} `);
      break;
    case 'info':
      icon = chalk.bgCyan.black.bold('ℹ');
      tag = co('[ INFO ]');
      msg = chalk.bgCyan.black.bold(` ${data} `);
      break;
    default:
      icon = chalk.bgMagenta.white.bold('•');
      tag = co(`${option.toUpperCase()}`);
      msg = chalk.bgMagenta.white.bold(` ${data} `);
      break;
  }
  console.log(`${icon} ${tag} ${msg}`);
};

// Loader logger function
module.exports.loader = (data, option = "info") => {
  let icon = '';
  let tag = co('[ PCODER ]');
  let msg = '';
  switch ((option || '').toLowerCase()) {
    case 'warn':
      icon = chalk.bgYellow.black.bold('⚠');
      msg = chalk.bgYellow.black.bold(` ${data} `);
      break;
    case 'error':
      icon = chalk.bgRed.white.bold('✖');
      msg = chalk.bgRed.white.bold(` ${data} `);
      break;
    case 'success':
      icon = chalk.bgGreen.white.bold('✔');
      msg = chalk.bgGreen.white.bold(` ${data} `);
      break;
    default:
      icon = chalk.bgCyan.black.bold('ℹ');
      msg = chalk.bgCyan.black.bold(` ${data} `);
      break;
  }
  console.log(`${icon} ${tag} ${msg}`);
};

// Extra: Success log shortcut
module.exports.success = (data) => {
  const coloredData = chalk.greenBright('[ SUCCESS ] - ') + chalk.white(data);
  console.log(coloredData);
};