const { color } = require('../../data/config.json');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Get support for Darling')
		.setDMPermission(false),

	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('Support')
			.setDescription("If you need help with Darling, feel free to join the Support Server. We'll be happy to help you!\nMake sure to also check out the Website or the GitHub Repository. Everything is also linked there.")
			.setColor(color);

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Support Server')
					.setURL('https://discord.gg/tpUr7d3')
					.setStyle(ButtonStyle.Link),
				new ButtonBuilder()
					.setLabel('Website')
					.setURL('https://darling-bot.xyz')
					.setStyle(ButtonStyle.Link),
				new ButtonBuilder()
					.setLabel('GitHub')
					.setURL('https://github.com/eckigerluca/darling')
					.setStyle(ButtonStyle.Link),
			);

		await interaction.reply({ embeds: [embed], components: [row] });
	},
};
