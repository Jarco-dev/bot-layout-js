/**
 * CooldownManager
 * The class that handles with command cooldowns
 */
class CooldownManager {
    /**
     * Constructor
     * @param {Client} client - The client instance
     */
    constructor(client) {
        /** @private */
        this.client = client;

        /** @private */
        this.logger = client.logger;

        /** @private */
        this.global = client.global;

        /** @private */
        this.sender = client.sender;

        /**
         * All the currently active cooldowns
         * @type {Object}
         */
        this.cooldown = {};
    }

    /**
     * Check if the user is on cooldown or not
     * @param {CommandInteraction} i - The command interaction
     * @param {Command} command - The requested command
     * @return {Boolean}
     */
    check(i, command) {
        const key = `${command.name}_${i.user.id}`;

        if (this.cooldown[key]) {
            let channelPerms = (i.inGuild()) ? i.channel.permissionsFor(this.client.user.id) : "NotInGuild";
            if (!i.inGuild() || (channelPerms.has("VIEW_CHANNEL") && channelPerms.has("SEND_MESSAGES") && channelPerms.has("EMBED_LINKS"))) {
                const diff = this.cooldown[key] - Date.now();
                const timeLeft = this.global.parseTime((diff >= 1000) ? diff : 1000);
                this.sender.reply(i, {
                    content: `Please wait \`${timeLeft}\` and try again`,
                    ephemeral: true
                }, { msgType: "time" });
            }
            return true;
        } else {
            this.cooldown[key] = Date.now() + command.cooldown;
            setTimeout(() => delete this.cooldown[key], command.cooldown);
            return false;
        }
    }
}

module.exports = CooldownManager;

/**
 * @typedef {import("../Bot")} Client
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("./structures/BaseCommand")} Command
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 */
