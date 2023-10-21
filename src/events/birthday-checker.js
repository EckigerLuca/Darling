const logger = require('silly-logger');
const { scheduleJob, RecurrenceRule } = require('node-schedule');
const { EmbedBuilder } = require('discord.js');
const { color } = require('../data/config.json');

const rule = new RecurrenceRule();
rule.tz = 'Etc/UTC';
// run at 12:00 UTC
rule.hour = 12;
rule.minute = 0;

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		logger.success("Birthday checker started!");
		const eckigerluca = await client.users.fetch('173374602389618688');
		const eckigerluca_avatar = eckigerluca.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });

		scheduleJob(rule, async () => {
			logger.info("Checking birthdays...");
			const now = new Date();
			const db = client.dbClient.db("darling");
			const userCollection = db.collection("users");

			let day = now.getUTCDate();
			if (day < 10) day = `0${day}`;
			let month = now.getUTCMonth() + 1;
			if (month < 10) month = `0${month}`;

			const query = { birthday: { $eq: `${day}/${month}` } };

			const results = await userCollection.find(query).toArray();

			results.forEach(async (result) => {
				const updateDoc = {
					$inc: {
						money: 10000,
					},
				};
				if (result.money !== "∞") await userCollection.updateOne({ _id: result._id }, updateDoc);
				const user = await client.users.fetch(result._id);

				const embed = new EmbedBuilder()
					.setTitle(`Happy birthday!`)
					.setDescription(`Woah! It's your birthday today. Happy birthday!\nHave a wonderful day, get many presents and eat a lot of cake!\nFrom me, you will receive 10.000 ${String.fromCodePoint(0x1FA99)}!`)
					.setTimestamp()
					.setThumbnail(user.displayAvatarURL({ forceStatic: false, format: 'png', size: 1024 }))
					.setColor(color);
				user.send({ embeds: [embed] });

				const serverCollection = db.collection("servers");
				const filter = { "birthday.enabled": true };
				const servers = await serverCollection.find(filter).toArray();
				servers.forEach(async (server) => {
					const guild = await client.guilds.fetch(server._id);
					const channel = guild.channels.cache.get(server.birthday.channel);
					if (!channel) return;

					let rawMessage = `Hey, it's ${user}'s birthday today!\nMake sure to gratulate them!`;
					let birthdayEmbedDescription;
					if (server.birthday.customMessage.enabled) rawMessage = server.birthday.customMessage.message;
					birthdayEmbedDescription = rawMessage.replaceAll("${memberMention}", user);
					birthdayEmbedDescription = birthdayEmbedDescription.replaceAll("${memberName}", user.username);

					const birthdayEmbed = new EmbedBuilder()
						.setTitle(`Happy birthday, ${user.username}!`)
						.setDescription(birthdayEmbedDescription)
						.setThumbnail(user.displayAvatarURL({ forceStatic: false, format: 'jpg', size: 1024 }))
						.setFooter({ text: `Bot by ${eckigerluca.username}`, iconURL: eckigerluca_avatar })
						.setColor(color);

					channel.send({ content: `${user}`, embeds: [birthdayEmbed] });
				});
			});

			logger.success(`Checked birthdays! ${results.length} birthdays today.`);
		});
	},
};
