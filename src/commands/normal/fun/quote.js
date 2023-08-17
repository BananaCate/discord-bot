const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Quotes a user')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user you want to quote")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("message")
                .setDescription("The message you want to quote")
                .setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getUser("user");
		const webhookchannel = interaction.channel;
        const webhookmessage = interaction.options.getString("message");
        
        webhook = await webhookchannel.createWebhook({
            name: member.username,
            avatar: member.displayAvatarURL({ dynamic: true })
        })
        
        await webhook.send({
            content: webhookmessage,
            avatarURL: member.displayAvatarURL({ dynamic: true }),
        });

        webhook.delete();
	},
};