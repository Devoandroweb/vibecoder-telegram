const { runShellCommand } = require('../utils/exec');

function formatOutput(value) {
  if (!value) {
    return 'No output was produced.';
  }

  return value.length > 3800 ? `${value.slice(0, 3800)}\n\n[Output truncated]` : value;
}

module.exports = async function handleCmd(bot, msg, commandText, allowedIds, logger) {
  const chatId = String(msg.chat.id);

  if (!allowedIds.includes(chatId)) {
    await bot.sendMessage(chatId, 'Unauthorized. /cmd is restricted to the configured ALLOWED_CHAT_ID.');
    logger.warn(`Denied /cmd access for ${chatId}`);
    return;
  }

  if (!commandText || !commandText.trim()) {
    await bot.sendMessage(chatId, 'Usage: /cmd <shell command>');
    return;
  }

  logger.info(`Running command from ${chatId}: ${commandText}`);
  const result = await runShellCommand(commandText);

  if (result.error) {
    await bot.sendMessage(chatId, `Command finished with error:\n\n${formatOutput(result.stderr || result.error.message)}`);
    logger.warn(`Command error: ${result.error.message}`);
    return;
  }

  await bot.sendMessage(chatId, `Command output:\n\n${formatOutput(result.stdout)}`);
  logger.info('Command completed successfully.');
};
