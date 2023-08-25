module.exports = {
    data: {
        name: 'sub-menu'
    },
    async execute(interaction) {
        await interaction.reply(`You selected: ${interaction.values[0]}`);
    }
};