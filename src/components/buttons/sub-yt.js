module.exports = {
    data: {
        name: 'sub-yt'
    },
    async execute(interaction) {
        await interaction.reply({
            content: 'https://youtube.com'
        });
    }
}