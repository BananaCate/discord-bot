const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sendwebhook')
		.setDescription('Sends a message in a webhook')
        .addStringOption(option =>
            option.setName("message")
                .setDescription("The message you want to send trough the webhook")
                .setRequired(true))
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The channel where there is a webhook")),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const webhookchannel = interaction.options.getChannel("channel") ?? interaction.channel;
        const webhookmessage = interaction.options.getString("message");

        if (botPermission.has(PermissionsBitField.Flags.ManageWebhooks) || botPermission.has(PermissionsBitField.Flags.Administrator)) {
            const webhooks = await webhookchannel.fetchWebhooks();
            const webhook = webhooks.find(wh => wh.token);
            
            if (!webhook) {
                return interaction.reply(`No webhook(s) in ${webhookchannel} were found that i can use!`);
            }
            
            await webhook.send({
                content: webhookmessage,
                avatarURL: webhook.avatarURL(),
                allowedMentions: { users: [], roles: [], everyone: false }
            });
            
            interaction.reply(`Sent \"\`${webhookmessage}\`\" in ${webhookchannel}`);
        } else {
            interaction.reply('I do not have permissions to send a message trough a webhook.');
        }
	}
};