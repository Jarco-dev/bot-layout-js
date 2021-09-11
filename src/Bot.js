const Discord = require("discord.js");

/**
 * Client
 * The extended discord.js client
 */
class Client extends Discord.Client {
    /**
     * Constructor
     * @param {ClientOptions} [options] - Options for the client
     */
    constructor(options = {}) {
        super(options);

        // Secret configs
        this.auth = require("../secret/auth");
        this.sConfig = require("../secret/secretConfig");

        // Bot configs
        this.config = require("./data/config");
        this.config.version = require("../package.json").version;

        // Logger
        this.logger = new (require("./utils/Logger"));
        this.logger.setLogLevel(this.sConfig.logLevel);

        // Database
        this.sequelize = new (require("./database/Sequelize"))(this);
        this.db = {
            ExampleTable: require("./database/models/ExampleTable") // This is a example!
        }

        // Data manager
        this.dataManager = new (require("./utils/DataManager"))(this);

        // Message sender
        this.sender = new (require("./utils/Sender"))(this);

        // Global functions
        this.global = new (require("./utils/Global"))(this);

        // Cooldown check
        this.cooldownManager = new (require("./utils/CooldownManager"))(this);

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

module.exports = new Client((require("./data/config")).clientOptions);

/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("discord.js").ClientOptions} ClientOptions
 */
