const { italic, SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('konachan')
        .setDescription('search konachan board')
        .addStringOption(option => option.setName('tags').setDescription('tags to search for').setRequired(true))
		.setDMPermission(false),

    async execute(interaction) {
        if (!interaction.channel.nsfw) {
            await interaction.reply({ content: 'Please go to a channel that is marked as NSFW!', ephemeral: true });
            return;
        }

        await interaction.deferReply();
        const query = interaction.options.getString('tags');
        if (query.split(' ').length > 2) return interaction.editReply({ content: "Max. amount of tags is 2." });

        const response = await fetch(`https://konachan.com/post.json?limit=99&tags=${query}`);
        const data = await response.json();
        const randomInt = Math.floor(Math.random() * (Object.keys(data).length - 0) + 0);

        if (!data.length) {
            await interaction.editReply(`I'm so sorry but I can't find anything with the tag(s) ${italic(query)}`);
            return;
        }

        const imgUrl = data[randomInt].file_url;
        const postId = data[randomInt].id;
        const postUrl = `https://konachan.com/post/show/${postId}`;

        const embed = new EmbedBuilder()
            .setTitle(`Post URL`)
            .setURL(postUrl)
            .setDescription(`Board: konachan.com\nQueried Tag(s): ${query}\nRequested by: ${interaction.member}`)
            .setColor(color)
            .setImage(imgUrl)
            .setFooter({ text: "This content is served by an image-search api and Darling is not responsible for any content!" });

        await interaction.editReply({ embeds: [embed] });
    },
};
