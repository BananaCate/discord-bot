const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Makes an embed'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
            .setTitle("this is an embed!")
            .setDescription("this is a very cool description!")
            .setColor(0x00ffbb)
            .setImage("https://cdn.discordapp.com/avatars/697053966415953942/4c021b8a1f532d1c9e49125689e1bc9b.webp")
            .setThumbnail("https://cdn.discordapp.com/avatars/564353701003657216/85ca602f71419bdf04a503ac083a3b3b.webp")
            .setTimestamp(Date.now())
            .setAuthor({
                url: "https://www.youtube.com/watch?v=j5a0jTc9S10",
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .setFooter({
                iconURL: interaction.client.user.displayAvatarURL(),
                text: "Powered by RatterScanner"
            })
            .setURL("https://ratterscanner.com")
            .addFields([
                {
                    name: "field 1",
                    value: "field value 1",
                    inline: true
                },
                {
                    name: "field 2",
                    value: "field value 2",
                    inline: true
                }
            ]);

            interaction.reply({embeds: [embed]})
	}
};