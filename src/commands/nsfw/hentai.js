const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

REDDIT_ENABLED_HENTAI_SUBREDDITS = [
    'A_HentaiTV',
    'ahegao',
    'AleatoryHentai',
    'AmberHentai',
    'AnalHentai',
    'animearmpits',
    'AnimeAss',
    'Animeasshole',
    'animeassholes',
    'animebodysuits',
    'AnimeBooty',
    'AnimeFeets',
    'Animefoot',
    'AnimeFootFetish',
    'animehandjobs',
    'AnimeHeelsAndBoots',
    'AnimeHighHeels',
    'animeJOmaterial',
    'animelegs',
    'animelegwear',
    'AnimeLingerie',
    'animemaids',
    'animemidriff',
    'AnimeMILFS',
    'animemilkers',
    'animepantsu',
    'AnimePantyhose',
    'AnimePasties',
    'animepointyears',
    'AnimePussy',
    'AnimeSeeThrough',
    'animeshirtgaps',
    'AnimeStockings',
    'animethighss',
    'AnimeTitties',
    'AraAra',
    'Artistic_Hentai',
    'AshiToFutomomo',
    'AsunaHentai',
    'Atago',
    'AverageAnimeTiddies',
    'AyakaHentai',
    'AzurlaneHentai',
    'AzurLaneXXX',
    'AzurLewd',
    'AzurTakao',
    'bakunyuu',
    'BarbaraNSFW',
    'BeachHentai',
    'BeidouNSFW',
    'BigAnimeTiddies',
    'BikiniMoe',
    'BimboHentai',
    'BlondeHairWaifu',
    'bluehairhentai',
    'bunnygirlhentai',
    'CedehsHentai',
    'ChurchofBooty',
    'ChurchOfRikka',
    'ConfidentHentai',
    'Cowgirls',
    'CultureImpact',
    'CumHentai',
    'cute_hentai',
    'DarlingInTheFranXXX',
    'DateALewd',
    'deepthroathentai',
    'dekaihentai',
    'DoA_Rule34',
    'ecchi',
    'Ecchibondage',
    'ecchitits',
    'Elegant34',
    'ElfHentai',
    'EmbarrassedHentai',
    'EmiliaHentai',
    'ErOshiri',
    'Erza34',
    'EulaNSFW',
    'Fairytail_hentai',
    'FateEcchi',
    'FateHentai',
    'Fateishtar',
    'FateXXX',
    'FGOcomics',
    'Fire_Emblem_R34',
    'fischlnsfw',
    'Formidable_AZ',
    'FreeuseHentai',
    'funpiece',
    'GanyuNSFW',
    'GenshinImpactHentai',
    'GenshinImpactNSFW',
    'GenshinLewds',
    'glasshentai',
    'GloryHo',
    'grailwhores',
    'HardcoreHentaiBondage',
    'HelplessHentai',
    'Hen_Tai',
    'hentai',
    'hentai411',
    'Hentai4Everyone',
    'Hentai_feet',
    'HENTAI_GIF',
    'hentai_highlights',
    'HentaiAnal',
    'HentaiAnaru',
    'HentaiAnime',
    'HentaiBlessing',
    'hentaibondage',
    'HentaiBreeding',
    'Hentaibuttplug',
    'HentaiCameltoe',
    'HentaiCity',
    'HentaiCumsluts',
    'hentaifemdom',
    'hentaigg',
    'Hentaiofthedead',
    'HentaiParadise',
    'hentaipath',
    'HentaiPetgirls',
    'HentaiPixxx',
    'HentaiSchoolGirls',
    'HentaiVisualArts',
    'HentaiVTuberGirls',
    'hentaiwaifus69',
    'HentaiWorldInfo',
    'highschooldxdr34',
    'Hololewd',
    'HonkaiImpactRule34',
    'HQHentai',
    'HuTaoHentai',
    'HuTaoNSFW',
    'ishtarhentai',
    'IWantToBeHerHentai',
    'JeanHentai',
    'Jeanne',
    'Joshi_Kosei',
    'KdaNSFW',
    'kemonomimi',
    'KeqingNSFW',
    'KeyholeHentai',
    'Lewd_Not_Hentai',
    'LewdAnimeGirls',
    'LewdGenshinImpact',
    'LingerieHentai',
    'LisaHentai',
    'LoweredPantyhose',
    'lowlegsheaven',
    'MaidHentai',
    'MamaRaikou',
    'MasturbationHentai',
    'MidriffHentai',
    'MikuNakanoNSFW',
    'milfhentai',
    'Mona_NSFW',
    'MonaHentai',
    'MonsterGirl',
    'muchihentai',
    'nakanoitsuki',
    'Naruto_Hentai',
    'Nekomimi',
    'NinoNakanoNSFW',
    'NintendoWaifus',
    'NoneHumanMoe',
    'nsfw_zhentai',
    'NSFWEcchi',
    'NurseHentai',
    'officelady',
    'OfficialSenpaiHeat',
    'OniMaidTwins',
    'Oppai',
    'oppai_gif',
    'OppaiLove',
    'OriginalMoe',
    'overflowingcum',
    'overflowingoppai',
    'OverOppai',
    'oversizedbreasts',
    'Paizuri',
    'pantsu',
    'PantsuPull',
    'PublicHentai',
    'PussySpreadingHentai',
    'quick_hentai',
    'QuintupletsHentai',
    'RaidenMeiNSFW',
    'RaidenNSFW',
    'rape_hentai',
    'ReZeroHentai',
    'Rikka_Takarada',
    'RinTohsakaNSFW',
    'rippedanimelegwear',
    'RosariaNSFW',
    'rule34',
    'Rule34cumsluts',
    'rule34feet',
    'Rule34LoL',
    'RWBYNSFW',
    'Saber',
    'saohentai',
    'serafuku2D',
    'sex_comics',
    'SFMCompileClub',
    'Sheizenokan',
    'ShokugekiNoSomaNsfw',
    'SideBoobHentai',
    'SoakedHentai',
    'SteamyHentai',
    'StripHentai',
    'StuckHentai',
    'SubwayHentai',
    'Sukebei',
    'SurpriseHentai',
    'Sweatymoe',
    'swimsuithentai',
    'Taihou',
    'Tentai',
    'thehentaihaus',
    'ThiccElves',
    'thick_hentai',
    'thighdeology',
    'thighhighhentai',
    'tohsakahentai',
    'ToplessHentai',
    'uncensoredhentai',
    'Uniform_Hentai',
    'UpskirtHentai',
    'VaginaHentai',
    'VideoGame_Hentai',
    'VshojoLewds',
    'waifusgonewild',
    'WaifusOnCouch',
    'Waifutights',
    'WesternHentai',
    'XrayHentai',
    'YaeMikoNSFW',
    'ZeroTwoBooty',
    'ZeroTwoHentai'
    ]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hentai')
        .setDescription('returns random hentai from reddit')
        .addStringOption(option => 
            option.setName('input')
                .setDescription('Put in `help` or the name of a subreddit here that is in the list')
                .setRequired(false)),
        
        async execute(interaction) {
            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('hentai1')
                        .setEmoji('1️⃣')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('hentai2')
                        .setEmoji('2️⃣')
                        .setStyle('PRIMARY'),
                )
            if (interaction.channel.nsfw) {

                let input = interaction.options.getString('input');
                let subreddit = 'lulw';
                let notfound;

                if (input == 'help') {
                    const helpEmbed1 = new MessageEmbed()
                        .setTitle('List of subreddits | Page 1')
                        .setColor(color)
                        .addFields(
                            {name: "» 1-25 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(0, 25).join('\n'), inline: true},
                            {name: '» 26-50 «', value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(25, 50).join('\n'), inline: true},
                            {name: "» 51-75 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(50, 75).join("\n"), inline: true},
                            {name: "» 76-100 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(75, 100).join('\n'), inline: true},
                            {name: "» 101-125 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(100, 125).join('\n'), inline: true},
                            {name: "» 126-150 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(125, 150).join('\n'), inline: true}
                        )
                        .setFooter("Large and lower case is not important, just make sure to spell them correctly!")
                    const helpEmbed2 = new MessageEmbed()
                            .setTitle('List of subreddits | Page 2')
                            .setColor(color)
                            .addFields(
                                {name: "» 151-175 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(150, 175).join('\n'), inline: true},
                                {name: "» 176-200 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(175, 200).join("\n"), inline: true},
                                {name: "» 201-225 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(200,225).join('\n'), inline: true},
                                {name: "» 226-240 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(225).join('\n'), inline: true}
                            )
                            .setFooter("Large and lower case is not important, just make sure to spell them correctly!")
                    await interaction.reply({embeds: [helpEmbed1], components: [row]})
                    interaction.client.on('interactionCreate', interaction => {
                        if (!interaction.isButton()) return;
                        switch (interaction.customId) {
                            case "hentai1": {
                                return interaction.update({embeds: [helpEmbed1], components: [row]})
                            }
                            case "hentai2": {
                                return interaction.update({embeds: [helpEmbed2], components: [row]})
                            }
                        }
                    })

                    await sleep(60000)
                    row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('1')
                                .setEmoji('1️⃣')
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            new MessageButton()
                                .setCustomId('2')
                                .setEmoji('2️⃣')
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                        )
                    await interaction.editReply({components: [row]})

                    return;
                } else {
                    if (input == null) {
                        notfound = false;
                        subreddit = REDDIT_ENABLED_HENTAI_SUBREDDITS[Math.floor(Math.random() * REDDIT_ENABLED_HENTAI_SUBREDDITS.length)];
                    } else if (REDDIT_ENABLED_HENTAI_SUBREDDITS.map(list => list.toLowerCase()).includes(input.toLowerCase()) == false) {
                        notfound = true;
                        subreddit = REDDIT_ENABLED_HENTAI_SUBREDDITS[Math.floor(Math.random() * REDDIT_ENABLED_HENTAI_SUBREDDITS.length)];
                    } else if (REDDIT_ENABLED_HENTAI_SUBREDDITS.map(list => list.toLowerCase()).includes(input.toLowerCase()) == true) {
                        notfound = false;
                        subreddit = input;
                    } else {
                        await interaction.reply({content: "I dont know what, but something bad happened here. Try again and if it's still not working create an issue on GitHub:\nhttps://eckigerluca.com/darling/github", ephemeral: true})
                    }
                }

                async function getHentai() {
                    let response = await fetch(`https://reddit.com/r/${subreddit}/random.json`);
                    let data = await response.json();

                    let permalink = data[0].data.children[0].data.permalink;
                    let subredditName = data[0].data.children[0].data.subreddit_name_prefixed;
                    let hentaiUrl = `https://reddit.com${permalink}`;
                    let hentaiImg = data[0].data.children[0].data.url;
                    let hentaiTitle = data[0].data.children[0].data.title;
                    let hentaiUpvotes = data[0].data.children[0].data.ups;
                    let hentaiDownvotes = data[0].data.children[0].data.downs;
                    let hentaiNumComents = data[0].data.children[0].data.num_comments;
                    let hentaiSubredditUrl = `https://reddit.com/r/${data[0].data.children[0].data.subreddit}`;
                    let isVideo = data[0].data.children[0].data.is_video;

                    if (data[0].data.children[0].data.is_gallery == true) {
                        let ImgCode = data[0].data.children[0].data.gallery_data.items[0].media_id;
                        var ImgType;
                        if (data[0].data.children[0].data.media_metadata[ImgCode].m == "image/jpg") { 
                            ImgType = "jpg";
                        } else if (data[0].data.children[0].data.media_metadata[ImgCode].m == "image/png") {
                            ImgType = "png";
                        }
                        hentaiImg = `https://i.redd.it/${ImgCode}.${ImgType}`
                    } else {
                    }

                    const hentaiData = {
                        'permalink': permalink,
                        'postUrl': hentaiUrl,
                        'imgUrl': hentaiImg,
                        'title': hentaiTitle,
                        'upvotes': hentaiUpvotes,
                        'downvotes': hentaiDownvotes,
                        'comments': hentaiNumComents,
                        'subredditUrl': hentaiSubredditUrl,
                        'subredditName': subredditName,
                        'video': isVideo
                    }
                    return hentaiData;
                }
                let hentaiDataJson; 
                do {
                    hentaiDataJson = await getHentai(subreddit);
                } while (hentaiDataJson.video == true);

                if (hentaiDataJson.imgUrl.includes('redgif')) {
                    await interaction.reply({content: `This looks like a bit more!\n**From:** ${hentaiDataJson.subredditUrl}\n**Post:** ${hentaiDataJson.postUrl}\n**Submission:** ${hentaiDataJson.imgUrl}`})
                } else {

                    const embed = new MessageEmbed()
                        .setColor(color)
                        .setTitle(hentaiDataJson.title)
                        .setDescription(`From [${hentaiDataJson.subredditName}](${hentaiDataJson.subredditUrl})`)
                        .setURL(hentaiDataJson.postUrl)
                        .setImage(hentaiDataJson.imgUrl)
                        .setFooter(`👍 ${hentaiDataJson.upvotes} 👎 ${hentaiDataJson.downvotes} 💬 ${hentaiDataJson.comments}`)
                    
                    await interaction.reply({embeds: [embed]})
                    if (notfound == true) {
                        let infoEmbed = new MessageEmbed()
                            .setTitle('404 Not Found')
                            .setDescription("Seems like, that you've tried to get something from a subreddit that is not in the list!\nThat's why I decided to throw random shit..\nAnyway, you can see all supported subreddits with `/hentai help`")
                            .setColor(color)
                        await interaction.followUp({embeds: [infoEmbed], ephemeral: true});
                    }
                }

            } else { await interaction.reply({content: 'Please go to a channel that is marked as NSFW!', ephemeral: true}); return }
    }
};