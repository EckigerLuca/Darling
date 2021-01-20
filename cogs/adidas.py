import discord
from discord.ext import commands


class adidas(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command()
    async def adidas(self, ctx):
        await ctx.send("Adidas.mp4\nhttps://cdn.discordapp.com/attachments/743161085246570638/785943266544713738/Adidas.mp4")


def setup(client):
    client.add_cog(adidas(client))
