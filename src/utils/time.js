'use strict';

/**
 * Formats dates like the screenshot header, e.g.
 * "August 31, 2026 at 12:05 AM".
 */
const FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

/**
 * @param {Date} date
 * @returns {string}
 */
function formatLastUpdated(date) {
  return FORMATTER.format(date);
}

module.exports = { formatLastUpdated };
