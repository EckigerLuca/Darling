const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const { fetchRandom } = require('nekos-best.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sleep')
        .setDescription("go 2 bed")
		.setDMPermission(false),

    async execute(interaction) {
        async function fetchImage() {
            const response = await fetchRandom('sleep');
            return response.results[0].url;
        }

        const img = await fetchImage();
        const embed = new EmbedBuilder()
            .setDescription(`${interaction.user} thought it was smart to do ZzZz`)
            .setColor(color)
            .setImage(img);

        await interaction.reply({ embeds: [embed] });

    },
};