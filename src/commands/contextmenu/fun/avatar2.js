const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('avatar2')
        .setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        await interaction.reply(`${interaction.targetUser.displayAvatarURL()}`);
    }
}