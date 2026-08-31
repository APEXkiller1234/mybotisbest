'use strict';

const { ApplicationCommandOptionType } = require('discord.js');
const { buildSayPayload, sayLimit } = require('../utils/say');
const logger = require('../utils/logger');

module.exports = {
  name: 'say',
  description: 'Makes the bot say something (optional embed).',
  options: [
    {
      name: 'text',
      description: 'What the bot should say.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'embed',
      description: 'Send it as an embed instead of plain text (default: false).',
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
  adminOnly: true,

  /**
   * @param {import('../structures/BotClient')} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(client, interaction) {
    const text = interaction.options.getString('text', true).trim();
    const embed = interaction.options.getBoolean('embed') ?? false;

    if (!text) {
      return interaction.reply({
        content: '❌ You need to provide some text.',
        ephemeral: true,
      });
    }

    const limit = sayLimit(embed);
    if (text.length > limit) {
      return interaction.reply({
        content: `❌ Text too long: ${text.length}/${limit} characters.`,
        ephemeral: true,
      });
    }

    try {
      await interaction.reply(buildSayPayload(text, { embed }));
    } catch (error) {
      logger.error(`/say failed: ${error.stack || error.message}`);
      await interaction
        .reply({ content: '❌ Something went wrong while saying that.', ephemeral: true })
        .catch(() => {});
    }
  },
};
