const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const REDDIT_ENABLED_MEME_SUBREDDITS = [
    'AdviceAnimals',
    'Animemes',
    'animememes',
    'ComedyCemetery',
    'dankmemes',
    'funny',
    'me_irl',
    'MemeEconomy',
    'memes',
    'PrequelMemes',
    'terriblefacebookmemes',
    'teenagers',
    'wholesomememes',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('returns a random meme from reddit!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Put in `help` or the name of a subreddit here that is in the list')
                .setRequired(false)),

        async execute(interaction) {
            const embed = new MessageEmbed()
                .setColor(color);

            const input = interaction.options.getString('input');

            if (input == 'help') {
                embed.setTitle('List of subreddits')
                    .addField('»» 1-13 ««', REDDIT_ENABLED_MEME_SUBREDDITS.join('\n'))
                    .setFooter({ text: 'Page 1/1' });
                await interaction.reply({ embeds: [embed] });
                return;

            }
            else if (input !== null) {
                if (REDDIT_ENABLED_MEME_SUBREDDITS.map(list => list.toLowerCase()).indexOf(input.toLowerCase()) === -1) {
                    const subreddit = REDDIT_ENABLED_MEME_SUBREDDITS[Math.floor(Math.random() * REDDIT_ENABLED_MEME_SUBREDDITS.length)];
                    const response = await fetch(`https://reddit.com/r/${subreddit}/random.json`);
                    const data = await response.json();

                    const permalink = data[0].data.children[0].data.permalink;
                    const memeUrl = `https://reddit.com${permalink}`;
                    const memeImg = data[0].data.children[0].data.url;
                    const memeTitle = data[0].data.children[0].data.title;
                    const memeUpvotes = data[0].data.children[0].data.ups;
                    const memeDownvotes = data[0].data.children[0].data.downs;
                    const memeNumComents = data[0].data.children[0].data.num_comments;
                    const subredditUrl = `https://reddit.com/r/${data[0].data.children[0].data.subreddit}`;

                    embed.setTitle(memeTitle)
                        .setDescription(`From [r/${subreddit}](${subredditUrl})`)
                        .setURL(memeUrl)
                        .setImage(memeImg)
                        .setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComents}` });

                    const infoEmbed = new MessageEmbed()
                        .setTitle('404 Not Found')
                        .setDescription("Seems like, that you've tried to get something from a subreddit that is not in the list!\nThat's why I decided to throw random shit..\nAnyway, you can see all supported subreddits with `/meme help`")
                        .setColor(color);

                    await interaction.reply({ embeds: [embed] });
                    await interaction.followUp({ embeds: [infoEmbed], ephemeral: true });
                    return;

                }
                else if (REDDIT_ENABLED_MEME_SUBREDDITS.map(list => list.toLowerCase()).includes(input.toLowerCase())) {
                    const subreddit = input;
                    const response = await fetch(`https://reddit.com/r/${input}/random.json`);
                    const data = await response.json();

                    const permalink = data[0].data.children[0].data.permalink;
                    const memeUrl = `https://reddit.com${permalink}`;
                    const memeImg = data[0].data.children[0].data.url;
                    const memeTitle = data[0].data.children[0].data.title;
                    const memeUpvotes = data[0].data.children[0].data.ups;
                    const memeDownvotes = data[0].data.children[0].data.downs;
                    const memeNumComents = data[0].data.children[0].data.num_comments;
                    const subredditUrl = `https://reddit.com/r/${data[0].data.children[0].data.subreddit}`;

                    embed.setTitle(memeTitle)
                        .setDescription(`From [r/${subreddit}](${subredditUrl})`)
                        .setURL(memeUrl)
                        .setImage(memeImg)
                        .setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComents}` });

                    await interaction.reply({ embeds: [embed] });
                    return;
                }

            }
            else {
                const subreddit = REDDIT_ENABLED_MEME_SUBREDDITS[Math.floor(Math.random() * REDDIT_ENABLED_MEME_SUBREDDITS.length)];
                const response = await fetch(`https://reddit.com/r/${subreddit}/random.json`);
                const data = await response.json();

                const permalink = data[0].data.children[0].data.permalink;
                const memeUrl = `https://reddit.com${permalink}`;
                const memeImg = data[0].data.children[0].data.url;
                const memeTitle = data[0].data.children[0].data.title;
                const memeUpvotes = data[0].data.children[0].data.ups;
                const memeDownvotes = data[0].data.children[0].data.downs;
                const memeNumComents = data[0].data.children[0].data.num_comments;
                const subredditUrl = `https://reddit.com/r/${data[0].data.children[0].data.subreddit}`;

                embed.setTitle(memeTitle)
                    .setDescription(`From [r/${subreddit}](${subredditUrl})`)
                    .setURL(memeUrl)
                    .setImage(memeImg)
                    .setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComents}` });

                await interaction.reply({ embeds: [embed] });
                return;
            }
    },
};