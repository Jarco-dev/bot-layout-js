const BaseFeature = require("../../utils/structures/BaseFeature");

/**
 * PresenceFeature
 * Manages the bots presence
 */
class PresenceFeature extends BaseFeature {
    constructor() {
        super("presence");

        /** @type {NodeJS.Timeout|Number} */
        this.interval = undefined;
    }

    /**
     * Start the feature
     */
    start() {
        this._update();
        this.interval = setInterval(() => this._update(), 30000);
    }

    /**
     * Update the bots presence
     * @returns {void}
     * @private
     */
    async _update() {
        const members = this.client.guilds.cache.reduce((amount, guild) => amount + guild.memberCount, 0);
        this.client.user.setPresence({
            status: "online",
            activities: [
                {
                    name: `${members} users`,
                    type: "LISTENING"
                }, {
                    name: "test",
                    type: "PLAYING"
                }
            ]
        });
    }
}

module.exports = PresenceFeature;
