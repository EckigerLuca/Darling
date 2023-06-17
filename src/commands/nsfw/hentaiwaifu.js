/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hentaiwaifu')
        .setDescription('Returns a random hentai waifu pic')
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
        if (!interaction.channel.nsfw) {
            await interaction.reply({ content: 'Please go to a channel that is marked as NSFW!', ephemeral: true });
            return;
        }
        await interaction.deferReply();
        const amount = parseInt(interaction.options.getString('amount'));

        async function fetchImage() {
            const response = await fetch('https://api.waifu.pics/nsfw/waifu');
            const data = await response.json();
            const img_url = data.url;
            return img_url;
        }

        const embeds = [];
        for (let i = 0; i < amount; i++) {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Random hentai waifu pic?')
                .setFooter({ text: 'From waifu.pics' })
                .setImage(await fetchImage());
            embeds.push(embed);
        }

        await interaction.editReply({ embeds: embeds });
    },
};
