const developers = require("../../../schemas/developers.js");
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
		const ownProfile = await developers.findOne({ userid: interaction.user.id });

		if (ownProfile.permission != "permanent") {
			return interaction.reply("You are not a permanent developer")
		}
		const target = interaction.options.getUser("target");
		const developerProfile = await developers.findOne({ userid: target.id });
		if (!developerProfile) {
			return interaction.reply({
				content: `${target} doesn't have acces to developer commands.`,
                allowedMentions: { users: [], roles: [], everyone: false }
			});
		}
		if (developerProfile.permission == "permanent") {
			return interaction.reply({
				content: `${target} has permanent developer.`,
                allowedMentions: { users: [], roles: [], everyone: false }
			})
		}
		
		await developers.deleteOne({ userid: target.id });
		interaction.reply({
			content: `You removed ${target}'s access from developer commands.`,
			allowedMentions: { users: [], roles: [], everyone: false }
		});
	},
};