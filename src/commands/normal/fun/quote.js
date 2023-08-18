const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

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
        // ping issue
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
        const member = interaction.options.getUser("user");
		const webhookchannel = interaction.channel;
        const webhookmessage = interaction.options.getString("message");
        
        if (botPermission.has(PermissionsBitField.Flags.ManageWebhooks || botPermission.has(PermissionsBitField.Flags.Administrator))) {
            webhook = await webhookchannel.createWebhook({
                name: member.username,
                avatar: member.displayAvatarURL({ dynamic: true })
            })
            
            await webhook.send({
                content: webhookmessage,
                avatarURL: member.displayAvatarURL({ dynamic: true }),
            });
            
            webhook.delete();
        } else {
            interaction.reply('I do not have permissions to manage webhooks.');
        }
	},
};