'use strict';

const mmPanel = require('../content/mmpanel');
const tosPanel = require('../content/mmtosPanel');
const tosText = require('../content/mmtos');
const cart = require('../content/cart');
const jmsService = require('../content/jmsService');
const { createTicket, sendTicketWelcome } = require('../utils/tickets');
const { textToEmbeds } = require('../utils/embeds');
const { resolveImage } = require('../utils/images');
const { isAdmin } = require('../utils/permissions');
const logger = require('../utils/logger');

/**
 * Handles interactions:
 *   /say (chat input)         → admin-only, posted by the bot
 *   mmpanel:request (button)  → opens a middleman ticket
 *   mmtos:view (button)       → shows the full ToS (EPHEMERAL)
 *   cart:view (button)        → shows the links + service card (EPHEMERAL)
 */
module.exports = {
  name: 'interactionCreate',

  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(client, interaction);
      return;
    }

    if (!interaction.isButton()) return;

    try {
      if (interaction.customId === tosPanel.button.customId) {
        await handleTosClick(interaction);
        return;
      }

      if (interaction.customId === cart.button.customId) {
        await handleCartClick(client, interaction);
        return;
      }

      if (interaction.customId === mmPanel.button.customId) {
        await handlePanelClick(client, interaction);
        return;
      }
    } catch (error) {
      logger.error(
        `Button interaction failed (${interaction.customId}): ${error.stack || error.message}`,
      );
      await interaction
        .editReply({
          content: '❌ Something went wrong while handling that button.',
          ephemeral: true,
        })
        .catch(() => {});
    }
  },
};

/**
 * Ran for every slash command — same admin gate as the prefix commands.
 */
async function handleSlashCommand(client, interaction) {
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  if (command.adminOnly !== false && !isAdmin(interaction.member, client.config)) {
    return interaction.reply({
      content: '❌ You do not have permission to use this command (admins only).',
      ephemeral: true,
    });
  }

  try {
    await command.execute(client, interaction);
  } catch (error) {
    logger.error(`Slash command "${command.name}" failed: ${error.stack || error.message}`);
    await interaction
      .reply({
        content: '❌ An unexpected error occurred while running the command.',
        ephemeral: true,
      })
      .catch(() => {});
  }
}

/**
 * "View ToS" — posts the full Middleman Terms EPHEMERALLY (only the
 * clicker sees it; no clutter in the channel).
 */
async function handleTosClick(interaction) {
  await interaction.deferReply({ ephemeral: true });

  return interaction.editReply({
    embeds: textToEmbeds(tosText, {
      title: 'JMS Manual Middleman | TOS',
      color: 0x5865f2,
    }),
  });
}

/**
 * "View Links" — reveals the Jace's links + service card EPHEMERALLY.
 *   content: website URL + invite URL (Discord renders the guild card)
 *   files:   optional banner attachment
 *   embeds:  Jace's Middleman Service card
 */
async function handleCartClick(client, interaction) {
  await interaction.deferReply({ ephemeral: true });

  const cfg = client.config.cart || {};
  const content = [
    cfg.websiteUrl || cart.websiteUrl,
    cfg.inviteUrl || cart.inviteUrl,
  ].join('\n');

  const embed = jmsService.buildEmbed(cfg.thumbnailUrl || jmsService.thumbnailUrl);

  const image = await resolveImage({
    url: cfg.imageUrl,
    filePath: cfg.imagePath,
    name: 'jms-banner',
  });

  return interaction.editReply({
    content,
    embeds: [embed],
    files: image ? [image] : [],
  });
}

/**
 * "Request Middleman" — creates a private ticket channel for the user.
 */
async function handlePanelClick(client, interaction) {
  await interaction.deferReply({ ephemeral: true });

  const { guild, member } = interaction;
  if (!guild || !member) {
    return interaction.editReply({
      content: '❌ The "Request Middleman" button can only be used inside the server.',
      ephemeral: true,
    });
  }

  // No category configured? Fall back to the category the panel lives in.
  const fallbackCategoryId = interaction.channel?.parentId || undefined;

  let result;
  try {
    result = await createTicket(guild, member, client.config, fallbackCategoryId);
  } catch (error) {
    if (error.code === 'NO_CATEGORY') {
      return interaction.editReply({
        content:
          '⚠️ No ticket category is configured. An admin needs to set the category in config.json (or TICKET_CATEGORY_ID in .env).',
        ephemeral: true,
      });
    }
    throw error;
  }

  if (result.existing) {
    return interaction.editReply({
      content: `ℹ️ You already have an open ticket: ${result.existing}`,
      ephemeral: true,
    });
  }

  const { channel } = result;
  await sendTicketWelcome(channel, member, client.config);

  return interaction.editReply({
    content: `✅ Your middleman ticket has been created: ${channel}`,
    ephemeral: true,
  });
}
