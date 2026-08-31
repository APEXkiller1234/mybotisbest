'use strict';

/**
 * Exact text used by the `!leaderboard` command.
 *
 * Placeholders:
 *   {top3Role}   → <@&role> mention if leaderboard.top3RoleId is set, else "Top 3 Clients"
 *   {top10Role}  → <@&role> mention if leaderboard.top10RoleId is set, else "Top 10 Clients"
 *   {channel}    → <#channel> mention of channels.mmRequestChannelId, else plain text
 */
module.exports = {
  lastUpdatedPrefix: 'Last Updated: ',
  roleNote:
    'Top 3 of the previous month will get {top3Role} role, the rest will get {top10Role}. You get one point for each deal you complete.',
  manualNote:
    'This leaderboard is only for Manual tickets -> {channel}. Use /leaderboard for Auto tickets leaderboard.',
};
