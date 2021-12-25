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
                //{ name: '🎵 Music', value: '`/play` `/join` `/leave` `/nowplaying` `/pause` `/stop` `/resume` `/volume`'},
                { name: '🔨 Moderation', value: '`/ban` `/kick` `/unban` `/clear` `/serverstats`'},
                { name: '🖼️ Media', value: '`/cat` `/fox` `/dog` `/raccoon` `/avatar` `/waifu` `/neko`'},
                { name: '📸 Image Generation', value: '`/lolilicense`'},
                { name: '🤣 Memes', value: '`/meme` `/meme help` `/adidas`'},
                { name: '😂 Meme Generation', value: '`/magik (@member)`'},
                { name: '🎭 Roleplay', value: '`/baka` `/bite` `/blush` `/bored` `/cry` `/cuddle` `/dance` `/facepalm` `/feed` `/happy` `/highfive` `/hug` `/kiss` `/laugh` `/pat` `/poke` `/pout` `/shrug` `/slap` `/sleep` `/smile` `/smug` `/stare` `/think` `/tickle` `/wave` `/wink` ||`/fuck`||'},
                { name: '🔰 Other', value: '`/ping` `/whois` `/invite bot` `/invite server` `/random number` `/botinfo` `/botvote`'},
            )
            if (interaction.channel.nsfw) {
                embed.addField('🔞 NSFW', '`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob`')
                embed.addField('🔞² Boorus', '`/safebooru (tags)` `/konachan (tags)` `/gelbooru (tags)` `/rule34 (tags)` `/lolibooru (tags)`')
            } else {
                embed.addField('🔞 NSFW', '||`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob` ||')
                embed.addField('🔞² Boorus', '||`/safebooru (tags)` `/konachan (tags)` `/gelbooru (tags)` `/rule34 (tags)` `/lolibooru (tags)`||')
            }
        await interaction.reply({embeds: [embed]});
    },
};