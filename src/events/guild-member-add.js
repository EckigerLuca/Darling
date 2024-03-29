const { EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const logger = require('silly-logger');
const { mongodbUri } = require('../data/config.json');

const dbClient = new MongoClient(String(mongodbUri));

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async execute(member) {
		if (member.user.bot) return;
		const guildId = member.guild.id;
		const filter = {
			_id: guildId,
		};
		try {
			await dbClient.connect();
			const db = dbClient.db("darling");
			const collection = db.collection("welcome");
			const result = await collection.findOne(filter);
			const eckigerluca = await member.client.users.fetch('173374602389618688');
			const eckigerluca_avatar = eckigerluca.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });
			if (result) {
				if (result.enabled == true) {
					const memberMention = `<@${member.user.id}>`;
					const memberName = member.displayName;
					const memberNumber = member.guild.memberCount;
					const serverName = member.guild.name;

					result.headline = result.headline.replaceAll("${memberName}", memberName);
					result.headline = result.headline.replaceAll("${memberNumber}", memberNumber);
					result.headline = result.headline.replaceAll("${serverName}", serverName);

					result.message = result.message.replaceAll("${memberMention}", memberMention);
					result.message = result.message.replaceAll("${memberName}", memberName);
					result.message = result.message.replaceAll("${memberNumber}", memberNumber);
					result.message = result.message.replaceAll("${serverName}", serverName);

					result.dm[1] = result.dm[1].replaceAll("${memberMention}", memberMention);
					result.dm[1] = result.dm[1].replaceAll("${memberName}", memberName);
					result.dm[1] = result.dm[1].replaceAll("${memberNumber}", memberNumber);
					result.dm[1] = result.dm[1].replaceAll("${serverName}", serverName);

					const embed = new EmbedBuilder()
						.setTitle(result.headline)
						.setDescription(result.message)
						.setFooter({ text: `Bot by ${eckigerluca.username}`, iconURL: eckigerluca_avatar })
						.setTimestamp()
						.setColor(result.color);

					if (result.thumbnail == true) {
						embed.setThumbnail(member.displayAvatarURL({ size: 512, extension: 'png', forceStatic: false }));
					}
					if (result.image[0] == true) {
						embed.setImage(result.image[1]);
					}

					if (result.role[0] == true) {
						try {
							const role = await member.guild.roles.fetch(result.role[1]);
							await member.roles.add(role);
						} catch (err) {
							logger.error(err);
						}
					}

					try {
						const channel = await member.guild.channels.fetch(result.channelId);

						if (channel) await channel.send({ content: memberMention, embeds: [embed] });
					} catch (err) {
						logger.error(err);
					}

					if (result.dm[0] == true) {
						const dmChannel = await member.user.createDM();
						await dmChannel.send({ content: result.dm[1] });
					}
				}
			}
		}
		catch (err) {
			logger.error(err);
		}
	},
};
