/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rule34')
        .setDescription('search rule34.xxx board')
        .addStringOption(option => option.setName('tags').setDescription('tags to search for').setRequired(true))
		.setDMPermission(false),

    async execute(interaction) {
        if (interaction.channel.nsfw) {
            await interaction.deferReply();
            const query = interaction.options.getString('tags');
            if (query.split(' ').length > 2) return interaction.editReply({ content: "Max. amount of tags is 2." });

            async function getBooru() {
                const response = await fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${query}`);
                const data = await response.json();
                const randomInt = Math.floor(Math.random() * (Object.keys(data).length - 0) + 0);

                const postId = data[randomInt].id;

                const postUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${postId}`;
                const imgUrl = data[randomInt].file_url;

                const result = {
                    "postUrl": postUrl,
                    "imgUrl": imgUrl,
                };
                return result;
            }
            let booruResult;

            do {
                booruResult = await getBooru();
            } while (booruResult.imgUrl.includes('mp4'));

            const embed = new EmbedBuilder()
                .setTitle(`Post URL`)
                .setURL(booruResult.postUrl)
                .setDescription(`Board: rule34.xxx\nQueried Tag(s): ${query}\nRequested by: ${interaction.member}`)
                .setColor(color)
                .setImage(booruResult.imgUrl)
                .setFooter({ text: "This content is served by an image-search api and Darling is not responsible for any content!" });

            await interaction.editReply({ embeds: [embed] });
        }
 else {await interaction.reply({ content: 'Please go to a channel that is marked as NSFW!', ephemeral: true });}
    },
};
