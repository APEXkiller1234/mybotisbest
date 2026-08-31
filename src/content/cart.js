'use strict';

/**
 * Exact content for the `!cart` command.
 *
 * The message sends:
 *   content:  website URL
 *             invite URL      (Discord auto-renders the guild card)
 *   files:    optional banner image (clickable attachment)
 *   embeds:   Jace's Middleman Service card
 *
 * websiteUrl / inviteUrl can be overridden in config.json
 * (cart.websiteUrl / cart.inviteUrl) or .env
 * (CART_WEBSITE_URL / CART_INVITE_URL).
 */
module.exports = {
  websiteUrl: 'https://jaces.xyz/',
  inviteUrl: 'https://discord.gg/fQbPUNvCFx',

  // ── Jace's Middleman Service embed ──────────────────────────
  embedColor: 0x5865f2, // Discord blurple (blue border in the screenshot)
  embedTitle: "Jace's Middleman Service",
  embedDescription: [
    "Jace's Roblox Middleman Service offers trusted MM2, Adopt Me, and cross-trade middleman services through Discord.",
    '',
    'Safe, verified, and scam-free trading',
  ].join('\n'),
  embedFooter: "Jace's Middleman Service",
};
