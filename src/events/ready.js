module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`\nReady! Logged in as ${client.user.tag}\n`);
		setInterval(() => {
			client.user.setActivity(`${client.guilds.cache.size} servers | /help`, { type: 'WATCHING' });
		}, 30000);
	},
};