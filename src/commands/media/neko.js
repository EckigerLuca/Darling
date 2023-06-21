const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const { fetchRandom } = require ('nekos-best.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('neko')
        .setDescription('Returns a random neko')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Defines how many images the bot should send')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'One',
                        value: '1',
                    },
                    {
                        name: 'Five',
                        value: '5',
                    },
                    {
                        name: 'Ten',
                        value: '10',
                    },
                ))
		.setDMPermission(false),

    async execute(interaction) {
        let amount = interaction.options.getString('amount');
        amount = parseInt(amount);

        async function fetchImage() {
            const response = await fetchRandom('neko');
            return response.results[0];
        }

        const fetches = Array.from(Array(amount), () => fetchImage());
        const nekos = await Promise.all(fetches);
        const embeds = [];

        nekos.forEach((neko) => {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Meow')
                .setDescription(`[${neko.artist_name}](${neko.source_url})`)
                .setFooter({ text: 'From nekos.best' })
                .setImage(neko.url);
            embeds.push(embed);
        });

        await interaction.reply({ embeds: embeds });
    },
};
