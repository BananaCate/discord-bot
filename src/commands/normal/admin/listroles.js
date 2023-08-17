const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listroles')
		.setDescription('Shows a list of all roles'),
    async execute(interaction) {
        const guildRoles = interaction.guild.roles.cache;
        const roleArray = Array.from(guildRoles.values());
        roles = "The roles in this server are:\n";
        for (i = 0; i < roleArray.length; i++) {
            roles += `${roleArray[i].name}\n`;
        }
        interaction.reply(roles);
    },
};