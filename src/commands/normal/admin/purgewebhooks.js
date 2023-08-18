const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purgewebhooks')
		.setDescription('Purges webhooks in a (selected) channel')
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("External channel option")),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        if (botPermission.has(PermissionsBitField.Flags.ManageWebhooks || botPermission.has(PermissionsBitField.Flags.Administrator))) {
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
        } else {
            interaction.reply('I do not have permissions to purge webooks.');
        }
	},
};