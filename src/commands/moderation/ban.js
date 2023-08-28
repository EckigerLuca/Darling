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
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || "No reason provided.";
            const member = await interaction.guild.members.fetch(user.id);
            const messageAuthor = await interaction.guild.members.fetch(interaction.member.id);
            const authorIsServerOwner = messageAuthor.id === interaction.guild.ownerId;
            const clientMember = interaction.guild.members.me;

            if (!clientMember.permissions.has(PermissionFlagsBits.BanMembers)) {
                await interaction.reply({ content: "I am missing permission to do that!", ephemeral: true });
                return;
            }
            else if (!messageAuthor.permissions.has(PermissionFlagsBits.BanMembers)) {
                await interaction.reply({ content: "You're not allowed to do that!", ephemeral: true });
                return;
            }

            if (clientMember === member) {
                await interaction.reply({ content: "I can't ban myself silly!", ephemeral: true });
                return;
            }
            else if (member.id === interaction.guild.ownerId) {
                await interaction.reply({ content: "You can't ban the server owner silly!", ephemeral: true });
                return;
            }

            if (member.roles.highest.position >= clientMember.roles.highest.position) {
                await interaction.reply({ content: "I can't ban that member becuse their role is higher than mine!", ephemeral: true });
                return;
            }
            else if (member.roles.highest.position >= messageAuthor.roles.highest.position && !authorIsServerOwner) {
                await interaction.reply({ content: "You can't ban that member because their role is higher than yours!", ephemeral: true });
                return;
            }

            try {
                await member.send(`You have been banned from **${interaction.guild.name}**\nReason: ${reason}`);
            }
            catch {
                console.log("Could not dm member after banning!");
            }

            await member.ban({ reason: reason });
            interaction.reply({ content: `Banned ${member.user.username} successfully!\nReason: ${reason}` });
        },
};
