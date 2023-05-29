const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const { fetchRandom } = require('nekos-best.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bored')
        .setDescription("show the world how bored you are")
		.setDMPermission(false),

    async execute(interaction) {
        async function fetchImage() {
            const response = await fetchRandom('bored');
            return response.results[0].url;
        }

        const img = await fetchImage();

        const embed = new EmbedBuilder()
            .setDescription(`${interaction.user} is bored so do something or they will stab you`)
            .setColor(color)
            .setImage(img);

        await interaction.reply({ embeds: [embed] });

    },
};