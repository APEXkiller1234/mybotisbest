'use strict';

const { EmbedBuilder } = require('discord.js');

/**
 * Builds the payload used by both `/say` and `!say`.
 *
 * @param {string} text
 * @param {{ embed?: boolean, color?: number }} options
 * @returns {{ content?: string, embeds?: import('discord.js').EmbedBuilder[] }}
 */
function buildSayPayload(text, { embed = false, color = 0x5865f2 } = {}) {
  if (embed) {
    return { embeds: [new EmbedBuilder().setColor(color).setDescription(text)] };
  }
  return { content: text };
}

/**
 * Maximum text length per mode (Discord limits).
 */
function sayLimit(embed) {
  return embed ? 4096 : 2000;
}

module.exports = { buildSayPayload, sayLimit };
