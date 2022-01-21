const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('returns your or the avatar of someone else')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Tag a user to get their avatar')),

        async execute(interaction) {
            let user = interaction.options.getUser('user');
            if (user === null) {
                user = interaction.user;
            }
            const avatar = user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true });
            const embed = new MessageEmbed()
                .setColor(color)
                .setDescription(`You requested ${user}'s avatar`)
                .setImage(avatar);
            await interaction.reply({ embeds: [embed] });
    },
};