const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./data/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
module.exports = { client };
client.commands = new Collection();

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


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(token);