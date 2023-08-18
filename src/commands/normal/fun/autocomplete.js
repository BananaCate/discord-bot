const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autocomplete')
		.setDescription('Returns autocomplete')
        .addStringOption(option =>
            option.setName('color')
            .setDescription('A color based on autocomplete')
            .setAutocomplete(true)
            .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choises = ["red", "orange", "yellow", "green", "lightblue", "blue", "darkblue", "purple", "pink"];
        const filtered = choises.filter(choise => choise.startsWith(focusedValue))
        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })))
    },
	async execute(interaction) {
		const option = interaction.options.getString("color");
        await interaction.reply({
            content: `You told me, "${option}"`,
            allowedMentions: { users: [], roles: [], everyone: false }
        })
	},
};