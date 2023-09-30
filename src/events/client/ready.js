const { WebhookClient } = require('discord.js');
const { extraWebhookurl } = require('../../../config.json');
const extraWebhook = new WebhookClient({ url: extraWebhookurl });

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Logged in as ${client.user.tag}.`);
		
		extraWebhook.send({
			username: "Startup",
			content: 'I have started up.'
		});
	},
};