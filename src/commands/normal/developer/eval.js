const { SlashCommandBuilder, WebhookClient } = require('discord.js');
const { succesWebhookurl, errorWebhookurl } = require('../../../../config.json');
const errorWebhook = new WebhookClient({ url: errorWebhookurl });
const succesWebhook = new WebhookClient({ url: succesWebhookurl });
const chalk = require('chalk');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Runs desired commands')
		.addStringOption(option =>
			option.setName("input")
			.setDescription("The code you want the bot to run")
			.setRequired(true)),
	async execute(interaction) {
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
			} else {
				interaction.reply({
					content: "Done",
					ephemeral: true
				})
			}

			succesWebhook.send({
				username: "Command",
				content: `eval ran by ${interaction.user.tag} with arguments: input:\`${interaction.options.data[0].value}\``
			});
		}  catch (error) {
			interaction.reply("There was an error executing this command :c");

			console.log(chalk.red(`Error executing ${interaction.options.data[0].value} from ${interaction.user.tag}`));
			console.error(error)

			errorWebhook.send({
				username: "Command",
				content: `eval ran by ${interaction.user.tag} with arguments: input:\`${interaction.options.data[0].value}\`:\n\`\`\`${error.stack}\`\`\``
			});
		}
			
	},
};