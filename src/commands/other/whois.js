const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('returns information about you or')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Tag a user to get information about them'))
		.setDMPermission(false),

        async execute(interaction) {
            let user = interaction.options.getUser('user');
            if (user === null) {
                user = interaction.user;
            }

            async function getMemberJoinDate() {
                const member = await interaction.guild.members.fetch(user.id);
                const date = Math.round(member.joinedTimestamp / 1000);
                return date;
            }
            const joinDate = await getMemberJoinDate();

            let roles = '';
            async function getMemberRoles() {
                const member = await interaction.guild.members.fetch(user.id);
                const rolesArray = member._roles;
                rolesArray.forEach(role => roles += `<@&${role}> `);
                return roles;
            }
            const memberRoles = await getMemberRoles();

            const avatar = user.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });
            const embed = new EmbedBuilder()
                .setDescription(`<@${user.id}>`)
                .setAuthor({ name: String(user.username), iconURL: avatar })
                .setThumbnail(avatar)
                .setFooter({ text: `User ID: ${user.id}` })
                .setColor(color)
                .addFields(
                    { name: 'Joined:', value: `<t:${joinDate}:f>\n<t:${joinDate}:R>`, inline: true },
                    { name: 'Registered:', value: `<t:${Math.round(user.createdTimestamp / 1000)}:f>\n<t:${Math.round(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Roles:', value: '\u200b' + memberRoles, inline: false },
                );
            await interaction.reply({ embeds: [embed] });
    },
};