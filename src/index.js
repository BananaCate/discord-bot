const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, mongodbtoken } = require('../config.json');
const { connect } = require('mongoose');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.allCooldowns = new Collection();

const functionFiles = fs.readdirSync(`./src/functions/`).filter(file => file.endsWith(".js"));
for (const file of functionFiles) {
    require(`../src/functions/${file}`)(client);
}

client.handleCommands();
client.handleEvents();
client.handleComponents();
client.login(token); 

connect(mongodbtoken, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(console.error);