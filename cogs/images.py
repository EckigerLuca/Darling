import random
import aiohttp
from discord.ext import commands
import discord

import praw

from settings import REDDIT_APP_ID, REDDIT_APP_SECRET, REDDIT_ENABLED_MEME_SUBREDDITS


class Images(commands.Cog):
    @commands.command(brief="Random picture of a cat")
    async def cat(self, ctx):
        async with ctx.channel.typing():
            async with aiohttp.ClientSession() as cs:
                async with cs.get("http://aws.random.cat/meow") as r:
                    data = await r.json()

                    embed = discord.Embed(
                        title="Meow",
                        description="Look at this cute cat!",
                        color = discord.Colour.from_rgb(239, 164, 176)
                        )
                    embed.set_image(url=data['file'])
                    embed.set_footer(text="http://random.cat")
               
                    await ctx.send(embed=embed)



    @commands.command(brief="Random picture of a dog")
    async def dog(self, ctx):
        async with ctx.channel.typing():
            async with aiohttp.ClientSession() as cs:
                async with cs.get("https://random.dog/woof.json") as r:
                    data = await r.json()

                    embed = discord.Embed(
                        title="Woof",
                        description="Look at this cute dog!",
                        color = discord.Colour.from_rgb(239, 164, 176)
                        )
                    embed.set_image(url=data['url'])
                    embed.set_footer(text="https://random.dog")
               
                    await ctx.send(embed=embed)


    @commands.command(brief="Random picture of a fox")
    async def fox(self, ctx):
        async with ctx.channel.typing():
            async with aiohttp.ClientSession() as cs:
                async with cs.get("https://randomfox.ca/floof/") as r:
                    data = await r.json()

                    embed = discord.Embed(
                        title = "Hey Siri, what noises do a fox make?",
                        description = "Look at this cute fox!",
                        color = discord.Colour.from_rgb(239, 164, 176)
                    )
                    embed.set_image(url=data['image'])
                    embed.set_footer(text="https://randomfox.ca")
               
                    await ctx.send(embed=embed)



def setup(client):
    client.add_cog(Images(client))