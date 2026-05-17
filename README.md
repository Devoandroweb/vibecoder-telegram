# vibecoder-telegram

A CLI scaffolder that adds a Telegram-based coding assistant into an existing Node.js project.

## Features

- `npx vibecoder-telegram init`
- `npx vibecoder-telegram init my-project`
- Generates `telegram/` folder with modular commands and utilities
- Generates `.env.example`
- Injects bot scripts into target `package.json`
- Automatically installs required runtime dependencies
- Includes error handling, timestamp logging, and VS Code file creation support

## Installation

Use `npx` directly without installing globally:

```bash
npx vibecoder-telegram init
```

Or generate into a target folder:

```bash
npx vibecoder-telegram init my-project
```

## Usage

Run the CLI in the target project directory:

```bash
cd existing-node-project
npx vibecoder-telegram init
```

If you want to scaffold into another path:

```bash
npx vibecoder-telegram init path/to/project
```

If you already installed an older scaffold and want to refresh Telegram files and scripts after upgrading the package:

```bash
npx vibecoder-telegram init --force
```

Or for a specific target:

```bash
npx vibecoder-telegram init path/to/project --force
```

## Generated bot commands

- `/ping` — test bot online
- `/cmd <shell command>` — execute command and return stdout/stderr
- `/new <relative/file/path>` — create a file recursively and open it in VS Code
- `/vibe [relative/file/path]` — start a vibe coding session by creating/opening a file and launching the editor
- `/prompt <your Copilot prompt>` — create a prompt file and open it in VS Code so GitHub Copilot can continue the coding flow
- `/copilot [--allow-all] <task or question>` — run GitHub Copilot CLI directly from Telegram and return the result

## Required environment

Copy `.env.example` to `.env` and set values:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
ALLOWED_CHAT_ID=123456789
OPEN_EDITOR_COMMAND=code
COPILOT_COMMAND=gh copilot
COPILOT_ALLOW_ALL=false
```

Set `COPILOT_ALLOW_ALL=true` if you want the bot to prepend `/allow-all` automatically on every `/copilot` request.
You can also enable it per request by using `/copilot --allow-all <task>`.

## Target package scripts

The initializer injects these scripts into the target `package.json`:

- `telegram:start`
- `telegram:env`


## Notes

- The generated bot uses polling via `node-telegram-bot-api`.
- `/cmd`, `/new`, and `/copilot` commands are restricted to `ALLOWED_CHAT_ID` for security.
- `OPEN_EDITOR_COMMAND` defaults to `code` for VS Code integration.
- `COPILOT_COMMAND` defaults to `gh copilot`; make sure GitHub CLI and Copilot CLI are installed and authenticated before using `/copilot`.
