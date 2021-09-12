const Discord = require("discord.js");

/**
 * Global
 * Global functions for use in the bot
 */
class Global {
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

        /** @private */
        this.sender = client.sender;
    }

    /**
     * Create and prepare a message embed
     * @returns {MessageEmbed}
     */
    embed() {
        return new Discord.MessageEmbed()
            .setColor(this.config.colors.default)
            .setTimestamp();
    }

    /**
     * Create a empty message embed
     * @returns {MessageEmbed}
     */
    emptyEmbed() {
        return new Discord.MessageEmbed();
    }

    /**
     * Create a button
     * @returns {MessageButton}
     */
    button() {
        return new Discord.MessageButton();
    }

    /**
     * Create a action row
     * @returns {MessageActionRow}
     */
    actionRow() {
        return new Discord.MessageActionRow();
    }

    /**
     * Create a select menu
     * @returns {MessageSelectMenu}
     */
    selectMenu() {
        return new Discord.MessageSelectMenu();
    }

    /**
     * Fetch a user
     * @param {Snowflake|UserMention} userId - The user you want to fetch
     * @returns {?User}
     */
    async fetchUser(userId) {
        if (userId) {
            userId = userId.match(/[0-9]+/)?.[0];
            if (userId) return await this.client.users.fetch(userId).catch(() => { });
        }
    }

    /**
     * Fetch a member from a guild
     * @param {Guild} guild - The guild of the member
     * @param {Snowflake|UserMention} userId - The id of the member you want to fetch
     * @returns {?Member}
     */
    async fetchMember(guild, userId) {
        if (guild && userId) {
            userId = userId.match(/[0-9]+/)?.[0];
            if (userId) {
                if (!guild.id) guild = this.client.guilds.resolve(guild.match(/[0-9]+/)[0]);
                return await guild.members.fetch(userId).catch(() => { });
            }
        }
    }

    /**
     * Fetch a role from a guild
     * @param {Guild|Snowflake} guild - The guild of the role
     * @param {Snowflake|RoleMention} roleId - The role you want to fetch
     * @returns {?Role}
     */
    async fetchRole(guild, roleId) {
        if (guild && roleId) {
            roleId = roleId.match(/[0-9]+/)?.[0];
            if (roleId) {
                if (!guild.id) guild = this.client.guilds.resolve(guild.match(/[0-9]+/)[0]);
                return await guild.roles.fetch(roleId).catch(() => { });
            }
        }
    }

    /**
     * Fetch a channel from a guild
     * @param {Snowflake|ChannelMention} channelId - The channel you want to fetch
     * @returns {?Channel}
     */
    fetchChannel(channelId) {
        if (channelId) {
            channelId = channelId.match(/[0-9]+/)?.[0];
            if (channelId) return this.client.channels.resolve(channelId);
        }
    }

    /**
     * Convert the given ms to a readable time string
     * @param {Number} duration - The time in ms
     * @returns {String}
     */
    parseTime(duration) {
        let result = "";

        duration = Math.floor(duration / 1000);
        let sec = duration % 60;
        if (duration >= 1) result = sec + "s";

        duration = Math.floor(duration / 60);
        let min = duration % 60;
        if (duration >= 1) result = min + "m " + result;

        duration = Math.floor(duration / 60);
        let hour = duration % 24;
        if (duration >= 1) result = hour + "h " + result;

        duration = Math.floor(duration / 24);
        let day = duration;
        if (duration >= 1) result = day + "d " + result;

        return result;
    }


    /**
     * Check a list of permissions for the bot and return a boolean
     * @param {GuildChannel} channel - The channel to check in
     * @param {PermissionResolvable[]} permissions - The array of permission flags to check
     * @param {TextBasedChannels|Interaction} [notifHere] - The channel or interaction for warning about missing permissions
     * @returns {Boolean}
     */
    hasPermissions(channel, permissions, notifHere) {
        const perms = channel.permissionsFor(this.client.user);
        permissions = permissions.filter(perm => !perms.has(perm));
        if (permissions.length === 0) return true;
        if (notifHere) {
            const method = (notifHere.applicationId) ? "reply" : "msgChannel";
            if (method === "msgChannel") {
                const notifChanPerms = notifHere.permissionsFor(this.client.users);
                if (!notifChanPerms.has("VIEW_CHANNEL") || !notifChanPerms.has("SEND_MESSAGES") || !notifChanPerms.has("EMBED_LINKS")) return false;
            }
            this.sender[method](notifHere, `The bot is missing the \`${permissions.join("`, `")}\` permission(s) in ${channel}, Please contact a server admin!`, { msgType: "invalid" });
        }
        return false;
    }

    /**
     * Check whether a list of roles is manageable by the bot
     * @param {Role[]} roles - The array of roles to check
     * @param {TextBasedChannels|Interaction} notifHere - The channel to notify missing permissions in
     * @returns {Boolean}
     */
    async isAboveRoles(roles, notifHere) {
        roles = roles.filter(role => role.editable === false).sort((a, b) => b.position - a.position);
        if (roles.length === 0) return true;
        if (notifHere) {
            const method = (notifHere.applicationId) ? "reply" : "msgChannel";
            if (method === "msgChannel") {
                const notifChanPerms = notifHere.permissionsFor(this.client.users);
                if (!notifChanPerms.has("VIEW_CHANNEL") || !notifChanPerms.has("SEND_MESSAGES") || !notifChanPerms.has("EMBED_LINKS")) return false;
            }
            this.sender[method](notifHere, `The bot is too low in the role hierarchy to manage the \`${roles.join("`, `")}\` role(s), Please contact a server admin!`, { msgType: "invalid" });
        }
    }
}

module.exports = Global;

/**
 * A user mention
 * @typedef UserMention
 * @type {String}
 */

/**
 * A role mention
 * @typedef RoleMention
 * @type {String}
 */

/**
 * A channel mention
 * @typedef ChannelMention
 * @type {String}
 */

/**
 * @typedef {import("../Bot")} Client
 * @typedef {import("discord.js").User} user
 * @typedef {import("discord.js").Role} Role
 * @typedef {import("discord.js").Guild} Guild
 * @typedef {import("discord.js").Message} Member
 * @typedef {import("discord.js").Channel} Channel
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("discord.js").Interaction} Interaction
 * @typedef {import("discord.js").GuildChannel} GuildChannel
 * @typedef {import("discord.js").MessageEmbed} MessageEmbed
 * @typedef {import("discord.js").MessageButton} MessageButton
 * @typedef {import("discord.js").TextBasedChannels} TextBasedChannels
 * @typedef {import("discord.js").MessageActionRow} MessageActionRow
 * @typedef {import("discord.js").MessageSelectMenu} MessageSelectMenu
 * @typedef {import("discord.js").PermissionResolvable} PermissionResolvable
 */
