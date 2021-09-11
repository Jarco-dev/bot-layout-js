const fs = require("fs");
const db = require("sequelize");

/**
 * Database
 * The database wrapper for mysql
 */
class Sequelize {
    /**
     * Constructor
     * @param {Client} client - The client instance
     */
    constructor(client) {
        /** @private */
        this.client = client;

        /** @private */
        this.auth = client.auth;

        /** @private */
        this.logger = client.logger;

        /**
         * The database connection
         * @type {Sequelize}
         */
        this.con = new db.Sequelize(this.auth.mysql_database, this.auth.mysql_user, this.auth.mysql_password, {
            logging: (log) => this.logger.verbose(log),
            dialect: "mysql",
            host: this.auth.mysql_host,
            define: {
                freezeTableName: true
            }
        });

        this._initModels();
    }

    /**
     * Find and initialise all the models
     * @returns {void}
     * @private
     */
    async _initModels() {
        try {
            fs.readdirSync("./src/database/models")
                .filter((file) => (file.indexOf(".") !== 0 && file.endsWith(".js")))
                .forEach((file) => require(`./models/${file}`).init(this.con));
        } catch (err) {
            this.logger.error("Error while initialising database models", err);
        }
    }
}

module.exports = Sequelize;

/**
 * @typedef {import("../Bot")} Client
 */
