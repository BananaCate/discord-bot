const members = require("../../schemas/membercounts.js");

module.exports = {
	name: 'guildMemberAdd',
	once: true,
	async execute(member) {
        if (member.guild.id == "1041020827619049592") {
            guild = await members.findOne({});
            const AmountMembers = member.guild.memberCount;
            if (!guild) {
                guild = await new members({
                    membercount: AmountMembers
                });
                
                return await guild.save();
            }

            if (String(AmountMembers) > guild.membercount) {
                if (AmountMembers % 10 == 0 || AmountMembers - 10 > Number(guild.membercount)) {
                    const chat = member.guild.channels.cache.get("1134439155460472843");
                    if (chat) chat.send(`We reached ${AmountMembers} member's!`);
                    
                    guild.membercount = String(AmountMembers);
                    return await guild.save();
                }
            }
        }
	},
};