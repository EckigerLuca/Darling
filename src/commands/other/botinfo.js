const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Shows some information about the bot'),

    async execute(interaction) {
        let servers = interaction.client.guilds.cache.size;
        let eckigerluca = await interaction.client.users.fetch('173374602389618688')
        let eckigerluca_avatar = eckigerluca.displayAvatarURL({size: 1024, format: 'png', dynamic: true})
        let embed = new MessageEmbed()
            .setTitle('Hey!')
            .setColor(color)
            .setDescription('This page here is just existing to share some information about the bot, so read it if you have time for it lol')
            .setThumbnail(interaction.client.user.displayAvatarURL({size: 1024, format: 'png', dynamic: true}))
            .addFields(
                {name: 'How it started...', value: "I actually decided to code my own bot because I felt like 'Ugh pay2win I dont like that' sooooo I decided to do it free then. Yes, this bot is completely free, but I have to pay to maintain it tho lol\nThe first few lines of code of `Darling.` were written in Python with discord.py, but sadly this library isn't maintained anymore so I had to switch to `Discord.js` which is obv written in JavaScript. Uh yeah, a date..  it was the 12th august 2020 when I started this project. How time has passed\nEnough bs, time for important information!", inline: false},
                {name: "Profile Picture", value: `__Artist:__\n[ShiChi](https://www.pixiv.net/en/users/36083362)\n__Artwork:__\n[スカジ](https://www.pixiv.net/en/artworks/85612659)`, inline: true},
                {name: "Servers:", value: `${servers}`, inline: false},
                {name: "Code", value: "https://eckigerluca.com/darling/github"},
                
            )
            .setFooter("Ich mag Bananensaft", eckigerluca_avatar)
            .setAuthor("EckigerLuca", eckigerluca_avatar, "https://github.com/EckigerLuca/")
        await interaction.reply({embeds: [embed]})
    }
};