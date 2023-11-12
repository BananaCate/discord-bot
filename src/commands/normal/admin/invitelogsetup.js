const { SlashCommandBuilder } = require('discord.js');
const { inviteModel} = require('../../../schemas/invites.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invitelogsetup')
		.setDescription('Sets up the (non customizable, but proffesional) invite/leave logs')
        .addChannelOption(option => 
            option.setName("log_channel")
            .setDescription("This is the channel where it will happen in")),
	async execute(interaction) {
		const targetchannel = interaction.options.getChannel("log_channel");
        currentServer = await inviteModel.findOne({ serverId: interaction.guild.id});
        
        if (!targetchannel) {
            if (currentServer) {
                currentServer['inviteLogId'] = "";
                await currentServer.save()
                return interaction.reply("Join/leave logs are now disabled from this server.")
            }

            return interaction.reply({
                content:`I do not have acces to ${targetchannel}, meaning i won't be able to send messages there. Pick a diffrent chanel or change my permissions.`,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        }
        
        if (!currentServer) {
            currentServer = new inviteModel({ serverId: interaction.guild.id, inviteLogId: targetchannel.id, users: [], invites:[] })
            await currentServer.save()

            return interaction.reply(`I have set your join/leave log to ${targetchannel}.`);
        }
        currentServer['inviteLogId'] = targetchannel.id;
        await currentServer.save()

        interaction.reply(`I have updated your join/leave log to ${targetchannel}.`);
	}
};