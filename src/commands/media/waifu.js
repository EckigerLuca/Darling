const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Returns a random waifu pic')
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
            const response = await fetch('https://api.waifu.pics/sfw/waifu');
            const data = await response.json();
            const img_url = data.url;
            return img_url;
        }

        const embeds = [];
        for (let i = 0; i < amount; i++) {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Random waifu pic?')
                .setFooter({ text: 'From waifu.pics' })
                .setImage(await fetchImage());
            embeds.push(embed);
        }


        await interaction.editReply({ embeds: embeds });
    },
};
