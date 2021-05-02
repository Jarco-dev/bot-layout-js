const BaseEvent = require("../../utils/structures/BaseEvent");

/**
 * @typedef {import("discord.js").MessageReaction} MessageReaction
 * @typedef {import("discord.js").User} User
 */

class MessageReactionRemoveEvent extends BaseEvent {
    constructor() {
        super("messageReactionRemove");
    }

    /**
     * Run the event
     * @param {MessageReaction} reaction - The message reaction
     * @param {User} user - The user reaction
     */
    run(reaction, user) {
        this.ReactionCollector.react(reaction.message, reaction.emoji.name, user.id, "remove");
    }
}

module.exports = MessageReactionRemoveEvent;