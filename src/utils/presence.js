'use strict';

const { ActivityType } = require('discord.js');
const logger = require('./logger');

/**
 * ── Bot presence helpers ─────────────────────────────────────────
 * Shared by /setbot and !setbot: status (online/idle/dnd/invisible)
 * and activity (playing/watching/listening/competing/streaming/custom).
 */

const STATUS_ALIASES = {
  online: 'online',
  idle: 'idle',
  dnd: 'dnd',
  do_not_disturb: 'dnd',
  invisible: 'invisible',
  offline: 'invisible',
};

const STATUS_LABELS = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  invisible: 'Invisible',
};

const ACTIVITY_ALIASES = {
  play: 'playing',
  playing: 'playing',
  watch: 'watching',
  watching: 'watching',
  listen: 'listening',
  listening: 'listening',
  compete: 'competing',
  competing: 'competing',
  stream: 'streaming',
  streaming: 'streaming',
  custom: 'custom',
  customstatus: 'custom',
};

const ACTIVITY_TYPES = {
  playing: ActivityType.Playing,
  watching: ActivityType.Watching,
  listening: ActivityType.Listening,
  competing: ActivityType.Competing,
  streaming: ActivityType.Streaming,
  custom: ActivityType.Custom,
};

const ACTIVITY_LABELS = {
  playing: 'Playing',
  watching: 'Watching',
  listening: 'Listening to',
  competing: 'Competing in',
  streaming: 'Streaming',
  custom: 'Custom Status',
};

/** Discord activity name limit. */
const MAX_ACTIVITY_LENGTH = 128;

/**
 * @param {string} value
 * @returns {string|null} normalized status or null when invalid
 */
function parseStatus(value) {
  const key = String(value || '').trim().toLowerCase();
  return STATUS_ALIASES[key] || null;
}

/**
 * @param {string} value
 * @returns {string|null} normalized activity type or null when invalid
 */
function parseActivityType(value) {
  const key = String(value || '').trim().toLowerCase();
  return ACTIVITY_ALIASES[key] || null;
}

/**
 * @param {string} type normalized activity type
 * @returns {string}
 */
function activityLabel(type) {
  return ACTIVITY_LABELS[type] || type;
}

/**
 * @param {string} status normalized status
 * @returns {string}
 */
function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

/**
 * Builds the presence payload. Keeps the current status/activity when
 * only one part is being changed.
 *
 * @param {import('discord.js').Client} client
 * @param {{ status?: string, type?: string, text?: string|null, url?: string }} changes
 * @returns {{ data?: object, error?: string }}
 */
function buildPresenceData(client, changes) {
  const currentStatus = client.user?.presence?.status || 'online';
  const status = changes.status || currentStatus;

  let activities;
  if (changes.type === undefined) {
    // Keep whatever the bot is currently doing.
    activities = (client.user?.presence?.activities || []).map((activity) => ({
      name: activity.name,
      type: activity.type,
      url: activity.url || undefined,
    }));
  } else if (changes.type === 'clear') {
    activities = [];
  } else {
    if (!changes.text) {
      return { error: `The "${changes.type}" activity requires some text (e.g. "Roblox traders").` };
    }
    const activity = {
      name: changes.text.trim().slice(0, MAX_ACTIVITY_LENGTH),
      type: ACTIVITY_TYPES[changes.type],
    };
    if (changes.type === 'streaming') {
      if (!changes.url) {
        return { error: 'Streaming activity requires a URL (e.g. https://twitch.tv/your-channel).' };
      }
      activity.url = changes.url;
    }
    activities = [activity];
  }

  return { data: { status, activities } };
}

/**
 * Applies the presence to the client user.
 * @returns {Promise<{ data?: object, error?: string }>}
 */
async function applyPresence(client, changes) {
  const { data, error } = buildPresenceData(client, changes);
  if (error) return { error };

  await client.user.setPresence(data);
  logger.info(`Presence updated -> status: "${data.status}", activities: ${data.activities.length}`);
  return { data };
}

module.exports = {
  STATUS_ALIASES,
  STATUS_LABELS,
  ACTIVITY_ALIASES,
  ACTIVITY_TYPES,
  ACTIVITY_LABELS,
  MAX_ACTIVITY_LENGTH,
  parseStatus,
  parseActivityType,
  activityLabel,
  statusLabel,
  buildPresenceData,
  applyPresence,
};
