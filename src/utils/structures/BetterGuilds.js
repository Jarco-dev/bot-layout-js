const Discord = require("discord.js");
const GuildConfigs = require("../../database/models/GuildConfigs")

exports = Discord.Structures.extend("Guild", Guild => {
    /**
     * BetterGuild
     * A extension of the discord.js guild class
     */
    class BetterGuild extends Guild {
        constructor(client, data) {
            super(client, data);

            this.prefix;
        }

        /**
         * Fetch the guilds command prefix
         * @returns {String}
         */
        async fetchPrefix() {
            if (!this.prefix) {
                this.prefix = (await GuildConfigs.findOne({ where: { guildId: this.id } })).prefix;
                return this.prefix;
            } else {
                return this.prefix;
            }
        }
    }

    return BetterGuild;
});