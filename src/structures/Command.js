'use strict';

/**
 * Base class for every prefix command.
 *
 * Each file inside `src/commands/<category>/` exports either:
 *   - an instance of this class, or
 *   - a plain options object that BotClient wraps into a Command.
 *
 * Options:
 *   name        (string)  Command name used after the prefix (required)
 *   description (string)  Short description of what the command does
 *   aliases     (string[]) Alternative names that also trigger the command
 *   category    (string)  Folder the command lives in (set automatically)
 *   adminOnly   (boolean) Whether the command is restricted to admins (default: true)
 *   usage       (string)  Example usage shown to the user
 *   execute     (function) (client, message, args) => Promise<void> (required)
 */
class Command {
  constructor(client, options = {}) {
    this.client = client;
    this.name = options.name;
    this.description = options.description || 'No description provided.';
    this.aliases = options.aliases || [];
    this.category = options.category || 'general';
    this.adminOnly = options.adminOnly !== false; // admin-only by default
    this.usage = options.usage || `${client ? client.config.prefix : '!'}${this.name}`;
    this.execute = options.execute;
    this.owner = options.owner || false;

    if (!this.name || typeof this.name !== 'string') {
      throw new Error(`Command in ${options.category || 'unknown'} is missing a name.`);
    }
    if (typeof this.execute !== 'function') {
      throw new Error(`Command "${this.name}" is missing an execute() function.`);
    }
  }
}

module.exports = Command;
