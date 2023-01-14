const { color } = require('../../data/config.json');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    data: new SlashCommandBuilder()
		.setName('divorce')
		.setDescription('End your marriage :/')
		.setDMPermission(false),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const dbClient = interaction.client.dbClient;
		const db = dbClient.db('darling');
		const userCollection = db.collection('users');
		const user = interaction.member.user;
		const userDocument = await userCollection.findOne({ '_id': user.id });
		const partnerDocument = await userCollection.findOne({ '_id': userDocument.married.partner });
		const partner = await interaction.client.users.fetch(partnerDocument['_id']);

		const userDivorceConfirmationEmbed = new EmbedBuilder()
			.setTitle('Divorce Confirmation')
			.setDescription(`Are you sure, that you want to end your marriage with ${partner}?\nClick one of the buttons below to confirm. Starting now, you have 30 seconds to decide.`)
			.setThumbnail(partner.displayAvatarURL({ dynamic: true }))
			.setColor(color)
			.setTimestamp();

		const userConfirmRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('divorce_cancel')
					.setEmoji('1061678468380774440')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('divorce_confirm')
					.setEmoji('1061678465914507386')
					.setStyle(ButtonStyle.Danger),
			);

		await interaction.editReply({ embeds: [userDivorceConfirmationEmbed], components: [userConfirmRow], ephemeral: true });

		let userActed = false;
		interaction.client.once("interactionCreate", async (newUserInteraction) => {
			if (!newUserInteraction.isButton()) return;
			if (newUserInteraction.user.id != interaction.member.user.id) return;
			if (newUserInteraction.customId == "divorce_confirm") {
				const updateDocument = {
					$set: {
						married: {
							status: false,
							partner: null,
							date: null,
						},
					},
				};

				await userCollection.updateOne(userDocument, updateDocument);
				await userCollection.updateOne(partnerDocument, updateDocument);

				const userConfirmEmbed = new EmbedBuilder()
					.setTitle("Divorce Confirmed")
					.setDescription(`You have ended your marriage with ${partner}.`)
					.setColor(color)
					.setTimestamp();

				const partnerDivorceEmbed = new EmbedBuilder()
					.setTitle("Your marriage has ended")
					.setDescription(`You are now divorced from ${interaction.user}. They decided to end the marriage.`)
					.setColor(color)
					.setTimestamp();


				userActed = true;
				await interaction.editReply({ embeds: [userConfirmEmbed], components: [], ephemeral: true });

				try {
					return await partner.send({ embeds: [partnerDivorceEmbed] });
				} catch {
					return await interaction.followUp({ content: `${partner}\nCouldn't DM you!\nPlease allow DMs from server members in your \`Privacy & Safety\` settings!`, embeds: [partnerDivorceEmbed], ephemeral: true });
				}

			} else if (newUserInteraction.customId == "divorce_cancel") {
				const userCancelEmbed = new EmbedBuilder()
					.setTitle("Divorce Cancelled")
					.setDescription(`You have cancelled the divorce.`)
					.setColor(color)
					.setTimestamp();

				userActed = true;
				return await interaction.editReply({ embeds: [userCancelEmbed], components: [], ephemeral: true });
			}
		});

		await sleep(30_000);
		if (userActed) return;
		const userTimeoutEmbed = new EmbedBuilder()
			.setTitle("Divorce Cancelled")
			.setDescription(`You have not confirmed the divorce in time.`)
			.setColor(color)
			.setTimestamp();

		return await interaction.editReply({ embeds: [userTimeoutEmbed], components: [], ephemeral: true });
	},
};