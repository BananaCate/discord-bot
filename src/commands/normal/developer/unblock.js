const Block = require("../../../schemas/block.js");
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
		let blockprofile = await Block.findOne({ userid: target.id });
		if (!blockprofile) {
			interaction.reply(`${target.username} wasn't blocked from using commands.`)
		}
		else {
			await Block.deleteOne({ userid: target.id });
			interaction.reply(`${target.username} has been unblocked from using commands.`)
		}
	},
};