const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Returns a random dog')
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
        await interaction.deferReply();
        const amount = parseInt(interaction.options.getString('amount'));

        async function fetchImage() {
            const response = await fetch('https://random.dog/woof.json');
            const data = await response.json();
            const img_url = data.url;
            return img_url;
        }

        const embeds = [];
        for (let i = 0; i < amount; i++) {
            const img = await fetchImage();
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Woof!')
                .setDescription(`[Link if you can't see the image](${img})`)
                .setFooter({ text: 'From random.dog' })
                .setImage(img);
            embeds.push(embed);
        }

        await interaction.editReply({ embeds: embeds });
    },
};
