const Utils = require("../utils/Utils");
const Users = require("../database/models/Users");
const Guilds = require("../database/models/Guilds");
const GuildConfigs = require("../database/models/GuildConfigs");
const StateManager = require("../database/StateManager");
const config = require("../config/config.json");

// delete the guild data if the bot left while offline
// create the guild if the bot joined while offline
const syncGuildsTables = async (client) => {
    const dbGuildIds = [];
    const cachedGuildIds = [];
    const toAddGuilds = [];
    const toDelGuilds = [];

    await client.guilds.cache.forEach(guild => cachedGuildIds.push(guild.id));        
    const dbGuilds = await Guilds.findAll({attributes: ["guildId"]});
    dbGuilds.forEach(Guild => dbGuildIds.push(Guild.guildId));

    dbGuildIds.forEach(dbGuildId => {
        if(!cachedGuildIds.includes(dbGuildId)) toDelGuilds.push(dbGuildId);
    });
    cachedGuildIds.forEach(cachedGuildId => {
        if(!dbGuildIds.includes(cachedGuildId)) toAddGuilds.push(cachedGuildId);
    });

    toAddGuilds.forEach(guildId => {
        Guilds.create({guildId: guildId})
        .then(() => {
            GuildConfigs.create({guildId: guildId});
            StateManager.emit("cmdPrefixUpdate", guildId, config.BOT.PREFIX);
        }).catch(err => console.log(err));;
    });
    toDelGuilds.forEach(guildId => {
        Guilds.destroy({where: {guildId: guildId}})
        .catch(err => console.log(err));
    });
}

module.exports.run = async (client) => {
    await syncGuildsTables(client);
}