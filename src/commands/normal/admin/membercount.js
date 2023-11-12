const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const servers = require("../../../schemas/membercounts.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('membercount')
		.setDescription('Sets up custom messages in specific channels after reaching a set amount of members.'),
	async execute(interaction) {
		currentServer = await servers.findOne({ serverid: interaction.guild.id });
        if (!currentServer || currentServer.messages.length == 0) {
            interaction.reply({
                content: "You do not have any preset messages yet. Would you like to make one?",
                components: [new ActionRowBuilder().addComponents(new ButtonBuilder()
                    .setCustomId('membercount_1add')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('✅'))]
            })
        }
        else {
            const leftbutton = new ButtonBuilder()
                                .setCustomId('membercount_1left')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('⬅️')
                                .setDisabled(true)
            const editbutton = new ButtonBuilder()
                                .setCustomId('membercount_1edit')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('✏️')
            const rightbutton = new ButtonBuilder()
                                .setCustomId('membercount_1right')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('➡️')

            const addbutton = new ButtonBuilder()
                                .setCustomId('membercount_1add')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('➕')
            const removebutton = new ButtonBuilder()
                                .setCustomId('membercount_1remove')
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji('🗑️')

            const embedData = currentServer.messages[0]

            if (1 == currentServer.messages.length) {
                rightbutton.setDisabled(true);
            }
            const embed = new EmbedBuilder()
                            .setTitle('Member notifier')
                            .setDescription(`Automated notifiers per member count. (1/${currentServer.messages.length})`)
                            .addFields([
                                {
                                    name: "Per",
                                    value: `${embedData["amount"]} members`,
                                    inline: true
                                },
                                {
                                    name: "Message",
                                    value: embedData["message"],
                                    inline: true
                                },
                                {
                                    name: "Channel",
                                    value: `<#${embedData["channel"]}>`,
                                    inline: true
                                }
                            ])
                            .setThumbnail('https://cdn.discordapp.com/icons/1041020827619049592/eb43dd350bc728f10d8955ca68b79807.png?size=4096')
                            .setFooter({text:'Powered by RatterScanner'});
                              
            
            interaction.reply({
                content: ``,
                components: [new ActionRowBuilder().addComponents(leftbutton, editbutton,rightbutton), new ActionRowBuilder().addComponents(removebutton, addbutton)],
                embeds: [embed],
                allowedMentions: { users: [], roles: [], everyone: false }
            })
        }
	}
};