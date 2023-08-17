const Block = require("../../../schemas/block.js");
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require("mongoose");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription("Adds a user to the block list")
		.addUserOption(option => 
			option.setName("target")
				.setDescription("The person you want to block from using any commands")
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		let blockprofile = await Block.findOne({ userid: target.id });

		if (!blockprofile) {
			blockprofile = await new Block({
				_id: new mongoose.Types.ObjectId(),
				userid: target.id
			});
			
			await blockprofile.save();
			interaction.reply(`You blocked ${target.username} from using commands.`);
		} 
		else{
			interaction.reply(`${target.username} was already blocked from using commands.`)
		}
	},
};