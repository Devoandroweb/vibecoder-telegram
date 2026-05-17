import chalk from 'chalk';

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info: (message) => console.log(chalk.cyan(`[${timestamp()}] INFO   `) + message),
  warn: (message) => console.warn(chalk.yellow(`[${timestamp()}] WARN   `) + message),
  error: (message) => console.error(chalk.red(`[${timestamp()}] ERROR  `) + message),
};

export default logger;
