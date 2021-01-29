module.exports = async () => {
    // require the statemanager
    const StateManager = require("../database/StateManager");

    // require all the models
    const Guilds = require("../database/models/Guilds");
    const GuildConfigs = require("../database/models/GuildConfigs");

    // connect to the database
    await StateManager.connection.authenticate()
    .then(async () => {
        // confirm connection
        console.log("[DATABASE] Succesfully connected");

        // initialise the models
        Guilds.init(StateManager.connection);
        GuildConfigs.init(StateManager.connection);

        // register associations

        // One to One (Guild, GuildConfig)
        Guilds.hasOne(GuildConfigs, {
            sourceKey: "guildId",
            foreignKey: "guildId",
            onUpdate: "cascade",
            onDelete: "cascade"
        });
        GuildConfigs.belongsTo(Guilds, {
            targetKey: "guildId",
            foreignKey: "guildId"
        });

        await StateManager.connection.sync()
    })
    .catch(async err => {
        await console.log("[DATABASE] Failed to connect\n", err);
        process.exit();
    });
}