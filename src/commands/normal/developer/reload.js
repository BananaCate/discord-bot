const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload')
                .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        
        const commandPath = findCommandPath(commandName);
  
        if (!commandPath) {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        }

        delete require.cache[require.resolve(commandPath)];

        try {
            const newCommand = require(commandPath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
            interaction.reply(`There was an error while reloading command \`${commandName}\`.`);
        }
    }
};

function findCommandPath(commandName) {
    const types = ['normal', 'contextmenu'];
    const categories = ['owner', 'admin', 'developer', 'fun', 'moderation', 'utility'];
    for (const type of types) {
        for (const category of categories) {
            const commandPath = path.join(__dirname, '..', '..', `${type}`, `${category}`, `${commandName}.js`);
            if (fs.existsSync(commandPath)) {
                return commandPath;
            }
        }
    }
    return null;
}