const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('botvote')
		.setDescription('vote for the bot!')
		.setDMPermission(false),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Vote for me!')
            .setDescription('[Click](https://top.gg/bot/743150068726628440)')
            .setColor(color);

        await interaction.reply({ embeds: [embed] });
    },
};