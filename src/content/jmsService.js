'use strict';

/**
 * Shared "Jace's Middleman Service" embed used by !cart and !servers.
 * Matches the reference screenshots 101%.
 */
module.exports = {
  embedColor: 0x5865f2, // Discord blurple (blue border)
  embedTitle: "Jace's Middleman Service",
  embedDescription: [
    "Jace's Roblox Middleman Service offers trusted MM2, Adopt Me, and cross-trade middleman services through Discord.",
    '',
    'Safe, verified, and scam-free trading',
  ].join('\n'),
  embedFooter: "Jace's Middleman Service",

  // Optional JMS logo shown as the embed thumbnail (right side).
  // Set via config: cart.thumbnailUrl / servers.embedThumbnailUrl.
  thumbnailUrl: '',
};
