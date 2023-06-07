const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gelbooru')
        .setDescription('search gelbooru.com board')
        .addStringOption(option => option.setName('tags').setDescription('tags to search for').setRequired(true))
		.setDMPermission(false),

    async execute(interaction) {
        if (interaction.channel.nsfw) {
            await interaction.deferReply();
            const query = interaction.options.getString('tags');
            if (query.split(' ').length > 2) return interaction.editReply({ content: "Max. amount of tags is 2." });

            const response = await fetch(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${query}`);
            const data = await response.json();
            const randomInt = Math.floor(Math.random() * (Object.keys(data.post).length - 0) + 0);

            const postId = data.post[randomInt].id;

            const postUrl = `https://gelbooru.com/index.php?page=post&s=view&id=${postId}`;
            const imgUrl = data.post[randomInt].file_url;

            const embed = new EmbedBuilder()
                .setTitle(`Post URL`)
                .setURL(postUrl)
                .setDescription(`Board: gelbooru.com\nQueried Tag(s): ${query}\nRequested by: ${interaction.member}`)
                .setColor(color)
                .setImage(imgUrl)
                .setFooter({ text: "This content is served by an image-search api and Darling is not responsible for any content!" });

            await interaction.editReply({ embeds: [embed] });
        }
        else {
            await interaction.reply({ content: 'Please go to a channel that is marked as NSFW!', ephemeral: true });
        }
    },
};
