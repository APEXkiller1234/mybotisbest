'use strict';

const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('./logger');

/**
 * ── Middleman ticket helpers ─────────────────────────────────────
 * Every helper here is pure-ish and only talks through the guild /
 * config objects, so it can be unit-tested without a real bot.
 */

/**
 * Sanitizes a username into something Discord accepts in a channel name.
 * @param {string} username
 * @returns {string}
 */
function sanitizeName(username) {
  const cleaned = username
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 80);
  return cleaned || 'user';
}

/**
 * Finds an already-open ticket channel owned by the user.
 * Channels store `RequesterID: <id>` in their topic for this lookup.
 *
 * @param {import('discord.js').Guild} guild
 * @param {string} userId
 * @param {object} config Bot config (config.tickets used)
 * @returns {import('discord.js').TextChannel|undefined}
 */
function findUserTicket(guild, userId, config) {
  const { channelPrefix, categoryId } = config.tickets;
  return guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.name.startsWith(channelPrefix) &&
      channel.topic?.includes(`RequesterID: ${userId}`) &&
      (!categoryId || channel.parentId === categoryId),
  );
}

/**
 * Builds a unique, Discord-valid channel name (e.g. "mm-robloxuser").
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').GuildMember} member
 * @param {object} config
 * @returns {string}
 */
function buildTicketChannelName(guild, member, config) {
  const prefix = config.tickets.channelPrefix;
  const base = `${prefix}${sanitizeName(member.user.username)}`;

  let name = base.slice(0, 100);
  let suffix = 2;
  while (guild.channels.cache.some((channel) => channel.name === name)) {
    const tail = `-${suffix}`;
    name = `${base.slice(0, 100 - tail.length)}${tail}`;
    suffix += 1;
  }
  return name;
}

/**
 * Creates the middleman ticket channel for a user.
 *
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').GuildMember} member
 * @param {object} config
 * @param {string|undefined} fallbackCategoryId Used when config has no category
 *   (typically the category the panel was sent in).
 * @returns {Promise<{channel?: import('discord.js').TextChannel, existing?: import('discord.js').TextChannel}>}
 */
async function createTicket(guild, member, config, fallbackCategoryId) {
  // Reuse the user's existing open ticket instead of creating a duplicate.
  const existing = findUserTicket(guild, member.id, config);
  if (existing) return { existing };

  const categoryId = config.tickets.categoryId || fallbackCategoryId;
  if (!categoryId) {
    const error = new Error('NO_CATEGORY');
    error.code = 'NO_CATEGORY';
    throw error;
  }

  const everyoneId = guild.roles.everyone.id;
  const viewerPermissions = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.EmbedLinks,
  ];

  // Hide the channel from @everyone, open it for the requester + staff.
  const permissionOverwrites = [
    { id: everyoneId, deny: [PermissionFlagsBits.ViewChannel] },
    { id: member.id, allow: viewerPermissions },
    ...config.tickets.staffRoleIds.map((roleId) => ({
      id: roleId,
      allow: viewerPermissions,
    })),
  ];

  const channel = await guild.channels.create({
    name: buildTicketChannelName(guild, member, config),
    type: ChannelType.GuildText,
    parent: categoryId,
    topic: `RequesterID: ${member.id}`,
    permissionOverwrites,
    reason: `Middleman ticket requested by ${member.user.tag}`,
  });

  logger.info(
    `Ticket #${channel.name} (${channel.id}) created for ${member.user.tag} (${member.id})`,
  );

  return { channel };
}

/**
 * Builds the welcome embed sent inside a fresh ticket channel.
 * @param {import('discord.js').GuildMember} member
 * @param {object} config
 * @returns {import('discord.js').EmbedBuilder}
 */
function buildWelcomeEmbed(member, config) {
  const { welcomeTitle, welcomeDescription } = config.tickets;
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(welcomeTitle)
    .setDescription(
      welcomeDescription.replaceAll('{user}', `<@${member.id}>`),
    )
    .setFooter({ text: `Opened by ${member.user.tag}` })
    .setTimestamp();
}

/**
 * Sends the welcome message (+ optional staff ping) into the ticket.
 * @param {import('discord.js').TextChannel} channel
 * @param {import('discord.js').GuildMember} member
 * @param {object} config
 * @returns {Promise<import('discord.js').Message>}
 */
function sendTicketWelcome(channel, member, config) {
  const contentParts = [];
  if (config.tickets.mentionStaff && config.tickets.staffRoleIds.length > 0) {
    contentParts.push(
      config.tickets.staffRoleIds.map((id) => `<@&${id}>`).join(' '),
    );
  }

  return channel.send({
    content: contentParts.join(' '),
    embeds: [buildWelcomeEmbed(member, config)],
  });
}

module.exports = {
  sanitizeName,
  findUserTicket,
  buildTicketChannelName,
  createTicket,
  buildWelcomeEmbed,
  sendTicketWelcome,
};
