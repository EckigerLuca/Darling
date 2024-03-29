const { italic, SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('safebooru')
        .setDescription('search safebooru.org board')
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

        const response = await fetch(`https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${query}`);
        let data;

        try {
            data = await response.json();
        } catch {
            await interaction.editReply(`I'm so sorry but I can't find anything with the tag(s) ${italic(query)}`);
            return;
        }

        const randomInt = Math.floor(Math.random() * (Object.keys(data).length - 0) + 0);

        const postImgName = data[randomInt].image;
        const postDirectory = data[randomInt].directory;
        const postId = data[randomInt].id;

        const postUrl = `https://safebooru.org/index.php?page=post&s=view&id=${postId}`;
        const imgUrl = `https://safebooru.org/images/${postDirectory}/${postImgName}`;

        const embed = new EmbedBuilder()
            .setTitle(`Post URL`)
            .setURL(postUrl)
            .setDescription(`Board: safebooru.org\nQueried Tag(s): ${query}\nRequested by: ${interaction.member}`)
            .setColor(color)
            .setImage(imgUrl)
            .setFooter({ text: "This content is served by an image-search api and Darling is not responsible for any content!" });

        await interaction.editReply({ embeds: [embed] });
    },
};
