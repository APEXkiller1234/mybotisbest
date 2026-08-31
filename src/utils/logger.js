'use strict';

/**
 * Small timestamped logger so every command/event action is traceable in the console.
 */

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

const logger = {
  info(message) {
    console.log(`[${timestamp()}] [INFO] ${message}`);
  },
  warn(message) {
    console.warn(`[${timestamp()}] [WARN] ${message}`);
  },
  error(message) {
    console.error(`[${timestamp()}] [ERROR] ${message}`);
  },
};

module.exports = logger;
