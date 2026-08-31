'use strict';

const { EmbedBuilder } = require('discord.js');
const rules = require('../../content/rules');

module.exports = {
  name: 'rules',
  description: 'Sends the server rules as an embed.',
  category: 'admin',
  adminOnly: true,
  usage: '!rules',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(rules.embedColor)
      .setTitle(rules.embedTitle)
      .setDescription(rules.description);

    return message.channel.send({ embeds: [embed] });
  },
};
