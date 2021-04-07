'use strict';

const { DataTypes } = require("sequelize");

module.exports = {
  /**
   * @typedef {import('sequelize').Sequelize} Sequelize
   * @typedef {import('sequelize').QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Guilds", {
      guildId: {
        type: DataTypes.STRING(18),
        primaryKey: true
      }
    });

    await queryInterface.createTable("GuildConfigs", {
      guildId: {
        type: DataTypes.STRING(18),
        primaryKey: true,
        forgeignkey: true,
        references: {
          model: "Guilds",
          key: "guildId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      cmdPrefix: {
        type: DataTypes.STRING(10),
        allowNull: true,
      }
    });

  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("GuildConfigs");
    await queryInterface.dropTable("Guilds");
  }
};
