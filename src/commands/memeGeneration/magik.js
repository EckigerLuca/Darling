const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('magik')
        .setDescription('create magik')
        .addUserOption(option => option.setName('target').setDescription('user to magik').setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();
        let target = interaction.options.getUser('target');
        if (target === null) {
            target = interaction.user;
        }
        const avatar = target.displayAvatarURL({ size: 512, format: 'png', dynamic: true });
        const response = await fetch(`https://nekobot.xyz/api/imagegen?type=magik&image=${avatar}`);
        const data = await response.json();

        const embed = new MessageEmbed()
            .setTitle('Magik')
            .setColor(color)
            .setImage(data.message);
        await interaction.editReply({ embeds: [embed] });
    },
};