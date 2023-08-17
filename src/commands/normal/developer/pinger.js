const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pinger')
		.setDescription('Ping a chosen member a "few" times')
		.addUserOption(option => 
			option.setName('target')
				.setDescription('The member to ping')
				.setRequired(true))
		.addIntegerOption(option => 
			option.setName('amount')
				.setDescription('Number of pings')
				.setMinValue(1)
				.setMaxValue(10)),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		const amount = interaction.options.getInteger('amount') ?? 5;
		for (let i = 0; i < amount; i++) {
			await interaction.channel.send(`${member}`);
		}
	},
};