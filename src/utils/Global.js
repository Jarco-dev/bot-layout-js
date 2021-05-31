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

        /** @Private */
        this.sender = client.sender;
    }

    /**
     * Create and prepate a message embed
     * @returns {MessageEmbed}
     */
    embed() {
        return this.emptyEmbed()
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
     * Fetch a user
     * @param {Snowflake|UserMention} userId - The user you want to fetch
     * @returns {User} 
     */
    async fetchUser(userId) {
        if (!userId) return;
        userId = userId.match(/[0-9]+/);
        if (!userId) return;
        userId = userId[0];
        let user = await this.client.users.fetch(userId).catch(err => { });
        return user;
    }

    /**
     * Fetch a member from a guild
     * @param {Guild} guild - The guild of the member
     * @param {Snowflake|UserMention} userId - The id of the member you want to fetch
     * @returns 
     */
    async fetchMember(guild, userId) {
        if (!guild) throw new Error("no guild was provided");
        if (!userId) return;
        userId = userId.match(/[0-9]+/);
        if (!userId) return;
        userId = userId[0];
        let member = await guild.members.fetch(userId).catch(err => { });
        return member;
    }

    /**
     * Fetch a role from a guild
     * @param {Guild} guild - The guild of the role
     * @param {Snowflake|RoleMention} roleId - The role you want to fetch
     * @returns {Role}
     */
    async fetchRole(guild, roleId) {
        if (!guild) throw new Error("no guild was provided");
        if (!roleId) return;
        roleId = roleId.match(/[0-9]+/);
        if (!roleId) return;
        roleId = roleId[0];
        console.log(roleId);
        let role = await guild.roles.fetch(roleId).catch(err => { });
        return role;
    }

    /**
     * Fetch a channel from a guild
     * @param {Guild} guild - The guild of the channel
     * @param {Snowflake} channelId - The channel you want to fetch
     * @returns {Channel|ChannelMention}
     */
    fetchChannel(guild, channelId) {
        if (!guild) throw new Error("no guild was provided");
        if (!channelId) return;
        channelId = channelId.match(/[0-9]+/);
        if (!channelId) return;
        channelId = channelId[0];
        let channel = guild.channels.resolve(channelId);
        return channel;
    }

    /**
     * Convert the given ms to a readable time string
     * @param {Number} time - The time in ms
     * @returns {String}
     */
    parseTime(time) {
        let result = "";
        time = Math.floor(time / 1000);
        var sec = time % 60;
        if (time >= 1) result = sec + "s";

        time = Math.floor(time / 60);
        var min = time % 60;
        if (time >= 1) result = min + "m " + result;

        time = Math.floor(time / 60);
        var hour = time % 24;
        if (time >= 1) result = hour + "h " + result;

        time = Math.floor(time / 24);
        let day = time;
        if (time >= 1) result = day + "d " + result;

        return result;
    }



    /**
     * Check a list of permissions for the bot and return a boolean
     * @param {Channel} channel - The channel to check in
     * @param {PermissionFlags[]} permissions - The array of permission flags to check
     * @param {Channel} [notifChan] - The channel to notify missing permissions in
     * @returns {Boolean}
     */
    async hasPermissions(channel, permissions, notifChan) {
        const perms = await channel.permissionsFor(this.client.user);
        for (let i in permissions) {
            if (!perms.has(permissions[i])) {
                if (!notifChan) return false;
                const notifChanPerms = await notifChan.permissionsFor(this.client.user);
                if (notifChanPerms.has("VIEW_CHANNEL") && notifChanPerms.has("SEND_MESSAGES")) {
                    this.sender.msgChannel(notifChan, `${this.config.emoji.invalid} **|** The bot doesn't have the \`${permissions[i]}\` permission in ${channel}, Please contact your server admin!`);
                }
                return false;
            }
        }
        return true;
    }

    /**
     * Check wether a list of roles is managable by the bot
     * @param {Role[]} roles - The array of roles to check 
     * @param {*} notifChan - The channel to notify missing permissions in
     * @returns {Boolean} 
     */
    async canManageRoles(roles, notifChan) {
        roles = roles.filter(role => role.editable == false).sort((a, b) => b.position - a.position);
        if (roles[0]) {
            if (!notifChan) return false;
            const notifChanPerms = await notifChan.permissionsFor(this.client.user);
            if (notifChanPerms.has("VIEW_CHANNEL") && notifChanPerms.has("SEND_MESSAGES")) {
                this.sender.msgChannel(notifChan, `${this.config.emoji.invalid} **|** The bot is too low in the role hierarchy to manage the \`${roles[0].name}\` role, Please contact your server admin!`);
            }
            return false;
        }
        return true;
    }
}

module.exports = Global;

/**
 * @typedef {import("../Bot")} Client
 * @typedef {import("discord.js").User} user
 * @typedef {import("discord.js").Role} Role
 * @typedef {import("discord.js").Guild} Guild
 * @typedef {import("discord.js").Message} Member
 * @typedef {import("discord.js").Channel} Channel
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("discord.js").MessageEmbed} MessageEmbed
 */