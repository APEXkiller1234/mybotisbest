'use strict';

const content = require('../../content/leaderboard');
const { formatLastUpdated } = require('../../utils/time');
const { resolveImage } = require('../../utils/images');

module.exports = {
  name: 'leaderboard',
  description: 'Posts the middleman leaderboard (lifetime + monthly images).',
  category: 'admin',
  adminOnly: true,
  usage: '!leaderboard',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   */
  async execute(client, message) {
    const lb = client.config.leaderboard;

    const top3Role = lb.top3RoleId ? `<@&${lb.top3RoleId}>` : 'Top 3 Clients';
    const top10Role = lb.top10RoleId ? `<@&${lb.top10RoleId}>` : 'Top 10 Clients';
    const reqChannel = client.config.channels.mmRequestChannelId
      ? `<#${client.config.channels.mmRequestChannelId}>`
      : 'the mm-req channel';

    const roleNote = content.roleNote
      .replaceAll('{top3Role}', top3Role)
      .replaceAll('{top10Role}', top10Role);
    const manualNote = content.manualNote.replaceAll('{channel}', reqChannel);

    // "Last Updated: August 31, 2026 at 12:05 AM" (override with
    // leaderboard.lastUpdated if the image has a fixed timestamp).
    const lastUpdated = lb.lastUpdated || formatLastUpdated(new Date());

    const lifetimeImage = await resolveImage({
      url: lb.lifetimeImageUrl,
      filePath: lb.lifetimeImagePath,
      name: 'leaderboard-lifetime',
    });
    const monthlyImage = await resolveImage({
      url: lb.monthlyImageUrl,
      filePath: lb.monthlyImagePath,
      name: 'leaderboard-monthly',
    });

    // Message 1: header + lifetime image (like the screenshot).
    await message.channel.send({
      content: `${content.lastUpdatedPrefix}${lastUpdated}`,
      files: lifetimeImage ? [lifetimeImage] : [],
    });

    // Message 2: role/notes text + monthly image (like the screenshot).
    await message.channel.send({
      content: `${roleNote}\n${manualNote}`,
      files: monthlyImage ? [monthlyImage] : [],
    });
  },
};
