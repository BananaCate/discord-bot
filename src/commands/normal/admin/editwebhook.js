const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('editwebhook')
		.setDescription('Edits a webhook name/avatar/channelid')
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the webhook you want to edit")
                .setRequired(true))
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("External channel where the webhook is"))
        .addStringOption(option =>
            option.setName("target-name")
                .setDescription("The name you want to edit to"))
        .addStringOption(option =>
            option.setName("target-avatar")
                .setDescription("The avatar you want to edit to"))
        .addChannelOption(option =>
            option.setName("target-channel")
                .setDescription("The channel you want to edit to")),
	async execute(interaction) {
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        const name = interaction.options.getString("name");

        const webhookcollection = await channel.fetchWebhooks();

        if(webhookcollection.size == 0) {
            return interaction.reply(`There are no webhooks in ${channel}.`);
        }
        
        const webhook = webhookcollection.find(wh => wh.token && wh.name == name);

        if (webhook.size == 0) {
            return interaction.reply(`There is no webhook with name: ${name}.`)
        }

        const targetname = interaction.options.getString("target-name") ?? webhook.name;
        const targetavatar = interaction.options.getString("target-avatar") ?? webhook.avatarURL();
        const targetchannel = interaction.options.getChannel("target-channel");

        const targetchannelid = targetchannel ? targetchannel.id : webhook.channelId;

        edited = "I have edited the following:";

        if (targetname != webhook.name) {
            edited += `\nName: ${webhook.name} -> ${targetname}`;
        }

        if (targetchannelid != channel.id) {
            edited += `\nLocation: <#${channel.id}> -> <#${targetchannelid}>`;
        }

        if (targetavatar != webhook.avatarURL()) {
            edited += `\nAvatar: ${webhook.avatarURL()} -> ${targetavatar} .`;
        }
        else {
            edited += ".";
        }

        await webhook.edit({
            name: targetname,
            avatar: targetavatar,
            channel: targetchannelid,
        })

        interaction.reply(edited);
	},
};