'use strict';

const { PermissionFlagsBits } = require('discord.js');

/**
 * Checks whether a guild member is allowed to run admin commands.
 *
 * Access is granted when ANY of the following is true:
 *  1. The member is the guild owner.
 *  2. The member's ID is listed in BOT_OWNER_IDS (.env).
 *  3. The member has one of the roles listed in ADMIN_ROLE_IDS (.env).
 *  4. (Fallback) The member has the "Administrator" permission — only used
 *     when no ADMIN_ROLE_IDS are configured.
 *
 * @param {import('discord.js').GuildMember} member
 * @param {import('../../config')} config
 * @returns {boolean}
 */
function isAdmin(member, config) {
  if (!member || !member.guild) return false;

  // Guild owner always has access.
  if (member.guild.ownerId === member.id) return true;

  // Bot owner always has access.
  if (config.botOwnerIds.includes(member.id)) return true;

  // Role-based access (configured in .env).
  if (config.adminRoleIds.length > 0) {
    return member.roles.cache.some((role) => config.adminRoleIds.includes(role.id));
  }

  // Fallback: use the Administrator permission.
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

module.exports = { isAdmin };
