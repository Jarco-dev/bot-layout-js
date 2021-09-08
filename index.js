const client = require("./src/Bot");
const auth = require("./secret/auth");

// Fix console being unreadable on pterodactyl
console.log("\n");

// Authorise the bot
client.logger.info("Connecting to discord...");
client.login(auth.token);

// Catch any uncaught errors
process.on("uncaughtException", (err) => {
    client.logger.error("Uncaught exception in process#uncaughtException", err);
});

process.on("unhandledRejection", (err) => {
    client.logger.error("Unhandled rejection in process#unhandledRejection", err);
});
