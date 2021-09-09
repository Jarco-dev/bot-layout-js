const BaseEvent = require("../../utils/structures/BaseEvent");

class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super("interactionCreate");
        
        /** @private */
        this.commands = this.client.commandLoader.commands;

        /** @private */
        this.cooldownManager = this.client.cooldownManager;
    }

    /**
     * Run the event
     * @param {Interaction} i - The interaction
     */
    run(i) {
        try {
            // Application commands
            if (i.isCommand()) {
                // Get the corresponding command
                const command = this.commands[i.commandName];
                if (!command) throw new Error(`The ${i?.commandName} could not be found`);

                // Process command options
                if (i.inGuild()) {
                    const channelPerms = i.channel.permissionsFor(this.client.user.id);

                    // bot permissions
                    for (let perm in command.botPermissions) {
                        if (!channelPerms.has(command.botPermissions[perm])) {
                            if (channelPerms.has("VIEW_CHANNEL") && channelPerms.has("SEND_MESSAGES") && channelPerms.has("EMBED_LINKS")) {
                                this.sender.reply(i, `The bot doesn't have the \`${command.permissions[perm]}\` permission in ${i.channel}, Please contact a server admin!`, { msgType: "invalid" });
                            }
                            return;
                        }
                    }

                    // nsfw
                    if (command.nsfw && i.channel.nsfw) {
                        if (!channelPerms.has("VIEW_CHANNEL") && channelPerms.has("SEND_MESSAGES") && channelPerms.has("EMBED_LINKS")) {
                            this.sender.reply(i, "This command can only be used in **nsfw** channels!", {
                                delTime: 5000,
                                msgType: "invalid"
                            });
                        }
                        return;
                    }
                } else {
                    // disableDm
                    if (command.disableDm) {
                        this.sender.reply(i, "This command is disabled outside of servers!", {
                            delTime: 5000,
                            msgType: "invalid"
                        });
                        return;
                    }
                }

                // Check user command cooldown
                if (command.cooldown > 0 && this.cooldownManager.check(i, command)) return;

                // Run the command
                try {
                    command.run(i);
                } catch (err) {
                    this.logger.error(`Error while executing a command commandName: ${command.name}${(i.inGuild()) ? `guildId: ${i.guild.id}` : ""}`);
                    this.sender.reply(i, "Something went wrong while running the command, the command might have not worked fully!", { msgType: "error" });
                }
            }
        } catch (err) {
            this.logger.error(`Error while going through command handler`, err);
            this.sender.reply(i, "Something went wrong, please try again", { msgType: "error" });
        }
    }
}

module.exports = InteractionCreateEvent;

/**
 * @typedef {import("discord.js").Interaction} Interaction
 */
