const Guilds = require("../../database/models/Guilds");
const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class GuildDeleteEvent extends BaseEvent {
    constructor() {
        super("guildDelete")
    }

    run(guild) {
        Guilds.destroy({where: {guildId: guild.id}});
    }
}