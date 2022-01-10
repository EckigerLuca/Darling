const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fuck')
        .setDescription('bang someone really hard')
        .addUserOption(option => option.setName('target').setDescription('the person you want to bang').setRequired(true)),
    
    async execute(interaction) {
        let user = interaction.options.getUser('target');

        let sfwGif = 'https://eckigerluca.com/darling/media/fuck/fuck.gif'

        if (interaction.channel.nsfw) {
            let response = await fetch('https://eckigerluca.com/api/fuck');
            let data = await response.json();

            let embed = new MessageEmbed()
                .setDescription(`${interaction.user} bangs the shit out of ${user}`)
                .setColor(color)
                .setImage(data.image)
            await interaction.reply({embeds: [embed]})
        } else {
            const embed = new MessageEmbed()
                .setDescription(`${interaction.user} is doing lewd things to ${user}`)
                .setColor(color)
                .setImage(sfwGif)
            await interaction.reply({embeds: [embed]})
        }
    }
};