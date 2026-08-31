'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Full Middleman Terms of Service (single source of truth).
 * Lives in mmtos.txt so the text can be edited/verified without touching JS.
 * @returns {string}
 */
module.exports = fs.readFileSync(path.join(__dirname, 'mmtos.txt'), 'utf8').trim();
