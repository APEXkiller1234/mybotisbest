'use strict';

/**
 * Exact content of the Middleman Service panel (embed + button).
 * Matches the reference screenshot 101%.
 */
module.exports = {
  color: 0x5865f2, // Discord blurple (blue border in the screenshot)

  description: [
    'ㅤㅤㅤㅤㅤ **Middleman Service**',
    '',
    '> ***✦︰*** *To request a middleman from this server, click the blue "Request Middleman" button on this message.*',
    '',
    'ㅤㅤㅤㅤㅤ **How does middleman work?**',
    '',
    '> ***⨯︰*** ***Example: Trade is NFR Crow for Robux.***',
    '',
    '> 1. Seller gives NFR Crow to middleman',
    '',
    '> 2. Buyer pays seller robux (After middleman confirms receiving pet)',
    '',
    '> 3. Middleman gives buyer NFR Crow (After seller confirmed receiving robux)',
    '',
    'ㅤㅤㅤㅤㅤ **NOTES:**',
    '',
    '> **1.** ***You must both agree on the deal before using a middleman. Troll tickets will have consequences.***',
    '',
    '> **2.** ***Specify what you\'re trading (e.g. FR Frost Dragon in Adopt me > $20 USD LTC). Don\'t just put "adopt me" in the embed.***',
  ].join('\n'),

  button: {
    customId: 'mmpanel:request',
    label: 'Request Middleman',
    emoji: '🔶',
  },
};
