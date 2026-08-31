'use strict';

const {
  applyPresence,
  parseStatus,
  parseActivityType,
  activityLabel,
  statusLabel,
} = require('../../utils/presence');
const logger = require('../../utils/logger');

module.exports = {
  name: 'setbot',
  aliases: ['presence', 'setpresence', 'status'],
  description: 'Sets the bot status and/or activity (playing/watching/etc).',
  category: 'admin',
  adminOnly: true,
  usage:
    '!setbot [status] [type] [text]\n' +
    '  !setbot dnd watching Roblox traders\n' +
    '  !setbot online\n' +
    '  !setbot streaming "Roblox trading live" https://twitch.tv/channel\n' +
    '  !setbot clear',

  /**
   * @param {import('../../structures/BotClient')} client
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  async execute(client, message, args) {
    // `!setbot` with no arguments -> show usage + current presence.
    if (args.length === 0) {
      return message.reply(
        `**Current presence:** ${statusLabel(client.user?.presence?.status || 'online')} — ` +
          `${(client.user?.presence?.activities || []).map((a) => a.name).join(', ') || 'no activity'}\n\n` +
          `Usage:\n${this.usage}`,
      );
    }

    const changes = parseArgs(args);

    if (Object.keys(changes).length === 0) {
      return message.reply(
        `❌ Not a valid combination.\nUsage:\n${this.usage}`,
      );
    }

    try {
      const { data, error } = await applyPresence(client, changes);
      if (error) {
        return message.reply(`❌ ${error}`);
      }

      const parts = [];
      if (changes.status) parts.push(`Status **${statusLabel(changes.status)}**`);
      if (changes.type === 'clear') {
        parts.push('Activity cleared');
      } else if (changes.type && changes.text) {
        parts.push(`${activityLabel(changes.type)} **${changes.text}**`);
      }

      return message.reply(`✅ ${parts.join(' · ')}`);
    } catch (error) {
      logger.error(`!setbot failed: ${error.stack || error.message}`);
      return message.reply(`❌ Could not update presence: ${error.message}`);
    }
  },
};

/**
 * Parses !setbot arguments:
 *   !setbot <status> <type> <text>   e.g. !setbot dnd watching Roblox traders
 *   !setbot <status>                 e.g. !setbot online
 *   !setbot <type> <text>            e.g. !setbot playing Roblox traders
 *   !setbot clear                    clears the activity
 * @param {string[]} args
 * @returns {{ status?: string, type?: string, text?: string|null, url?: string }}
 */
function parseArgs(args) {
  const tokens = [...args];
  const changes = {};

  const first = tokens[0]?.toLowerCase();
  const status = parseStatus(first);
  if (status) {
    changes.status = status;
    tokens.shift();
  }

  const second = tokens[0]?.toLowerCase();
  if (second === 'clear') {
    changes.type = 'clear';
    return changes;
  }

  const type = parseActivityType(second);
  if (type) {
    changes.type = type;
    tokens.shift();

    // For streaming, a trailing URL is treated as the stream URL.
    const last = tokens[tokens.length - 1];
    if (type === 'streaming' && last && /^https?:\/\//i.test(last)) {
      changes.url = tokens.pop();
    }

    changes.text = tokens.join(' ').trim() || null;
  }

  return changes;
}
