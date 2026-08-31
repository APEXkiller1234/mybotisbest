'use strict';

/**
 * Exact content of the Middleman Service panel (embed + button).
 * Matches the user-provided text 101%:
 *   - headings: ㅤㅤㅤㅤㅤ __*`Middleman Service`**__
 *   - intro:     > *`✦︰`** *To request ...*
 *   - example:   > *`⨯︰`** ***Example: Trade is NFR Crow for Robux. ***
 *   - items 1/2/3 consecutive inside one blockquote
 *   - notes:     > *`1.`** ***...***
 *   - button emoji: 🎟️ (ticket)
 */
module.exports = {
  color: 0x5865f2, // Discord blurple (blue border in the screenshot)

  description: [
    '\u3164\u3164\u3164\u3164\u3164 __*`Middleman Service`**__',
    '',
    '> *`\u2726\ufe30`** *To request a middleman from this server, click the blue "Request Middleman" button on this message.*',
    '',
    '\u3164\u3164\u3164\u3164\u3164 __*`How does middleman work?`**__',
    '',
    '> *`\u2a2f\ufe30`** ***Example: Trade is NFR Crow for Robux. ***',
    '> 1. Seller gives NFR Crow to middleman',
    '> 2. Buyer pays seller robux (After middleman confirms receiving pet)',
    '> 3. Middleman gives buyer NFR Crow (After seller confirmed receiving robux)',
    '',
    '\u3164\u3164\u3164\u3164\u3164 __*`NOTES:`**__',
    '',
    '> *`1.`** ***You must both agree on the deal before using a middleman. Troll tickets will have consequences.***',
    '> *`2.`** ***Specify what you\'re trading (e.g. FR Frost Dragon in Adopt me > $20 USD LTC). Don\'t just put "adopt me" in the embed.***)',
  ].join('\n'),

  button: {
    customId: 'mmpanel:request',
    label: 'Request Middleman',
    emoji: '\u{1F39F}\uFE0F', // 🎟️ ticket
  },
};
