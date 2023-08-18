const { Collection, InteractionType, PermissionsBitField, WebhookClient } = require('discord.js');
const { succesWebhookurl, errorWebhookurl } = require('../../../config.json');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errorWebhook = new WebhookClient({ url: errorWebhookurl });
const succesWebhook = new WebhookClient({ url: succesWebhookurl });
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
				const permission = interaction.member.permissions;
				const flag = PermissionsBitField.Flags;

				if (commandCategory == "owner" && interaction.user.id != "441240050861211648") {
					return interaction.reply("This is only for Banana Cate.");
				}
				else if (commandCategory == "developer" && !ownProfile) {
					return interaction.reply("This is only for developers.");
				}
				else if (commandCategory == "admin" && !(permission.has(flag.Administrator) ||		ownProfile)) {
					return interaction.reply("This is only for admins.");
				}
				else if (commandCategory == "moderation" ) {
					if(commandName.includes("ban") && !(permission.has(flag.BanMembers) ||		permission.has(flag.Administrator) || ownProfile)) {
						return interaction.reply("You need ban permission's");
					}
					else if (!(permission.has(flag.KickMembers) || permission.has(flag.ManageChannels) || permission.has(flag.ManageMessages) || 
							permission.has(flag.ManageNicknames) || permission.has(flag.ManageRoles) || permission.has(flag.ModerateMembers) ||

							permission.has(flag.BanMembers) || permission.has(flag.Administrator) || ownProfile)) {
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
					const optionValues = [];
					for (const option of interaction.options.data) {
						const value = option.value;
						const name = option.name;
						optionValues.push(`${name}: \`${value}\``);
					}
					const argsString = optionValues.join(', ');

					await command.execute(interaction);
					if (argsString) {
						succesWebhook.send({
							content: `Command ${commandName} ran by ${interaction.user.tag} with arguments: ${argsString}`
						});
					}
					else {
						succesWebhook.send({
							content: `Command ${commandName} ran by ${interaction.user.tag}`
						});
					}
				} catch (error) {
					interaction.reply("There was an error executing this command :c");

					console.log(chalk.red(`Error executing ${commandName} from ${interaction.user.tag}`));
					console.error(error)
					
					errorWebhook.send({
						content: `Command ${commandName} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
					});
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
						content: `Button ${customId} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					console.log(chalk.red(`Error executing button ${customId} from ${interaction.user.tag}`));
					console.error(error)
					
					errorWebhook.send({
						content: `Button ${customId} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
					});
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
						content: `Select Menu ${customId} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					console.log(chalk.red(`Error executing select menu ${customId} from ${interaction.user.tag}`));
					console.error(error)
					
					errorWebhook.send({
						content: `Select menu ${customId} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
					});
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
						content: `Modal ${customId} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					console.log(chalk.red(`Error executing modal ${customId} from ${interaction.user.tag}`));
					console.error(error)
					
					errorWebhook.send({
						content: `Modal ${customId} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
					});
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
					console.log(chalk.red(`Error executing context menu command ${commandName} from ${interaction.user.tag}`));
					console.error(error)
					
					errorWebhook.send({
						content: `Context menu command ${commandName} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
					});
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
				} catch (error) {
					console.log(chalk.red(`Error executing auto complete command ${commandName} from ${interaction.user.tag}`));
					console.error(error)
					
					errorWebhook.send({
						content: `Auto complete command ${commandName} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
					});
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
    const categories = ['owner','admin','developer','fun','moderation','utility'];
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