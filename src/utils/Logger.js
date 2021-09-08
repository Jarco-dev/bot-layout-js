const moment = require("moment");

/**
 * Logger
 * The class for handeling all the logs the bot throws at it
 */
class Logger {
    /**
     * Constructor
     */
    constructor() {
        /**
         * The current log level
         * @type {0|1|2|3|4}
         */
        this.level = 0;
    }

    /**
     * Log the verbose message
     * @param {...any} message - The message to log
     * @returns {void}
     */
    verbose(message) {
        if (this.level <= 0) {
            const args = Array.prototype.slice.call(arguments);
            console.log(`[${this._getDateTimeString()}] [VERBOSE]`, args);
        }
    }

    /**
     * Log a debug message
     * @param {...any} message - The message to log
     * @returns {void}
     */
    debug(message) {
        if (this.level <= 1) {
            const args = Array.prototype.slice.call(arguments);
            console.debug("\x1b[36m%s\x1b[0m", `[${this._getDateTimeString()}] [DEBUG]`, args);
        }
    }

    /**
     * Log the info message
     * @param {...any} message - The message to log
     * @returns {void}
     */
    info(message) {
        if (this.level <= 2) {
            const args = Array.prototype.slice.call(arguments);
            console.info("\x1b[32m%s\x1b[0m", `[${this._getDateTimeString()}] [INFO]`, args);
        }
    }

    /**
     * Log a warn message
     * @param {...any} message - The message to log
     * @returns {void}
     */
    warn(message) {
        if (this.level <= 3) {
            const args = Array.prototype.slice.call(arguments);
            console.warn("\x1b[33m%s\x1b[0m", `[${this._getDateTimeString()}] [WARN]`, args);
        }
    }

    /**
     * Log a error message
     * @param {...any} message - The message to log
     * @returns {void}
     */
    error(message) {
        if (this.level <= 4) {
            const args = Array.prototype.slice.call(arguments);
            console.error("\x1b[31m%s\x1b[0m", `[${this._getDateTimeString()}] [ERROR]`, args);
        }
    }

    /**
     * Set the logging level
     * @param {"verbose"|"debug"|"info"|"warn"|"error"|0|1|2|3|4} level - The level of logs at wich you want to start logging them
     * @returns {void}
     */
    setLogLevel(level) {
        switch (level) {
            case "verbose":
            case 0:
                this.level = 0;
                break;

            case "debug":
            case 1:
                this.level = 1;
                break;

            case "info":
            case 2:
                this.level = 2;
                break;

            case "warn":
            case 3:
                this.level = 3;
                break;

            case "error":
            case 4:
                this.level = 4;
                break;

            default:
                throw new Error(`level is a invalid log level`);
        }
    }

    /**
     * Get the current date and time in the YYYY-MM-DD HH:mm:ss format
     * @returns {String}
     * @private
     */
    _getDateTimeString() {
        return moment.utc().format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = Logger;

/**
 * @typedef {"verbose"|"debug"|"info"|"warn"|"error"|0|1|2|3|4} LogLevel
 */
