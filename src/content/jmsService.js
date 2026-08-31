'use strict';

const { EmbedBuilder } = require('discord.js');

/**
 * Shared "Jace's Middleman Service" embed used by !cart and !servers.
 * Matches the reference screenshots 101%.
 */
const service = {
  embedColor: 0x5865f2, // Discord blurple (blue border)
  embedTitle: "Jace's Middleman Service",
  embedDescription: [
    "Jace's Roblox Middleman Service offers trusted MM2, Adopt Me, and cross-trade middleman services through Discord.",
    '',
    'Safe, verified, and scam-free trading',
  ].join('\n'),
  embedFooter: "Jace's Middleman Service",

  // Optional JMS logo shown as the embed thumbnail (right side).
  thumbnailUrl: '',
};

/**
 * Builds the Jace's Middleman Service embed.
 * @param {string} [thumbnailUrl]
 * @returns {import('discord.js').EmbedBuilder}
 */
function buildEmbed(thumbnailUrl) {
  const embed = new EmbedBuilder()
    .setColor(service.embedColor)
    .setTitle(service.embedTitle)
    .setDescription(service.embedDescription)
    .setFooter({ text: service.embedFooter });

  if (thumbnailUrl) embed.setThumbnail(thumbnailUrl);
  return embed;
}

module.exports = { ...service, buildEmbed };
