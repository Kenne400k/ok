const chalk = require('chalk');
const gradient = require('gradient-string');
const con = require('./../config.json');
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
module.exports = (data, option) => {
  let coloredData = '';

  switch (option) {
    case 'warn':
      coloredData = gradient('#3aed34', '#c2ed34').multiline('[ WARN ] - ' + data);
      console.log(chalk.red(coloredData));
      break;
    case 'error':
      coloredData = chalk.bold.hex('#FF0000')('[ ERROR ] - ') + chalk.bold.red(data);
      console.log(coloredData);
      break;
    default:
      coloredData = co(`${option} - ` + data);
 console.log(chalk.red(coloredData));
      break;
  }
};
module.exports.loader = (data, option) => {
  let coloredData = '';

  switch (option) {
    case 'warn':
      coloredData = co('[ PCODER ] - ' + data);
      console.log(chalk.bold(coloredData));
      break;
    case 'error':
      coloredData = co('[ PCODER ] - ') + data;
      console.log(chalk.bold(coloredData));
      break;
    default:
      coloredData = co('[ PCODER ] - ' + data);
      console.log(chalk.bold(coloredData));
      break;
  }
};
