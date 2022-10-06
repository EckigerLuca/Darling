const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Random stuff')
        .addSubcommand(subcommand =>
            subcommand
                .setName('number')
                .setDescription('returns a random number')
                .addNumberOption(option => option.setName('start').setDescription('Start of Range'))
                .addNumberOption(option => option.setName('end').setDescription('End of Range'))),

        async execute(interaction) {
            let startRange = interaction.options.getNumber('start');
            let endRange = interaction.options.getNumber('end');
            if (startRange == null) {
                startRange = 1;
            }
            if (endRange == null) {
                endRange = startRange + 100;
            }

            async function getRandomIntInclusive(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            const randomNumber = await getRandomIntInclusive(startRange, endRange);

            const embed = new EmbedBuilder()
                .setTitle('Random Number')
                .setDescription(`Your random number is: **${randomNumber}**`)
                .setColor(color);
            await interaction.reply({ embeds: [embed] });
        },
    };