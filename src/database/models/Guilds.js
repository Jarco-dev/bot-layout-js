const { DataTypes, Model } = require("sequelize");

module.exports = class Guilds extends Model {
    static init(sequelize) {
        return super.init({
            guildId: {
                type: DataTypes.STRING(18),
                primaryKey: true
            }
        }, {
            timestamps: false,
            tableName: "Guilds",
            sequelize
        })
    }
}