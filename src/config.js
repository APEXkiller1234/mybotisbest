'use strict';

require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const logger = require('./utils/logger');
const {
  DEFAULT_BOT_NAMES,
  DEFAULT_ROLE_NAMES,
} = require('./utils/disguise');

/**
 * Parses a comma-separated environment variable into a clean array of strings.
 * @param {string|undefined} value
 * @returns {string[]}
 */
function parseList(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const DEFAULT_WELCOME = [
  'Hey {user}, your middleman ticket has been opened! 🎫',
  '',
  'Please provide the following details:',
  '1️⃣ Roblox username(s) of both parties',
  '2️⃣ What is being traded (e.g. NFR Crow for Robux)',
  '3️⃣ Payment method & amount',
  '',
  'A middleman will be with you shortly. Please do not ping or DM staff.',
].join('\n');

/**
 * ── config.json (optional, primary) ─────────────────────────────
 * Channels / roles / categories live here. Copy config.example.json
 * to config.json and fill in your IDs.
 *
 * ── .env (fallback) ─────────────────────────────────────────────
 * The same settings can also be provided with:
 *   TICKET_CATEGORY_ID, STAFF_ROLE_IDS, TICKET_CHANNEL_PREFIX
 */
const jsonPath = path.join(__dirname, '..', 'config.json');
let jsonConfig = {};
if (fs.existsSync(jsonPath)) {
  try {
    jsonConfig = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    logger.info('Loaded config.json');
  } catch (error) {
    logger.warn(`Could not parse config.json (${jsonPath}): ${error.message}`);
  }
}

const jsonTickets = jsonConfig.tickets || {};
const jsonChannels = jsonConfig.channels || {};
const jsonLeaderboard = jsonConfig.leaderboard || {};
const jsonDisguise = jsonConfig.disguise || {};

const config = {
  token: process.env.DISCORD_TOKEN,
  prefix: (process.env.PREFIX || '!').trim(),
  adminRoleIds: parseList(process.env.ADMIN_ROLE_IDS),
  botOwnerIds: parseList(process.env.BOT_OWNER_IDS),

  // Guild used for slash command registration (instant updates).
  guildId:
    jsonConfig.guildId ??
    process.env.GUILD_ID ??
    '',

  channels: {
    // Channel linked by the !mmtos panel ("Get a Manual Middleman here ->").
    // Also used by !leaderboard ("Manual tickets -> #channel").
    mmRequestChannelId:
      jsonChannels.mmRequestChannelId ??
      process.env.MM_REQUEST_CHANNEL_ID ??
      '',
  },

  leaderboard: {
    // Images set here will be attached by !leaderboard.
    lifetimeImageUrl:
      jsonLeaderboard.lifetimeImageUrl ??
      process.env.LIFETIME_IMAGE_URL ??
      '',
    monthlyImageUrl:
      jsonLeaderboard.monthlyImageUrl ??
      process.env.MONTHLY_IMAGE_URL ??
      '',
    lifetimeImagePath:
      jsonLeaderboard.lifetimeImagePath ??
      '',
    monthlyImagePath:
      jsonLeaderboard.monthlyImagePath ??
      '',

    // Roles mentioned in the leaderboard note ("Top 3 / Top 10 Clients").
    top3RoleId:
      jsonLeaderboard.top3RoleId ??
      process.env.TOP3_ROLE_ID ??
      '',
    top10RoleId:
      jsonLeaderboard.top10RoleId ??
      process.env.TOP10_ROLE_ID ??
      '',

    // Optional fixed "Last Updated" value; empty = current time.
    lastUpdated:
      jsonLeaderboard.lastUpdated ??
      '',
  },

  disguise: {
    // React to guild renames only when enabled.
    enabled: jsonDisguise.enabled ?? true,

    // Guild name that triggers the random identity.
    shopName:
      jsonDisguise.shopName ??
      'Horizon Shop',

    // Guild name that restores the normal identity.
    homeName:
      jsonDisguise.homeName ??
      "Jace's MM",

    // Normal identity restored on the home server.
    botName:
      jsonDisguise.botName ??
      'JMS Bot',
    roleName:
      jsonDisguise.roleName ??
      'JMS Bot',

    // Random pools used while disguised.
    botNames:
      Array.isArray(jsonDisguise.botNames) && jsonDisguise.botNames.length > 0
        ? jsonDisguise.botNames.map(String)
        : DEFAULT_BOT_NAMES,
    roleNames:
      Array.isArray(jsonDisguise.roleNames) && jsonDisguise.roleNames.length > 0
        ? jsonDisguise.roleNames.map(String)
        : DEFAULT_ROLE_NAMES,
  },
  tickets: {
    // Category where ticket channels are created.
    categoryId:
      jsonTickets.categoryId ??
      process.env.TICKET_CATEGORY_ID ??
      '',

    // Roles that can see / access tickets (pinged when a ticket opens).
    staffRoleIds:
      Array.isArray(jsonTickets.staffRoleIds) && jsonTickets.staffRoleIds.length > 0
        ? jsonTickets.staffRoleIds.map(String)
        : parseList(process.env.STAFF_ROLE_IDS),

    // Prefix for ticket channel names, e.g. "mm-" -> "mm-user1".
    channelPrefix:
      jsonTickets.channelPrefix ??
      process.env.TICKET_CHANNEL_PREFIX ??
      'mm-',

    // Whether to ping staff roles in the new ticket channel.
    mentionStaff: jsonTickets.mentionStaff ?? true,

    // Welcome embed sent when a ticket opens.
    welcomeTitle:
      jsonTickets.welcomeTitle ??
      'Middleman Ticket',
    welcomeDescription:
      jsonTickets.welcomeDescription ??
      DEFAULT_WELCOME,
  },
};

module.exports = config;
