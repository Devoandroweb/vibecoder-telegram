import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export default async function handleNew(bot, msg, targetPath, allowedIds, openEditorCommand, logger) {
  const chatId = String(msg.chat.id);

  if (!allowedIds.includes(chatId)) {
    await bot.sendMessage(chatId, 'Unauthorized. /new is restricted to the configured ALLOWED_CHAT_ID.');
    logger.warn(`Denied /new access for ${chatId}`);
    return;
  }

  if (!targetPath || !targetPath.trim()) {
    await bot.sendMessage(chatId, 'Usage: /new relative/path/to/file.js');
    return;
  }

  const normalizedPath = targetPath.trim();
  const absolutePath = path.resolve(process.cwd(), normalizedPath);
  const directory = path.dirname(absolutePath);

  await fs.promises.mkdir(directory, { recursive: true });

  if (!fs.existsSync(absolutePath)) {
    await fs.promises.writeFile(
      absolutePath,
      `// Created by Vibe Coder Telegram on ${new Date().toISOString()}\n\n`,
      'utf8'
    );
  }

  await bot.sendMessage(chatId, `Created file: ${path.relative(process.cwd(), absolutePath)}`);
  logger.info(`Created new file: ${absolutePath}`);

  exec(`${openEditorCommand} "${absolutePath}"`, (err) => {
    if (err) {
      logger.warn(`Could not open editor with command '${openEditorCommand}': ${err.message}`);
    } else {
      logger.info(`Opened file in editor: ${absolutePath}`);
    }
  });
};
