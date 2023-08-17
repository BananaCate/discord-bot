const { SlashCommandBuilder } = require('discord.js');

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
		const webhookchannel = interaction.options.getChannel("channel") ?? interaction.channel;
        const webhookmessage = interaction.options.getString("message");

        const webhooks = await webhookchannel.fetchWebhooks();
        const webhook = webhooks.find(wh => wh.token);

        if (!webhook) {
            return interaction.reply(`No webhook(s) in ${webhookchannel} was/were found that i can use!`);
        }

        await webhook.send({
            content: webhookmessage,
            avatarURL: webhook.avatarURL(),
        });

        interaction.reply(`Sent \"\`${webhookmessage}\`\" in ${webhookchannel}`);
	},
};