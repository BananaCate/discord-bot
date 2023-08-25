const guilds = require("../../../schemas/guilds.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('Returns information from a database'),
	async execute(interaction) {
		let guildProfile = await guilds.findOne({ guildId: interaction.guild.id });
        if (!guildProfile) {
            guildProfile = await new guilds({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL() ?? "None."
            });
        
            await guildProfile.save();
            interaction.reply(`Server name: ${guildProfile.guildName}`);
        } else {
            interaction.reply(`Server id: ${guildProfile.guildId}`);
        }
	}
};