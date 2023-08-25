const blockedusers = require("../../../schemas/blockedusers.js");
const developers = require("../../../schemas/developers.js");
const { SlashCommandBuilder } = require('discord.js');

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
		const developerProfile = await developers.findOne({ userid: target.id });
		if (developerProfile) {
			if (developerProfile.permission == "permanent") {
				return interaction.reply({
					content: `${target} has permanent developer, you can't block them from using commands`,
					allowedMentions: { users: [], roles: [], everyone: false }
				});
			}
			developers.deleteOne({userid: target.id});
		}
		let blockprofile = await blockedusers.findOne({ userid: target.id });
		if (blockprofile) {
			return interaction.reply({
				content: `${target} was already blocked from using commands.`,
                allowedMentions: { users: [], roles: [], everyone: false }
			});
		}

		blockprofile = await new blockedusers({
			userid: target.id
		});
		
		await blockprofile.save();
		interaction.reply({
			content: `You blocked ${target} from using commands.`,
			allowedMentions: { users: [], roles: [], everyone: false }
		});
	}
};