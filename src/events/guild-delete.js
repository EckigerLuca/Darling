const { MongoClient } = require('mongodb');
const logger = require('silly-logger');
const { mongodbUri } = require('../data/config.json');

const dbClient = new MongoClient(String(mongodbUri));

module.exports = {
	name: 'guildDelete',
	once: false,
	async execute(guild) {
		const guildId = guild.id;
		const filter = {
			_id: guildId,
		};
		try {
			await dbClient.connect();
			const db = dbClient.db("darling");
			const collections = await db.listCollections();
			await collections.forEach(async c => {
				const collection = await db.collection(c.name);
				await collection.deleteOne(filter);
			});
		}
		catch (err) {
			logger.error(err);
		}
	},
};