const chalk = require('chalk');
const err = (exp) => console.log(chalk.red(`======${exp}======`));
const info = (exp) => console.log(`======${exp}======`);
const warn = (exp) => console.log(chalk.yellow(`======${exp}======`));
const success = (exp) => console.log(chalk.green(`======${exp}======`));

module.exports = {
  err,
  info,
  warn,
  success
}