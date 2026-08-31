'use strict';

const { randomInt } = require('node:crypto');
const logger = require('./logger');

/**
 * ── Server-name disguise ────────────────────────────────────────
 * When the guild is renamed to the "shop" name ("Horizon Shop")
 * the bot plays alive-looking (random) bot names and renames its own
 * role too. When the guild is renamed back to the "home" name
 * (Jace's MM), the bot returns to its normal identity
 * (JMS Bot / JMS Bot role).
 */

const DEFAULT_BOT_NAMES = [
  'notkaii',
  'clxudyy',
  'shadxw',
  'viibe',
  'ayden_ttv',
  'luvsleep',
  'prodbyvic',
  'sophiiee',
  'tradeswme',
  'daytraded',
  'moonnix',
  'st4rfall',
  'z4yn',
  'kaydrane',
  'riiverx',
];

const DEFAULT_ROLE_NAMES = [
  'Middleman',
  'MM Team',
  'Head Trader',
  'Trades',
  'Deal Manager',
  'Horizon Staff',
];

/**
 * Normalizes a server name for comparison (apostrophes + case).
 * @param {string} name
 * @returns {string}
 */
function normalizeName(name) {
  return String(name || '').replaceAll('\u2019', "'").trim().toLowerCase();
}

/**
 * @param {string[]} list
 * @returns {string|null}
 */
function pickRandom(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[randomInt(list.length)];
}

/**
 * Changes the bot's username (skipped when it already matches).
 * Discord rate-limits username changes, so we never re-apply same names.
 * @param {import('discord.js').Client} client
 * @param {string} name
 */
async function setBotUsername(client, name) {
  if (!name || !client.user) return;
  if (client.user.username === name) return;
  await client.user.setUsername(name);
  logger.info(`Bot username changed to "${name}"`);
}

/**
 * Renames the bot's own (highest) role in the guild.
 * @param {import('discord.js').Guild} guild
 * @param {string} name
 */
async function setBotRoleName(guild, name) {
  if (!name || !guild?.members?.me) return;
  const role = guild.members.me.roles?.highest;
  if (!role || role.name === name) return;
  await role.setName(name);
  logger.info(`Bot role renamed to "${name}" in guild "${guild.name}"`);
}

/**
 * Randomize bot username + role name (shop disguise).
 */
async function applyDisguise(client, guild, config) {
  const disguise = config.disguise || {};
  const botName = pickRandom(disguise.botNames);
  const roleName = pickRandom(disguise.roleNames);
  await setBotUsername(client, botName);
  await setBotRoleName(guild, roleName);
}

/**
 * Restore normal identity (JMS Bot / JMS Bot role).
 */
async function restoreIdentity(client, guild, config) {
  const disguise = config.disguise || {};
  await setBotUsername(client, disguise.botName);
  await setBotRoleName(guild, disguise.roleName);
}

module.exports = {
  DEFAULT_BOT_NAMES,
  DEFAULT_ROLE_NAMES,
  normalizeName,
  pickRandom,
  setBotUsername,
  setBotRoleName,
  applyDisguise,
  restoreIdentity,
};
