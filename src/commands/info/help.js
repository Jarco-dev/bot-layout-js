const StateManager = require("../../database/StateManager");
const BaseCommand = require("../../utils/structures/BaseCommand");

// command prefix tracking
const guildCmdPrefixes = new Map();
StateManager.on("cmdPrefixFetched", (guildId, cmdPrefix) => guildCmdPrefixes.set(guildId, cmdPrefix));
StateManager.on("cmdPrefixUpdate", (guildId, cmdPrefix) => guildCmdPrefixes.set(guildId, cmdPrefix));

module.exports = class HelpCommand extends BaseCommand {
    constructor() {
        super({
            name: "help",
            category: "Info",
            description: "Helps you understand my commands better",
            usage: "[command]",
            examples: ["help info","help ping"],
            botPermissions: ["SEND_MESSAGES","EMBED_LINKS"]
        });
    }

    async run(message, args) {
        // Categories to check for when showing help embed
        const helpCategories = ["Info", "Settings"];

        // get the command prefix
        let cmdPrefix = (message.channel.type === "dm") ? this.config.BOT.PREFIX : guildCmdPrefixes.get(message.channel.guild.id);

        // send a list of the commands if there are no arguments
        const devTag = (await this.client.users.fetch(this.config.BOT.DEVELOPER)).tag
        if(!args[0]) {
            const embed = this.utils.embed()
                .setColor(this.config.COLOR.DEFAULT)
                .setFooter(message.author.tag)
                .setTitle(`${this.client.user.username} command list`)
                .setDescription(`The current prefix is \`${cmdPrefix}\`\nFor more information use \`help <command>\`\nPlease report bugs to \`${devTag}\` when found.`)
                .setTimestamp();
            await addCommandFields(this.client, helpCategories, embed);
            return message.channel.send(embed);
        }

        // per command help
        else {
            // is a valid command
            const command = this.client.commands.get(args[0].toLowerCase());
            if (!command) return message.channel.send("❌  **|** That's not a valid command!");

            // turn arrays into help embed layout
            const aliases = [];
            command.aliases.forEach(alias => aliases.push(`\`${alias}\``));
            const examples = [];
            command.examples.forEach(example => examples.push(`\`${cmdPrefix}${example}\``));
     
            // create the embed and send it
            const embed = this.utils.embed()
                .setColor(this.config.COLOR.DEFAULT)
                .setFooter(`${message.author.tag} <> = required [] = optional`)
                .setTimestamp();
            if(command.usage) embed.setTitle(`\`${cmdPrefix}${command.name} ${command.usage}\``);
                else embed.setTitle(`\`${cmdPrefix}${command.name}\``)
            if(command.description) embed.addField("Description", `${command.description}`);
            if(examples.length > 0) embed.addField("Examples", examples.join("\n"), true)
            if(aliases.length > 0) embed.addField("Aliases", aliases.join(", "), true)
            message.channel.send(embed);
        }
        
        // get all the commands of a certain category and add them to the embed
        async function addCommandFields(client, categories, embed) {
            categories.forEach(async categorie => {
                const commands = [];
                await client.commands.forEach(command => {
                    if(command.category !== categorie) return;
                    if(commands.includes(`\`${command.name}\``)) return;
                    commands.push(`\`${command.name}\``);
                });
                embed.addField(categorie, commands.join(" "));
            });
            return embed;
        }
    }
}