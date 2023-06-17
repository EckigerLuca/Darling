const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raccoon')
        .setDescription('random raccoon')
		.setDMPermission(false),

    async execute(interaction) {
        const response = await fetch('https://eckigerluca.com/api/raccoon');
        const data = await response.json();

        const embed = new EmbedBuilder()
            .setTitle('Raccoon!')
            .setColor(color)
            .setImage(data.image)
            .setFooter({ text: 'Thank you Henry for the images >..<' });

        await interaction.reply({ embeds: [embed] });
    },
};
