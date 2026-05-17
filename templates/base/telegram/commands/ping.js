export default async function handlePing(bot, msg, logger) {
  const chatId = msg.chat.id;
  const timestamp = new Date().toISOString();
  await bot.sendMessage(chatId, `Pong! Bot is online. ${timestamp}`);
  logger.info(`Received /ping from ${chatId}`);
};
