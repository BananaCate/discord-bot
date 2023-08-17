const Developer = require("../../../schemas/developer.js");
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require("mongoose");

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
		if (ownProfile.permission == "permanent") {
			const target = interaction.options.getUser("target");
			let developerProfile = await Developer.findOne({ userid: target.id });

			if (!developerProfile) {
				developerProfile = await new Developer({
					_id: new mongoose.Types.ObjectId(),
					userid: target.id,
					permission: "temporary"
				});
				
				await developerProfile.save();
				interaction.reply(`You gave ${target.username} access to developer commands.`);
			}else {
				interaction.reply(`${target.username} already had acces to developer commands.`);
			}
		} else {
			interaction.reply("You are not a permanent developer, you can't give others developer commands.")
		}
	},
};