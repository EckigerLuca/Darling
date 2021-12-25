const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const convert = require('xml-js')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('konachan')
        .setDescription('search konachan board')
        .addStringOption(option => option.setName('tags').setDescription('tags to search for').setRequired(true)),
    
    async execute(interaction) {
        if (interaction.channel.nsfw) {
            await interaction.deferReply();
            let query = interaction.options.getString('tags')
            if (query.split(' ').length > 2) return interaction.editReply({content: "Max. amount of tags is 2."});

            let response = await fetch(`https://konachan.com/post.json?limit=99&tags=${query}`)
            let data = await response.json();
            let randomInt = Math.floor(Math.random() * (Object.keys(data).length - 0) + 0);
            
            let imgUrl = data[randomInt].file_url;
            let postId = data[randomInt].id;
            let postUrl = `https://konachan.com/post/show/${postId}`

            const embed = new MessageEmbed()
                .setTitle(`Post URL`)
                .setURL(postUrl)
                .setDescription(`Board: konachan.com\nQueried Tag(s): ${query}\nRequested by: ${interaction.member}`)
                .setColor(color)
                .setImage(imgUrl)
                .setFooter("This content is served by an image-search api and Darling is not responsible for any content!")

            await interaction.editReply({embeds: [embed]})
        } else {await interaction.reply({content: 'Please go to a channel that is marked as NSFW!', ephemeral: true})}
    }
};