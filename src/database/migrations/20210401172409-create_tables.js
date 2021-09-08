const { DataTypes } = require("sequelize");

/**
 * @param {QueryInterface} queryInterface
 * @param {Sequelize} Sequelize
 * @returns {void}
 */
const up = async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ExampleTable", {
        key: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        value: {
            type: DataTypes.STRING
        }
    });
}

/**
 * @param {QueryInterface} queryInterface
 * @param {Sequelize} Sequelize
 * @returns {void}
 */
const down = async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ExampleTable");
}

module.exports = { up, down };

/**
 * @typedef {import("sequelize").Sequelize} Sequelize
 * @typedef {import("sequelize").QueryInterface} QueryInterface
 */
