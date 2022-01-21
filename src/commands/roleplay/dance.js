const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const { fetchNeko } = require('nekos-best.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dance')
        .setDescription("Keep On Ravin' Baby")
        .addStringOption(option => option.setName('extra').setDescription('learn2read')),

    async execute(interaction) {
        let extra = interaction.options.getString('extra');

        async function fetchImage() {
            const response = await fetchNeko('dance');
            return response.url;
        }

        const img = await fetchImage();

        if (!extra) {
            extra = '';
        }
        const embed = new MessageEmbed()
            .setDescription(`${interaction.user} dances ${extra}`)
            .setColor(color)
            .setImage(img);

        await interaction.reply({ embeds: [embed] });

    },
};