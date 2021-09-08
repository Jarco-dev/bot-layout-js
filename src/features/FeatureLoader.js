const BaseFeature = require("../utils/structures/BaseFeature");
const fs = require("fs").promises;
const path = require("path");

/**
 * FeatureLoader
 * The class for loading and unloading features
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
         * All the currently loaded features
         */
        this.features = {};

        /**
         * The path to the features folder
         */
        this.path = "./src/features/"
    }

    /**
     * Load all the features that are available
     * @returns {void}
     */
    async loadAll() {
        // Get all the folders
        const folders = await fs.readdir(this.path);
        for (const folder of folders) {
            // Load the features if it's a folder
            if ((await fs.lstat(this.path + folder)).isDirectory()) {
                const files = await fs.readdir(this.path + folder);
                // Go through all the feature files
                for (const file of files) {
                    if (file.endsWith(".js")) {
                        // Load the feature
                        try {
                            const Feature = require(path.join(__dirname, `${folder}/${file}`));
                            if (Feature.prototype instanceof BaseFeature) {
                                const feature = new Feature();
                                this.features[feature.name] = feature;
                            }
                        } catch (err) {
                            this.logger.error(`Error while trying to load a feature featureFile: ${file}`, err);
                        }
                    }
                }
            }
        }
    }

    /**
     * Start all the loaded features
     * @returns {void}
     */
    async startAll() {
        for (const feature in this.features) {
            try {
                this.features[feature].start();
            } catch (err) {
                this.logger.error(`Error while starting a feature feature: ${feature}`, err);
            }
        }
    }
}

module.exports = CommandLoader;

/**
 * @typedef {import("../Bot")} Client
 */
