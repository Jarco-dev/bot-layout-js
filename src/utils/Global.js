const { MessageEmbed } = require("discord.js");

/**
 * @typedef {import("../Bot")} Client
 * @typedef {import("discord.js").MessageEmbed} MessageEmbed
 */

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
            .setTimestamp()
            .setFooter("© Jarco 2021");
    }

    /**
     * Create a empty message embed
     * @returns {MessageEmbed}
     */
    emptyEmbed() {
        return new MessageEmbed();
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