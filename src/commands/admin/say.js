'use strict';

const { buildSayPayload, sayLimit } = require('../../utils/say');

module.exports = {
  name: 'say',
  aliases: ['speak'],
  description: 'Makes the bot say something. Use -e / --embed for an embed.',
  category: 'admin',
  adminOnly: true,
  usage: '!say [-e|--embed] <text>',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  execute(client, message, args) {
    let embed = false;
    const first = (args[0] || '').toLowerCase();
    if (first === '-e' || first === '--embed' || first === 'embed') {
      embed = true;
      args.shift();
    }

    const text = args.join(' ').trim();
    if (!text) {
      return message.reply(`Usage: ${client.config.prefix}say [-e|--embed] <text>`);
    }

    const limit = sayLimit(embed);
    if (text.length > limit) {
      return message.reply(`❌ Text too long: ${text.length}/${limit} characters.`);
    }

    return message.channel.send(buildSayPayload(text, { embed }));
  },
};
