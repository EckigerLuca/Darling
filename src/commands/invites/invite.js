const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed, Permissions } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite links!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('My invite link!'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Server Invite Link')),
        
        async execute(interaction) {
            if (interaction.options.getSubcommand() === 'bot') {
                const embed = new MessageEmbed()
                    .setTitle('Invite link')
                    .setDescription('[Click me ヽ(✿ﾟ▽ﾟ)ノ](https://eckigerluca.com/darling/invite)')
                    .setColor(color)
                await interaction.reply({embeds: [embed]})
                return;
            } else if (interaction.options.getSubcommand() === 'server') {
                if (interaction.member.permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
                    const invite = interaction.channel.createInvite({unique: true, maxAge: 300})
                    await interaction.reply({content: `Here is your link: ${await invite}\nNote: This invite is usable for five minutes!`, ephemeral: true})
                } else { await interaction.reply({content: "I'm sorry, but you're not allowed to do that!", ephemeral: true}) }
            }
        }
};