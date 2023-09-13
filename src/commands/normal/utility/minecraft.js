const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minecraft')
		.setDescription('Gives some information about a minecraft username')
        .addStringOption(option => 
			option.setName("username")
				.setDescription("The username you want some information about")
                .setRequired(true)),
	async execute(interaction) {
        const username = interaction.options.getString("username");

        const embed = new EmbedBuilder()
            .setTitle(username)
            .setDescription(`Information about ${username}`)
            .setColor(0x00ffbb)
            .setThumbnail(`https://crafthead.net/avatar/${username}`)
            .setTimestamp(Date.now())
            .setAuthor({
                url: interaction.user.displayAvatarURL(),
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
                    name: "SkyCrypt:",
                    value: `https://sky.shiiyu.moe/stats/${username}`,
                    inline: true
                },
                {
                    name: "NameMc",
                    value: `https://nl.namemc.com/search?q=${username}`,
                    inline: true
                },
                {
                    name: "Plancke",
                    value: `https://plancke.io/hypixel/player/stats/${username}`,
                    inline: true
                },
                {
                    name: "Laby net",
                    value: `https://laby.net/@${username}`,
                    inline: true
                }
            ]);

        interaction.reply({ embeds: [embed] });
	}
};