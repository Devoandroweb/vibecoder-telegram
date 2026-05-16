const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = async function handleVibe(bot, msg, targetPath, allowedIds, openEditorCommand, logger) {
  const chatId = String(msg.chat.id);

  if (!allowedIds.includes(chatId)) {
    await bot.sendMessage(chatId, 'Unauthorized. /vibe is restricted to the configured ALLOWED_CHAT_ID.');
    logger.warn(`Denied /vibe access for ${chatId}`);
    return;
  }

  const normalizedPath = targetPath && targetPath.trim() ? targetPath.trim() : 'vibe.js';
  const absolutePath = path.resolve(process.cwd(), normalizedPath);
  const directory = path.dirname(absolutePath);

  await fs.promises.mkdir(directory, { recursive: true });

  if (!fs.existsSync(absolutePath)) {
    await fs.promises.writeFile(
      absolutePath,
      `// Vibe coding session started on ${new Date().toISOString()}\n// Use this file to capture ideas, code snippets, or starter logic.\n\n`,
      'utf8'
    );
  }

  await bot.sendMessage(chatId, `Let's vibe! File created/opened: ${path.relative(process.cwd(), absolutePath)}`);
  logger.info(`Started vibe file: ${absolutePath}`);

  exec(`${openEditorCommand} "${absolutePath}"`, (err) => {
    if (err) {
      logger.warn(`Could not open editor with command '${openEditorCommand}': ${err.message}`);
    } else {
      logger.info(`Opened vibe file in editor: ${absolutePath}`);
    }
  });
};