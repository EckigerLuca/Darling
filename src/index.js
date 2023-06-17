const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, mongodbUri } = require('./data/config.json');
const { MongoClient } = require('mongodb');
const logger = require('silly-logger');

const topGG = false;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

const dbClient = new MongoClient(String(mongodbUri));
(async function dbSetup() {
	await dbClient.connect();
	client.dbClient = dbClient;
	logger.success("Connected to database!");
} ());

if (topGG) {
	const discordBotListToken = require('./data/config.json');
	const { AutoPoster } = require('topgg-autoposter');
	const ap = AutoPoster(`${String(discordBotListToken)}`, client);

	ap.on('posted', (stats) => {
		logger.success(`Posted stats to Top.gg | ${stats.serverCount} servers`);
	});

	ap.on('error', (err) => {
		logger.error(err);
	});
}

const folders = fs.readdirSync('./src/commands');

for (const folder of folders) {
    const files = fs.readdirSync(`./src/commands/${folder}`);
    for (const file of files) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
