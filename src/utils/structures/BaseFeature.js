/**
 * BaseFeature
 * The class handeling all the feature parameters
 */
class BaseFeature {
    /**
     * Constructor
     * @param {String} name - The name of the event
     */
    constructor(name) {
        // Feature parameters
        this.name = name;

        // Client parameters
        this.client = require("../../Bot");
        this.db = this.client.db;
        this.sConfig = this.client.sConfig;
        this.config = this.client.config;
        this.logger = this.client.logger;
        this.sender = this.client.sender;
        this.global = this.client.global;
    }
}

module.exports = BaseFeature;
