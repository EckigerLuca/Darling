const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('returns information about you or')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Tag a user to get information about them')),

        async execute(interaction) {
            let user = interaction.options.getUser('user');
            if (user === null) {
                user = interaction.user
            }

            async function getMemberJoinDate() {
                let member = await interaction.guild.members.fetch(user.id)
                let date = Math.round(member.joinedTimestamp / 1000);
                return date;
            };
            let joinDate = await getMemberJoinDate();

            let roles = '';
            async function getMemberRoles() {
                let member = await interaction.guild.members.fetch(user.id)
                let rolesArray = member._roles
                rolesArray.forEach(role => roles += `<@&${role}> `);
                return roles;
            };
            let memberRoles = await getMemberRoles();

            let avatar = user.displayAvatarURL({size: 1024, format: 'png', dynamic: true})
            const embed = new MessageEmbed()
                .setDescription(`<@${user.id}>`)
                .setAuthor(user.username, avatar)
                .setThumbnail(avatar)
                .setFooter('User ID: '+user.id)
                .setColor(color)
                .addFields(  
                    { name: 'Joined:', value: `<t:${joinDate}:f>\n<t:${joinDate}:R>`, inline: true },
                    { name: 'Registered:', value: `<t:${Math.round(user.createdTimestamp / 1000)}:f>\n<t:${Math.round(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Roles:', value: '\u200b'+memberRoles, inline: false},
                )
            await interaction.reply({embeds: [embed]})
    },
};