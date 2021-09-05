const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Returns the Bot's ping!"),

        async execute(interaction) {
            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle('Pong!')
                .setDescription(`That took ${Date.now() - interaction.createdTimestamp}ms.\n\nAPI Latency is ${Math.round(interaction.client.ws.ping)}ms`)
                
            await interaction.reply({ embeds: [embed] });
    },
};