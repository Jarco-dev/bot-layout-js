const BaseCommand = require("../../utils/structures/BaseCommand");

class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "ping",
            description: "View the bots response time",
            options: [{
                type: "STRING",
                name: "action",
                description: "Extra actions for the ping command",
                choices: [{
                    name: "Explain",
                    value: "explain"
                }]
            }],
            cooldown: 3000,
            status: "enabled"
        });

        /**
         * RTT emoji
         * @type {String}
         */
        this.rttEmoji = "🔁";

        /**
         * Heartbeat emoji
         * @type {string}
         */
        this.hbEmoji = "💟";
    }

    /**
     * Run the command
     * @param {CommandInteraction} i - The command interaction
     */
    async run(i) {
        // Ping action
        switch (i?.options?.getString("action", false)) {

            // Explain
            case "explain": {
                const explainEmbed = this.global.embed()
                    .setTitle("Ping explanation")
                    .setDescription(`
                        ${this.rttEmoji} **RTT**: The delay between you sending the message and the bot replying
                        ${this.hbEmoji} **Heartbeat**: The delay between the bot and the discord api servers
                    `);
                this.sender.reply(i, { embeds: [explainEmbed], ephemeral: true });
                break;
            }

            // Ping (default)
            default: {
                // Send a pinging message
                const pingingEmbed = this.global.embed()
                    .setTitle("Pinging...");
                const reply = await this.sender.reply(i, { embeds: [pingingEmbed], ephemeral: true, fetchReply: true });

                // Calculate the delay and edit the reply
                const timeDiff = reply.createdTimestamp - i.createdTimestamp;
                const resultEmbed = this.global.embed()
                    .setTitle("Ping result")
                    .setDescription(`
                        ${this.rttEmoji} **RTT**: ${timeDiff}ms
                        ${this.hbEmoji} **Heartbeat**: ${this.client.ws.ping}ms
                    `);
                this.sender.reply(i, { embeds: [resultEmbed] }, { method: "editReply" });
            }
        }
    }
}

module.exports = PingCommand;

/**
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 */
