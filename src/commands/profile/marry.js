const { color } = require('../../data/config.json');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    data: new SlashCommandBuilder()
		.setName("marry")
		.setDescription("Marry someone!")
		.addUserOption(option => option.setName("target").setDescription("Select user to marry").setRequired(true))
		.setDMPermission(false),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const target = interaction.options.getUser("target");
		const eckigerluca = await interaction.client.users.fetch('173374602389618688');
		const dbClient = interaction.client.dbClient;
		const db = dbClient.db("darling");
		const userCollection = db.collection("users");
		if (target == interaction.client.user) return await interaction.editReply({ content: "You can't marry me!", ephemeral: true });
		if (target == eckigerluca) return await interaction.editReply({ content: "Are you trying to steal my man?!", ephemeral: true });
		if (target.bot) return await interaction.editReply({ content: "You can't marry a bot!", ephemeral: true });
		if (target == interaction.member.user) return await interaction.editReply({ content: "You can't marry yourself.", ephemeral: true });

		const userResult = await userCollection.findOne({ "_id": interaction.member.id });
		if (!userResult) return await interaction.editReply({ content: "You dont't even own a profile! Set it up with `/profile edit` first!", ephemeral: true });
		if (Object.values(userResult).includes("Not set...") || Object.values(userResult).includes("00/00")) return await interaction.editReply({ content: "Set up your profile first with `/profile edit`!", ephemeral: true });
		if (userResult.married.status) return await interaction.editReply({ content: `You are already married to <@${userResult.married.partner}>!`, ephemeral: true });

		const targetResult = await userCollection.findOne({ "_id": target.id });
		if (!targetResult) return await interaction.editReply({ content: `${target} doesn't even own a profile! Tell them to set it up with \`/profile edit\`!`, ephemeral: true });
		if (Object.values(targetResult).includes("Not set...") || Object.values(targetResult).includes("00/00")) return await interaction.editReply({ content: `${target} needs to set their profile up first with \`/profile edit\`!`, ephemeral: true });
		if (targetResult.married.status) return await interaction.editReply({ content: `${target} is already married!`, ephemeral: true });

		const userConfirmEmbed = new EmbedBuilder()
			.setTitle("Proposal Confirmation")
			.setDescription(`Are you sure you want to marry ${target}?\nClick on one of the buttons below to confirm. Starting now, you have 30 seconds to decide.`)
			.setThumbnail(target.displayAvatarURL({ forceStatic: false }))
			.setColor(color)
			.setTimestamp();

		const userRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId("marry_confirm_user")
					.setEmoji("1061678465914507386")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId("marry_cancel_user")
					.setEmoji("1061678468380774440")
					.setStyle(ButtonStyle.Danger),
			);

		await interaction.editReply({ embeds: [userConfirmEmbed], components: [userRow], ephemeral: true });

		let userActed = false;
		let functionRan = false;
		interaction.client.once("interactionCreate", async (newUserInteraction) => {
			if (functionRan) return;
			functionRan = true;
			if (!newUserInteraction.isButton()) return;
			if (newUserInteraction.user.id != interaction.member.user.id) return;
			if (newUserInteraction.customId == "marry_confirm_user") {
				userActed = true;
				await interaction.editReply({ content: `Proposal sent to ${target} !`, embeds: [], components: [], ephemeral: true });

				const targetRow = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId("marry_confirm_target")
							.setEmoji("1061678465914507386")
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setCustomId("marry_cancel_target")
							.setEmoji("1061678468380774440")
							.setStyle(ButtonStyle.Danger),
					);

				const targetConfirmEmbed = new EmbedBuilder()
					.setTitle("Someone wants to marry you!")
					.setDescription(`${interaction.member.user} wants to marry you! Starting now, you have 10 minutes to decide wheter you want to accept or decline the proposal.`)
					.setColor(color)
					.setTimestamp();

				let targetMessage;
				try {
					targetMessage = await target.send({ embeds: [targetConfirmEmbed], components: [targetRow] });
				}
				catch {
					return await interaction.editReply({ content: `Couldn't DM ${target}!\nPlease tell them to allow DMs from server members in their \`Privacy & Safety\` settings.\n\nThe proposal has been cancelled.`, embeds: [], components: [], ephemeral: true });
				}

				let targetActed = false;
				interaction.client.once("interactionCreate", async (newTargetInteraction) => {
					if (!newTargetInteraction.isButton()) return;
					if (newTargetInteraction.user.id != target.id) return;
					if (newTargetInteraction.customId == "marry_confirm_target") {
						targetActed = true;
						const curDate = Math.floor(Date.now() / 1000);
						const userUpdateDocument = {
							$set: {
								"married": {
									status: true,
									partner: target.id,
									date: curDate,
								},
							},
						};
						const targetUpdateDocument = {
							$set: {
								"married": {
									status: true,
									partner: interaction.member.user.id,
									date: curDate,
								},
							},
						};

						await userCollection.updateOne(userResult, userUpdateDocument);
						await userCollection.updateOne(targetResult, targetUpdateDocument);

						const targetSuccessEmbed = new EmbedBuilder()
							.setTitle("Proposal Accepted")
							.setDescription(`You have accepted the proposal from ${interaction.member.user}! Congratulations!`)
							.setColor(color)
							.setTimestamp();

						await targetMessage.edit({ embeds: [targetSuccessEmbed], components: [] });

						const userSuccessEmbed = new EmbedBuilder()
							.setTitle("Proposal Accepted")
							.setDescription(`Your proposal to ${target} has been accepted! Congratulations!`)
							.setColor(color)
							.setTimestamp();

						try {
							return await interaction.member.user.send({ embeds: [userSuccessEmbed] });
						}
						catch {
							return await interaction.followUp({ content: `${interaction.member.user}\nCouldn't DM you!\nPlease allow DMs from server members in your \`Privacy & Safety\` settings!\n\nYour proposal to ${target} has been accepted! Congratulations!`, ephemeral: true });
						}

					} else if (newTargetInteraction.customId == "marry_cancel_target") {
						targetActed = true;
						const targetFailEmbed = new EmbedBuilder()
							.setTitle("Proposal Declined")
							.setDescription(`You have declined the proposal from ${interaction.member.user}!`)
							.setColor(color)
							.setTimestamp();

						await targetMessage.edit({ embeds: [targetFailEmbed], components: [] });
						try {
							return await interaction.member.user.send({ content: `Your proposal to ${target} has been declined!` });
						} catch {
							return await interaction.followUp({ content: `${interaction.member.user}\nCouldn't DM you!\nPlease allow DMs from server members in your \`Privacy & Safety\` settings!\n\nYour proposal to ${target} has been declined!`, ephemeral: true });
						}
					}
				});

				await sleep(600_000);
				if (targetActed) return;
				await targetMessage.edit({ content: `You took too long to decide if you want to marry ${interaction.member}!`, embeds: [], components: [] });
				try {
					return await interaction.member.user.send({ content: `Your proposal to ${target} has been cancelled because they took too long to decide!` });
				}
				catch {
					return await interaction.followUp({ content: `${interaction.member.user}\nCouldn't DM you!\nPlease allow DMs from server members in your \`Privacy & Safety\` settings!\n\nYour proposal to ${target} has been cancelled because they took too long to decide!`, ephemeral: true });
				}
			}
			else if (newUserInteraction.customId == "marry_cancel_user") {
				userActed = true;
				const userCancelEmbed = new EmbedBuilder()
					.setTitle("Proposal Cancelled")
					.setDescription(`You have cancelled the proposal to ${target}.`)
					.setColor(color)
					.setTimestamp();
				return await interaction.editReply({ embeds: [userCancelEmbed], components: [], ephemeral: true });
			}
		});

		await sleep(30_000);
		if (userActed) return;
		const userTimeoutEmbed = new EmbedBuilder()
			.setTitle("Proposal Cancelled")
			.setDescription(`You have not confirmed the proposal to ${target} in time.`)
			.setColor(color)
			.setTimestamp();

		return await interaction.editReply({ embeds: [userTimeoutEmbed], components: [], ephemeral: true });
	},
};