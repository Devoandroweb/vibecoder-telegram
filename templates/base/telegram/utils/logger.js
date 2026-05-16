const { default: chalk } = require('chalk');

function timestamp() {
  return new Date().toISOString();
}

function logInfo(message) {
  console.log(chalk.cyan(`[${timestamp()}] INFO   `) + message);
}

function logWarning(message) {
  console.warn(chalk.yellow(`[${timestamp()}] WARN   `) + message);
}

function logError(message) {
  console.error(chalk.red(`[${timestamp()}] ERROR  `) + message);
}

module.exports = {
  timestamp,
  logInfo,
  logWarning,
  logError,
  info: logInfo,
  warn: logWarning,
  error: logError
};
