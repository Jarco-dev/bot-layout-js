// informational message for the settings that have to be set (delete this code once done)
console.log("\n")
console.log("Before the bot is ready to start you need to do the following things:")
console.log("\n")
console.log("Powershell   | install packages using \"npm i\"");
console.log("config.json  | set the bot version, token, mysql and owner");
console.log("package.json | Set the bot name, description and version");
console.log("\n")
return;
// actual base code

const discord = require('discord.js');
const client = new discord.Client();

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