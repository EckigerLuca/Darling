const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Returns a random cat')
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
        const amount = parseInt(interaction.options.getString('amount'));

        async function fetchImage() {
            const response = await fetch('https://cataas.com/cat?json=true');
            const data = await response.json();
            const img_url = `https://cataas.com${data.url}`;
            return img_url;
        }

        const embeds = [];

        for (let i = 0; i < amount; i++) {
            const img = await fetchImage();
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Meow!')
                .setDescription(`[Link if you can't see the image](${img})`)
                .setImage(img)
                .setFooter({ text: 'From cataas.com' });
            embeds.push(embed);
        }

        await interaction.reply({ embeds: embeds });
    },
};
