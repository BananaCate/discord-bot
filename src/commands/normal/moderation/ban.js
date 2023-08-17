const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a member')
		.addUserOption(option => 
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to ban this member')),
	async execute(interaction) {
		const member = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason was given';

        await interaction.guild.members.ban(member, { "reason": reason });
		interaction.reply(`You banned ${member} for reason: \`${reason}\``);
	},
};