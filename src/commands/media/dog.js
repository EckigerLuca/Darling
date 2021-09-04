const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder() 
        .setName('dog')
        .setDescription('Returns a random dog')
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
                let response = await fetch('https://random.dog/woof.json');
                let data = await response.json();
                let img_url = data.url
                return img_url;
            }

            var real_amount = amount-1;
            let img = await fetchImage()
            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle('Woof!')
                .setDescription(`[Link if you can't see the image](${img})`)
                .setFooter('From random.dog')
                .setImage(img)
        
            
            await interaction.reply({ embeds: [embed] });
            for(var i=0; i < real_amount; i++){
                embed.setImage(await fetchImage())
                await interaction.followUp({ embeds: [embed]} );
        }
    },
};