const Developer = require("../../../schemas/developer.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removedeveloper')
		.setDescription("Removes a user from developer list")
		.addUserOption(option => 
			option.setName("target")
				.setDescription("The person you want to remove acces from developer commands")
				.setRequired(true)),
	async execute(interaction) {
		const ownProfile = await Developer.findOne({ userid: interaction.user.id });

		if (ownProfile.permission != "permanent") {
			return interaction.reply("You are not a permanent developer")
		}
		const target = interaction.options.getUser("target");
		const developerProfile = await Developer.findOne({ userid: target.id });
		if (!developerProfile) {
			return interaction.reply(`${target.username} doesn't have acces to developer commands.`);
		}
		if (developerProfile.permission == "permanent") {
			return interaction.reply(`${target.username} has permanent developer.`)
		}
		
		await Developer.deleteOne({ userid: target.id });
		interaction.reply(`You removed ${target.username}'s access from developer commands.`);
	},
};