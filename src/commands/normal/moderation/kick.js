const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a memeber')
		.addUserOption(option => 
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to kick this member')),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const member = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason was given';

        if (botPermission.has(PermissionsBitField.Flags.KickMembers)  || botPermission.has(PermissionsBitField.Flags.Administrator)) {
            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply("You can't kick someone higher/equal than yourselves.");
            }
            if (member.roles.highest.position >= interaction.guild.members.cache.get(interaction.client.user.id).roles.highest.position) {
                return interaction.reply("I can't kick someone higher/equal than myself.");
            }

            await member.kick(reason);
            interaction.reply({
                content: `You kicked ${member} for reason: \`${reason}\``,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        } else {
            interaction.reply('I do not have permissions to kick members.');
        }
	}
};