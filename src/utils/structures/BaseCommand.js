module.exports = class BaseCommand {
    constructor({name, aliases, category, description, usage, examples, cooldown, botPermissions}) {
        this.utils = require('../Utils');
        this.config = require('../../config/config.json');
        this.client = require('../../app');

        this.name = name;
        this.aliases = aliases || [];
        this.category = category || "misc";
        this.description = description;
        this.usage = usage;
        this.examples = examples || [];
        this.cooldown = (cooldown == null) ? this.config.BOT.COOLDOWN : cooldown;
        this.botPermissions = botPermissions || [];
    }
}