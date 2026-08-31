'use strict';

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const panel = require('../../content/mmpanel');

module.exports = {
  name: 'mmpanel',
  description: 'Sends the Middleman Service panel with a "Request Middleman" button.',
  category: 'admin',
  adminOnly: true,
  usage: '!mmpanel',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(panel.color)
      .setDescription(panel.description);

    const button = new ButtonBuilder()
      .setCustomId(panel.button.customId)
      .setLabel(panel.button.label)
      .setStyle(ButtonStyle.Primary) // blue
      .setEmoji(panel.button.emoji);

    const row = new ActionRowBuilder().addComponents(button);

    return message.channel.send({ embeds: [embed], components: [row] });
  },
};
