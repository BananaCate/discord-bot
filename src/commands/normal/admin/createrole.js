const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createrole')
		.setDescription('Creates a role')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name you want the role to be called')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to create the role')),
	async execute(interaction) {
        const name = interaction.options.getString('name');
        const reason = interaction.options.getString('reason') ?? "No reason provided";
        await interaction.guild.roles.create({ name: name, reason: reason });
		interaction.reply(`Created role ${name} with reason: \`${reason}\`.`);
	},
};