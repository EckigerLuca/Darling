const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all commands'),
    
    async execute(interaction) {
        let eckigerluca = await interaction.client.users.fetch('173374602389618688')
        let eckigerluca_avatar = eckigerluca.displayAvatarURL({size: 1024, format: 'png', dynamic: true})
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle('All commands')
            .setDescription('[] = Needed argument\n() = Optional argument')
            .setFooter(`Bot by ${eckigerluca.username}#${eckigerluca.discriminator}`, eckigerluca_avatar)
            .addFields(
                { name: '❓ Help', value: '`/help`'},
                { name: '🎵 Music', value: '`/play` `/join` `/leave` `/nowplaying` `/pause` `/stop` `/resume` `/volume`'},
                { name: '🔨 Moderation', value: '`/ban` `/kick` `/unban [user]` `/clear` `/serverstats`'},
                { name: '🖼️ Media', value: '`/cat` `/fox` `/dog` `/avatar` `/waifu` `/neko`'},
                { name: '🤣 Memes', value: '`/meme` `/meme help` `/adidas`'},
                { name: '🎭 Roleplay', value: '`/bite` `/blush` `/bonk` `/bully` `/cringe` `/cry` `/cuddle` `/dance` `/glomp` `/happy` `/highfive` `/hug` `/kill` `/kiss` `/lick` `/nom` `/pat` `/poke` `/slap` `/smile` `/wave` `/wink` `/yeet`'},
                { name: '🔰 Other', value: '`/ping` `/whois` `/invite bot` `/invite server` `/random number`'},
            )
            if (interaction.channel.nsfw) {
                embed.addField('🔞 NSFW', '`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob`')
            } else {
                embed.addField('🔞 NSFW', '||`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob`||')
            }
        await interaction.reply({embeds: [embed]});
    },
};