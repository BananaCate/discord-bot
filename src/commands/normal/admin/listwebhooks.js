const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listwebhooks')
		.setDescription('Shows a list of webhooks')
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("External channel")),
	async execute(interaction) {
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        const webhookcollection = await channel.fetchWebhooks();
        if(webhookcollection.size == 0) {
            return interaction.reply(`There are no webhooks in ${channel}`);
        }
        const webhooks = Array.from(webhookcollection.values());
        
        message = `${channel} has the following webhook(s):\`\`\`\n`;
        for (i = 0; i < webhooks.length; i++) {
            message += `${webhooks[i].name}\n`;
        }
        interaction.reply(`${message}\`\`\``);
	},
};