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
            .setImage("https://cdn.discordapp.com/avatars/1129723426601447554/3908552166038dbacc3a503517beec13.webp")
            .setThumbnail("https://cdn.discordapp.com/avatars/564353701003657216/85ca602f71419bdf04a503ac083a3b3b.webp")
            .setTimestamp(Date.now())
            .setAuthor({
                url: "https://www.youtube.com/watch?v=j5a0jTc9S10",
                iconUR: interaction.user.displayAvatarURL(),
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

            await interaction.reply({embeds: [embed]})
	},
};