const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const { fetchRandom } = require('nekos-best.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('laugh')
        .setDescription("laugh")
		.setDMPermission(false),

    async execute(interaction) {
        async function fetchImage() {
            const response = await fetchRandom('laugh');
            return response.results[0].url;
        }

        const img = await fetchImage();
        const embed = new EmbedBuilder()
            .setDescription(`${interaction.user} thinks it was funny`)
            .setColor(color)
            .setImage(img);

        await interaction.reply({ embeds: [embed] });

    },
};