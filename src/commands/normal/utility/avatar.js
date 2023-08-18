const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar')
		.addUserOption(option => 
			option.setName('target')
				.setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user = interaction.options.getUser('target') ?? interaction.user;
		interaction.reply({
			content: `${user}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`,
			allowedMentions: { users: [], roles: [], everyone: false }
		});
	},
};