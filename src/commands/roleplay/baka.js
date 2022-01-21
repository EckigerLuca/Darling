const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const { fetchNeko } = require('nekos-best.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('baka')
        .setDescription("ДЕБИЛ")
        .addStringOption(option => option.setName('extra').setDescription('learn2read')),

    async execute(interaction) {
        async function fetchImage() {
            const response = await fetchNeko('baka');
            return response.url;
        }

        const img = await fetchImage();
        const embed = new MessageEmbed()
            .setTitle('ДЕБИЛ!')
            .setDescription(`${interaction.user} went tsundere`)
            .setColor(color)
            .setImage(img);

        await interaction.reply({ embeds: [embed] });

    },
};