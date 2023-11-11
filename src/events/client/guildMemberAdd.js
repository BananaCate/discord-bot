// Member notifier

const servers = require("../../schemas/membercounts.js");

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const currentServer = await servers.findOne({ serverid: member.guild.id });
        if (currentServer) {
            const notifiers = currentServer["messages"];
            notifiers.forEach(notifier => {
                if (Number(currentServer["oldmembercount"]) < Number(member.guild.memberCount)) {
                    const chat = member.guild.channels.cache.get(notifier["channel"]);
                    
                    if (Number(currentServer["oldmembercount"]) % Number(notifier["amount"]) == 0) {
                        if (chat) chat.send(notifier["message"].replace(/\{membercount\}/i, member.guild.memberCount));
                    }
                    
                    if (notifiers.indexOf(notifier) == notifiers.length) {
                        currentServer.oldmembercount = member.guild.memberCount;
                        currentServer.save();
                    }
                }
            })
        }
	},
};