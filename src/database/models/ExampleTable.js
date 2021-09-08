const { DataTypes, Model } = require("sequelize");

/**
 * IMPORTANT NOTE
 *
 * Don't forget to require the table in /src/bot.js in the "this.db" object
 * And to update the cache for it in /src/utils/DataManager.js if needed
 */

class ExampleTable extends Model {
    static init(sequelize) {
        return super.init({
            key: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING
            }
        }, {
            timestamps: false,
            sequelize
        });
    }
}

module.exports = ExampleTable;
