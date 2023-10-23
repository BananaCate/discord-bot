const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrole')
		.setDescription('Add a role to a member')
		.addUserOption(option => 
            option.setName('target')
                .setDescription('The member to add the role to')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role you want to add')
                .setRequired(true)),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const member = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        if (botPermission.has(PermissionsBitField.Flags.ManageRoles) || botPermission.has(PermissionsBitField.Flags.Administrator)) {
            if (role.position >= interaction.member.roles.highest.position) {
                return interaction.reply("You can't give a role higher/equal to your highest role.");
            }
            if (role.position >= interaction.guild.members.cache.get(interaction.client.user.id).roles.highest.position) {
                return interaction.reply("This role is higher/equal than my highest role.");
            }
            await member.roles.add(role);
            interaction.reply({
                content: `You added the role ${role} to: ${member}`,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        } else {
            interaction.reply('I do not have permissions to give roles.');
        }
	}
};