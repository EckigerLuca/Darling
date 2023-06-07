const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Shows some information about the bot')
		.setDMPermission(false),

    async execute(interaction) {
        const servers = interaction.client.guilds.cache.size;
        const eckigerluca = await interaction.client.users.fetch('173374602389618688');
        const eckigerluca_avatar = eckigerluca.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });
        const embed = new EmbedBuilder()
            .setTitle('Hey!')
            .setColor(color)
            .setDescription('This page here is just existing to share some information about the bot, so read it if you have time for it lol')
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false }))
            .addFields(
                // { name: 'How it started...', value: "I actually decided to code my own bot because I felt like 'Ugh pay2win I dont like that' sooooo I decided to do it free then. Yes, this bot is completely free, but I have to pay to maintain it tho lol\nThe first few lines of code of `Darling.` were written in Python with discord.py, but sadly this library isn't maintained anymore so I had to switch to `Discord.js` which is obv written in JavaScript. Uh yeah, a date..  it was the 12th August 2020 when I started this project. How time has passed\nEnough bs, time for important information!", inline: false },
                { name: "Profile Picture", value: `__Artist:__\n[ShiChi](https://www.pixiv.net/en/users/36083362)\n__Artwork:__\n[スカジ](https://www.pixiv.net/en/artworks/85612659)`, inline: true },
                { name: "Servers", value: `${servers}`, inline: true },
                { name: "Code", value: "https://github.com/eckigerluca/darling", inline: true },
                { name: "Support", value: "The **Bot Support** is on my [Server](https://eckigerluca.com/discord).\nBut you can also support **me** on [Patreon](https://patreon.com/eckigerluca) or [Ko-Fi](https://ko-fi.com/eckigerluca)", inline: false },
            )
            .setFooter({ text: "Bot by EckigerLuca#0001", iconURL: eckigerluca_avatar })
            .setAuthor({ name: "EckigerLuca", iconURL: eckigerluca_avatar, url: "https://github.com/EckigerLuca/" });
        await interaction.reply({ embeds: [embed] });
    },
};
