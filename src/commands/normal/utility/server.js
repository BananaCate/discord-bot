const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server'),
	async execute(interaction) {
		interaction.reply(`This server is called ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	}
};