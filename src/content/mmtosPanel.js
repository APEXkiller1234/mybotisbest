'use strict';

/**
 * Little panel shown by `!mmtos`.
 * {channel} is replaced with the <#id> mention of the manual middleman
 * request channel (config.json -> channels.mmRequestChannelId).
 */
module.exports = {
  messageText: '> Get a Manual Middleman here -> {channel}',

  button: {
    customId: 'mmtos:view',
    label: 'View ToS',
  },
};
