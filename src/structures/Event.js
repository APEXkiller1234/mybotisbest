'use strict';

/**
 * Base class for every event.
 *
 * Each file inside `src/events/` exports either:
 *   - an instance of this class, or
 *   - a plain options object that BotClient wraps into an Event.
 *
 * Options:
 *   name    (string)  Discord.js event name (e.g. "messageCreate") (required)
 *   once    (boolean) Register with client.once() instead of client.on()
 *   execute (function) (...args) => void (required)
 */
class Event {
  constructor(client, options = {}) {
    this.client = client;
    this.name = options.name;
    this.once = options.once || false;
    this.execute = options.execute;

    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Event is missing a name.');
    }
    if (typeof this.execute !== 'function') {
      throw new Error(`Event "${this.name}" is missing an execute() function.`);
    }
  }
}

module.exports = Event;
