const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Select a member to unban')
		.addUserOption(option => 
            option.setName('target')
                .setDescription('The member to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to unban this member')),
	async execute(interaction) {
		const member = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason was given';

        await interaction.guild.members.unban(member, { "reason": reason });
		interaction.reply(`You unbanned ${member} for reason: \`${reason}\`.`);
	},
};