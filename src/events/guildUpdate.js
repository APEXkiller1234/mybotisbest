'use strict';

const {
  normalizeName,
  applyDisguise,
  restoreIdentity,
} = require('../utils/disguise');
const logger = require('../utils/logger');

/**
 * Watches server renames:
 *   - "Horizon Shop"   → bot picks a random alive-looking name + role name
 *   - "Jace's MM"      → bot returns to JMS Bot + JMS Bot role
 * Only reacts when the name actually changed (old !== new).
 */
module.exports = {
  name: 'guildUpdate',

  execute(client, oldGuild, newGuild) {
    const disguise = client.config.disguise || {};
    if (!disguise.enabled) return;

    const oldName = normalizeName(oldGuild?.name);
    const newName = normalizeName(newGuild?.name);
    if (!oldName || !newName || oldName === newName) return;

    const shopName = normalizeName(disguise.shopName);
    const homeName = normalizeName(disguise.homeName);

    if (newName === shopName) {
      logger.info(`Guild renamed to "${newGuild.name}" — applying random identity.`);
      return applyDisguise(client, newGuild, client.config).catch((error) => {
        logger.error(`Disguise failed: ${error.stack || error.message}`);
      });
    }

    if (newName === homeName) {
      logger.info(`Guild renamed to "${newGuild.name}" — restoring JMS Bot identity.`);
      return restoreIdentity(client, newGuild, client.config).catch((error) => {
        logger.error(`Identity restore failed: ${error.stack || error.message}`);
      });
    }
  },
};
