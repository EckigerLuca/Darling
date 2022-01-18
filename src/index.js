const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token, color } = require('./data/config.json');

const topGG = false;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });
client.commands = new Collection();

if (topGG) {
	const discordBotListToken = require('./data/config.json');
	const { AutoPoster } = require('topgg-autoposter');
	const ap = AutoPoster(`${discordBotListToken}`, client)

	ap.on('posted', (stats) => {
		console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
	})

	ap.on('error', (err) => {
		console.log(err)
	})
}

const folders = fs.readdirSync('./src/commands');

for (var folder of folders) {
    const files = fs.readdirSync(`./src/commands/${folder}`);
    for (var file of files) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}


const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);