const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listwebhooks')
		.setDescription('Shows a list of webhooks')
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("External channel")),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        
        if (botPermission.has(PermissionsBitField.Flags.ManageWebhooks || botPermission.has(PermissionsBitField.Flags.Administrator))) {
            const webhookcollection = await channel.fetchWebhooks();
            if(webhookcollection.size == 0) {
                return interaction.reply(`There are no webhooks in ${channel}`);
            }
            const webhooks = Array.from(webhookcollection.values());
            
            interaction.reply(`${channel} has the following webhook(s):\`\`\`\n${webhooks.map(webhook => webhook.name).join("\n")}\`\`\``);
        } else {
            interaction.reply('I do not have permissions to list the webhooks.');
        }
	}
};