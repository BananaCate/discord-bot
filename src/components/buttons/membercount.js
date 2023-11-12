const { ModalBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle } = require("discord.js");
const servers = require("../../schemas/membercounts.js")

module.exports = {
    data: {
        name: 'membercount'
    },
    async execute(interaction, data) {
        page = data[0];
		currentServer = await servers.findOne({ serverid: interaction.guild.id });

        const leftbutton = new ButtonBuilder()
                                .setCustomId(`membercount_${page}left`)
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('⬅️')
        const editbutton = new ButtonBuilder()
                                .setCustomId(`membercount_${page}edit`)
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('✏️')
        const rightbutton = new ButtonBuilder()
                                .setCustomId(`membercount_${page}right`)
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji('➡️')

        const addbutton = new ButtonBuilder()
                                .setCustomId(`membercount_${page}add`)
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('➕')
        const removebutton = new ButtonBuilder()
                                .setCustomId(`membercount_${page}remove`)
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji('🗑️')

        embedData = "";
        const type = data.substring(1,7);

        if (interaction.user.id != interaction.message.interaction.user.id) {
            return interaction.reply({ephemeral: true, content: "This is not your button 😡"});
        }

        if (type == "add" || type == "edit") {
            const modal = new ModalBuilder()
                .setCustomId(`membercount_${data}`)
            
            if (type == "add") {
                modal.setTitle('New member amount notifier!');
            }
            else if (type == "edit") {
                modal.setTitle('Edit amount notifier.');
            }

            const amount = new TextInputBuilder()
                .setCustomId('amount')
                .setLabel('Per how many users?')
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const message = new TextInputBuilder()
                .setCustomId('message')
                .setLabel('What message ({membercount} = amt of members)')
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);
            const channel = new TextInputBuilder()
                .setCustomId('channel')
                .setLabel('Where? (channelid)')
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            modal.addComponents([new ActionRowBuilder().addComponents(amount),new ActionRowBuilder().addComponents(message),new ActionRowBuilder().addComponents(channel)]);
            
            await interaction.showModal(modal);

            const collectorFilter = i => {
                return i.user.id === interaction.user.id;
            };

            interaction.awaitModalSubmit({ time: 60000, filter: collectorFilter }).then(() => {
                updatedata()
            }).catch(error => {});
        }
        else if (type == "left") {          
            page = Number(page) - 1
            move()
        }
        else if (type == "right") {
            page = Number(page) + 1
            move()
        }
        else if (type == "remove") { 
            if (currentServer.messages.splice(Number(page)-1,1).length == 0) {
                await interaction.deferUpdate();
                await currentServer.save();
                return interaction.message.edit({
                    content: "You do not have any preset messages yet. Would you like to make one?",
                    components: [new ActionRowBuilder().addComponents(new ButtonBuilder()
                    .setCustomId('membercount_1add')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('✅'))],
                    embeds: []
                })
            }
            await interaction.deferUpdate();
            await currentServer.save();
            if (Number(page) > currentServer.messages.length) {
                page = Number(page)-1
            }

            updatedata()
        }

        async function move() {
            await interaction.deferUpdate();

            leftbutton.setCustomId(`membercount_${page}left`)
            editbutton.setCustomId(`membercount_${page}edit`)
            rightbutton.setCustomId(`membercount_${page}right`)
            addbutton.setCustomId(`membercount_${page}add`)
            removebutton.setCustomId(`membercount_${page}remove`)

            updatedata()
        }

        function updatedata() {
            setTimeout(async function() {
                currentServer = await servers.findOne({ serverid: interaction.guild.id });
                
                embedData = currentServer.messages[Number(page) - 1];
                resendmessage();
            }, 125);
        }

        function resendmessage() {
            if (Number(page) == 1) {
                leftbutton.setDisabled(true)
            }
            if (Number(page) == currentServer.messages.length) {
                rightbutton.setDisabled(true)
            }

            const embed = new EmbedBuilder()
            .setTitle('Member notifier')
            .setDescription(`Automated notifiers per member count. (${page}/${currentServer.messages.length})`)
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

            if (type == "add" || type == "edit") {
                interaction.editReply({
                    components: [new ActionRowBuilder().addComponents(leftbutton, editbutton,rightbutton), new ActionRowBuilder().addComponents(removebutton, addbutton)],
                    embeds: [embed],
                    allowedMentions: { users: [], roles: [], everyone: false }
                })
            }
            else {
                interaction.message.edit({
                    components: [new ActionRowBuilder().addComponents(leftbutton, editbutton,rightbutton), new ActionRowBuilder().addComponents(removebutton, addbutton)],
                    embeds: [embed],
                    allowedMentions: { users: [], roles: [], everyone: false }
                })
            }
        }
    }
};