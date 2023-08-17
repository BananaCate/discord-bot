const { Collection, InteractionType, PermissionsBitField, WebhookClient } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errorWebhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1141391428673618032/Qy1r3K9vHOewMgdZr8eYJZ1LQnMdwAAPyQL68UanYXqVgat7bLq6rnN1lMdX628zBsHT' });
const succesWebhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1141469514312192101/FHn3qky058ViFW9mdn4jo4bhrGqw5M7Ns5WQmeXjiUA9xQod_qdAPoddUqWVJ6oNdV2X' });
const Block = require("../../schemas/block.js");
const Developer = require("../../schemas/developer.js");

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		const blockprofile = await Block.findOne({ userid: interaction.user.id });
		if (!blockprofile) {
			if (interaction.isChatInputCommand()) {
				const ownProfile = await Developer.findOne({ userid: interaction.user.id });
				const { commands } = client;
				const { commandName } = interaction;
				const commandCategory = findCommandCategory(commandName);
				

				if (commandCategory == "owner" && interaction.user.id != "441240050861211648") {
					return interaction.reply("This is only for Banana Cate.");
				}
				else if (commandCategory == "developer" && !ownProfile) {
					return interaction.reply("This is only for developers.");
				}
				else if (commandCategory == "admin" && !(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
														ownProfile)) {
					return interaction.reply("This is only for admins.");
				}
				else if (commandCategory == "moderation" ) {
					if(commandName.includes("ban") && !(interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) || 
					interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || ownProfile)) {
						return interaction.reply("You need ban permission's");
					}
					if (!(interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers) || 
							interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels) || 
							interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) || 
							interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames) || 
							interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) || 
							interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) ||

							interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) || 
							interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || ownProfile)) {
						return interaction.reply("This is only for moderators.");
					}
				}
				
				const command = commands.get(commandName)
				
				if (!command) return console.error(`No command matching ${commandName} was found.`);


				const { allCooldowns } = client;
					
				if (!allCooldowns.has(command.data.name)) {
					allCooldowns.set(command.data.name, new Collection());
				}
				
				const now = Date.now();
				const cooldown = allCooldowns.get(command.data.name);
				const defaultCooldownDuration = 3;
				const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
				
				if (cooldown.has(interaction.user.id)) {
					const expirationTime = cooldown.get(interaction.user.id) + cooldownAmount;
					
					if (now < expirationTime) {
						const expiredTimestamp = Math.round(expirationTime / 1000);
						return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
					}
				}
				
				cooldown.set(interaction.user.id, now);
				setTimeout(() => cooldown.delete(interaction.user.id), cooldownAmount);

				try {
					const options = interaction.options._hoistedOptions;
					const args = options.map(option => option.value);
					const optionNames = options.map(option => option.name);
					const argsString = args.map((arg, index) => `${optionNames[index]}: \`${arg}\``).join(', ');
					await command.execute(interaction);
					succesWebhook.send({
						content: `Command ${commandName} ran by ${interaction.user.tag} with arguments: ${argsString}`
					});
				} catch (error) {
					interaction.reply("There was an error executing this command :c");
					console.error(chalk.red(`Error executing ${interaction.commandName} from ${interaction.user.tag}\n${error}`));
					errorWebhook.send({
						content: `Command ${commandName} ran by ${interaction.user.tag}: \`\`\`${error}\`\`\``
					})
				}
			}
			else if (interaction.isButton()) {
				const { buttons } = client;
				const { customId } = interaction;
				const button = buttons.get(customId);
				if (!button) return console.log('There is no code for this button');
				
				try {
					await button.execute(interaction);
					succesWebhook.send({
						content: `Button ${customid} ran by ${interaction.user.tag}`
					})
				} catch (err) {
					console.error(chalk.red(`Error executing button ${customId} from ${interaction.user.tag}\n${err}`));
					errorWebhook.send({
						content: `Button ${customId} ran by ${interaction.user.tag}: \`\`\`${err}\`\`\``
					})
				}
			}
			else if (interaction.isSelectMenu()) {
				const { selectMenus } = client;
				const { customId } = interaction;
				const menu = selectMenus.get(customId);
				if (!menu) return console.log('There is no code for this select menu');

				try {
					await menu.execute(interaction);
					succesWebhook.send({
						content: `Select Menu ${customid} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					console.error(chalk.red(`Error executing select menu ${customId} from ${interaction.user.tag}\n${error}`));
					errorWebhook.send({
						content: `Select menu ${customId} ran by ${interaction.user.tag}: \`\`\`${error}\`\`\``
					})
				}
			}
			else if(interaction.type == InteractionType.ModalSubmit) {
				const { modals } = client;
				const { customId } = interaction;
				const modal = modals.get(customId);
				if (!modal) return new Error ('There is no code for this modal');

				try { 
					await modal.execute(interaction);
					succesWebhook.send({
						content: `Modal ${customid} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					console.error(chalk.red(`Error executing modal ${customId} from ${interaction.user.tag}\n${error}`));
					errorWebhook.send({
						content: `Modal ${customId} ran by ${interaction.user.tag}: \`\`\`${error}\`\`\``
					})
				}
			}
			else if (interaction.isContextMenuCommand()) {
				const { commands } = client;
				const { commandName } = interaction;
				const contextCommand = commands.get(commandName);

				if (!contextCommand) return;
				
				try {
					await contextCommand.execute(interaction);
					succesWebhook.send({
						content: `Context menu command ${commandName} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					console.error(chalk.red(`Error executing context menu command ${commandName} from ${interaction.user.tag}\n${error}`));
					errorWebhook.send({
						content: `Context menu command ${commandName} ran by ${interaction.user.tag}: \`\`\`${error}\`\`\``
					})
				}
			}
			else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
				const { commands } = client;
				const { commandName } = interaction;
				const command = commands.get(commandName);
		
				if (!command) return console.error(`No command matching ${commandName} was found.`);

				try {
					await command.autocomplete(interaction);
					succesWebhook.send({
						content: `auto complete command ${commandName} ran by ${interaction.user.tag}`
					})
				} catch (err) {
					console.error(chalk.red(`Error executing auto complete command ${commandName} from ${interaction.user.tag}\n${err}`));
					errorWebhook.send({
						content: `auto complete command ${commandName} ran by ${interaction.user.tag}: \`\`\`${err}\`\`\``
					})
				}
			}
		}
		else {
			interaction.reply("You are blocked from using any commands.");
		}
	},
};

function findCommandCategory(commandName) {
    const types = ['normal', 'contextmenu'];
    const categories = ['admin','developer','fun','moderation','utility'];
    for (const type of types) {
        for (const category of categories) {
            const commandPath = path.join(__dirname, '..', '..', 'commands', `${type}`, `${category}`, `${commandName}.js`);
            if (fs.existsSync(commandPath)) {
                return category;
			}
		}
    }
    return null;
}