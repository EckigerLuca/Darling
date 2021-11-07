const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')
const {fetchNeko} = require('nekos-best.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wave')
        .setDescription("EllO!/GudBaYe")
        .addStringOption(option => option.setName('extra').setDescription('learn2read')),
    
    async execute(interaction) {
        let extra = interaction.options.getString('extra')

        async function fetchImage() {
            let response = await fetchNeko('wave');
            return response.url;
        }

        let img = await fetchImage()

        if (!extra) {
            extra = ''
        }
        let embed = new MessageEmbed()
            .setDescription(`${interaction.user} waves ${extra}`)
            .setColor(color)
            .setImage(img)
        
        await interaction.reply({embeds: [embed]})
            
    }
};