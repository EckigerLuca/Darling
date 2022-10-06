const logger = require('silly-logger');
const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		logger.success(`Ready! Logged in as ${client.user.tag}`);
		require("../website/index.js")(client);
		setInterval(() => {
			client.user.setActivity(`${client.guilds.cache.size} servers | /help`, { type: ActivityType.Watching });
		}, 30000);
	},
};