const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Returns a random waifu pic')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Defines how many images the bot should send')
                .setRequired(true)
                .addChoice('One', '1')
                .addChoice('Five', '5')
                .addChoice('Ten', '10')),
        
        async execute(interaction) {
            const amount = interaction.options.getString('amount');

            async function fetchImage() {
                let response = await fetch('https://api.waifu.pics/sfw/waifu');
                let data = await response.json();
                let img_url = data.url
                return img_url;
            }

            var real_amount = amount-1;
            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle('Random waifu pic?')
                .setImage(await fetchImage())
        
            
            await interaction.reply({ embeds: [embed] });
        for(var i=0; i < real_amount; i++){
            embed.setImage(await fetchImage())
            await interaction.followUp({ embeds: [embed]} );
        }
    },
};