'use strict';

const { ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,

  async execute(client) {
    logger.info(`Logged in as ${client.user.tag} (${client.user.id})`);
    logger.info(`Serving ${client.guilds.cache.size} guild(s)`);

    client.user.setActivity(`${client.config.prefix}rules`, {
      type: ActivityType.Watching,
    });

    // Register slash commands (guild commands when guildId is set).
    try {
      await client.registerSlashCommands();
    } catch (error) {
      logger.error(`Slash command registration failed: ${error.message}`);
    }
  },
};
