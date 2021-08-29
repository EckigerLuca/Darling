const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } =require('./data/config.json');
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Returns a random waifu pic')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Defines how many images the bot should send')
                .setRequired(true)
                .addChoice('One', '1')
                .addChoice('Five', '5')
                .addChoice('Ten', '10')),
    async execute(interaction) {
        const amount = interaction.options.getString('amount');
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle('Random waifu pic?')
            .setImage('')
        await interaction.reply(`Waifu.png comes here\n You have chosen ${amount} picture(s)`);
    },
};