'use strict';

const { EmbedBuilder } = require('discord.js');
const cart = require('../../content/cart');
const { resolveImage } = require('../../utils/images');

module.exports = {
  name: 'cart',
  description: 'Posts the Jace\'s Middleman Service card (website, invite, embed).',
  category: 'admin',
  adminOnly: true,
  usage: '!cart',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  async execute(client, message, args) {
    const cfg = client.config.cart || {};

    const content = [
      cfg.websiteUrl || cart.websiteUrl,
      cfg.inviteUrl || cart.inviteUrl,
    ].join('\n');

    const embed = new EmbedBuilder()
      .setColor(cart.embedColor)
      .setTitle(cart.embedTitle)
      .setDescription(cart.embedDescription)
      .setFooter({ text: cart.embedFooter });

    // Optional banner attached above the embeds (like the screenshot).
    const image = await resolveImage({
      url: cfg.imageUrl,
      filePath: cfg.imagePath,
      name: 'jms-banner',
    });

    return message.channel.send({
      content,
      embeds: [embed],
      files: image ? [image] : [],
    });
  },
};
