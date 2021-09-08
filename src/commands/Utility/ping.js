const BaseCommand = require("../../utils/structures/BaseCommand");

class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "ping",
            description: "View the bots response time",
            options: [{
                type: "SUB_COMMAND",
                name: "explain",
                description: "Explains how the response time is established"
            }],
            cooldown: 3000,
            botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
            status: "enabled"
        });

        this.repeatEmoji = "🔁";
        this.heartEmoji = "💟";
    }

    /**
     * Run the command
     * @param {CommandInteraction} i - The command interaction
     */
    async run(i) {
        // Subcommands
        switch (i?.options?.getSubcommand(false)) {

            // Explain
            case "explain": {
                const explainEmbed = this.global.embed()
                    .setTitle("Ping explanation")
                    .setDescription(`
                        ${this.repeatEmoji} **RTT**: The delay between you sending the message and the bot replying
                        ${this.heartEmoji} **Heartbeat**: The delay between the bot and the discord api servers
                    `);
                this.sender.reply(i, { embeds: [explainEmbed] });
                break;
            }

            // Default command (ping the bot)
            default: {
                // Send a reply indication that we're pinging
                const pingingEmbed = this.global.embed().setTitle("Pinging...");
                const reply = await this.sender.reply(i, { embeds: [pingingEmbed], fetchReply: true });

                // Calculate the delay and edit the reply
                const timeDiff = reply.createdTimestamp - i.createdTimestamp;
                const resultEmbed = this.global.embed()
                    .setTitle("Ping result")
                    .setDescription(`
                        ${this.repeatEmoji} **RTT**: ${timeDiff}ms
                        ${this.heartEmoji} **Heartbeat**: ${this.client.ws.ping}ms
                    `);
                this.sender.reply(i, { embeds: [resultEmbed] }, { editReply: true });
                break;
            }
        }
    }
}

module.exports = PingCommand;

/**
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 */
