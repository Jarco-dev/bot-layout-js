const BaseEvent = require("../utils/structures/BaseEvent");
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
         * All the currently loaded events
         * @type {Object}
         */
        this.events = {};

        /**
         * The path to the commands folder
         * @type {String}
         */
        this.path = "./src/events/"
    }

    /**
     * Load all the commands that are available
     * @returns {void}
     */
    async loadAll() {
        // Get all the folders
        const folders = await fs.readdir(this.path);
        for (const folder of folders) {
            // Load the events if it's a folder
            if ((await fs.lstat(this.path + folder)).isDirectory()) {
                const files = await fs.readdir(this.path + folder);
                // Go through all the event files
                for (const file of files) {
                    if (file.endsWith(".js")) {
                        // Load the event
                        try {
                            const Event = require(path.join(__dirname, `${folder}/${file}`));
                            if (Event.prototype instanceof BaseEvent) {
                                const event = new Event();
                                this.client.on(event.name, event.run.bind(event))
                                this.events[event.name] = event;
                            }
                        } catch (err) {
                            this.logger.error(`Error while trying to load a event eventFile: ${file}`, err);
                        }
                    }
                }
            }
        }
    }
}

module.exports = CommandLoader;

/**
 * @typedef {import("../Bot")} Client
 */
