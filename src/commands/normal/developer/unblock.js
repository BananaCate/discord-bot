const blockedusers = require("../../../schemas/blockedusers.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unblock')
		.setDescription("Removes a user from the block list")
		.addUserOption(option => 
			option.setName("target")
				.setDescription("The person you want to unblock from using any commands")
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		let blockprofile = await blockedusers.findOne({ userid: target.id });
		if (!blockprofile) {
			return interaction.reply({
				content: `${target} already wasn't blocked from using commands.`,
                allowedMentions: { users: [], roles: [], everyone: false }
			})
		}
		await blockedusers.deleteOne({ userid: target.id });
		interaction.reply({
			content: `${target} has been unblocked from using commands.`,
			allowedMentions: { users: [], roles: [], everyone: false }
		})
	}
};