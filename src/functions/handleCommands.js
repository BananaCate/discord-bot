const { REST, Routes } = require('discord.js');
const { token } = require('../../config.json');
const fs = require('node:fs');

module.exports = (client) => {
	client.handleCommands = async() => {
		const commands = [];
		const commandTypeFolders = fs.readdirSync(`./src/commands`);

		for (const commandType of commandTypeFolders) {

			const commandFolders = fs.readdirSync(`./src/commands/${commandType}`);
			
			for (const folder of commandFolders) {
				const commandFiles = fs.readdirSync(`./src/commands/${commandType}/${folder}`).filter(file => file.endsWith('.js'));
				
				for (const file of commandFiles) {
					const command = require(`../commands/${commandType}/${folder}/${file}`);
					
					if ('data' in command && 'execute' in command) {
						client.commands.set(command.data.name, command);
						commands.push(command.data.toJSON());
					} else {
						console.log(`🔴 The command at ./src/commands/${commandType}/${folder}/${file} is missing a required "data" or "execute" property.`);
					}
				}
			}
		}
		
		const rest = new REST().setToken(token);
			
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
			
			await rest.put(
				Routes.applicationCommands("1129723426601447554"),
				{ body: commands },
				);
				
				console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	}
}