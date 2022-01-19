const {MongoClient} = require('mongodb');
const { mongodbUri } = require('../data/config.json');

const dbClient = new MongoClient(String(mongodbUri));

module.exports = {
	name: 'guildDelete',
	once: false,
	async execute(guild) {
		const guildId = guild.id;
		const filter = {
			_id: guildId
		}
		try {
			await dbClient.connect();
			const db = dbClient.db("darling");
			let collections = await db.listCollections();
			await collections.forEach(async c => {
				let collection = await db.collection(c.name);
				let result = await collection.deleteOne(filter);
			});
		} catch (err) {console.log(err)}
	},
};