const BaseEvent = require("../../utils/structures/BaseEvent");
const config = require("../../config/config.json");
const { Collection } = require("discord.js");
const StateManager = require("../../database/StateManager");
const cooldowns = new Collection();

// command prefix tracking
guildCmdPrefixes = new Map();
StateManager.on("cmdPrefixFetched", (guildId, cmdPrefix) => guildCmdPrefixes.set(guildId, cmdPrefix));
StateManager.on("cmdPrefixUpdate", (guildId, cmdPrefix) => guildCmdPrefixes.set(guildId, cmdPrefix));

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super("message")
    }

    run(message) {
        // author is not from a bot
        if (message.author.bot) return;
        
        // set the prefix depending on wether you're in a guild or in dm's
        let prefix;
        if(message.channel.type !== "dm") prefix = guildCmdPrefixes.get(message.channel.guild.id);
        else prefix = config.BOT.PREFIX;

        // starts with the guilds prefix
        if (!message.content.startsWith(prefix) && !message.content.startsWith(`<@!${this.client.user.id}>`) && !message.content.startsWith(`<@${this.client.user.id}>`)) return;

        // get the args and command name
        if(message.content.startsWith(`${prefix} `)) prefix = `${prefix} `
        else if(message.content.startsWith(`<@${this.client.user.id}>`)) prefix = `<@${this.client.user.id}> `
        else if(message.content.startsWith(`<@!${this.client.user.id}>`)) prefix = `<@!${this.client.user.id}> `

        const args = message.content.slice(prefix.length).split(/\s+/);
        if(args[0] === prefix) args.shift();
        const cmdName = args.shift().toLowerCase();

        // is a valid command
        const command = this.client.commands.get(cmdName);
        if (command) {
            if (!botHasPermission(command, message)) return;
            if (command.cooldown > 0) if (isOnCooldown(command, message)) return;
            command.run(message, args);
        }

        // processes the command cooldown
        function isOnCooldown(command, message) {
            if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());
            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = command.cooldown * 1000;
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeftInMs = expirationTime - now;
                    const timeLeft = (expirationTime - now) / 1000;
                    message.channel.send(`⏱ | **${message.author.username}**! Please wait ${timeLeft.toFixed(1)}s and try again!`)
                        .then(r => r.delete({ timeout: timeLeftInMs }))
                        .catch(err => { });
                    return true;
                }
            }
            else {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                return false;
            }
        }

        // checks wether the bot has the needed permissions
        function botHasPermission(command, message) {
            if(command.botPermissions.length === 0) return true;
            if(message.channel.type == "dm") return true;
            const bot = message.channel.guild.members.cache.get(command.client.user.id);
            const missingPerms = bot.permissionsIn(message.channel).missing(command.botPermissions)
            if(missingPerms.length === 0) return true;
            const missingPermsFormatted = [];
            missingPerms.forEach(permission => missingPermsFormatted.push(`\`${permission}\``));
            const missingPermsList = missingPermsFormatted.join(", ");
            message.reply(`I am missing ${(missingPerms.length > 1) ? "permissions" : "a permission"} to execute this command\nIf you wish to be able to use it please reinvite me or give me the following permission${(missingPerms.length > 1) ? "s" : ""}:\n${missingPermsList}`).catch(err => { });
            return false;
        }
    }
}