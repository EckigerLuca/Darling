const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unban a user')
        .addStringOption(option => option.setName('userid').setDescription('UserID that you want to unban').setRequired(true)),

        async execute(interaction) {
            const userID = interaction.options.getString('userid');
            const messageAuthor = await interaction.guild.members.fetch(interaction.member.id);
            if (messageAuthor.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                const guild = await interaction.guild.fetch();
                await guild.members.unban(userID).then((user) => {
                    interaction.reply({ content: `Successfully unbanned ${user.tag} from the server!` });
                }).catch(() => {
                    interaction.reply({ content: "Please define a valid ID, resp. the ID of a banned member!", ephemeral: true }); return;
                });
            }
            else {
                await interaction.reply({ content: "You're not allowed to do that!", ephemeral: true }); return;
            }
        },
};