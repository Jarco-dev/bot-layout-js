const MYSQL = require("../config/config.json").MYSQL;

module.exports = {
    "username": MYSQL.USER,
    "password": MYSQL.PASSWORD,
    "database": MYSQL.DATABASE,
    "host": MYSQL.HOST,
    "dialect": "mysql"
}
