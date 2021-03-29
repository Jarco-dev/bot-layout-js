const { DataTypes, Model} = require("sequelize");

module.exports = class GuildConfigs extends Model {
    static init(sequelize) {
        return super.init({
            guildId: {
                type: DataTypes.STRING(10),
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
                type: DataTypes.STRING(10)
            }
        }, {
            timestamps: false,
            tableName: "GuildConfigs",
            sequelize
        })
        
    }
}