const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Shows some information about the server')
		.setDMPermission(false),

    async execute(interaction) {
        const guild = interaction.guild;

        async function getTextChannels() {
            const all_channels = await interaction.guild.channels.fetch();
            const text_channels = all_channels.filter(channels => channels.type === ChannelType.GuildText).size;
            return text_channels;
        }
        const no_text_channels = await getTextChannels();

        async function getVoiceChannels() {
            const all_channels = await interaction.guild.channels.fetch();
            const voice_channels = all_channels.filter(channels => channels.type === ChannelType.GuildVoice).size;
            return voice_channels;
        }
        const no_voice_channels = await getVoiceChannels();

        async function getRealMembers() {
            const all_members = await interaction.guild.members.fetch();
            const humans = all_members.sweep(member => !member.user.bot);
            return humans;
        }
        const real_members = await getRealMembers();

        async function getBotMembers() {
            const all_members = await interaction.guild.members.fetch();
            const bots = all_members.sweep(member => member.user.bot);
            return bots;
        }
        const bot_members = await getBotMembers();

        const members = guild.memberCount;
        const date_created = guild.createdTimestamp;
        const afk_timeout = guild.afkTimeout / 60;
        let afk_channel;
        if (guild.afkChannel == null) {
            afk_channel = 'None';
        }
        else {
            afk_channel = guild.afkChannel;
        }

        async function getGuildEmotes() {
            const all_emojis = await guild.emojis.fetch();
            const amount = all_emojis.size;
            return amount;
        }
        const emotes = await getGuildEmotes();

        async function getGuildRoles() {
            const all_roles = await guild.roles.fetch();
            const amount = all_roles.size;
            return amount;
        }
        const roles = await getGuildRoles();

        const boosts = guild.premiumSubscriptionCount;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setThumbnail(guild.iconURL())
            .setTitle('Stats of the Server')
            .addFields(
                { name: '_General Information_', value: `**» Name:** ${guild.name}\n**» Created at:** <t:${Math.round(date_created / 1000)}:f>\n**» Owner:** <@${guild.ownerId}>\n**» Guild-ID:** ${guild.id}` },
                { name: '_Members_', value: `**» Total Members:** ${members}\n**» Real Members:** ${real_members}\n**» Bots:** ${bot_members}` },
                { name: '_Channels_', value: `**» Voice Channels:** ${no_voice_channels}\n**» Text Channels:** ${no_text_channels}\n**» AFK Channel:** ${afk_channel}\n**» AFK Timeout:** ${afk_timeout} minutes` },
                { name: '_Other_', value: `**» Roles:** ${roles}\n**» Emotes:** ${emotes}\n**» Boosts:** ${boosts}` },
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
