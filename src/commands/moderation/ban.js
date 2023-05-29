const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('ban a member')
        .addUserOption(option => option.setName('user').setDescription('Select a user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Define a reason').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),

        async execute(interaction) {
            const member = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || "No reason provided.";

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
                await interaction.reply({ content: "I am missing permission to do that!", ephemeral: true });
                return;
            }

            const memberFetched = await interaction.guild.members.fetch(member.id);
            const messageAuthor = await interaction.guild.members.fetch(interaction.member.id);

            if (messageAuthor.permissions.has(PermissionFlagsBits.BanMembers)) {

                if (memberFetched.roles.highest.position >= messageAuthor.roles.highest.position) return interaction.reply({ content: "You can't ban that member because their role is higher than yours!", ephemeral: true });
                try {
                await member.send(`You have been banned from **${interaction.guild.name}**\nReason: ${reason}`);
                }
                catch {console.log("Could not dm member after banning!");}

                await memberFetched.ban({ reason: reason });
                interaction.reply({ content: `Banned ${memberFetched.user.tag} successfully!\nReason: ${reason}` });
            }
            else {
                await interaction.reply({ content: "You're not allowed to do that!", ephemeral: true }); return;
            }
        },
};
