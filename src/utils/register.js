const path = require('path');
const fs = require('fs').promises;

// register all the features
async function features(client) {
    registerFeatures("../features");
    async function registerFeatures(dir = '') {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if(stat.isDirectory()) registerFeatures(path.join(dir, file));
            if(file.endsWith(".js")) {
                const feature = require(path.join(filePath, file));
                try {
                    feature(client);
                }
                catch(err) {
                    console.log(`Error while loading: ${file}`)
                    console.log(err);
                }
            }
        }
    }
}

// register all the commands
async function commands(client) {
    client.commands = new Map();
    await registerCommands("../commands")
    async function registerCommands(dir = '') {
        const BaseCommand = require("./structures/BaseCommand");
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if(stat.isDirectory()) registerCommands(path.join(dir, file));
            if(file.endsWith('.js')) {
                const Command = require(path.join(filePath, file));
                if(Command.prototype instanceof BaseCommand) {
                    const cmd = new Command(client);
                    try {
                        client.commands.set(cmd.name, cmd);
                        if(cmd.aliases.length !==0) cmd.aliases.forEach(alias => client.commands.set(alias, cmd));
                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            }
        }
    }
}

// register all the events
async function events(client) {
    await registerEvents("../events");
    async function registerEvents(dir = '') {
        const BaseEvent = require("./structures/BaseEvent");
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if(stat.isDirectory()) registerEvents(path.join(dir, file));
            if(file.endsWith('.js')) {
                const Event = require(path.join(filePath, file));
                if(Event.prototype instanceof BaseEvent) {
                    const event = new Event(client);
                    try {
                        client.on(event.name, event.run.bind(event));
                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            }
        }
    }
}

module.exports = {
    features,
    commands,
    events
}