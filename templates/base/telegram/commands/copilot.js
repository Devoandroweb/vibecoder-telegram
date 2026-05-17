import { runShellCommand } from '../utils/exec.js';

function formatOutput(value) {
  if (!value) {
    return 'No output was produced.';
  }

  return value.length > 3800 ? `${value.slice(0, 3800)}\n\n[Output truncated]` : value;
}

function shellSingleQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function parsePromptOptions(input) {
  const value = (input || '').trim();
  if (!value) {
    return { prompt: '', allowAll: false };
  }

  if (value.startsWith('--allow-all ')) {
    return {
      prompt: value.slice('--allow-all '.length).trim(),
      allowAll: true
    };
  }

  if (value === '--allow-all') {
    return { prompt: '', allowAll: true };
  }

  return { prompt: value, allowAll: false };
}

export default async function handleCopilot(bot, msg, promptText, allowedIds, logger) {
  const chatId = String(msg.chat.id);

  if (!allowedIds.includes(chatId)) {
    await bot.sendMessage(chatId, 'Unauthorized. /copilot is restricted to the configured ALLOWED_CHAT_ID.');
    logger.warn(`Denied /copilot access for ${chatId}`);
    return;
  }

  const parsed = parsePromptOptions(promptText);
  if (!parsed.prompt) {
    await bot.sendMessage(chatId, 'Usage: /copilot [--allow-all] <task or question for GitHub Copilot CLI>');
    return;
  }

  const copilotCommand = process.env.COPILOT_COMMAND || 'gh copilot';
  const envAllowAll = /^true$/i.test((process.env.COPILOT_ALLOW_ALL || '').trim());
  const useAllowAll = envAllowAll || parsed.allowAll;
  const promptPayload = useAllowAll ? `/allow-all\n${parsed.prompt}` : parsed.prompt;
  const command = `${copilotCommand} -p ${shellSingleQuote(promptPayload)}`;

  logger.info(`Running Copilot CLI from ${chatId}: ${parsed.prompt}${useAllowAll ? ' [allow-all]' : ''}`);
  const result = await runShellCommand(command);

  if (result.error) {
    await bot.sendMessage(chatId, `Copilot CLI finished with error:\n\n${formatOutput(result.stderr || result.error.message)}`);
    logger.warn(`Copilot CLI error: ${result.error.message}`);
    return;
  }

  await bot.sendMessage(chatId, `Copilot CLI output:\n\n${formatOutput(result.stdout || result.stderr)}`);
  logger.info('Copilot CLI completed successfully.');
};