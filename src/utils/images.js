'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { AttachmentBuilder } = require('discord.js');
const logger = require('./logger');

/**
 * ── Leaderboard image loading ───────────────────────────────────
 * Images can come from:
 *   - a local file path  (leaderboard.lifetimeImagePath / monthlyImagePath)
 *   - an HTTP(S) URL     (leaderboard.lifetimeImageUrl / monthlyImageUrl)
 * A local path wins over a URL when both are provided.
 */

const PROJECT_ROOT = path.join(__dirname, '..', '..');

/**
 * Resolves a possibly-relative path against the project root.
 * @param {string} filePath
 * @returns {string}
 */
function resolveLocalPath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
}

/**
 * @param {string|null|undefined} contentType e.g. "image/png"
 * @returns {string|null}
 */
function extensionFromContentType(contentType) {
  const map = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return map[(contentType || '').split(';')[0].trim()] || null;
}

/**
 * @param {string} url
 * @returns {string|null}
 */
function extensionFromUrl(url) {
  try {
    const fileName = new URL(url).pathname.split('/').pop().split('?')[0];
    const ext = path.extname(fileName).replace('.', '').toLowerCase();
    if (!['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return null;
    return ext === 'jpeg' ? 'jpg' : ext;
  } catch {
    return null;
  }
}

/**
 * Loads a leaderboard image as an AttachmentBuilder.
 * Returns null (with a warning) when nothing is configured or unavailable,
 * so the text parts of the leaderboard always still send.
 *
 * @param {{ url?: string, filePath?: string, name?: string }} options
 * @returns {Promise<import('discord.js').AttachmentBuilder|null>}
 */
async function resolveImage({ url = '', filePath = '', name = 'image' }) {
  if (filePath) {
    const absolute = resolveLocalPath(filePath);
    if (fs.existsSync(absolute)) {
      return new AttachmentBuilder(absolute, { name: path.basename(absolute) });
    }
    logger.warn(`Leaderboard image file not found: ${absolute}`);
    return null;
  }

  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const ext =
      extensionFromContentType(response.headers.get('content-type')) ||
      extensionFromUrl(url) ||
      'png';
    return new AttachmentBuilder(buffer, { name: `${name}.${ext}` });
  } catch (error) {
    logger.warn(`Could not download leaderboard image ${url}: ${error.message}`);
    return null;
  }
}

module.exports = {
  resolveImage,
  resolveLocalPath,
  extensionFromContentType,
  extensionFromUrl,
};
