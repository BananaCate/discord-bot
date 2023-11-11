const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const servers = require("../../schemas/membercounts.js");

module.exports = {
    data: {
        name: 'membercount'
    },
    async execute(interaction, data) {
        const page = data[0];
        const type = data.substring(1,5);

        const amount = interaction.fields.getTextInputValue("amount");
        const message = interaction.fields.getTextInputValue("message");
        const channel = interaction.fields.getTextInputValue("channel");

        const Targetchannel = interaction.client.channels.cache.get(channel);
        if (!Targetchannel) {
            return interaction.reply({
                        content:`I do not have acces to <#${interaction.fields.getTextInputValue("channel")}>, also meaning i won't be able to send messages there. Pick a diffrent chanel or change my permissions.`,
                        allowedMentions: { users: [], roles: [], everyone: false },
                        ephemeral: true
                    });
        }

        if (isNaN(amount)) {
            return interaction.reply({
                        content: (`${amount} is not a valid number i can work with. Please pick an natural number.`),
                        allowedMentions: { users: [], roles: [], everyone: false },
                        ephemeral: true
                    })
        }
        
		currentServer = await servers.findOne({ serverid: interaction.guild.id });
        if (type == "add") {
            if (!currentServer) {
                currentServer = await new servers({
                    serverid: interaction.guild.id,
                    messages: [{amount: amount, message: message, channel: channel}],
                    oldmembercount: interaction.guild.memberCount
                });
            }
            else {
                currentServer.messages.push({amount: amount, message: message, channel: channel})
            }

            await currentServer.save();
    
            await interaction.reply({
                content: 'Succesfully created',
                ephemeral: true
            });
        }
        else if (type == "edit") {
            currentServer.messages[Number(page)-1] = {amount: amount, message: message, channel: channel}
            await currentServer.save();

            await interaction.reply({
                content: 'Succesfully edited it',
                ephemeral: true
            });
        }
    }
};