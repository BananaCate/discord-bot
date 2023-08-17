const Developer = require("../../../schemas/developer.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removepermdeveloper')
		.setDescription("Removes a user from permanent developer list")
		.addUserOption(option => 
			option.setName("target")
				.setDescription("The person you want to remove acces from permanent developer commands")
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		const developerProfile = await Developer.findOne({ userid: target.id });
		if (!developerProfile) {
			return interaction.reply(`${target.username} doesn't have acces to developer commands.`);
		}

		await Developer.deleteOne({ userid: target.id });
		interaction.reply(`You removed ${target.username}'s access from permanent developer commands.`);
	},
};