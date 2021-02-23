/**
 * Usefull commonly used utilities.
 */
module.exports = class Utils {
    constructor() {
    }

    /**
     * @returns initiated MessageEmbed object
     */
    static embed() {
        const { MessageEmbed } = require('discord.js');
        return new MessageEmbed();
    }

    /**
    * @param {Object} message The discord message object
    * @param {Array} args The message arguments
    * @param {String} type What type of property you would like to get from the args (user, role, channel)
    */
    static async argumentHandler(message, args, type) {
        if(!type) return console.log(`[Utils, argumentHandler] no type provided`);
        switch(type.toLowerCase()) {
            case 'user':
                const users = []
                for (const possUser of args) {
                    let possUserId = possUser.match(/<@!?(\d{17,19})>/);
                    possUserId = (possUserId) ? possUserId[1] : possUser;
                    let user;
                    if((/\d{17,19}/).test(possUserId)) user = await message.client.users.fetch(possUserId).catch(err => { });
                    if(user) users.push(user);
                }
                if(users[0]) return users;
                break;
            case 'role':
                const roles = [];
                for (const possRole of args) {
                    let possRoleId = (/<@&(\d{17,19})>/).exec((possRole));
                    possRoleId = (possRoleId) ? possRoleId[1] : possRole;
                    let role
                    if((/(\d{17,19})/).test(possRoleId)) role = await message.guild.roles.fetch(possRoleId).catch(err => { });
                    if(role) roles.push(role);
                }
                if(roles[0]) return roles;
                break;
            case 'channel':
                const channels = [];
                for (const possChannel of args) {
                    let possChannelId = (/<#(\d{17,19})>/).exec((possChannel));
                    possChannelId = (possChannelId) ? possChannelId[1] : possChannel;
                    let channel;
                    if((/(\d{17,19})/).test(possChannelId)) channel = await message.channel.guild.channels.resolve(possChannelId);
                    if(channel) channels.push(channel);
                }
                console.log(channels);
                if(channels[0]) return channels;
                break;
            default:
                throw new Error("type is not defined");
        }
    }

    /**
     * convert the time given to a neat format
     * @param {Integer} ms the timer in ms
     * @returns {String} returns the time formatted as days hours minutes and seconds 
     */
    static toTime(ms){
        let result = "";
        ms = Math.floor(ms/1000);
        var sec = ms%60;
        if(ms>=1) result = sec+"s";
    
        ms = Math.floor(ms/60);
        var min = ms%60;
        if(ms>=1) result = min+"m "+result;
    
        ms = Math.floor(ms/60);
        var hour = ms%24;
        if(ms>=1) result = hour+"h "+result;
    
        ms = Math.floor(ms/24);
        let day = ms;
        if(ms>=1) result = day+"d "+result;
    
        return result;
    }

    /**
     * create a random string containing a-z A-Z 0-9
     * @param {Integer} length the length of the random string needed
     * @returns {String} a random string
     */
    static getRandomString(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
    
    /**
    * @param {Channel} channel The channel object of wich to check the permissions
    * @param {Array} perms The array of permissions to check for
    * @param {Object} notifChan The channel to notify missing permissions in
    * @returns if notifChan is set it will return a boolean if not then it will return the following object {hasPerm: boolean, missingPerms: string}
    */
   static async hasPermsInChannel(channel, perms, notifChan) {
    if(!channel) throw new Error("channel is undefined");
    if(!perms) return new Error("perms is undefined");
    const botMember = await channel.guild.members.fetch(client.user.id);
    const missingPerms = botMember.permissionsIn(channel).missing(perms);
    if(missingPerms.length > 0) {
        let list = []
        missingPerms.forEach(perm => list.push(`\`${perm}\``));
        if(!notifChan) return {hasPerms: false, missingPerms: list.join(", ")};
        notifChan.send(`❌ **|** I am missing the following permission please grant me these if you want to use this feature\n       **|** ${list.join(", ")}`);
        return false;
    }
    if(!notifChan) return {hasPerms: true, missingPerms: ""};
    else return true;
}
}