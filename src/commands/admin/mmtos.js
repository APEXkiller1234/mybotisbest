'use strict';

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const panel = require('../../content/mmtosPanel');

module.exports = {
  name: 'mmtos',
  description: 'Posts the Middleman ToS panel with a "View ToS" button.',
  category: 'admin',
  adminOnly: true,
  usage: '!mmtos',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  execute(client, message, args) {
    // Use the configured manual-middleman channel; fall back to where the
    // command was run so the panel still works out of the box.
    const channelId = client.config.channels.mmRequestChannelId || message.channel.id;

    const button = new ButtonBuilder()
      .setCustomId(panel.button.customId)
      .setLabel(panel.button.label)
      .setStyle(ButtonStyle.Primary); // blue

    const row = new ActionRowBuilder().addComponents(button);

    return message.channel.send({
      content: panel.messageText.replace('{channel}', `<#${channelId}>`),
      components: [row],
    });
  },
};
