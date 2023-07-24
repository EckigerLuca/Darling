const { bold, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { color } = require('../../data/config.json');
const { randomInt } = require('../../utils/random');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Random stuff')
        .addSubcommand(subcommand =>
            subcommand
                .setName('number')
                .setDescription('returns a random number')
                .addIntegerOption(option => option.setName('start').setDescription('Start of Range'))
                .addIntegerOption(option => option.setName('end').setDescription('End of Range')))
		.setDMPermission(false),

        async execute(interaction) {
            const startRange = interaction.options.getInteger('start') || 1;
            const endRange = interaction.options.getInteger('end') || startRange + 100;

            if (startRange >= endRange) {
                interaction.reply({
                    content: "Your start can't be greater than or equal to your end silly!",
                    ephemeral: true,
                });
                return;
            }
            const randomNumber = await randomInt(startRange, endRange);

            const embed = new EmbedBuilder()
                .setTitle('Random Number')
                .setDescription(`Your random number is: ${bold(randomNumber)}`)
                .setColor(color);
            await interaction.reply({ embeds: [embed] });
        },
    };
