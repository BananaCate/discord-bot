const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a member')
		.addUserOption(option => 
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to ban this member')),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const member = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason was given';

        if (botPermission.has(PermissionsBitField.Flags.BanMembers || botPermission.has(PermissionsBitField.Flags.Administrator))) {
            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply("You can't ban someone higher/equal than your highest role.");
            }
            if (member.roles.highest.position >= interaction.guild.members.cache.get(interaction.client.user.id).roles.highest.position) {
                return interaction.reply("I can't ban someone higher/equal than my highest role.");
            }

            await interaction.guild.members.ban(member, { reason: reason });
            interaction.reply({
                content: `You banned ${member} for reason: \`${reason}\``,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        } else {
            interaction.reply('I do not have permissions to ban members.');
        }
	}
};