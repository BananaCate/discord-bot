const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Returns a select menu'),
    async execute(interaction) {
        const menu = new SelectMenuBuilder()
            .setCustomId('sub-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(new SelectMenuOptionBuilder({
                label: 'Option #1',
                value: 'https://ratterscanner.com'
            }), new SelectMenuOptionBuilder({
                label: 'Option #2',
                value: 'https://youtube.com'
            }))
        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(menu)]
        })
    }
}