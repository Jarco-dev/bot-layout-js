const GuildConfigs = require("../../database/models/GuildConfigs");
const StateManager = require("../../database/StateManager");
const BaseCommand = require("../../utils/structures/BaseCommand");

// command prefix tracking
const guildCmdPrefixes = new Map();
StateManager.on("cmdPrefixFetched", (guildId, cmdPrefix) => guildCmdPrefixes.set(guildId, cmdPrefix));
StateManager.on("cmdPrefixUpdate", (guildId, cmdPrefix) => guildCmdPrefixes.set(guildId, cmdPrefix));

module.exports = class TestCommand extends BaseCommand {
    constructor() {
        super({
            name: "prefix",
            category: "Settings",
            description: "Shows you the current prefix or updates the prefix",
            usage: "[new prefix]",
            examples: ["prefix","prefix ,","prefix myprefix"],
            botPermissions: ["SEND_MESSAGES"]
        })
    }
    async run(message, args) {
        // message is not in dm's
        if(!message.channel.guild) return message.channel.send(`The prefix in my dm's is: \`${this.config.BOT.PREFIX}\``);

        // with out arguments return the default prefix
        const guild = message.channel.guild
        const cmdPrefix = guildCmdPrefixes.get(guild.id);
        if(args.length === 0) return message.channel.send(`The prefix for **${guild.name}** is: \`${cmdPrefix}\``);

        // user has administration permissions
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ **|** You don't have the permission to use this command");

        // set the cmdPrefix with a max length of 10 characters
        if(args[0].length > 10) return message.channel.send("❌ **|** The prefix must be 10 characters or less");
        try {
            await GuildConfigs.update({cmdPrefix: args[0]}, {where: {guildId: guild.id}});
            StateManager.emit("cmdPrefixUpdate", guild.id, args[0]);
            message.channel.send(`The prefix for **${guild.name}** has been updated to: \`${args[0]}\``);
        }
        catch(err) {
            console.log(err);
            const devTag = this.client.users.cache.get(this.config.BOT.DEVELOPER);
            return message.channel.send(`❌ **|** An error occured if this keeps happening please contact my dev \`${devTag.tag}\``);
        }
    }
}