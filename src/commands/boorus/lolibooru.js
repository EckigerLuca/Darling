const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lolibooru')
        .setDescription('search lolibooru.moe board')
        .addStringOption(option => option.setName('tags').setDescription('tags to search for').setRequired(true)),

    async execute(interaction) {
        if (interaction.channel.nsfw) {
            await interaction.deferReply();
            const query = interaction.options.getString('tags');
            if (query.split(' ').length > 2) return interaction.editReply({ content: "Max. amount of tags is 2." });

            const response = await fetch(`https://lolibooru.moe/post/index.json?page=dapi&s=post&q=index&json=1&limit=99&tags=${query}`);
            const data = await response.json();
            const randomInt = Math.floor(Math.random() * (Object.keys(data).length - 0) + 0);

            const postId = data[randomInt].id;

            const postUrl = `https://lolibooru.moe/post/show/${postId}`;
            const imgUrl = data[randomInt].file_url;
            const imgUrlEdited = imgUrl.replace(/ /g, '%20');

            const embed = new MessageEmbed()
                .setTitle(`Post URL`)
                .setURL(postUrl)
                .setDescription(`Board: lolibooru.moe\nQueried Tag(s): ${query}\nRequested by: ${interaction.member}`)
                .setColor(color)
                .setImage(imgUrlEdited)
                .setFooter({ text:"This content is served by an image-search api and Darling is not responsible for any content!" });

            await interaction.editReply({ embeds: [embed] });
        }
        else {await interaction.reply({ content: 'Please go to a channel that is marked as NSFW!', ephemeral: true });}
    },
};