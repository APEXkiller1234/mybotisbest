'use strict';

/**
 * Exact content for the `!servers` command.
 *
 * Message 1: every server invite, one per line.
 *   Discord automatically renders each invite as a guild card
 *   (Jace's MM Service / JMS 2 / Jace's Market / JMS Stock).
 *
 * Message 2: "All links can be found at {websiteUrl}" + the
 *   Jace's Middleman Service embed.
 */
module.exports = {
  invitationUrls: [
    'https://discord.gg/KdXDqvdayx', // Jace's MM Service (Auto & Manual)
    'https://discord.gg/8ueB68BGqn', // JMS 2 (Auto)
    'https://discord.gg/fQbPUNvCFx', // Jace's Market
    'https://discord.gg/VYWmqpTVq4', // JMS Stock (corrected)
  ],
  websiteUrl: 'https://jaces.xyz/',
  allLinksLine: 'All links can be found at {websiteUrl}',
};
