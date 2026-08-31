'use strict';

/**
 * Exact content for the `!cart` command.
 *
 * The command posts a single button; clicking it shows an EPHEMERAL
 * message containing:
 *   content:  website URL
 *             invite URL      (Discord auto-renders the guild card)
 *   files:    optional banner image (clickable attachment)
 *   embeds:   Jace's Middleman Service card
 *
 * websiteUrl / inviteUrl / button label / button emoji can be overridden
 * in config.json (cart.*) or .env (CART_WEBSITE_URL / CART_INVITE_URL).
 */
module.exports = {
  websiteUrl: 'https://jaces.xyz/',
  inviteUrl: 'https://discord.gg/fQbPUNvCFx',

  button: {
    customId: 'cart:view',
    label: 'View Links',
    emoji: '\u{1F517}', // 🔗 link
  },
};
