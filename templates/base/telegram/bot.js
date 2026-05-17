import path from 'path';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import logger from './utils/logger.js';
import handleCmd from './commands/cmd.js';
import handleNew from './commands/new.js';
import handlePing from './commands/ping.js';
import handleVibe from './commands/vibe.js';
import handlePrompt from './commands/prompt.js';
import handleCopilot from './commands/copilot.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const allowedIds = (process.env.ALLOWED_CHAT_ID || '').split(',').map((id) => id.trim()).filter(Boolean);
const openEditorCommand = process.env.OPEN_EDITOR_COMMAND || 'code';

if (!token) {
  logger.error('TELEGRAM_BOT_TOKEN is required in .env');
  process.exit(1);
}

if (!allowedIds.length) {
  logger.warn('ALLOWED_CHAT_ID is not configured. /cmd, /new, /vibe, /prompt, and /copilot will be disabled until it is set.');
}

const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', (error) => {
  logger.error('Polling error: ' + error.message);
});

bot.onText(/\/ping\b/, async (msg) => {
  await handlePing(bot, msg, logger);
});

bot.onText(/\/cmd(?:\s+([\s\S]+))?/, async (msg, match) => {
  try {
    await handleCmd(bot, msg, match ? match[1] : '', allowedIds, logger);
  } catch (error) {
    await bot.sendMessage(msg.chat.id, `Error executing command: ${error.message}`);
    logger.error(error.message);
  }
});

bot.onText(/\/new(?:\s+([\s\S]+))?/, async (msg, match) => {
  try {
    await handleNew(bot, msg, match ? match[1] : '', allowedIds, openEditorCommand, logger);
  } catch (error) {
    await bot.sendMessage(msg.chat.id, `Error creating file: ${error.message}`);
    logger.error(error.message);
  }
});

bot.onText(/\/vibe(?:\s+([\s\S]+))?/, async (msg, match) => {
  try {
    await handleVibe(bot, msg, match ? match[1] : '', allowedIds, openEditorCommand, logger);
  } catch (error) {
    await bot.sendMessage(msg.chat.id, `Error creating vibe file: ${error.message}`);
    logger.error(error.message);
  }
});

bot.onText(/\/prompt(?:\s+([\s\S]+))?/, async (msg, match) => {
  try {
    await handlePrompt(bot, msg, match ? match[1] : '', allowedIds, openEditorCommand, logger);
  } catch (error) {
    await bot.sendMessage(msg.chat.id, `Error creating prompt file: ${error.message}`);
    logger.error(error.message);
  }
});

bot.onText(/\/copilot(?:\s+([\s\S]+))?/, async (msg, match) => {
  try {
    await handleCopilot(bot, msg, match ? match[1] : '', allowedIds, logger);
  } catch (error) {
    await bot.sendMessage(msg.chat.id, `Error running Copilot CLI: ${error.message}`);
    logger.error(error.message);
  }
});

bot.on('message', (msg) => {
  const text = msg.text || '';
  if (!text.startsWith('/')) {
    return;
  }

  if (!/\/(ping|cmd|new|vibe|prompt|copilot)\b/.test(text)) {
    bot.sendMessage(msg.chat.id, 'Command not recognized. Use /ping, /cmd, /new, /vibe, /prompt, or /copilot.');
  }
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection: ' + String(error));
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception: ' + String(error));
});

logger.info('Telegram coding assistant started. Waiting for messages...');
