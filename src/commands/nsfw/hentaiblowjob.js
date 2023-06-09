/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hentaiblowjob')
        .setDescription('Returns a random hentai blowjob gif')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Defines how many gifs the bot should send')
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
            const response = await fetch('https://api.waifu.pics/nsfw/blowjob');
            const data = await response.json();
            const img_url = data.url;
            return img_url;
        }

        const embeds = [];
        for (let i = 0; i < amount; i++) {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Random hentai blowjob')
                .setFooter({ text: 'From waifu.pics' })
                .setImage(await fetchImage());
            embeds.push(embed);
        }

        await interaction.editReply({ embeds: embeds });
    },
};
