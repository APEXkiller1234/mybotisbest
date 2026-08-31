'use strict';

const servers = require('../../content/servers');
const jmsService = require('../../content/jmsService');

module.exports = {
  name: 'servers',
  description: 'Posts all server invites (auto-rendered cards) + the Middleman Service embed.',
  category: 'admin',
  adminOnly: true,
  usage: '!servers',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  async execute(client, message, args) {
    const cfg = client.config.servers || {};

    // ── Message 1: invite links (one per line) ──────────────────
    // Discord auto-renders each invite as a guild card below the text.
    const invites =
      Array.isArray(cfg.inviteUrls) && cfg.inviteUrls.length > 0
        ? cfg.inviteUrls.map(String)
        : servers.invitationUrls;

    await message.channel.send({ content: invites.join('\n') });

    // ── Message 2: "All links..." line + Middleman Service embed ─
    const websiteUrl = cfg.websiteUrl || servers.websiteUrl;
    const allLinksLine = (cfg.allLinksText || servers.allLinksLine).replace(
      '{websiteUrl}',
      websiteUrl,
    );

    const embedding = jmsService.buildEmbed(
      cfg.embedThumbnailUrl || jmsService.thumbnailUrl,
    );

    return message.channel.send({
      content: allLinksLine,
      embeds: [embedding],
    });
  },
};
