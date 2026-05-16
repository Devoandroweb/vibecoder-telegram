#!/usr/bin/env node

const path = require('path');
const { program } = require('commander');
const { initProject } = require('../src/init');
const pkg = require('../package.json');

program
  .name('vibecoder-telegram')
  .description('Scaffold a Telegram-based coding assistant into an existing Node.js project.')
  .version(pkg.version);

program
  .command('init [target]')
  .description('Initialize a Telegram assistant in the current or target directory')
  .option('-s, --starter', 'Create a starter project (full scaffold)')
  .action(async (target, options) => {
    try {
      await initProject(target, options || {});
    } catch (error) {
      console.error('Initialization failed:', error.message);
      process.exit(1);
    }
  });

if (!process.argv.slice(2).length) {
  program.help();
}

program.parse(process.argv);
