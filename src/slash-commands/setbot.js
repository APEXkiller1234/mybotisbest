'use strict';

const { ApplicationCommandOptionType } = require('discord.js');
const {
  applyPresence,
  parseStatus,
  parseActivityType,
  activityLabel,
  statusLabel,
} = require('../utils/presence');
const logger = require('../utils/logger');

module.exports = {
  name: 'setbot',
  description: 'Sets the bot status and/or the activity it is playing/watching.',
  options: [
    {
      name: 'status',
      description: 'Bot status: online, idle, dnd or invisible.',
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: 'Online', value: 'online' },
        { name: 'Idle', value: 'idle' },
        { name: 'Do Not Disturb', value: 'dnd' },
        { name: 'Invisible', value: 'invisible' },
      ],
    },
    {
      name: 'type',
      description: 'Activity type: playing, watching, listening, competing, streaming, custom.',
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: 'Playing', value: 'playing' },
        { name: 'Watching', value: 'watching' },
        { name: 'Listening to', value: 'listening' },
        { name: 'Competing in', value: 'competing' },
        { name: 'Streaming', value: 'streaming' },
        { name: 'Custom Status', value: 'custom' },
        { name: 'Clear Activity', value: 'clear' },
      ],
    },
    {
      name: 'text',
      description: 'What the bot is playing/watching (e.g. "Roblox traders").',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'url',
      description: 'URL required for streaming activity (e.g. a Twitch channel).',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  adminOnly: true,

  /**
   * @param {import('../structures/BotClient')} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(client, interaction) {
    const statusRaw = interaction.options.getString('status');
    const typeRaw = interaction.options.getString('type');
    const text = interaction.options.getString('text');
    const url = interaction.options.getString('url');

    const status = statusRaw ? parseStatus(statusRaw) : undefined;
    const type = typeRaw ? parseActivityType(typeRaw) : undefined;

    if (!status && !type) {
      return interaction.reply({
        content: '❌ Provide at least one option: `status` and/or `type`.',
        ephemeral: true,
      });
    }

    try {
      const { data, error } = await applyPresence(client, { status, type, text, url });

      if (error) {
        return interaction.reply({ content: `❌ ${error}`, ephemeral: true });
      }

      const parts = [];
      if (status) parts.push(`Status **${statusLabel(status)}**`);
      if (type === 'clear') {
        parts.push('Activity cleared');
      } else if (type && text) {
        parts.push(`${activityLabel(type)} **${text}**`);
      }

      return interaction.reply({
        content: `✅ ${parts.join(' · ')}`,
        ephemeral: true,
      });
    } catch (error) {
      logger.error(`/setbot failed: ${error.stack || error.message}`);
      return interaction
        .reply({
          content: `❌ Could not update presence: ${error.message}`,
          ephemeral: true,
        })
        .catch(() => {});
    }
  },
};
