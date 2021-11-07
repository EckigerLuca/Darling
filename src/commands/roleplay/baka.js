const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')
const {fetchNeko} = require('nekos-best.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('baka')
        .setDescription("ДЕБИЛ")
        .addStringOption(option => option.setName('extra').setDescription('learn2read')),
    
    async execute(interaction) {
        let extra = interaction.options.getString('extra')

        async function fetchImage() {
            let response = await fetchNeko('baka');
            return response.url;
        }

        let img = await fetchImage()
        let embed = new MessageEmbed()
            .setTitle('ДЕБИЛ!')
            .setDescription(`${interaction.user} went tsundere`)
            .setColor(color)
            .setImage(img)
        
        await interaction.reply({embeds: [embed]})
            
    }
};