const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createrole')
		.setDescription('Creates a role')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name you want the role to be called')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to create the role')),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
        const name = interaction.options.getString('name');
        const reason = interaction.options.getString('reason') ?? "No reason provided";
        if (botPermission.has(PermissionsBitField.Flags.ManageRoles) || botPermission.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.guild.roles.create({ name: name, reason: reason });
            interaction.reply({
                content: `Created role ${name} with reason: \`${reason}\`.`,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        } else {
            interaction.reply('I do not have permissions to create a role.');
        }
	}
};