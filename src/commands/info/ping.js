const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "ping",
            category: "Info",
            description: "Pings the bot and api connection",
            examples: ["ping"],
            botPermissions: ["SEND_MESSAGES","MANAGE_MESSAGES"]
        })
    }

    async run(message, args) {
        // process command
        const sent = await message.channel.send("🔂 **RTT**: ??? ms\n💟 **Heartbeat**: ??? ms");
        const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        return sent.edit([
            `🔂 **RTT**: ${timeDiff} ms`,
            `💟 **Heartbeat**: ${Math.round(this.client.ws.ping)} ms`,
        ]);
    }
}