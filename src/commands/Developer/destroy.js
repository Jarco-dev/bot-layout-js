const { Collection } = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class DestroyCommand extends BaseCommand {
    constructor() {
        super({
            name: "destroy",
            aliases: ["terminate","shutdown"],
            category: "Dev only",
            description: "Shut down the bot incase of an emergency",
            examples: ["destroy"],
            cooldown: 3,
            botPermissions: ["SEND_MESSAGE"]
        });
        this.runningConfirmations = new Collection();
    }

    async run(message, args) {
        // check permissions
        if(message.author.id !== this.config.BOT.OWNER) return message.channel.send("❌  **|** You don't have the permission to use this command.");

        // return if there is already a confirmation awaiting a reply
        const timeLeft = this.runningConfirmations.get(message.author.id) - Date.now();
        if(Date.now() < this.runningConfirmations.get(message.author.id)) {
            return message.author.send(`❌  **|** You already have a open confirmation action!\nThis action will expire in: ${(timeLeft / 1000).toFixed(1)}s`)
                .then(r => r.delete({ timeout: timeLeft })).catch(err => {});
        }

        // send the message and await the random string to confirm the action
        const rndString = this.utils.getRandomString(6);
        console.log("[DestroyCommand] A request to terminate the bot has been send");
        this.runningConfirmations.set(message.author.id, Date.now() + 30000);
        const embed = this.utils.embed()
            .setColor(this.config.COLOR.DEFAULT)
            .setTitle(`To confirm send to this channel: ${rndString}`)
            .setDescription("To cancel send any other message to this channel");
        await message.author.send(embed)
            .then(r => {
                r.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 30000})
                    .then(async collected => {

                        if (collected.first().content === rndString) {
                            const embed = this.utils.embed()
                                .setColor(this.config.COLOR.RED)
                                .setTitle("⚠  **SHUTTING DOWN**  ⚠");
                            await r.edit("Action confirmed", embed);
                            console.log(`[DestroyCommand] Bot shut down by: "${message.author.id}" aka "${message.author.tag}"`);
                            process.exit();
                        }
                        else {
                            console.log("[DestroyCommand] Request cancled");
                            r.edit("Action has been cancled").catch(err => {});
                        }
                    }).catch(() => {
                        console.log("[DestroyCommand] Request expired");
                        r.edit("Action timed out after 30 seconds").catch(err => {});
                    });
            });
    }
}