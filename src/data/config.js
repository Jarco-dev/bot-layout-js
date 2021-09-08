const { Intents } = require("discord.js");

module.exports = {

    // Bot colors
    colors: {
        default: "F88038"
    },

    // Message type emojis and colors
    msgTypes: {
        success: { emoji: "✅", color: "00FF00" },
        invalid: { emoji: "❌", color: "ORANGE" },
        error: { emoji: "⚠", color: "FF0000" },
        time: { emoji: "⏱", color: "ORANGE" }
    },

    /**
     * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
     *   THE SETTINGS BELOW CAN BREAK THE BOT IT'S BETTER NOT TO TOUCH THIS
     * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
     */

    /**
     * Discord.js client options
     * @type {ClientOptions}
     */
    clientOptions: {
        intents: [
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_INTEGRATIONS,
            Intents.FLAGS.GUILD_INVITES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGE_TYPING,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_WEBHOOKS
        ]
    }
}

/**
 * @typedef {import("discord.js").ClientOptions} ClientOptions
 */
