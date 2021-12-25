const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raccoon')
        .setDescription('random raccoon'),

    async execute(interaction) {
        let response = await fetch('http://eckigerluca.com:727/raccoon');
        let data = await response.json();

        let embed = new MessageEmbed()
            .setTitle('Raccoon!')
            .setColor(color)
            .setImage(data.image)
            .setFooter('Thank you Henry for the images >..<')
        
        await interaction.reply({embeds: [embed]})
    }
};