const Discord = require("discord.js");

/**
 * DataManager
 * The manager for cache like data
 */
class DataManager {
    /**
     * Constructor
     * @param {Client} client - The client instance
     */
    constructor(client) {
        /** @private */
        this.client = client;

        this.ExampleTable = new ExampleTable(client);
    }
}

/**
 * ExampleTable
 * A example cache handler
 */
class ExampleTable {
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
        this.db = client.db;

        /**
         * The example data cache mapped by the key
         * @type {import("discord.js").Collection<String, ExampleData>}
         */
        this.cache = new Discord.Collection();
    }

    /**
     * Fetch example data or get it from the cache if already available
     * @param {String} key - The key of the row
     * @param {DataManagerFetchOptions} options - The fetch options
     * @returns {Promise<?ExampleData>}
     */
    async fetch(key, { cache = true, force = false } = {}) {
        try {
            // Check the cache
            if (key && !force) {
                const existing = this.cache.get(key);
                if (existing) return existing;
            }

            // Fetch the data
            const data = await this.db.ExampleTable.findOne({ where: { key: key } });
            if (!data) return;

            const exampleData = new ExampleData(data);
            if (cache) this.cache.set(key, exampleData);
            return exampleData
        } catch (err) {
            this.logger.error(`Error while fetching example data key: ${key}`, err);
        }
    }

    /**
     * Update the example data if it's cached
     * @param {String} key - The key to update
     * @param {String} value - The new value for the key
     * @returns {void}
     */
    async update(key, value) {
        const exampleData = this.cache.get(key);
        if (exampleData) exampleData[key] = value;
    }
}

/**
 * ExampleData
 * The class to parse ExampleTable data
 */
class ExampleData {
    /**
     * Constructor
     * @param {Object} p - The example parameters
     * @param {String} p.key - The key of the row
     * @param {String} p.value - The value of the row
     */
    constructor(p) {
        this.key = p.key;
        this.value = p.value;
    }
}

module.exports = DataManager;

/**
 * @typedef {Object} DataManagerFetchOptions
 * @property {Boolean} [cache=true] - Cache the fetched value?
 * @property {Boolean} [force=false] - Skip the cache and force fetch?
 */
