const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purgewebhooks')
		.setDescription('Purges webhooks in the (selected) channel')
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("External channel option")),
	async execute(interaction) {
		const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        const webhookcollection = await channel.fetchWebhooks();
        if(webhookcollection.size == 0) {
            return interaction.reply(`There are no webhooks in ${channel}`);
        }
        const webhooks = Array.from(webhookcollection.values());
        
        message = `I have deleted the following webhook(s) in ${channel}:\`\`\`\n`;
        for (i = 0; i < webhooks.length; i++) {
            message += `${webhooks[i].name}\n`;
            await webhooks[i].delete();
        }
        interaction.reply(`${message}\`\`\``);
	},
};