module.exports = class BaseEvent {
    constructor(name) {
        this.name = name
        this.utils = require('../Utils');
        this.config = require('../../config/config.json');
        this.client = require('../../app');
    }
}