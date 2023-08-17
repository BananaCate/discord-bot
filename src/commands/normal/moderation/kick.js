const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a memeber')
		.addUserOption(option => 
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to kick this member')),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason was given';

        await member.kick(reason);
		interaction.reply(`You kicked ${member} for reason: \`${reason}\``);
	},
};