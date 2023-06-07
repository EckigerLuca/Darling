const logger = require('silly-logger');
const { ActivityType } = require('discord.js');

let num = 0;

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		logger.success(`Ready! Logged in as ${client.user.tag}`);
		require("../website/index.js")(client);
		setInterval(async () => {
			if (num == 0) {
				client.user.setActivity(`${client.guilds.cache.size} servers | /help`, { type: ActivityType.Watching });
				++num;
			} else if (num == 1) {
				client.user.setActivity(`darling-bot.xyz`, { type: ActivityType.Watching });
				--num;
			}
		}, 15000);
	},
};
