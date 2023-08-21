const guilds = require("../../../schemas/guilds.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('Returns information from a databse'),
	async execute(interaction) {
		let guildProfile = await guilds.findOne({ guildId: interaction.guild.id });
        if (!guildProfile) {
            guildProfile = await new guilds({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL() ? interaction.guild.iconURL() : "None."
            });
        
            await guildProfile.save();
            await interaction.reply(`Server name: ${guildProfile.guildName}`);
        } else {
            await interaction.reply(`Server id: ${guildProfile.guildId}`);
        }
	},
};