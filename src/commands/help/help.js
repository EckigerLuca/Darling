const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all commands')
		.setDMPermission(false),

    async execute(interaction) {
        const eckigerluca = await interaction.client.users.fetch('173374602389618688');
        const eckigerluca_avatar = eckigerluca.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('All commands')
            .setDescription(`[Web Dashboard](${(require('../../website/settings.json')).website.domain}/dashboard)`)
            .setFooter({ text: `Bot by ${eckigerluca.username}`, iconURL: eckigerluca_avatar });

			embed.addFields(
				{ name: '❓ Help', value: '`/help` `/support`' },
				{ name: '🔨 Moderation', value: '`/ban` `/kick` `/unban` `/clear` `/serverstats`' },
				{ name: '🏠 Community Management', value: '`/welcome setup` `/welcome enable` `/welcome disable` `/birthday setup` `/birthday enable` `/birthday disable`' },
				{ name: '🖼️ Media', value: '`/cat` `/fox` `/dog` `/raccoon` `/avatar` `/waifu` `/neko`' },
				{ name: '👤 Profiles', value: '`/profile view` `/profile edit` `/marry` `/divorce`' },
				{ name: '📸 Image Generation', value: '`/lolilicense`' },
				{ name: '🤣 Memes', value: '`/meme` `/meme help` `/adidas` `/magik`' },
				{ name: '🎭 Roleplay', value: '`/baka` `/bite` `/blush` `/bored` `/cry` `/cuddle` `/dance` `/facepalm` `/feed` `/happy` `/highfive` `/hug` `/kiss` `/laugh` `/pat` `/poke` `/pout` `/shrug` `/slap` `/sleep` `/smile` `/smug` `/stare` `/think` `/tickle` `/wave` `/wink` ||`/fuck`||' },
				{ name: '🔰 Other', value: '`/ping` `/whois` `/invite bot` `/invite server` `/random number` `/botinfo` `/botvote`' },
			);

			if (interaction.channel.nsfw) {
				embed.addFields(
					{ name: '🔞 NSFW', value: '`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob`' },
					{ name: '🔞² Boorus', value: '`/safebooru (tags)` `/konachan (tags)` `/gelbooru (tags)` `/rule34 (tags)` `/lolibooru (tags)`' },
				);
			} else {
				embed.addFields(
					{ name: 'Note:', value: "NSFW commands are only visible in designated channels." },
				);
			}

            // if (interaction.channel.nsfw) {
            //     embed.addFields(
            //         { name: '❓ Help', value: '`/help` `/support`' },
            //         { name: '🔨 Moderation', value: '`/ban` `/kick` `/unban` `/clear` `/serverstats`' },
            //         { name: '🏠 Community Management', value: '`/welcome setup` `/welcome enable` `/welcome disable` `/birthday setup` `/birthday enable` `/birthday disable`' },
            //         { name: '🖼️ Media', value: '`/cat` `/fox` `/dog` `/raccoon` `/avatar` `/waifu` `/neko`' },
			// 		{ name: '👤 Profiles', value: '`/profile view` `/profile edit` `/marry` `/divorce`' },
			// 		{ name: '📸 Image Generation', value: '`/lolilicense`' },
            //         { name: '🤣 Memes', value: '`/meme` `/meme help` `/adidas`' },
            //         { name: '😂 Meme Generation', value: '`/magik (@member)`' },
            //         { name: '🎭 Roleplay', value: '`/baka` `/bite` `/blush` `/bored` `/cry` `/cuddle` `/dance` `/facepalm` `/feed` `/happy` `/highfive` `/hug` `/kiss` `/laugh` `/pat` `/poke` `/pout` `/shrug` `/slap` `/sleep` `/smile` `/smug` `/stare` `/think` `/tickle` `/wave` `/wink` `/fuck`' },
            //         { name: '🔰 Other', value: '`/ping` `/whois` `/invite bot` `/invite server` `/random number` `/botinfo` `/botvote`' },
            //         { name: '🔞 NSFW', value: '`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob`' },
            //         { name: '🔞² Boorus', value: '`/safebooru (tags)` `/konachan (tags)` `/gelbooru (tags)` `/rule34 (tags)` `/lolibooru (tags)`' },
            //     );
            // }
            // else {
            //     embed.addFields(
            //         { name: '❓ Help', value: '`/help` `/support`' },
            //         { name: '🔨 Moderation', value: '`/ban` `/kick` `/unban` `/clear` `/serverstats`' },
            //         { name: '👋 Welcome', value: '`/welcome setup` `/welcome enable` `/welcome disable`' },
            //         { name: '🖼️ Media', value: '`/cat` `/fox` `/dog` `/raccoon` `/avatar` `/waifu` `/neko`' },
			// 		{ name: '👤 Profiles', value: '`/profile view` `/profile edit` `/marry` `/divorce`' },
			// 		{ name: '📸 Image Generation', value: '`/lolilicense`' },
            //         { name: '🤣 Memes', value: '`/meme` `/meme help` `/adidas`' },
            //         { name: '😂 Meme Generation', value: '`/magik (@member)`' },
            //         { name: '🎭 Roleplay', value: '`/baka` `/bite` `/blush` `/bored` `/cry` `/cuddle` `/dance` `/facepalm` `/feed` `/happy` `/highfive` `/hug` `/kiss` `/laugh` `/pat` `/poke` `/pout` `/shrug` `/slap` `/sleep` `/smile` `/smug` `/stare` `/think` `/tickle` `/wave` `/wink` ||`/fuck`||' },
            //         { name: '🔰 Other', value: '`/ping` `/whois` `/invite bot` `/invite server` `/random number` `/botinfo` `/botvote`' },
            //         { name: '🔞 NSFW', value: '||`/hentai (subreddit)` `/hentai help` `/hentaiwaifu` `/hentaineko` `/hentaiblowjob`||' },
            //         { name: '🔞² Boorus', value: '||`/safebooru (tags)` `/konachan (tags)` `/gelbooru (tags)` `/rule34 (tags)` `/lolibooru (tags)`||' },
            //     );
            // }
        await interaction.reply({ embeds: [embed] });
    },
};
