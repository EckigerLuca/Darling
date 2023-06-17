/* eslint-disable no-lonely-if */
/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const REDDIT_ENABLED_HENTAI_SUBREDDITS = [
    "ahegao",
    "AmberHentai",
    "AnalHentai",
    "animearmpits",
    "animeassholes",
    "animebodysuits",
    "AnimeBooty",
    "AnimeFeets",
    "AnimeFootFetish",
    "animehandjobs",
    "AnimeHeelsAndBoots",
    "AnimeHighHeels",
    "animelegs",
    "animelegwear",
    "AnimeLingerie",
    "animemaids",
    "animemidriff",
    "AnimeMILFS",
    "animepantsu",
    "AnimePantyhose",
    "animepointyears",
    "AnimePussy",
    "AnimeSeeThrough",
    "animeshirtgaps",
    "AnimeStockings",
    "AnimeTitties",
    "AraAra",
    "Artistic_Hentai",
    "AshiToFutomomo",
    "AsunaHentai",
    "Atago",
    "AverageAnimeTiddies",
    "AyakaHentai",
    "AzurLaneXXX",
    "AzurLewd",
    "bakunyuu",
    "BarbaraNSFW",
    "BeachHentai",
    "BeidouNSFW",
    "BigAnimeTiddies",
    "BikiniMoe",
    "BimboHentai",
    "BlondeHairWaifu",
    "bluehairhentai",
    "bunnygirlhentai",
    "CedehsHentai",
    "ChurchofBooty",
    "ChurchOfRikka",
    "ConfidentHentai",
    "CultureImpact",
    "CumHentai",
    "cute_hentai",
    "DarlingInTheFranXXX",
    "deepthroathentai",
    "dekaihentai",
    "DoA_Rule34",
    "ecchi",
    "Elegant34",
    "ElfHentai",
    "EmbarrassedHentai",
    "EmiliaHentai",
    "EulaNSFW",
    "FateEcchi",
    "FateHentai",
    "Fateishtar",
    "FateXXX",
    "FGOcomics",
    "Fire_Emblem_R34",
    "Formidable_AZ",
    "FreeuseHentai",
    "funpiece",
    "GanyuNSFW",
    "GenshinImpactHentai",
    "GenshinImpactNSFW",
    "GenshinLewds",
    "glasshentai",
    "GloryHo",
    "grailwhores",
    "HardcoreHentaiBondage",
    "HelplessHentai",
    "Hen_Tai",
    "hentai",
    "hentai411",
    "Hentai_feet",
    "HentaiAnal",
    "HentaiAnaru",
    "HentaiBlessing",
    "hentaibondage",
    "HentaiBreeding",
    "Hentaibuttplug",
    "HentaiCameltoe",
    "hentaifemdom",
    "hentaigg",
    "Hentaiofthedead",
    "HentaiPetgirls",
    "HentaiPixxx",
    "HentaiSchoolGirls",
    "HentaiVTuberGirls",
    "hentaiwaifus69",
    "HentaiWorldInfo",
    "highschooldxdr34",
    "Hololewd",
    "HonkaiImpactRule34",
    "HuTaoNSFW",
    "ishtarhentai",
    "IWantToBeHerHentai",
    "Jeanne",
    "Joshi_Kosei",
    "kemonomimi",
    "KeqingNSFW",
    "KeyholeHentai",
    "Lewd_Not_Hentai",
    "LewdAnimeGirls",
    "LewdGenshinImpact",
    "LingerieHentai",
    "lowlegsheaven",
    "MaidHentai",
    "MamaRaikou",
    "MasturbationHentai",
    "MidriffHentai",
    "MikuNakanoNSFW",
    "milfhentai",
    "Mona_NSFW",
    "MonaNSFW",
    "MonsterGirl",
    "muchihentai",
    "nakanoitsuki",
    "Naruto_Hentai",
    "Nekomimi",
    "NinoNakanoNSFW",
    "NintendoWaifus",
    "NoneHumanMoe",
    "nsfw_zhentai",
    "NurseHentai",
    "officelady",
    "OfficialSenpaiHeat",
    "OniMaidTwins",
    "oppai_gif",
    "OppaiLove",
    "OriginalMoe",
    "overflowingoppai",
    "OverOppai",
    "oversizedbreasts",
    "Paizuri",
    "pantsu",
    "PublicHentai",
    "QuintupletsHentai",
    "RaidenMeiNSFW",
    "RaidenNSFW",
    "rape_hentai",
    "ReZeroHentai",
    "rippedanimelegwear",
    "RosariaNSFW",
    "rule34",
    "Rule34cumsluts",
    "rule34feet",
    "Rule34LoL",
    "RWBYNSFW",
    "Saber",
    "saohentai",
    "serafuku2D",
    "sex_comics",
    "SFMCompileClub",
    "SoakedHentai",
    "StuckHentai",
    "Sukebei",
    "Sweatymoe",
    "swimsuithentai",
    "Taihou",
    "Tentai",
    "ThiccElves",
    "thick_hentai",
    "thighdeology",
    "thighhighhentai",
    "tohsakahentai",
    "ToplessHentai",
    "uncensoredhentai",
    "Uniform_Hentai",
    "UpskirtHentai",
    "VaginaHentai",
    "VideoGame_Hentai",
    "VshojoLewds",
    "waifusgonewild",
    "WaifusOnCouch",
    "Waifutights",
    "WesternHentai",
    "XrayHentai",
    "YaeMikoNSFW",
    "ZeroTwoHentai",
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hentai')
        .setDescription('returns random hentai from reddit')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Put in `help` or the name of a subreddit here that is in the list')
                .setRequired(false))
		.setDMPermission(false),

        async execute(interaction) {
            let row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('hentai1')
                        .setEmoji('1️⃣')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('hentai2')
                        .setEmoji('2️⃣')
                        .setStyle(ButtonStyle.Primary),
                );
            if (interaction.channel.nsfw) {

                const input = interaction.options.getString('input');
                let subreddit = '';
                let notfound;

                if (input == 'help') {
                    const helpEmbed1 = new EmbedBuilder()
                        .setTitle('List of subreddits | Page 1')
                        .setColor(color)
                        .addFields(
                            { name: "» 1-25 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(0, 25).join('\n'), inline: true },
                            { name: '» 26-50 «', value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(25, 50).join('\n'), inline: true },
                            { name: "» 51-75 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(50, 75).join("\n"), inline: true },
                            { name: "» 76-100 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(75, 100).join('\n'), inline: true },
                            { name: "» 101-125 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(100, 125).join('\n'), inline: true },
                            { name: "» 126-150 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(125, 150).join('\n'), inline: true },
                        )
                        .setFooter({ text: "Large and lower case is not important, just make sure to spell them correctly!" });
                    const helpEmbed2 = new EmbedBuilder()
                            .setTitle('List of subreddits | Page 2')
                            .setColor(color)
                            .addFields(
                                { name: "» 151-175 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(150, 175).join('\n'), inline: true },
                                { name: "» 176-189 «", value: REDDIT_ENABLED_HENTAI_SUBREDDITS.slice(175, 189).join("\n"), inline: true },
                            )
                            .setFooter({ text: "Large and lower case is not important, just make sure to spell them correctly!" });
                    await interaction.reply({ embeds: [helpEmbed1], components: [row] });
                    interaction.client.on('interactionCreate', newInteraction => {
                        if (!newInteraction.isButton()) return;
						if (newInteraction.user.id != interaction.member.user.id) return;
						if (!newInteraction.customId.startsWith('hentai')) return;
                        switch (newInteraction.customId) {
                            case "hentai1": {
                                return newInteraction.update({ embeds: [helpEmbed1], components: [row] });
                            }
                            case "hentai2": {
                                return newInteraction.update({ embeds: [helpEmbed2], components: [row] });
                            }
                        }
                    });

                    await sleep(60000);
                    row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('hentai1')
                                .setEmoji('1️⃣')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('hentai2')
                                .setEmoji('2️⃣')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                        );
                    await interaction.editReply({ components: [row] });

                    return;
                }
                else {
                    if (input == null) {
                        notfound = false;
                        subreddit = REDDIT_ENABLED_HENTAI_SUBREDDITS[Math.floor(Math.random() * REDDIT_ENABLED_HENTAI_SUBREDDITS.length)];
                    }
                    else if (REDDIT_ENABLED_HENTAI_SUBREDDITS.map(list => list.toLowerCase()).includes(input.toLowerCase()) == false) {
                        notfound = true;
                        subreddit = REDDIT_ENABLED_HENTAI_SUBREDDITS[Math.floor(Math.random() * REDDIT_ENABLED_HENTAI_SUBREDDITS.length)];
                    }
                    else if (REDDIT_ENABLED_HENTAI_SUBREDDITS.map(list => list.toLowerCase()).includes(input.toLowerCase()) == true) {
                        notfound = false;
                        subreddit = input;
                    }
                    else {
                        await interaction.reply({ content: "I dont know what, but something bad happened here. Try again and if it's still not working create an issue on GitHub:\nhttps://eckigerluca.com/darling/github", ephemeral: true });
                    }
                }

                interaction.commandData = {
                    name: interaction.commandName,
                    options: [interaction.options],
                    other: [{
                        subreddit: subreddit,
                    }],
                };

                async function getHentai() {
                    const response = await fetch(`https://reddit.com/r/${subreddit}/random.json`);
                    const data = await response.json();

                    const permalink = data[0].data.children[0].data.permalink;
                    const subredditName = data[0].data.children[0].data.subreddit_name_prefixed;
                    const hentaiUrl = `https://reddit.com${permalink}`;
                    let hentaiImg = data[0].data.children[0].data.url;
                    const hentaiTitle = data[0].data.children[0].data.title;
                    const hentaiUpvotes = data[0].data.children[0].data.ups;
                    const hentaiDownvotes = data[0].data.children[0].data.downs;
                    const hentaiNumComents = data[0].data.children[0].data.num_comments;
                    const hentaiSubredditUrl = `https://reddit.com/r/${data[0].data.children[0].data.subreddit}`;
                    const isVideo = data[0].data.children[0].data.is_video;

                    if (data[0].data.children[0].data.is_gallery == true) {
                        const ImgCode = data[0].data.children[0].data.gallery_data.items[0].media_id;
                        let ImgType;
                        if (data[0].data.children[0].data.media_metadata[ImgCode].m == "image/jpg") {
                            ImgType = "jpg";
                        }
                        else if (data[0].data.children[0].data.media_metadata[ImgCode].m == "image/png") {
                            ImgType = "png";
                        }
                        hentaiImg = `https://i.redd.it/${ImgCode}.${ImgType}`;
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
                        'video': isVideo,
                    };
                    return hentaiData;
                }
                let hentaiDataJson;
                do {
                    hentaiDataJson = await getHentai(subreddit);
                } while (hentaiDataJson.video == true);

                if (hentaiDataJson.imgUrl.includes('redgif')) {
                    await interaction.reply({ content: `This looks like a bit more!\n**From:** ${hentaiDataJson.subredditUrl}\n**Post:** ${hentaiDataJson.postUrl}\n**Submission:** ${hentaiDataJson.imgUrl}` });
                }
                else {

                    const embed = new EmbedBuilder()
                        .setColor(color)
                        .setTitle(hentaiDataJson.title)
                        .setDescription(`From [${hentaiDataJson.subredditName}](${hentaiDataJson.subredditUrl})`)
                        .setURL(hentaiDataJson.postUrl)
                        .setImage(hentaiDataJson.imgUrl)
                        .setFooter({ text: `👍 ${hentaiDataJson.upvotes} 👎 ${hentaiDataJson.downvotes} 💬 ${hentaiDataJson.comments}` });

                    await interaction.reply({ embeds: [embed] });
                    if (notfound == true) {
                        const infoEmbed = new EmbedBuilder()
                            .setTitle('404 Not Found')
                            .setDescription("Seems like, that you've tried to get something from a subreddit that is not in the list!\nThat's why I decided to throw random shit..\nAnyway, you can see all supported subreddits with `/hentai help`")
                            .setColor(color);
                        await interaction.followUp({ embeds: [infoEmbed], ephemeral: true });
                    }
                }
            }
            else { await interaction.reply({ content: 'Please go to a channel that is marked as NSFW!', ephemeral: true }); return; }
    },
};
