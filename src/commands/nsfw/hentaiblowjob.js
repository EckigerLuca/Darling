const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder() 
        .setName('hentaiblowjob')
        .setDescription('Returns a random hentai blowjob gif')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Defines how many gifs the bot should send')
                .setRequired(true)
                .addChoice('One', '1')
                .addChoice('Five', '5')
                .addChoice('Ten', '10')),
        
        async execute(interaction) {
            if (interaction.channel.nsfw) {
                const amount = interaction.options.getString('amount');

                async function fetchImage() {
                    let response = await fetch('https://api.waifu.pics/nsfw/blowjob');
                    let data = await response.json();
                    let img_url = data.url
                    return img_url;
                }

                var real_amount = amount-1;
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle('Random hentai blowjob')
                    .setFooter({text: 'From waifu.pics'})
                    .setImage(await fetchImage())
        
            
                await interaction.reply({ embeds: [embed] });
                for(var i=0; i < real_amount; i++){
                    embed.setImage(await fetchImage())
                    await interaction.followUp({ embeds: [embed]} );
            }
        } else {
            await interaction.reply({content: 'Please go to a channel that is marked as NSFW!', ephemeral: true})
            return
        }
    },
};