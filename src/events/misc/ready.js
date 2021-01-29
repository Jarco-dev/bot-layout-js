const BaseEvent = require("../../utils/structures/BaseEvent");
const Guilds = require("../../database/models/Guilds");
const GuildConfigs = require("../../database/models/GuildConfigs");
const StateManager = require("../../database/StateManager");
const register = require("../../utils/register");

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super("ready")
    }

    async run() {
        console.log(`[BOT] ${this.client.user.tag} logged in.`);
        
        try{
            //update the guilds that where created or deleted while the bot was offline
            const dbGuildIds = [];
            const cachedGuildIds = [];
            const toAddGuilds = [];
            const toDelGuilds = [];

            // push the cached and database guilds into id's
            await this.client.guilds.cache.forEach(guild => cachedGuildIds.push(guild.id));        
            const dbGuilds = await Guilds.findAll({attributes: ["guildId"]}).catch(err => console.log(err));
            dbGuilds.forEach(Guild => dbGuildIds.push(Guild.guildId));

            // filter out crated and deleted guilds
            dbGuildIds.forEach(dbGuildId => {
                if(!cachedGuildIds.includes(dbGuildId)) toDelGuilds.push(dbGuildId);
            });
            cachedGuildIds.forEach(cachedGuildId => {
                if(!dbGuildIds.includes(cachedGuildId)) toAddGuilds.push(cachedGuildId);
            });

            // update the database's guilds table
            toAddGuilds.forEach(guildId => {
                Guilds.create({guildId: guildId})
                .then(() => {
                    GuildConfigs.create({guildId: guildId});
                    StateManager.emit("cmdPrefixUpdate", guildId, this.config.BOT.PREFIX);
                }).catch(err => console.log(err));;
            });
            toDelGuilds.forEach(guildId => {
                Guilds.destroy({where: {guildId: guildId}})
                .catch(err => console.log(err));
            });

            // run/register feaures
            await register.features(this.client);

            // fetch and cache prefixes per guild
            (async () => {
                await GuildConfigs.findAll({
                    attributes: ["guildId","cmdPrefix"]
                })
                .then(results => {
                    results.forEach(result => {
                        StateManager.emit("cmdPrefixFetched", result.guildId, result.cmdPrefix || config.BOT.PREFIX);
                    });
                }).catch(err => console.log(err));
            })();
        }
        catch(err) {
            await console.log("Fatal error while starting up bot\n", err);
            process.exit();
        }
    }
}