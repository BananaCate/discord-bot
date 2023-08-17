const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user'),
	async execute(interaction) {
		const joinDate = interaction.member.joinedAt;
		interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${joinDate.getDate()}/${joinDate.getMonth() + 1}/${joinDate.getFullYear()}`);
	},
};