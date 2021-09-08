/**
 * BaseEvent
 * The class handeling all the event parameters
 */
class BaseEvent {
    /**
     * Constructor
     * @param {String} name - Name of the event
     */
    constructor(name) {
        // Event parameters
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

module.exports = BaseEvent;
