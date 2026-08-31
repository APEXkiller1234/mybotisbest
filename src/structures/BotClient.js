'use strict';

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { readdirSync, statSync } = require('node:fs');
const path = require('node:path');
const Command = require('./Command');
const Event = require('./Event');
const logger = require('../utils/logger');

/**
 * Custom Discord client that automatically loads:
 *   - commands        from  src/commands/<category>/<name>.js
 *   - slash commands  from  src/slash-commands/<name>.js
 *   - events          from  src/events/<name>.js
 */
class BotClient extends Client {
  constructor(config) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Channel, Partials.GuildMember, Partials.Message],
    });

    this.config = config;
    this.commands = new Collection(); // name -> Command
    this.categories = new Collection(); // category -> Command[]
    this.slashCommands = new Collection(); // name -> slash command definition
    this.events = new Collection(); // name -> Event
  }

  /**
   * Loads every command file from a directory of categories.
   * @param {string} directory Absolute path of `src/commands`
   * @returns {this}
   */
  loadCommands(directory) {
    if (!exists(directory)) {
      logger.warn(`Command directory not found: ${directory}`);
      return this;
    }

    const categories = readdirSync(directory).filter((entry) =>
      statSync(path.join(directory, entry)).isDirectory(),
    );

    for (const category of categories) {
      const categoryPath = path.join(directory, category);
      const files = readdirSync(categoryPath).filter((file) => file.endsWith('.js'));

      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        const commandModule = require(filePath);
        const command =
          commandModule instanceof Command
            ? commandModule
            : new Command(this, { ...commandModule, category });

        this.commands.set(command.name.toLowerCase(), command);
        if (!this.categories.has(category)) this.categories.set(category, []);
        this.categories.get(category).push(command);

        logger.info(`Loaded command "${command.name}" (${category}/${file})`);
      }
    }

    return this;
  }

  /**
   * Loads every slash command file from a directory.
   * @param {string} directory Absolute path of `src/slash-commands`
   * @returns {this}
   */
  loadSlashCommands(directory) {
    if (!exists(directory)) {
      logger.warn(`Slash commands directory not found: ${directory}`);
      return this;
    }

    const files = readdirSync(directory).filter((file) => file.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(directory, file);
      const command = require(filePath);

      if (!command.name || typeof command.execute !== 'function') {
        throw new Error(`Slash command in ${file} is missing name or execute().`);
      }

      this.slashCommands.set(command.name.toLowerCase(), command);
      logger.info(`Loaded slash command "${command.name}" (${file})`);
    }

    return this;
  }

  /**
   * Registers every loaded slash command. Uses guild commands when
   * config.guildId is set (instant), otherwise global commands.
   * @returns {Promise<void>}
   */
  async registerSlashCommands() {
    const commands = [...this.slashCommands.values()].map((command) => ({
      name: command.name,
      description: command.description || 'No description provided.',
      options: command.options || [],
    }));

    if (commands.length === 0) return;

    if (this.config.guildId) {
      const guild =
        this.guilds.cache.get(this.config.guildId) ??
        (await this.guilds.fetch(this.config.guildId));
      await guild.commands.set(commands);
      logger.info(
        `Registered ${commands.length} slash command(s) in guild "${guild.name}"`,
      );
    } else {
      await this.application.commands.set(commands);
      logger.info(`Registered ${commands.length} global slash command(s)`);
    }
  }

  /**
   * Loads every event file from a directory.
   * @param {string} directory Absolute path of `src/events`
   * @returns {this}
   */
  loadEvents(directory) {
    if (!exists(directory)) {
      logger.warn(`Events directory not found: ${directory}`);
      return this;
    }

    const files = readdirSync(directory).filter((file) => file.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(directory, file);
      const eventModule = require(filePath);
      const event =
        eventModule instanceof Event ? eventModule : new Event(this, eventModule);

      const register = event.once ? this.once.bind(this) : this.on.bind(this);
      register(event.name, (...args) => event.execute(this, ...args));
      this.events.set(event.name.toLowerCase(), event);

      logger.info(`Loaded event "${event.name}" (${file})`);
    }

    return this;
  }

  /**
   * Finds a command by its name or any of its aliases.
   * @param {string} input
   * @returns {Command|undefined}
   */
  findCommand(input) {
    const name = input.toLowerCase();
    return (
      this.commands.get(name) ||
      [...this.commands.values()].find((command) => command.aliases.includes(name))
    );
  }
}

function exists(directory) {
  try {
    return statSync(directory).isDirectory();
  } catch {
    return false;
  }
}

module.exports = BotClient;
