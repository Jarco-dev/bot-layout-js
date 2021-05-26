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
        let member = await guild.members.fetch(userId);
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
        let role = await guild.roles.fetch(roleId);
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