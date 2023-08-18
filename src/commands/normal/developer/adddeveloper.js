const Developer = require("../../../schemas/developer.js");
const Block = require("../../../schemas/block.js");
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
		const ownProfile = await Developer.findOne({ userid: interaction.user.id });
		
		if (ownProfile.permission != "permanent") {
			return interaction.reply("You are not a permanent developer, you can't give others developer commands.")
		}

		const target = interaction.options.getUser("target");
		const blockprofile = await Block.findOne({ userid: target.id });
		if (blockprofile) {
			await Block.deleteOne({userid: target.id});
		}

		let developerProfile = await Developer.findOne({ userid: target.id });
		
		if (developerProfile) {
			return interaction.reply({
				content: `${target} already had acces to developer commands.`,
                allowedMentions: { users: [], roles: [], everyone: false }
			});
		}
		developerProfile = await new Developer({
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