const { Collection, InteractionType, PermissionsBitField, WebhookClient } = require('discord.js');
const { succesWebhookurl, errorWebhookurl } = require('../../../config.json');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errorWebhook = new WebhookClient({ url: errorWebhookurl });
const succesWebhook = new WebhookClient({ url: succesWebhookurl });
const blockedusers = require("../../schemas/blockedusers.js");
const developers = require("../../schemas/developers.js");

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		const blockprofile = await blockedusers.findOne({ userid: interaction.user.id });
		if (!blockprofile) {
			if (interaction.isChatInputCommand()) {
				const ownProfile = await developers.findOne({ userid: interaction.user.id });
				const { commands } = client;
				const { commandName } = interaction;
				const commandCategory = findCommandCategory(commandName);
				const permission = interaction.member.permissions;
				const flag = PermissionsBitField.Flags;

				if (commandCategory == "owner" && !(interaction.user.id == "441240050861211648")) {
					return interaction.reply("This is only for Banana Cate.");
				}
				else if (commandCategory == "developer" && !(ownProfile || interaction.user.id == "441240050861211648")) {
					return interaction.reply("This is only for developers.");
				}
				else if (commandCategory == "admin" && !(permission.has(flag.Administrator) ||		ownProfile || interaction.user.id == "441240050861211648")) {
					return interaction.reply("This is only for admins.");
				}
				else if (commandCategory == "moderation" ) {
					if(commandName.includes("ban") && !(permission.has(flag.BanMembers) ||		permission.has(flag.Administrator) || ownProfile || interaction.user.id == "441240050861211648")) {
						return interaction.reply("You need ban permission's");
					}
					else if (!(permission.has(flag.KickMembers) || permission.has(flag.ManageChannels) || permission.has(flag.ManageMessages) || 
							permission.has(flag.ManageNicknames) || permission.has(flag.ManageRoles) || permission.has(flag.ModerateMembers) ||

							permission.has(flag.BanMembers) || permission.has(flag.Administrator) || ownProfile || interaction.user.id == "441240050861211648")) {
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

				if (commandName == "eval") {
					command.execute(interaction)
				}
				else {
					try {
						const optionValues = [];
						for (const option of interaction.options.data) {
							const value = option.value;
							const name = option.name;
							optionValues.push(`${name}: \`${value}\``);
						}
						const argsString = optionValues.join(', ');

						await command.execute(interaction);

						succesContent = `${commandName} ran by ${interaction.user.tag}`
						if (argsString) succesContent += ` with arguments: ${argsString}`

						succesWebhook.send({
							username: "Command",
							content: succesContent
						});
						
					} catch (error) {
						interaction.reply("There was an error executing this command :c");
						
						const optionValues = [];
						for (const option of interaction.options.data) {
							const value = option.value;
							const name = option.name;
							optionValues.push(`${name}: \`${value}\``);
						}
						const argsString = optionValues.join(', ');

						errorContent = `${commandName} ran by ${interaction.user.tag}`
						if (argsString) errorContent += ` with arguments: ${argsString}`
						errorContent += `:\n\`\`\`${error.stack}\`\`\``

						errorWebhook.send({
							username: "Command",
							content: errorContent
						});
					}
				}
			}
			else if (interaction.isButton()) {
				const { buttons } = client;
				const { customId } = interaction;
				const buttonId = customId.split('_')[0];
				const data = customId.split('_')[1];

				const button = buttons.get(buttonId);
				if (!button) return console.log('There is no code for this button');
				
				try {
					await button.execute(interaction, data);

					succescontent = `${buttonId} ran by ${interaction.user.tag}`
					if (data) succescontent += ` with data: ${data}`;

					succesWebhook.send({
						username: "Button",
						content:  succescontent
					})
				} catch (error) {
					errorcontent = `${buttonId} ran by ${interaction.user.tag}`
					if (data) errorcontent += ` with data: ${data}`;
					
					errorWebhook.send({
						username: "Button",
						content: `${errorcontent}:\n\`\`\`${error.stack}\`\`\``
					});
				}
			}
			else if (interaction.isSelectMenu()) { // ADD WHICH OPTION		 ADD WHICH OPTION		 ADD WHICH OPTION		 ADD WHICH OPTION		 ADD WHICH OPTION		
				const { selectMenus } = client;
				const { customId } = interaction;
				const menu = selectMenus.get(customId);
				if (!menu) return console.log('There is no code for this select menu');

				try {
					await menu.execute(interaction);
					succesWebhook.send({
						username: "Select Menu",
						content: `${customId} ran by ${interaction.user.tag}`
					})
				} catch (error) {					
					errorWebhook.send({
						username: "Select Menu",
						content: `${customId} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
					});
				}
			}
			else if(interaction.type == InteractionType.ModalSubmit) { // ADD ARGUMENTS		 ADD ARGUMENTS		 ADD ARGUMENTS		 ADD ARGUMENTS		 ADD ARGUMENTS		
				const { modals } = client;
				const { customId } = interaction;
				const modal = modals.get(customId);
				if (!modal) return new Error ('There is no code for this modal');

				try { 
					await modal.execute(interaction);
					succesWebhook.send({
						username: "Modal",
						content: `${customId} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					errorWebhook.send({
						username: "Modal",
						content: `${customId} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
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
						username: "Context menu command",
						content: `${commandName} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					errorWebhook.send({
						username: "Context menu command",
						content: `${commandName} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
					});
				}
			}
			else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) { // ADD ARGUMENTS		 ADD ARGUMENTS		 ADD ARGUMENTS		 ADD ARGUMENTS
				const { commands } = client;
				const { commandName } = interaction;
				const command = commands.get(commandName);
		
				if (!command) return console.error(`No command matching ${commandName} was found.`);

				try {
					await command.autocomplete(interaction);
					succesWebhook.send({
						username: "Auto complete command",
						content: `${commandName} ran by ${interaction.user.tag}`
					})
				} catch (error) {
					errorWebhook.send({
						username: "Auto complete command",
						content: `${commandName} ran by ${interaction.user.tag}:\n\`\`\`${error.stack}\`\`\``
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