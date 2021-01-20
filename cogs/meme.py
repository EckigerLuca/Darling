import random
import aiohttp
from discord.ext import commands
import discord
import praw

from settings import REDDIT_APP_ID, REDDIT_APP_SECRET, REDDIT_ENABLED_MEME_SUBREDDITS


class meme(commands.Cog):
    def __init__(self, client):
        self.client = client
        self.reddit = None
        if REDDIT_APP_ID and REDDIT_APP_SECRET:
            self.reddit = praw.Reddit(client_id=REDDIT_APP_ID, client_secret=REDDIT_APP_SECRET, user_agent="YOUR BOT NAME HERE:%s:1.0" % REDDIT_APP_ID)

    @commands.command(brief="Random anime meme from Reddit")
    async def meme(self, ctx, subreddit: str= ""):
        async with ctx.channel.typing():
            if self.reddit:
                #start working
                subreddit_to_pick = random.randint(1,3)
                chosen_subreddit = REDDIT_ENABLED_MEME_SUBREDDITS[subreddit_to_pick]
                if subreddit:
                    #should take default one
                    if subreddit in REDDIT_ENABLED_MEME_SUBREDDITS:
                        chosen_subreddit = subreddit
                    else:
                        embed = discord.Embed(
                            title="Help to .meme",
                            description="Use the following after **.meme** to get an meme from an other subreddit",
                            color=discord.Colour.from_rgb(239, 164, 176)
                        )
                        embed.set_footer(text="Please make sure to copy the name correctly or otherwise it won't work")
                        #embed.set_author(name='EckigerLuca', icon_url='https://cdn.discordapp.com/avatars/173374602389618688/08cbbbec8089309147ab4d7314ff1076.png?size=1024')
                        embed.add_field(name='Subreddits', value="\n• ".join(REDDIT_ENABLED_MEME_SUBREDDITS), inline=True)
                        await ctx.send(embed=embed)
                        #await ctx.send("Please choose a subreddit of the following list: %s" % ", ".join(REDDIT_ENABLED_HENTAI_SUBREDDITS))
                        return
                        #await ctx.send("Please choose a subreddit of the following list: %s" % ", ".join(REDDIT_ENABLED_MEME_SUBREDDITS))
                        #return

                submissions = self.reddit.subreddit(chosen_subreddit).hot()

                post_to_pick = random.randint(1,10)
                for i in range(0, post_to_pick):
                    submission = next(x for x in submissions if not x.stickied)
                if "https://www.youtube.com" in submission.url:
                    await ctx.send(f"Oh this looks like a funny meme!\nFrom: r/{chosen_subreddit}\n{submission.url}")
                else:
                    embed = discord.Embed(
                        title="A wonderful anime meme",
                        description=f"[Link if can't see the meme]({submission.url})\nFrom: [{chosen_subreddit}](https://www.reddit.com/r/{chosen_subreddit})",
                        color=discord.Colour.from_rgb(239, 164, 176)
                    )
                    embed.set_image(url=submission.url)
                    embed.set_footer(text="Pretty funny, huh?")
                    await ctx.send(embed=embed)

            else:
                await ctx.send("This is not working. Contact Administrator.")

def setup(client):
    client.add_cog(meme(client))