const path = require("path");
const fs = require("fs").promises;

module.exports = async () => {
    // require the statemanager
    const StateManager = require("../database/StateManager");

    // connect to the database
    await StateManager.connection.authenticate()
        .then(async () => {
            // confirm connection
            console.log("[DATABASE] Succesfully connected");

            // initialise the models
            const files = await fs.readdir("./src/database/models");
            for (const file of files) {
                if(!file.endsWith(".js")) return;
                const model = require(`../database/models/${file}`);
                await model.init(StateManager.connection);
            }

        })
        .catch(async err => {
            await console.log("[DATABASE] Failed to connect\n", err);
            process.exit();
        });
}