import random
import aiohttp
from discord.ext import commands
import discord
import praw

from settings import REDDIT_APP_ID, REDDIT_APP_SECRET, REDDIT_ENABLED_HENTAI_SUBREDDITS

class hentai(commands.Cog):
    def __init__(self, client):
        self.client = client
        self.reddit = None
        if REDDIT_APP_ID and REDDIT_APP_SECRET:
            self.reddit = praw.Reddit(client_id=REDDIT_APP_ID, client_secret=REDDIT_APP_SECRET, user_agent="YOUR BOT NAME HERE:%s:1.0" % REDDIT_APP_ID)

    @commands.command(brief="Some wholesome Hentai!  (Use '.hentai help' to see all subreddits)")
    async def hentai(self, ctx, subreddit: str= ""):
        async with ctx.channel.typing():
            if self.reddit:
                #start working
                nsfw_flag = True
                subreddit_to_pick = random.randint(1,61)
                chosen_subreddit = REDDIT_ENABLED_HENTAI_SUBREDDITS[subreddit_to_pick]
                if subreddit:
                    #should take default one
                    if subreddit in REDDIT_ENABLED_HENTAI_SUBREDDITS:
                        chosen_subreddit = subreddit
                    elif subreddit in REDDIT_ENABLED_HENTAI_SUBREDDITS:
                        chosen_subreddit = subreddit
                        nsfw_flag = True

                    else:
                        embed = discord.Embed(
                            title="Help to .hentai",
                            description="Use the following after **.hentai** to get an imagin from an other subreddit",
                            color=discord.Colour.from_rgb(239, 164, 176)
                        )
                        embed.set_footer(text="Please make sure to copy the name correctly or otherwise it won't work")
                        #embed.set_author(name='EckigerLuca', icon_url='https://cdn.discordapp.com/avatars/173374602389618688/08cbbbec8089309147ab4d7314ff1076.png?size=1024')
                        embed.add_field(name='Subreddits', value="\n• ".join(REDDIT_ENABLED_HENTAI_SUBREDDITS), inline=True)
                        await ctx.send(embed=embed)
                        #await ctx.send("Please choose a subreddit of the following list: %s" % ", ".join(REDDIT_ENABLED_HENTAI_SUBREDDITS))
                        return
                
                if nsfw_flag:
                    if not ctx.channel.is_nsfw():
                        await ctx.send("Please go to a NSFW channel.")
                        return

                submissions = self.reddit.subreddit(chosen_subreddit).hot()
                post_to_pick = random.randint(1,10)
                for i in range(0, post_to_pick):
                    submission = next(x for x in submissions if not x.stickied)
                if "https://i.redd.it" in submission.url:
                    embed = discord.Embed(
                        title="Some wholesome Hentai!",
                        description=f"[Link if you don't see the image]({submission.url})\nFrom: [{chosen_subreddit}](https://www.reddit.com/r/{chosen_subreddit})",
                        color=discord.Colour.from_rgb(239, 164, 176)
                    )
                    embed.set_image(url=submission.url)
                    embed.set_footer(text="Pro tip: type .hentai help to see all subreddits!")
                    await ctx.send(embed=embed)
                elif "https://i.imgur.com" in submission.url:
                    embed = discord.Embed(
                        title="Some wholesome Hentai!",
                        description=f"[Link if you don't see the image]({submission.url})\nFrom: [{chosen_subreddit}](https://www.reddit.com/r/{chosen_subreddit})",
                        color=discord.Colour.from_rgb(239, 164, 176)
                    )
                    embed.set_image(url=submission.url)
                    embed.set_footer(text="Pro tip: type .hentai help to see all subreddits!")
                    await ctx.send(embed=embed)
                elif "https://imgur.com" in submission.url:
                    embed = discord.Embed(
                        title="Some wholesome Hentai!",
                        description=f"[Link if you don't see the image]({submission.url})\nFrom: [{chosen_subreddit}](https://www.reddit.com/r/{chosen_subreddit})",
                        color=discord.Colour.from_rgb(239, 164, 176)
                    )
                    embed.set_image(url=submission.url)
                    embed.set_footer(text="Pro tip: type .hentai help to see all subreddits!")

                else:
                    if "https://www.youtube.com" in submission.url:
                        await ctx.send("Sorry, but this does not look like Hentai! Try again ;)")
                    else:
                        await ctx.send(f"Some wholesome Hentai!\n{submission.url}\nFrom: **r/{chosen_subreddit}**")

            else:
                await ctx.send("This is not working. Contact Administrator.")


def setup(client):
    client.add_cog(hentai(client))