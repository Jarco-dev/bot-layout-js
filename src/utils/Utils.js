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
        const embed = new MessageEmbed()
            .setColor(config.COLOR.DEFAULT)
            .setFooter("Bot coded by Jarco#0001")
            .setTimestamp();
        return embed;
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
    * @param {String} neededFor the string of where the permission is needed for
    * @param {Object} notifChan The channel to notify missing permissions in
    * @returns if notifChan is set it will return a boolean if not then it will return the following object {hasPerm: boolean, missingPerms: string}
    */
    static async hasPermsInChannel(channel, perms, neededFor, notifChan) {
        if(!channel) throw new Error("No channel specified");
        if(channel.type == "dm") throw new Error("Can't check permissions in a dm channel");
        if(!perms || perms.length == 0) return new Error("No perms to check given");

        const botMember = (channel.guild.me) ? channel.guild.me : await channel.guild.members.fetch(client.user.id);
        const roleOnlyPerms = new Discord.Permissions(["ADMINISTRATOR","KICK_MEMBERS","BAN_MEMBERS","MANAGE_GUILD","VIEW_AUDIT_LOG","VIEW_GUILD_INSIGHTS","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_ROLES","MANAGE_EMOJIS"]);
        const missingPerms = botMember.permissionsIn(channel).add(botMember.permissions & roleOnlyPerms).missing(perms);
        
        if(missingPerms.length > 0) {
            const missingPermsList = [];
            missingPerms.forEach(permission => missingPermsList.push(`\`${permission}\``));
            if(!notifChan) return {hasPerms: false, missingPerms: missingPermsList.join(", ")};
            const isMultiple = (missingPerms.length > 1) ? true : false;
            if(notifChan.guild && botMember.permissionsIn(notifChan).has("VIEW_CHANNEL") && botMember.permissionsIn(notifChan).has("SEND_MESSAGES")) {
                notifChan.send(`⚠  **|** I am missing ${(isMultiple) ? "permissions" : "a permission"} in ${channel} to ${neededFor}\n        **|** If you wish to be able to use it please reinvite me or give me the following permission${(isMultiple) ? "s" : ""}\n        **|** Permission${(isMultiple) ? "s" : ""} ${missingPermsList.join(", ")}`);
            }
            else {
                let dmChan;
                if(notifChan.guild) channel = await notifChan.client.users.fetch(notifChan.guild.ownerID);
                else dmChan = notifChan;
                dmChan.send(`⚠  **|** I am missing ${(isMultiple) ? "permissions" : "a permission"} to ${neededFor} in:\n        **|** \`Guild:\` **${channel.guild.name}** \`Channel:\` ${channel}\n        **|** If you wish to be able to use it please reinvite me or give me the following permission${(isMultiple) ? "s" : ""}\n        **|** Permission${(isMultiple) ? "s" : ""}: ${missingPermsList.join(", ")}`)
            }
            return false;
        }

        if(!notifChan) return {hasPerms: true, missingPerms: ""};
        else return true;
    }

    /**
    * @param {Array} roles the list of roles objects that need to be editable by the client
    * @param {String} neededFor the string of where the permission is needed for
    * @param {Object} notifChan The channel to notify the missing permissions in
    * @returns if notifChan is set it will return a boolean if not then it will return the following object {hasPerm: boolean, missingPerms: (object | null)}
    */
    static async hasPermsToEditRoles(roles, neededFor, notifChan) {
        if(!roles || roles.length == 0) throw new Error("No roles given");
        if(notifChan && !["dm","text"].includes(notifChan.type)) throw new Error("notifChan is a invalid channel type");

        roles = roles.filter(role => role.editable == false).sort((a, b) => b.position-a.position);

        if(roles[0]) {
            if(!notifChan) return {hasPerms: false, putRoleAbove: roles[0]};
            const botMember = (roles[0].guild.me) ? roles[0].guild.me : await roles[0].guild.members.fetch(client.user.id);
            if(notifChan.type == "text" && botMember.permissionsIn(notifChan).has("VIEW_CHANNEL") && botMember.permissionsIn(notifChan).has("SEND_MESSAGES")) {
                notifChan.send(`⚠  **|** I am too low in the role hierarchy to ${neededFor}\n        **|** If you wish to be able to use it then please move my role above the **${roles[0].name}** role`);
            }
            else {
                let channel;
                if(notifChan.guild) channel = await client.users.fetch(notifChan.guild.ownerID);
                else channel = notifChan;
                channel.send(`⚠  **|** I am too low in the role hierarchy to ${neededFor} in:\n        **|** \`Guild:\` **${notifChan.guild.name}**\n        **|** If you wish to be able to use it then please move my role above the **${roles[0].name}** role`)
            }
            return false;
        }
        
        if(!notifChan) return {hasPerms: true, putRoleAbove: null};
        return true;
    }

}