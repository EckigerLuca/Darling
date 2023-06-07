const { color } = require('../../data/config.json');
const { EmbedBuilder, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName("profile")
		.setDescription("View your/others profile and edit it")
		.addSubcommand(subcommand =>
			subcommand.setName("view")
				.setDescription("View your/others profile")
				.addUserOption(option => option.setName("target").setDescription("Select user to show the profile of (leave empty for your's)")))
		.addSubcommand(subcommand =>
			subcommand.setName("edit")
				.setDescription("Edit your profile"))
		.setDMPermission(false),

	async execute(interaction) {
		const dbClient = interaction.client.dbClient;
		const db = dbClient.db("darling");
		const userCollection = db.collection("users");
		if (interaction.options.getSubcommand() == "view") {
			await interaction.deferReply({ content: "Generating Profile. Please wait..." });

			let target = interaction.options.getUser("target") ?? interaction.member;
			if (target != interaction.member) {
				try {
					target = await interaction.guild.members.fetch(target);
				} catch {
					await interaction.editReply({ content: "Could not get the user that you specified. Please try again.", ephemeral: true });
				}
			}
			if (target.user.bot && target.user != interaction.client.user) return await interaction.editReply({ content: "You can't view the profile of a bot.", ephemeral: true });
			let findResult = await userCollection.findOne({
				"_id": target.id,
			});

			if (!findResult) {
				const document = {
					"_id": target.id,
					"gender": "Not set...",
					"pronouns": "Not set...",
					"birthday": "00/00",
					"botMemberSince": `${Math.floor(Date.now() / 1000)}`,
					"money": 1000,
					"description": "Not set...",
					"color": color,
					"style": 0,
					"background": 0,
					"married": {
						"status": false,
						"partner": null,
						"date": null,
					},
					"premium": false,
					"inventory": {},
				};
				await userCollection.insertOne(document);
				findResult = await userCollection.findOne({
					"_id": target.id,
				});
			}

			// style 0 = embed
			if (findResult.style == 0) {

				const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				const rawBirthday = (findResult.birthday).split("/");
				let birthday = `${rawBirthday[0]}. ${months[rawBirthday[1] - 1]}`;
				if (rawBirthday[0] == "00" && rawBirthday[1] == "00") birthday = "Not set...";

				let profileDescription = `**» Name:** ${target.nickname ?? target.user.username}\n**» Gender:** ${findResult.gender}\n**» Pronouns:** ${findResult.pronouns}\n**» Birthday:** ${birthday}\n**» Bot Member Since:** <t:${findResult.botMemberSince}:f>\n**» Money:** ${findResult.money} ${String.fromCodePoint(0x1FA99)}`;

				if (findResult.married.status) {
					profileDescription += `\n**» Married to:** ${await interaction.client.users.fetch(findResult.married.partner)}`;
				}

				const embed = new EmbedBuilder()
					.setColor(findResult.color)
					.setThumbnail(target.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false }))
					.setAuthor({ name: `Profile of ${target.user.username}#${target.user.discriminator}`, iconURL: target.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false }) })
					.setFooter({ text: 'Edit your profile with /profile edit' })
					.setDescription(profileDescription);
				embed.addFields({ name: "» Description:", value: findResult.description });
				await interaction.editReply({ embeds: [embed] });
			}

		} else if (interaction.options.getSubcommand() == "edit") {
			const target = interaction.member;
			let findResult = await userCollection.findOne({
				"_id": target.id,
			});

			if (!findResult) {
				const document = {
					"_id": target.id,
					"gender": "Not set...",
					"pronouns": "Not set...",
					"birthday": "00/00",
					"botMemberSince": `${Math.floor(Date.now() / 1000)}`,
					"money": 1000,
					"description": "Not set...",
					"color": color,
					"style": 0,
					"background": 0,
					"married": {
						"status": false,
						"partner": null,
						"date": null,
					},
					"premium": false,
					"inventory": {},
				};
				await userCollection.insertOne(document);
				findResult = await userCollection.findOne({
					"_id": target.id,
				});
			}

			const modal = new ModalBuilder()
				.setCustomId('profileEdit')
				.setTitle('Edit your Profile');

			const genderInput = new TextInputBuilder()
				.setCustomId('gender')
				.setLabel('What is your gender?')
				.setStyle(TextInputStyle.Short)
				.setValue(findResult.gender)
				.setPlaceholder('e.g. Male')
				.setRequired(true);

			const pronounsInput = new TextInputBuilder()
				.setCustomId('pronouns')
				.setLabel('What are your pronouns?')
				.setStyle(TextInputStyle.Short)
				.setValue(findResult.pronouns)
				.setPlaceholder('e.g. He/Him')
				.setRequired(true);

			const birthdayInput = new TextInputBuilder()
				.setCustomId('birthday')
				.setLabel('What is your birthday? (Format: DD/MM)')
				.setStyle(TextInputStyle.Short)
				.setValue(findResult.birthday)
				.setPlaceholder('e.g. 16/12')
				.setMinLength(5)
				.setMaxLength(5)
				.setRequired(true);

			const colorInput = new TextInputBuilder()
				.setCustomId('color')
				.setLabel('Set the accent of your profile (Hex Code)')
				.setStyle(TextInputStyle.Short)
				.setValue(findResult.color)
				.setPlaceholder('e.g. #FF0000')
				.setMinLength(7)
				.setMaxLength(7)
				.setRequired(true);

			const descriptionInput = new TextInputBuilder()
				.setCustomId('description')
				.setLabel('Set a description for your profile')
				.setStyle(TextInputStyle.Paragraph)
				.setValue(findResult.description)
				.setPlaceholder('e.g. I am a cool person')
				.setMaxLength(100)
				.setRequired(true);

			const genderActionRow = new ActionRowBuilder().addComponents(genderInput);
			const pronounsActionRow = new ActionRowBuilder().addComponents(pronounsInput);
			const birthdayActionRow = new ActionRowBuilder().addComponents(birthdayInput);
			const colorActionRow = new ActionRowBuilder().addComponents(colorInput);
			const descriptionActionRow = new ActionRowBuilder().addComponents(descriptionInput);

			modal.addComponents(genderActionRow, pronounsActionRow, birthdayActionRow, colorActionRow, descriptionActionRow);

			await interaction.showModal(modal);

			const filter = (newInteraction) => newInteraction.customId === 'profileEdit';
			interaction.awaitModalSubmit({ filter, time: 300_000 })
				.then(async newInteraction => {
					const rawBirthday = (newInteraction.fields.getTextInputValue('birthday')).split('/');
					let birthday = `${rawBirthday[0]}/${rawBirthday[1]}`;
					if (rawBirthday[0] > 31 || rawBirthday[1] > 12) birthday = "00/00";
					const updateDocument = {
						$set: {
							"gender": newInteraction.fields.getTextInputValue('gender'),
							"pronouns": newInteraction.fields.getTextInputValue('pronouns'),
							"birthday": birthday,
							"color": newInteraction.fields.getTextInputValue('color'),
							"description": newInteraction.fields.getTextInputValue('description'),
						},
					};
					await userCollection.updateOne(findResult, updateDocument);
					await newInteraction.reply({ content: 'Your profile has been updated!', ephemeral: true });
				})
				.catch(async err => await interaction.followUp({ content: 'You took too long to respond!', ephemeral: true }));
		}
	},
};
