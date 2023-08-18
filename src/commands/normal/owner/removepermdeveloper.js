const Developer = require("../../../schemas/developer.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removepermdeveloper')
		.setDescription("Removes a user from permanent developer list")
		.addUserOption(option => 
			option.setName("target")
				.setDescription("The person you want to remove acces from permanentdeveloper commands")
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		const developerProfile = await Developer.findOne({ userid: target.id });
		if (!developerProfile) {
			return interaction.reply({
				content: `${target} already didn't have acces to developer commands.`,
                allowedMentions: { users: [], roles: [], everyone: false }
			});
		}

		await Developer.deleteOne({ userid: target.id });
		interaction.reply({
			content: `You removed ${target}'s access from permanent developer commands.`,
			allowedMentions: { users: [], roles: [], everyone: false }
		});
	},
};