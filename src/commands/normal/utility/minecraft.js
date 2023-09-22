const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minecraft')
		.setDescription('Gives some information about a minecraft username')
        .addStringOption(option => 
			option.setName("username")
				.setDescription("The username you want some information about")
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const input = interaction.options.getString("username");

        if (!(/^[a-zA-Z0-9_]{3,16}$/.test(input))) {
            return interaction.editReply("Not a valid minecraft username (according to gpt)");
        }
        
        try {
            const { data: { data: { player } } } = await axios.get(`https://playerdb.co/api/player/minecraft/${input}`);

            const { username, raw_id: uuid } = player;        

            const embed = new EmbedBuilder()
                .setTitle(username)
                .setDescription(`Information about ${username}`)
                .setColor(0x00ffbb)
                .setThumbnail(`https://crafthead.net/avatar/${uuid}`)
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
                        name: "SkyCrypt",
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
                    },
                    {
                        name: "PitPanda",
                        value: `https://pitpanda.rocks/players/${username}`,
                        inline: true
                    },
                    {
                        name: "Elite Farmers",
                        value: `https://elitebot.dev/@${username}`,
                        inline: true
                    },
                    {
                        name: "Sky glass",
                        value: `https://skyglass.dev/stats/${username}`,
                        inline: true
                    }
                ]);

            interaction.editReply({ embeds: [embed] });
        } catch {
            return interaction.editReply("Error fetching the user")
        }
	}
};