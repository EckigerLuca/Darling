const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const {fetchNeko} = require('nekos-best.js')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('neko')
        .setDescription('Returns a random neko')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Defines how many images the bot should send')
                .setRequired(true)
                .addChoice('One', '1')
                .addChoice('Five', '5')
                .addChoice('Ten', '10')),
        
        async execute(interaction) {
            await interaction.deferReply();
            let amount = interaction.options.getString('amount');
            amount = parseInt(amount);

            async function fetchImage() {
                let response = await fetchNeko('nekos', parseInt(amount));
                return response;
            }

            let real_amount = amount-1;
            let nekos = await fetchImage()
            let embeds = [];
            for(let i=0; i <= real_amount; i++) {
                let embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle('Meow')
                    .setDescription(`[${nekos.url[i].artist_name}](${nekos.url[i].source_url})`)
                    .setFooter('From nekos.best')
                    .setImage(nekos.url[i].url)
                embeds.push(embed)
            }
        
            await interaction.editReply({ embeds: embeds });
    },
};
