module.exports = {

    // The bots default prefix (Will only change it for new guilds and dm's)
    prefix: ".",

    // Embed colors
    colors: {
        default: "ff4800",
        good: "00ff00",
        bad: "ff0000"
    },

    // Major emojis used by the bot
    emoji: {
        // Message types
        success: "✅",
        invalid: "❌",
        error: "⚠",
        time: "⏱",
    },

    // Enable logging debug / verbose info (you will normally want to have this on false)
    debug: true,

    /**
     * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
     *   THE SETTINGS BELOW CAN BREAK THE BOT IT'S BETTER NOT TO TOUCH THIS
     * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
     */

    // Discord.js client options
    clientOptions: {
        messageEditHistoryMaxSize: 0,
        disableMentions: "everyone",
        ws: {
            intents: [
                "GUILDS",
                "GUILD_MEMBERS",
                "GUILD_BANS",
                "GUILD_EMOJIS",
                "GUILD_INTEGRATIONS",
                "GUILD_WEBHOOKS",
                "GUILD_INVITES",
                "GUILD_VOICE_STATES",
                "GUILD_PRESENCES",
                "GUILD_MESSAGES",
                "GUILD_MESSAGE_REACTIONS",
                "GUILD_MESSAGE_TYPING",
                "DIRECT_MESSAGES",
                "DIRECT_MESSAGE_REACTIONS",
                "DIRECT_MESSAGE_TYPING"
            ]
        }
    }
}