import chalk from 'chalk';

export function info(text) {
  console.log(chalk.cyanBright('[+]') + ' - ' + text);
}
export function notOk(text) {
  console.log(chalk.redBright('[-]') + ' - ' + text);
}
export function warn(text) {
  console.log(chalk.yellowBright('[!]') + ' - ' + text);
}
