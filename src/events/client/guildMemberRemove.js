const { EmbedBuilder } = require("discord.js");
const { inviteModel } = require("../../schemas/invites.js");

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
        currentServer = await inviteModel.findOne({ serverId: member.guild.id});
        if (!currentServer) { return }
        inviter = ""
        const invitechannel = member.guild.channels.cache.get(currentServer["inviteLogId"]);
        
        const guildInvites = await member.guild.invites.fetch();
        
guildInvites.forEach(invite => {console.log(`${invite.code}\t${invite.uses}\n`)}); console.log("\n")
        const invite = guildInvites.find((i) => {
            return currentServer["invites"].some(invite => {
                return invite.code === i.code && Number(invite.amount) > i.uses
            });
        });
        console.log(invite)
        if (invite) {
            const inviterExists = currentServer["users"].some(user => user.userId === invite.inviterId);
            inviter = ""
            if (!inviterExists) {
                inviter = {userId: invite.inviterId, amount: "0"}
                currentServer["users"].push(inviter)
            }
            else {
                inviter = currentServer["users"].find(user => user.userId === invite.inviterId);
                inviter["amount"] = String(Number(inviter["amount"]) -1);
            }
            await currentServer.save();
        }
        
        const embed = new EmbedBuilder()
        .setTitle('Left')
        .setColor(0xff0000)
        .setTimestamp(Date.now())
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({
            text: `Powered by ratter scanner`,
            iconURL: `https://cdn.discordapp.com/icons/1041020827619049592/eb43dd350bc728f10d8955ca68b79807.png?size=4096`
        });

        if (inviter != "") {
            embed.setDescription(`${member}; Invited by ${invite.inviter.tag} (${inviter["amount"]} invites).`)
        }
        else {
            embed.setDescription("I could not figure out who invited them.");
        }
        
        invitechannel.send({
            embeds: [embed],
            allowedMentions: { users: [], roles: [], everyone: false }
        });
        
    },
};