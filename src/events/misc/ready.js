const BaseEvent = require("../../utils/structures/BaseEvent");
const GuildConfigs = require("../../database/models/GuildConfigs");
const StateManager = require("../../database/StateManager");
const register = require("../../utils/register");
const config = require("../../config/config.json");

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super("ready")
    }

    async run() {
        // process event
        console.log(`[BOT] ${this.client.user.tag} logged in.`);
        
        try{
            // register and run feaures
            await register.features(this.client);

            // fetch and cache prefixes per guild
            await GuildConfigs.findAll({attributes: ["guildId","cmdPrefix"]}).then(results => {
                results.forEach(result => {
                    StateManager.emit("cmdPrefixFetched", result.guildId, result.cmdPrefix || config.BOT.PREFIX);
                });
            });
        }
        catch(err) {
            await console.log("Fatal error while starting up bot\n", err);
            process.exit();
        }
    }
}