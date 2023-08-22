const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionroles')
        .setDescription('Ratter scanner related'),
    async execute(interaction) {
        const red = new ButtonBuilder()
            .setCustomId('role_red')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔴');
        const orange = new ButtonBuilder()
            .setCustomId('role_orange')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🟠');
        const yellow = new ButtonBuilder()
            .setCustomId('role_yellow')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🟡');
        const green = new ButtonBuilder()
            .setCustomId('role_green')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🟢');
        const cyan = new ButtonBuilder()
            .setCustomId('role_cyan')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Light blue')
        const blue = new ButtonBuilder()
            .setCustomId('role_blue')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔵');
        const purple = new ButtonBuilder()
            .setCustomId('role_purple')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🟣');

        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(red,orange,yellow,green),
                         new ActionRowBuilder().addComponents(cyan,blue,purple)]
        });
    }
}