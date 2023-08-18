const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to unmute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to unmute them for')),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'There was no reason provided';

        if (botPermission.has(PermissionsBitField.Flags.ModerateMembers) || botPermission.has(PermissionsBitField.Flags.Administrator)) {
            await target.timeout(null, reason);
            interaction.reply(`${target} has been unmuted for reason: \`${reason}\`.`);
        } else {
            interaction.reply('I do not have permissions to unmute members.');
        }
	},
};