const { EventEmitter } = require("events");
const { Sequelize } = require("sequelize");
const mysql = require("../config/config.json").MYSQL;

class StateManager extends EventEmitter {
    constructor() {
        super();
        this.connection = new Sequelize(mysql.DATABASE, mysql.USER, mysql.PASSWORD, {
            logging: false,
            dialect: "mysql",
            host: mysql.HOST
        });
    }
}

module.exports = new StateManager();