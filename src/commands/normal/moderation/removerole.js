const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removerole')
		.setDescription('Remove a role from a member')
		.addUserOption(option => 
            option.setName('target')
                .setDescription('The member to remove the role from')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role you want to remove')
                .setRequired(true)),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        await member.roles.remove(role);
		interaction.reply(`You removed the role ${role} from: ${member}.`);
	},
};