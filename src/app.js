const discord = require('discord.js');
const client = new discord.Client({
    messageEditHistoryMaxSize: 5,
});

const sequelizeAuth = require("./utils/sequelizeAuth");
const register = require("./utils/register");

(async () => {
    console.log("\n");
    console.log("[DATABASE] Connecting...");
    await sequelizeAuth();
    console.log("[BOT] Connecting to discord...")
    const TOKEN = require('./config/config.json').BOT.TOKEN;
    client.login(TOKEN);
    await register.events(client);
    await register.commands(client);
})();

module.exports = client;