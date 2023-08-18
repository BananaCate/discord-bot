const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Select a member to unban')
		.addUserOption(option => 
            option.setName('target')
                .setDescription('The member to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to unban this member')),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const member = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason was given';

        if (botPermission.has(PermissionsBitField.Flags.BanMembers) || botPermission.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.guild.members.unban(member, { "reason": reason });
            interaction.reply({
                content: `You unbanned ${member} for reason: \`${reason}\`.`,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        } else {
            interaction.reply('I do not have permissions to unban members.');
        }
	},
};