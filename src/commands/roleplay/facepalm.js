const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const { fetchRandom } = require('nekos-best.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('facepalm')
        .setDescription("a gif can say more than a thousand words")
		.setDMPermission(false),

    async execute(interaction) {
        async function fetchImage() {
            const response = await fetchRandom('facepalm');
            return response.results[0].url;
        }
        const img = await fetchImage();
        const embed = new EmbedBuilder()
            .setDescription(`${interaction.user} shows how dumb that shit was`)
            .setColor(color)
            .setImage(img);

        await interaction.reply({ embeds: [embed] });

    },
};
