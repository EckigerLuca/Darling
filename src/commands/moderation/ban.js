const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed, Permissions, ReactionUserManager } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('ban a member')
        .addUserOption(option => option.setName('user').setDescription('Select a user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Define a reason').setRequired(false)),

        async execute(interaction) {
            const member = interaction.options.getUser('user')
            const reason = interaction.options.getString('reason') || "No reason provided."

            let memberFetched = await interaction.guild.members.fetch(member.id);
            let messageAuthor = await interaction.guild.members.fetch(interaction.member.id)

            if (messageAuthor.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {

                if (memberFetched.roles.highest.position >= messageAuthor.roles.highest.position) return interaction.reply({content: "You can't ban that member because their role is higher than yours!", ephemeral: true})
                await member.send(`You have been banned from **${interaction.guild.name}**\nReason: ${reason}`);

                await memberFetched.ban({reason: reason});
                interaction.reply({content: `Banned ${memberFetched.user.tag} successfully!\nReason: ${reason}`})
            } else { await interaction.reply({content: "You're not allowed to do that!", ephemeral: true}); return;}
        }
};