const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, mongodbUri } = require('./data/config.json');
const { MongoClient } = require('mongodb');
const logger = require('silly-logger');

const { topGG } = require('./data/config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

const dbClient = new MongoClient(String(mongodbUri));
(async function dbSetup() {
	await dbClient.connect();
	client.dbClient = dbClient;
	logger.success("Connected to database server!");

	try {
		const databases = (await dbClient.db().admin().listDatabases()).databases;
		let found = false;
		databases.forEach((database) => {
			if (database.name === "darling") found = true;
		});
		if (!found) {
			throw new Error("Database not existing!");
		}
	}
	catch (err) {
		logger.error("Database not existing! Please create a mongodb database called 'darling' and restart the bot!");
		process.exit(1);
	}

	const requiredCollections = ['servers', 'users', 'welcome'];
	const collections = await dbClient.db("darling").listCollections().toArray();
	const collectionsOnServer = [];
	const notFound = [];

	collections.forEach((collection) => {
		collectionsOnServer.push(collection.name);
	});

	requiredCollections.forEach((collection) => {
		if (!collectionsOnServer.includes(collection)) notFound.push(collection);
	});

	if (notFound.length > 0) {
		logger.error(`Missing collections: ${notFound.join(', ')}`);
		logger.info("Creating missing collections...");
		notFound.forEach(async (collection) => {
			dbClient.db("darling").createCollection(collection);
			logger.info(`Created collection ${collection}!`);
		});
	}
	logger.success("Database setup complete!\n");

} ());

if (topGG) {
	const { discordBotListToken } = require('./data/config.json');
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
