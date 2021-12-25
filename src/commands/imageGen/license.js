const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const Canvas = require('canvas')
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lolilicense')
        .setDescription('get a qualified loli license'),

    async execute(interaction) {
        await interaction.deferReply()
        const user = interaction.user.username;

        const canvas = Canvas.createCanvas(1080, 611);
        const context = canvas.getContext('2d');
        Canvas.registerFont('src/data/media/fonts/GOTHICB.TTF', {family: 'Century Gothic'})

        const lolilicense = await Canvas.loadImage('src/data/media/images/license.jpg');
        context.drawImage(lolilicense, 0, 0, canvas.width, canvas.height);

        context.font = '20pt "Century Gothic"';
        context.fillStyle = '#000000';

        context.fillText(user, 450, 128);


        const attachment = new MessageAttachment(canvas.toBuffer(), 'lolilicense.jpg')
        interaction.editReply({files: [attachment]})
    }
};