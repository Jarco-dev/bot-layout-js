const Discord = require("discord.js");

/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("discord.js").ClientOptions} ClientOptions
 */

/**
 * Client
 * The discord.js client
 */
class Client extends Discord.Client {
    /**
     * Options for the Client
     * @typedef {ClientOptions} ClientOptions
     */

    /**
     * @param {ClientOptions} [options] - Options for the client
     */
    constructor(options = {}) {
        // Extend Discord.js structures
        require("./utils/structures/BetterGuilds");

        super(options);

        // secret
        this.auth = require("../secret/auth.json");

        // Bot configs
        this.config = require("./data/config.json");
        this.version = require("../package.json").version;
        this.debug = this.config.debug;

        // Logger
        this.logger = new (require("./utils/Logger"))((this.debug) ? "verbose" : "info");

        // Database
        this.sequelize = new (require("./database/Sequelize"))(this);
        this.db = {
            GuildConfigs: require("./database/models/GuildConfigs")
        }

        // Message sender
        this.sender = new (require("./utils/Sender"))(this);

        // Global functions
        this.global = new (require("./utils/Global"))(this);

        // Cooldown check
        this.cooldown = new (require("./utils/Cooldown"))(this);

        // ReactionCollector (Custom)
        this.reactionCollector = new (require("./utils/ReactionCollector"))(this);

        // Command handler
        this.commandLoader = new (require("./commands/CommandLoader"))(this);
        this.commandLoader.loadAll();

        // Event handler
        this.eventLoader = new (require("./events/EventLoader"))(this);
        this.eventLoader.loadAll();

        // Feature handler
        this.featureLoader = new (require("./features/FeatureLoader"))(this);
        this.featureLoader.loadAll();
    }
}

module.exports = new Client((require("./data/config.json")).clientOptions);