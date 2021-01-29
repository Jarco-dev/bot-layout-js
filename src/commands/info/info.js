const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../database/StateManager");

// command prefix tracking
const guildCmdPrefixes = new Map();
StateManager.on("cmdPrefixFetched", (guildId, cmdPrefix) => guildCmdPrefixes.set(guildId, cmdPrefix));
StateManager.on("cmdPrefixUpdate", (guildId, cmdPrefix) => guildCmdPrefixes.set(guildId, cmdPrefix));

module.exports = class InfoCommand extends BaseCommand {
    constructor () {
        super({
            name: "info",
            aliases: ["stats", "statistics"],
            category: "Info",
            description: "Displays bot information",
            examples: ["info"],
            botPermissions: ["SEND_MESSAGES","EMBED_LINKS"]
        })
    }

    async run(message, args) {
        // get all the information needed to create the embed
        const uptime = this.utils.toTime(this.client.uptime);
        const users =  await client.guilds.cache.reduce((amount, guild) => amount + guild.memberCount, 0);
        const channels = this.client.channels.cache.size;
        const guilds = this.client.guilds.cache.size;
        const usedMemory = (process.memoryUsage().heapUsed/1024/1024).toFixed(1);
        const devTag = (await this.client.users.fetch(this.config.BOT.DEVELOPER)).tag;
        const cmdPrefix = (message.channel.guild) ? guildCmdPrefixes.get(message.channel.guild.id) : this.config.BOT.PREFIX;

        // create and send the embed
        const embed = this.utils.embed()
            .setColor(this.config.COLOR.DEFAULT)
            .setTimestamp()
            .setFooter(message.author.tag)
            .setTitle("Bot statistics")
            .setDescription(`Bot developed by \`${devTag}\`.\nFor command information please use \`${cmdPrefix}help\``)
            .addField("Uptime", uptime, true)
            .addField("Memory usage", `${usedMemory} MB`, true)
            .addField("Version", `v${this.config.BOT.VERISON}`, true)
            .addField("Guilds", guilds, true)
            .addField("Channels", channels, true)
            .addField("Users", users, true);
        message.channel.send(embed);
    }
}