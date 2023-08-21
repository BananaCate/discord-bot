const developers = require("../../../schemas/developers.js");
const blockedusers = require("../../../schemas/blockedusers.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adddeveloper')
		.setDescription("Adds a user to the developer list")
		.addUserOption(option => 
			option.setName("target")
				.setDescription("The person you want to give acces to developer commands")
				.setRequired(true)),
	async execute(interaction) {
		const ownProfile = await developers.findOne({ userid: interaction.user.id });
		
		if (ownProfile.permission != "permanent") {
			return interaction.reply("You are not a permanent developer, you can't give others developer commands.")
		}

		const target = interaction.options.getUser("target");
		const blockprofile = await blockedusers.findOne({ userid: target.id });
		if (blockprofile) {
			await blockedusers.deleteOne({userid: target.id});
		}

		let developerProfile = await developers.findOne({ userid: target.id });
		
		if (developerProfile) {
			return interaction.reply({
				content: `${target} already had acces to developer commands.`,
                allowedMentions: { users: [], roles: [], everyone: false }
			});
		}
		developerProfile = await new developers({
			userid: target.id,
			permission: "temporary"
		});
		
		await developerProfile.save();
		interaction.reply({
			content: `You gave ${target} access to developer commands.`,
			allowedMentions: { users: [], roles: [], everyone: false }
		});
	},
};