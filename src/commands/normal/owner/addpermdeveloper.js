const developers = require("../../../schemas/developers.js");
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
        let developerProfile = await developers.findOne({ userid: target.id });

        if (!developerProfile) {
            developerProfile = await new developers({
                userid: target.id,
                permission: "permanent"
            });
            
            await developerProfile.save();
            interaction.reply({
                content: `You gave ${target} access permanently to developer commands.`,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        }
        else {
            if (developerProfile.permission == "permanent") {
                return interaction.reply({
                    content: `${target} already had permanent developer commands.`,
                    allowedMentions: { users: [], roles: [], everyone: false }
                });
            }
            developerProfile.permission = "permanent";
            await developerProfile.save();
            interaction.reply({
                content: `You gave ${target} acces permantly to developer commands.`,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        }
	},
};