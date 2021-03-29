const GuildConfigs = require("../../database/models/GuildConfigs");
const Guilds = require("../../database/models/Guilds");
const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../database/StateManager");

module.exports = class GuildCreateEvent extends BaseEvent {
    constructor() {
        super("guildCreate")
    }

    run(guild) {
        // process event
        try {
            Guilds.create({guildId: guild.id});
            GuildConfigs.create({guildId: guild.id});
            StateManager.emit("cmdPrefixUpdate", guild.id, this.config.BOT.PREFIX);
        }
        catch(err) {
            console.log(err);
        }
    }
}