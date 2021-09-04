const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all commands'),
    
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle('All commands')
            .setDescription('[] = Needed argument\n() = Optional argument')
            .addFields(
                { name: '❓ Help', value: '`/help`'},
                { name: '🎵 Music', value: '`/play` `/join` `/leave` `/nowplaying` `/pause` `/stop` `/resume` `/volume [level]`'},
                { name: '🔨 Moderation', value: '`/ban [user] (reason)` `/kick [user] (reason)` `/unban [user]` `/clear [amount]` `/serverstats`'},
                { name: '🖼️ Media', value: '`/cat` `/fox` `/dog` `/avatar (user)` `/waifu` `/neko`'},
                { name: '🤣 Memes', value: '`/meme (subreddit)` `/meme help` `/adidas`'},
                { name: '🎭 Roleplay', value: '`/bite` `/blush` `/bonk` `/bully` `/cringe` `/cry` `/cuddle` `/dance` `/glomp` `/happy` `/highfive` `/hug` `/kill` `/kiss` `/lick` `/nom` `/pat` `/poke` `/slap` `/smile` `/wave` `/wink` `/yeet`'},
                { name: '🔰 Other', value: '`/ping` `/whois (user)` `/botinvite` `/serverinvite` `/randomnumber (range)`'},
            )
            if (interaction.channel.nsfw) {
                embed.addField('🔞 NSFW', '`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob`')
            } else {
                embed.addField('🔞 NSFW', '||`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob`||')
            }
        await interaction.reply({embeds: [embed]});
    }
}