'use strict';

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cart = require('../../content/cart');

module.exports = {
  name: 'cart',
  description: 'Posts a button that reveals the Jace\'s links + service card (ephemeral).',
  category: 'admin',
  adminOnly: true,
  usage: '!cart',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  execute(client, message, args) {
    const cfg = client.config.cart || {};

    const button = new ButtonBuilder()
      .setCustomId(cart.button.customId)
      .setLabel(cfg.buttonLabel || cart.button.label)
      .setEmoji(cfg.buttonEmoji || cart.button.emoji)
      .setStyle(ButtonStyle.Primary); // blue

    const row = new ActionRowBuilder().addComponents(button);

    return message.channel.send({ components: [row] });
  },
};
