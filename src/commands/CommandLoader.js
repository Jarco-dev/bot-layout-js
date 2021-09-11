const BaseCommand = require("../utils/structures/BaseCommand");
const fs = require("fs").promises;
const path = require("path");

/**
 * CommandLoader
 * The class for loading and unloading commands
 */
class CommandLoader {
    /**
     * Constructor
     * @param {Client} client - The client instance
     */
    constructor(client) {
        /** @private */
        this.client = client;

        /** @private */
        this.logger = client.logger;

        /** @private */
        this.config = client.config;

        /**
         * All currently loaded commands
         * @type {Object}
         */
        this.commands = {};

        /**
         * The path to the commands folder
         * @type {String}
         */
        this.path = "./src/commands/"
    }

    /**
     * Load all the commands that are available
     * @returns {void}
     */
    async loadAll() {
        // Get all the folders
        const folders = await fs.readdir(this.path);
        for (const folder of folders) {
            // Load the commands if it's a folder
            if ((await fs.lstat(this.path + folder)).isDirectory()) {
                const files = await fs.readdir(this.path + folder);
                // Go through all the command files in the folder and load them
                for (const file of files) {
                    if (file.endsWith(".js")) {
                        // Load the command
                        try {
                            const Command = require(path.join(__dirname, `${folder}/${file}`));
                            if (Command.prototype instanceof BaseCommand) {
                                const command = new Command();
                                this.commands[command.name] = command;
                            }
                        } catch (err) {
                            this.logger.error(`Error while trying to load a command commandFile: ${file}`, err);
                        }
                    }
                }
            }
        }
    }

    /**
     * Create and or update all the commands with the "enabled" status
     * @param {"enabled"|"dev"|"all"} status - What should the status of the command be for it to be updated
     * @param {Snowflake} [guildId] - The id of the guild to update the commands in (none = global)
     * @returns {void}
     */
    async updateCommands(status, guildId) {
        if (!["enabled", "dev", "all"].includes(status)) throw new Error("status is a invalid value");
        await this.client.application.fetch();
        const data = [];
        for (let command in this.commands) {
            command = this.commands[command];
            if ((status !== "all" && command.status !== status) || command.status === "disabled") continue;
            data.push({
                name: command.name,
                description: command.description,
                type: command.type,
                options: command.options,
                defaultPermission: command.defaultPermission
            });
        }

        this.client.application.commands.set(data, guildId)
            .then(commands => this.logger.info(`Updated ${commands.size} application command(s) status: ${status} guild: ${(guildId) ? guildId : "None"}`))
            .catch(err => this.logger.error(`Error while updating application command(s) status: ${status} guild: ${(guildId) ? guildId : "None"}`, err));
    }
}

module.exports = CommandLoader;

/**
 * @typedef {import("../Bot")} Client
 */
