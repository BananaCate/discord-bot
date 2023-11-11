const { EmbedBuilder } = require("discord.js");
const { inviteModel } = require("../../schemas/invites.js");

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
        currentServer = await inviteModel.findOne({ serverId: member.guild.id});
        if (!currentServer) {
            currentServer = new inviteModel({ serverId: member.guild.id, users: [], invites:[] })
            await currentServer.save()
        }
        inviter = ""
        const invitechannel = member.guild.channels.cache.get(currentServer["inviteLogId"]);
        if (!invitechannel) {
            return
        }

        const guildInvites = await member.guild.invites.fetch();
        guildInvites.forEach(async (invite) => {
            const existingInvite = currentServer["invites"].some((i) => i.code === invite.code);
            if (existingInvite == false) {
                currentServer["invites"].push({code: invite.code, amount: String(invite.uses)})
            }
        });
        await currentServer.save()
guildInvites.forEach(invite => {console.log(`${invite.code}\t${invite.uses}\n`)}); console.log("\n")
        const invite = guildInvites.find((i) => {
            return currentServer["invites"].some(invite => {
                return invite.code === i.code && Number(invite.amount) < i.uses;
            });
        });

        if (invite) {
            const inviterExists = currentServer["users"].some(user => user.userId === invite.inviterId);
            inviter = ""
            if (!inviterExists) {
                inviter = {userId: invite.inviterId, amount: "1"}
                currentServer["users"].push(inviter)
            }
            else {
                inviter = currentServer["users"].find(user => user.userId === invite.inviterId);
                inviter["amount"] = String(Number(inviter["amount"]) +1);
            }
            await currentServer.save();
        }
        
        const embed = new EmbedBuilder()
        .setTitle('Joined')
        .setColor(0x00ff00)
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
            embed.setDescription(`${member}; vanity invite **ratterscanner**`);
        }
        
        invitechannel.send({
            embeds: [embed],
            allowedMentions: { users: [], roles: [], everyone: false }
        });
        
    },
};