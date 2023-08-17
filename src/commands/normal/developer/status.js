const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Sets my status')
        .addStringOption(option =>
            option.setName('status')
            .setDescription('Which status')
            .setRequired(true)
            .addChoices(
                { name: 'Online', value: 'online'},
                { name: 'Idle', value: 'idle'},
                { name: 'Do not disturb', value: 'dnd'}
            )),
	async execute(interaction) {
        // no offline option due to confusing-ness of the bot being down
        const choice = interaction.options.getString('status');
		interaction.client.user.setPresence({status: choice});
        interaction.reply(`Set my status to ${choice}`);
	},
};