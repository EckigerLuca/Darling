const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./data/config.json');

const commands = [];

const folders = fs.readdirSync('./src/commands');

for (var folder of folders) {
    const files = fs.readdirSync(`./src/commands/${folder}`);
    for (var file of files) {
        const command = require(`./commands/${folder}/${file}`);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		await rest.put(
			Routes.applicationGuildCommands(clientId, '785571867279753238'),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();