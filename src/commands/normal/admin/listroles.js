const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listroles')
		.setDescription('Shows a list of all roles'),
    async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
        if (botPermission.has(PermissionsBitField.Flags.ManageRoles) || botPermission.has(PermissionsBitField.Flags.ManageGuild) ||
            botPermission.has(PermissionsBitField.Flags.Administrator)) {
            const guildRoles = interaction.guild.roles.cache;
            const roleArray = Array.from(guildRoles.values());

            roleArray.sort((a, b) => b.position - a.position);

            roles = `The roles in this server are:\n${roleArray.join("\n")}`;
            
            interaction.reply({
                content: roles,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        } else {
            interaction.reply("I do not have permission to see the roles.")
        }
    }
};