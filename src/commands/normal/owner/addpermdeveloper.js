const Developer = require("../../../schemas/developer.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addpermdeveloper')
		.setDescription("Adds a user to the permanent developer list")
		.addUserOption(option => 
			option.setName("target")
				.setDescription("The person you want to give acces to permanent developer commands")
				.setRequired(true)),
	async execute(interaction) {
        const target = interaction.options.getUser("target");
        let developerProfile = await Developer.findOne({ userid: target.id });

        if (!developerProfile) {
            developerProfile = await new Developer({
                userid: target.id,
                permission: "permanent"
            });
            
            await developerProfile.save();
            interaction.reply(`You gave ${target.username} access permanently to developer commands.`);
        }
        else {
            if (developerProfile.permission == "permanent") {
                return interaction.reply(`${target.username} already had permanent developer commands.`);
            }
            developerProfile.permission = "permanent";
            await developerProfile.save();
            interaction.reply(`You gave ${target.username} acces permantly to developer commands.`);
        }
	},
};