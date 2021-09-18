const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Shows some information about the server'),
    
    async execute(interaction) {
        let guild = interaction.guild;

        async function getTextChannels() {
            let all_channels = await interaction.guild.channels.fetch()
            let text_channels = all_channels.filter(channels => channels.type == 'GUILD_TEXT').size;
            return text_channels
        };
        let no_text_channels = await getTextChannels();

        async function getVoiceChannels() {
            let all_channels = await interaction.guild.channels.fetch()
            let voice_channels = all_channels.filter(channels => channels.type == 'GUILD_VOICE').size;
            return voice_channels
        };
        let no_voice_channels = await getVoiceChannels();

        async function getRealMembers() {
            let all_members = await interaction.guild.members.fetch()
            let humans = all_members.sweep(member => !member.user.bot)
            return humans;
        };
        let real_members = await getRealMembers();

        async function getBotMembers() {
            let all_members = await interaction.guild.members.fetch()
            let bots = all_members.sweep(member => member.user.bot)
            return bots;
        };
        let bot_members = await getBotMembers();

        let members = guild.memberCount;
        let date_created = guild.createdTimestamp;
        let afk_timeout = guild.afkTimeout / 60;
        
        if (guild.afkChannel == null) {
            var afk_channel = 'None';
        } else {
            var afk_channel = guild.afkChannel;
        }

        async function getGuildEmotes() {
            let all_emojis = await guild.emojis.fetch()
            let amount = all_emojis.size
            return amount
        }
        let emotes = await getGuildEmotes();

        async function getGuildRoles() {
            let all_roles = await guild.roles.fetch()
            let amount = all_roles.size
            return amount
        }
        let roles = await getGuildRoles();

        let boosts = guild.premiumSubscriptionCount;

        const embed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(guild.iconURL())
            .setTitle('Stats of the Server')
            .addFields(
                {name: '_General Information_', value: `**» Name:** ${guild.name}\n**» Created at:** <t:${Math.round(date_created / 1000)}:f>\n**» Owner:** <@${guild.ownerId}>\n**» Guild-ID:** ${guild.id}`},
                {name: '_Members_', value: `**» Total Members:** ${members}\n**» Real Members:** ${real_members}\n**» Bots:** ${bot_members}`},
                {name: '_Channels_', value: `**» Voice Channels:** ${no_voice_channels}\n**» Text Channels:** ${no_text_channels}\n**» AFK Channel:** ${afk_channel}\n**» AFK Timeout:** ${afk_timeout} minutes`},
                {name: '_Other_', value: `**» Roles:** ${roles}\n**» Emotes:** ${emotes}\n**» Boosts:** ${boosts}`},
            )
            .setTimestamp()
        await interaction.reply({embeds: [embed]})
    },
};