import random
import aiohttp
from discord.ext import commands
import discord
import json
import praw


class Help(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command()
    async def help(self, ctx):
        with open('prefixes.json', 'r') as f:
            prefixes = json.load(f)
            embed = discord.Embed(
                title = 'Help',
                description = "This is the help file.",
                color = discord.Colour.from_rgb(239, 164, 176)
            )
            embed.add_field(name=':cat: Images', value='**.cat** sends a random image of a cat\n**.dog** sends a random image of a dog\n**.fox** sends a random image of a fox', inline=True)
            embed.add_field(name=':rofl: Memes', value='**.meme** sends a random anime meme from Reddit.\nTo see all subreddits, type **.meme help**!\n**.adidas** Adidas.mp4', inline=True)
            embed.add_field(name=':man_detective: Admin', value='**.status** shows some information about the server!\n**.newprefix** will let you change the prefix. **.newprefix [new prefix]** You can see your current prefix with **.prefix**\n**.clear [amount]** deletes messages in a channel.\n**.kick** kicks a user.\n Usage: **.kick @user "reason"**\n**.ban** bans a user.\n Usage: **.ban @user "reason"**\n**.unban** unbans a user. Usage: **.unban username**', inline=True)
            embed.add_field(name=':v: Other', value='**.botinvite** returns the invite link of the Bot!\n**.serverinvite** gives you and instant invite link for your server which works for five minutes.', inline=True)
            embed.add_field(name=':underage: NSFW', value='**.hentai** returns a random hentai image from Reddit.\nUse **.hentai help** to see a list of all subreddits.\nAttention: Only use this in an NSFW channel!', inline =False)
            embed.set_footer(text=f'Bot by EckigerLuca#0001\nCurrent prefix: {prefixes[str(ctx.guild.id)]}', icon_url='https://cdn.discordapp.com/avatars/173374602389618688/a_416cae09cfc3a22cde44b8b30e2bf9e5.gif?size=512')
            await ctx.send(embed=embed)

    @commands.command()
    async def prefix(self, ctx):
        with open('prefixes.json', 'r') as f:
            prefixes = json.load(f)
        embed=discord.Embed(
            title = "Current prefix",
            description = f"Your current prefix is:\n**{prefixes[str(ctx.guild.id)]}**",
            color = discord.Colour.from_rgb(239, 164, 176)
        )
        await ctx.send(embed=embed)


def setup(client):
    client.add_cog(Help(client))