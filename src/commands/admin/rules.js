'use strict';

const rulesText = require('../../content/rules');

module.exports = {
  name: 'rules',
  description: 'Sends the server rules.',
  category: 'admin',
  adminOnly: true,
  usage: '!rules',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  execute(client, message, args) {
    return message.channel.send(rulesText);
  },
};
