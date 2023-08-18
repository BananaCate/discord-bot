module.exports = {
    data: {
        name: 'sub-menu'
    },
    async execute(interaction) {
        await interaction.reply({
            content: `You selected: ${interaction.values[0]}`
        });
    }
}