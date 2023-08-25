const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('latency')
		.setDescription('Replies with API latency & client ping'),
	async execute(interaction) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

		const newMessage = `API latency: ${interaction.client.ws.ping}\nClient ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        interaction.editReply({
            content: newMessage
        })
	}
};