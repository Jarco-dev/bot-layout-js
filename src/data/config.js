module.exports = {

    // The bots default prefix (Will only change it for new guilds and dm's)
    "prefix": ".",

    // Embed colors
    "colors": {
        "default": "ff4800",
        "good": "00ff00",
        "bad": "ff0000"
    },

    // Emojis used by the bot
    "emoji": {
        "success": "✅",
        "invalid": "❌",
        "error": "⚠",
        "time": "⏱",
        "repeat": "🔁",
        "heartbeat": "💟"
    },

    // Discord.js client options
    "clientOptions": {
        "messageEditHistoryMaxSize": 0,
        "disableMentions": "everyone",
        "ws": {
            "intents": [
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