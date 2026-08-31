'use strict';

const { ChannelType } = require('discord.js');
const { isAdmin } = require('../utils/permissions');
const logger = require('../utils/logger');

/**
 * Guild text-channel only.
 */
function isTextChannel(channel) {
  return channel.type === ChannelType.GuildText;
}

module.exports = {
  name: 'messageCreate',

  execute(client, message) {
    // Never react to bots or DMs (commands are guild-only).
    if (message.author.bot || !message.guild) return;
    if (!isTextChannel(message.channel)) return;

    const { prefix } = client.config;
    if (!prefix || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift();
    if (!commandName) return;

    const command = client.findCommand(commandName);
    if (!command) return;

    // ── Admin gate: EVERY command is admin-only ─────────────
    if (command.adminOnly && !isAdmin(message.member, client.config)) {
      return message.reply('❌ You do not have permission to use this command (admins only).');
    }

    try {
      return Promise.resolve(command.execute(client, message, args)).catch((error) => {
        logger.error(`Command "${command.name}" failed: ${error.stack || error.message}`);
        return message.reply(`❌ An error occurred while running the command: ${error.message}`);
      });
    } catch (error) {
      logger.error(`Command "${command.name}" threw: ${error.stack || error.message}`);
      return message.reply('❌ An unexpected error occurred while running the command.');
    }
  },
};
