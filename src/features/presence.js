module.exports = (client) => {
    updatePresence();
    setInterval(() => updatePresence(), 10000)

    async function updatePresence() {
        const members = await client.guilds.cache.reduce((amount, guild) => amount + guild.memberCount, 0);
        client.user.setPresence({
                status: 'online',
                activity: {
                    name: `${members} users`,
                    type: 'LISTENING',
                }
        });
    }
}