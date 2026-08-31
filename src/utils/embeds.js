'use strict';

const { EmbedBuilder } = require('discord.js');

/**
 * Discord embed descriptions allow up to 4096 characters; we keep a small
 * safety margin. Long texts are split at line boundaries, never mid-line.
 */
const MAX_DESCRIPTION_LENGTH = 4000;

/**
 * Splits text into chunks that fit inside an embed description.
 * @param {string} text
 * @param {number} max
 * @returns {string[]}
 */
function splitText(text, max = MAX_DESCRIPTION_LENGTH) {
  const lines = text.split('\n');
  const chunks = [];
  let current = '';

  for (const line of lines) {
    const candidate = current ? `${current}\n${line}` : line;
    if (candidate.length > max && current) {
      chunks.push(current);
      current = line;
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

/**
 * Converts long text into one or more embed descriptions.
 * @param {string} text
 * @param {{ color?: number, title?: string, continuedTitle?: string }} options
 * @returns {import('discord.js').EmbedBuilder[]}
 */
function textToEmbeds(text, options = {}) {
  const chunks = splitText(text);
  const color = options.color ?? 0x5865f2;

  return chunks.map((chunk, index) => {
    const embed = new EmbedBuilder().setColor(color).setDescription(chunk);
    if (index === 0 && options.title) {
      embed.setTitle(options.title);
    } else if (index > 0 && options.continuedTitle) {
      embed.setTitle(options.continuedTitle);
    }
    return embed;
  });
}

module.exports = { splitText, textToEmbeds, MAX_DESCRIPTION_LENGTH };
