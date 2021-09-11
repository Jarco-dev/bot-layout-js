const BaseEvent = require("../../utils/structures/BaseEvent");

class ReadyEvent extends BaseEvent {
    constructor() {
        super("ready");
    }

    /**
     * Run the event
     * @returns {void}
     */
    run() {
        this.logger.info(`${this.client.user.tag} logged in`);
        this.client.commandLoader.updateCommands(this.sConfig.commandLoadLevel, this.sConfig.commandDevGuild);
        this.client.featureLoader.startAll();
    }
}

module.exports = ReadyEvent;
