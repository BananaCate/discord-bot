const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Runs desired commands')
		.addStringOption(option =>
			option.setName("input")
			.setDescription("The code you want the bot to run")
			.setRequired(true)),
	async execute(interaction) {
		// ping issue
		const code = interaction.options.getString("input");

		const wrappedCode = `
		(async () => {
			const func = async () => {
			${code}
			};
			return await func();
		})()
		`;

		try {
			const result = await eval(wrappedCode);
			if (result) {
				interaction.reply(`Result: ${result}`);
			} 
			else {
				interaction.reply({content: "Done", ephemeral : true})
			}
		} catch (err) {
			interaction.reply(`Error: ${err}`);
		}
			
	},
};