const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Prune up to 99 messages')
		.addIntegerOption(option => 
			option.setName('amount')
				.setDescription('Number of messages to prune')),
	async execute(interaction) {
		const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const amount = interaction.options.getInteger('amount');

		if (botPermission.has(PermissionsBitField.Flags.ManageMessages) || botPermission.has(PermissionsBitField.Flags.Administrator)) {
			if (amount < 1 || amount > 99) {
				return interaction.reply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
			}
			await interaction.channel.bulkDelete(amount, true).catch(error => {
				return interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
			});
			
			interaction.reply(`Successfully pruned \`${amount}\` messages.`);
		} else {
            interaction.reply('I do not have permissions to delete messages.');
        }
	},
};