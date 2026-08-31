'use strict';

const path = require('node:path');
const BotClient = require('./structures/BotClient');
const config = require('./config');
const logger = require('./utils/logger');

// ── Validate configuration ────────────────────────────────
if (!config.token) {
  logger.error('DISCORD_TOKEN is missing. Copy .env.example to .env and add your bot token.');
  logger.error('Get a token at https://discord.com/developers/applications');
  process.exit(1);
}
if (!config.prefix) {
  logger.error('PREFIX cannot be empty.');
  process.exit(1);
}

// ── Boot the client ────────────────────────────────────────
const client = new BotClient(config);

client
  .loadCommands(path.join(__dirname, 'commands'))
  .loadSlashCommands(path.join(__dirname, 'slash-commands'))
  .loadEvents(path.join(__dirname, 'events'))
  .login(config.token)
  .then(() => logger.info('Bot is online ✓'))
  .catch((error) => {
    logger.error(`Login failed: ${error.message}`);
    process.exit(1);
  });

// Graceful shutdown on Ctrl+C.
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  client.destroy();
  process.exit(0);
});
