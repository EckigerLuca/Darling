const { color } = require('../../data/config.json');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Colors, ChannelType, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName("birthday")
		.setDescription("Birthday Function Commands")
		.addSubcommand(subcommand =>
			subcommand
				.setName("setup")
				.setDescription("Set up the birthday function for your server")
				.addChannelOption(option =>
					option
						.setName("channel")
						.setDescription("The channel where the birthday messages will be sent to")
						.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
						.setRequired(true))
				.addStringOption(option =>
					option
						.setName("message")
						.setDescription("Choose yes if wou'd like to use a custom message sent to the specifed channel")
						.setRequired(true)
						.addChoices(
							{ name: "Yes", value: "yes" },
							{ name: "No", value: "no" },
						)))
		.addSubcommand(subcommand =>
			subcommand
				.setName("enable")
				.setDescription("Enable the birthday function on your server"))
		.addSubcommand(subcommand =>
			subcommand
				.setName("disable")
				.setDescription("Disable the birthday function on your server"))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),

	async execute(interaction) {
		const dbClient = interaction.client.dbClient;
		const serverCollection = await dbClient.db("darling").collection("servers");
		let server = await serverCollection.findOne({ _id: interaction.guild.id });
		if (!server) {
			const document = {
				_id: interaction.guild.id,
				birthday: {
					enabled: false,
					channel: null,
					customMessage: {
						enabled: false,
						message: null,
					},
				},
			};
			await serverCollection.insertOne(document);
			server = await serverCollection.findOne({ _id: interaction.guild.id });
		}

		if (!server.birthday) {
			const updateDocument = {
				$set: {
					birthday: {
						enabled: false,
						channel: null,
						customMessage: {
							enabled: false,
							message: null,
						},
					},
				},
			};
			await serverCollection.updateOne({ _id: interaction.guild.id }, updateDocument);
			server = await serverCollection.findOne({ _id: interaction.guild.id });
		}

		if (interaction.options.getSubcommand() === "setup") {
			// setup
			const channel = interaction.options.getChannel("channel");
			const message = interaction.options.getString("message");
			const customMessage = {
				enabled: false,
				message: null,
			};
			if (message === "yes") {
				const modal = new ModalBuilder()
					.setTitle("Custom Birthday Message")
					.setCustomId("customBirthdayMessage");

				const customBirthdayMessageInput = new TextInputBuilder()
					.setCustomId('customBirthdayMessage')
					.setLabel('Custom Birthday Message')
					.setStyle(TextInputStyle.Paragraph)
					.setValue(server.birthday.customMessage.message ? server.birthday.customMessage.message : '')
					.setPlaceholder('custom birthday message o.o\n${memberName} displays their name and ${memberMention} mentions them!')
					.setMaxLength(4000)
					.setRequired(true);

				const customBirthdayMessageActionRow = new ActionRowBuilder()
					.addComponents(customBirthdayMessageInput);

				modal.addComponents(customBirthdayMessageActionRow);
				await interaction.showModal(modal);

				const filter = (newInteraction) => newInteraction.customId === 'customBirthdayMessage';
				interaction.awaitModalSubmit({ filter, time: 300_000 })
					.then(async newInteraction => {
						const inputCustomBirthdayMessage = newInteraction.fields.getTextInputValue('customBirthdayMessage');

						customMessage.enabled = true;
						customMessage.message = inputCustomBirthdayMessage;

						const updateDocument = {
							$set: {
								"birthday.enabled": true,
								"birthday.channel": channel.id,
								"birthday.customMessage.enabled": customMessage.enabled,
								"birthday.customMessage.message": customMessage.message,
							},
						};

						await serverCollection.updateOne({ _id: interaction.guild.id }, updateDocument);
						const embed = new EmbedBuilder()
							.setColor(Colors.Green)
							.setDescription("The birthday function has been set up!\n\n**Channel:** <#" + channel.id + "\n**Custom Message:** " + (customMessage.enabled ? "Yes" : "No") + "\n\n**Note:** If you would like to change any of these settings, you can do so by running the `/birthday setup` command again!\nYou can disable it by running `/birthday disable`!")
							.addFields(
								{ name: "Custom Message", value: `\`\`\`${inputCustomBirthdayMessage}\`\`\`` },
							);
						return await newInteraction.reply({ embeds: [embed], ephemeral: true });
					})
					.catch(async err => {
						return await interaction.followUp({ content: 'You took too long to respond!', ephemeral: true });
					});
			} else if (message === "no") {
				customMessage.enabled = false;
				customMessage.message = null;

				const updateDocument = {
					$set: {
						"birthday.enabled": true,
						"birthday.channel": channel.id,
						"birthday.customMessage.enabled": customMessage.enabled,
						"birthday.customMessage.message": customMessage.message,
					},
				};
				await serverCollection.updateOne({ _id: interaction.guild.id }, updateDocument);
				const embed = new EmbedBuilder()
					.setColor(Colors.Green)
					.setDescription("The birthday function has been set up!\n\n**Channel:** <#" + channel.id + "\n**Custom Message:** " + (customMessage.enabled ? "Yes" : "No") + "\n\n**Note:** If you would like to change any of these settings, you can do so by running the `/birthday setup` command again!\nYou can disable it by running `/birthday disable`!");
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		if (interaction.options.getSubcommand() === "enable") {
			if (server.birthday.enabled) {
				const embed = new EmbedBuilder()
					.setColor(Colors.Red)
					.setDescription("The birthday function is already enabled!");
				return interaction.reply({ embeds: [embed], ephemeral: true });
			} else {
				const updateDocument = {
					$set: {
						"birthday.enabled": true,
					},
				};
				await serverCollection.updateOne({ _id: interaction.guild.id }, updateDocument);
				const embed = new EmbedBuilder()
					.setColor(Colors.Green)
					.setDescription("The birthday function has been enabled!");
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		if (interaction.options.getSubcommand() === "disable") {
			if (!server.birthday.enabled) {
				const embed = new EmbedBuilder()
					.setColor(Colors.Red)
					.setDescription("The birthday function is already disabled!");
				return interaction.reply({ embeds: [embed], ephemeral: true });
			} else {
				const updateDocument = {
					$set: {
						"birthday.enabled": false,
					},
				};
				await serverCollection.updateOne({ _id: interaction.guild.id }, updateDocument);
				const embed = new EmbedBuilder()
					.setColor(Colors.Green)
					.setDescription("The birthday function has been disabled!");
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}
	},
};
