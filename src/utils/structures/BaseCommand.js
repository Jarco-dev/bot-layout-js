/**
 * BaseCommand
 * The class handeling all the command parameters
 */
class BaseCommand {
    /**
     * Constructor
     * @param {Object} p - The parameters for the command
     * @param {String} p.name - The application command name
     * @param {String} p.description - The application command description
     * @param {ApplicationCommandType} [p.type="CHAT_INPUT"] - The application command type
     * @param {ApplicationCommandOptionsData[]} [p.options] - The application command options
     * @param {Boolean} [p.defaultPermission] - The application command defaultPermission setting
     * @param {Number} [p.cooldown=0] - How long a user has to wait before using it again
     * @param {Boolean} [p.nsfw=false] - Should it be locked to nsfw channels?
     * @param {Boolean} [p.disableDm=false] - Should it be usable in dms?
     * @param {PermissionResolvable[]} [p.botPermissions=[]] - The permissions the bot needs to execute the command
     * @param {CommandStatus} [p.status="disabled"] - The status of the application command indicating how it's handled
     */
    constructor({
        name,
        description,
        type = "CHAT_INPUT",
        options = undefined,
        defaultPermission = undefined,
        cooldown = 0,
        nsfw = false,
        disableDm = false,
        botPermissions = [],
        status = "disabled"
    }) {
        // Command parameters
        this.name = name;
        this.description = description;
        this.type = type;
        this.options = options;
        this.defaultPermission = defaultPermission;
        this.cooldown = cooldown;
        this.nsfw = nsfw;
        this.disableDm = disableDm;
        this.botPermissions = botPermissions;
        this.status = status;

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

module.exports = BaseCommand;

/**
 * The status of the command
 * Enabled: Enable globally
 * Disable: Disable globally
 * Dev: Enable in the development guild (secretConfig setting)
 * @typedef CommandStatus
 * @type {"enabled"|"disabled"|"dev"}
 */

/**
 * @typedef {import("discord.js").Guild} Guild
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("discord.js").PermissionResolvable} PermissionResolvable
 * @typedef {import("discord.js").ApplicationCommandData} ApplicationCommandData
 * @typedef {import("discord.js").ApplicationCommandType} ApplicationCommandType
 * @typedef {import("discord.js").ApplicationCommandOptionData} ApplicationCommandOptionsData
 */
