const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createwebhook')
		.setDescription('Creates a webhook for selected channel with desired name')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name you want the webhook to have')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where you want to create the webhook')),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const targetChannel = interaction.options.getChannel('channel') ?? interaction.channel;
        const WebookName = interaction.options.getString('name');
        if (botPermission.has(PermissionsBitField.Flags.ManageWebhooks) || botPermission.has(PermissionsBitField.Flags.Administrator)) {
            targetChannel.createWebhook({
                name: WebookName,
                avatar: 'https://cdn.discordapp.com/avatars/505301679999287299/a352379bfc046ed00a59444c551d972c.png?size=4096'
            })
            interaction.reply(`Created the webook \`${WebookName}\` in ${targetChannel}`);
        } else {
            interaction.reply('I do not have permission to create a webhook.');
        }
	},
};