const Discord = require("discord.js");

/**
 * Sender
 * The class that handles sending messages
 */
class Sender {
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
     * Reply to a interaction
     * @param {Interaction} i - The interaction
     * @param {String|MessagePayload|InteractionReplyOptions} payload - The payload you want to send
     * @param {SenderReplyOptions} [options] - The sender options
     * @returns {Promise<Message|void>}
     */
    reply(i, payload, options) {
        // No options shortcut
        if (!options) return i.reply(payload);

        // Handle the bot message type
        if (options.msgType) {
            // Cancel message type reply if there is a embed
            if (payload.embeds) throw new Error("the provided embed would be overwritten by the msgType");

            // Create and set the embed
            const embed = new Discord.MessageEmbed()
                .setColor(this.config.msgTypes[options.msgType].color);

            if (typeof payload === "string") {
                embed.setDescription(`${this.config.msgTypes[options.msgType].emoji} **${payload}**`);
                payload = { embeds: [embed] };
            } else {
                embed.setDescription(`${this.config.msgTypes[options.msgType].emoji} **${payload.content}**`);
                delete payload.content;
                payload.embeds = [embed];
            }
        }

        // Fetch the reply if there are any after send options required
        if (options.delTime) payload.fetchReply = true;

        // Send the message
        return i[(options?.editReply) ? "editReply" : "reply"](payload)
            .then(async msg => {
                // Message delete timeout
                if (options.delTime && msg?.deletable) setTimeout(() => msg.delete().catch(() => {}), options.delTime)
            });
    }

    /**
     * Send a message to the original channel
     * @param {Message|Interaction} origin - The original message or interaction
     * @param {String|MessagePayload|MessageOptions} payload - The payload you want to send
     * @param {SenderMessageOptions} [options] - The sender options
     * @returns {Promise<Message>}
     */
    send(origin, payload, options) {
        const channel = origin?.channel || origin?.msg?.channel;
        return this._sendMsg(channel, payload, options);
    }

    /**
     * Send a message to a channel
     * @param {TextBasedChannels|Snowflake} channel - The channel to send the message in
     * @param {String|MessagePayload|MessageOptions} payload - The payload you want to send
     * @param {SenderMessageOptions} [options] - The sender options
     * @returns {Promise<Message|void>}
     */
    async msgChannel(channel, payload, options) {
        channel = `${channel}`.match(/[0-9]+/)?.[0];
        if (channel) {
            channel = await this.client.channels.fetch(channel).catch(() => { });
            if (channel) return this._sendMsg(channel, payload, options);
        }
    }

    /**
     * Send a dm to a user
     * @param {User|Snowflake} user - The original message or interaction
     * @param {String|MessagePayload|MessageOptions} payload - The payload you want to send
     * @param {SenderMessageOptions} [options] - The sender options
     * @returns {Promise<Message|void>}
     */
    async msgUser(user, payload, options) {
        user = `${user}`.match(/[0-9]+/)?.[0];
        if (user) {
            user = await this.client.users.fetch(user).catch(() => { });
            if (user) return this._sendMsg(await user.createDM(), payload, options);
        }
    }

    /**
     * Send a message to a channel
     * @param {TextBasedChannels} channel - The channel to send the message in
     * @param {String|MessagePayload|MessageOptions} payload - The payload you want to send
     * @param {SenderMessageOptions} [options] - The sender options
     * @returns {Promise<Message>}
     * @private
     */
    _sendMsg(channel, payload, options) {
        // No options shortcut
        if (!options) return channel.send(payload);

        // Handle the bot message type
        if (options.msgType) {
            // Cancel message type reply if there is a embed
            if (payload.embeds) throw new Error("you can't provide a embed together with a msgType");

            // Create and set the embed
            const embed = new Discord.MessageEmbed()
                .setColor(this.config.msgTypes[options.msgType].color);

            if (typeof payload === "string") {
                embed.setDescription(`${this.config.msgTypes[options.msgType].emoji} **${payload}**`);
                payload = { embeds: [embed] };
            } else {
                embed.setDescription(`${this.config.msgTypes[options.msgType].emoji} **${payload.content}**`);
                delete payload.content;
                payload.embeds = [embed];
            }
        }

        // Send the message
        return channel.send(payload)
            .then(msg => {
                // Message delete timeout
                if (options.delTime) setTimeout(() => msg.delete().catch(() => { }), options.delTime);
            });
    }
}

module.exports = Sender;

/**
 * @typedef {Object} SenderMessageOptions
 * @property {Number} [delTime] - The delay before deleting the message in milliseconds
 * @property {"success"|"invalid"|"error"|"time"} [msgType] - The bot message type to reply with (Doesn't support a embed in the payload)
 */

/**
 * @typedef {Object} SenderReplyOptions
 * @property {Number} [delTime] - The delay before deleting the message in milliseconds
 * @property {"success"|"invalid"|"error"|"time"} [msgType] - The bot message type to reply with (Doesn't support a embed in the payload)
 * @property {Boolean} [editReply=false] - Edit the already existing reply (Only works if the interaction already has a reply)
 */


/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("discord.js").Interaction} Interaction
 * @typedef {import("discord.js").MessagePayload} MessagePayload
 * @typedef {import("discord.js").MessageOptions} MessageOptions
 * @typedef {import("discord.js").TextBasedChannels} TextBasedChannels
 * @typedef {import("discord.js").InteractionReplyOptions} InteractionReplyOptions
 */
