import os
import json
from typing import Text
from attr import __description__, __title__
import discord
import random
import asyncio
import time
from discord import activity
from discord import user
from discord import channel
from discord import message
from discord.client import Client
from discord.ext import commands
from discord.ext.commands.core import has_permissions
from settings import *
import logging

logging.basicConfig(level=logging.INFO)

global defaultcolor
defaultcolor = discord.Colour.from_rgb(239, 164, 176)


#prefix
def get_prefix(client, message):
    with open('prefixes.json', 'r') as f:
        prefixes = json.load(f)

    return prefixes[str(message.guild.id)]

client = commands.Bot(command_prefix=get_prefix)

@client.event
async def on_guild_join(guild):
    with open('prefixes.json', 'r') as f:
        prefixes = json.load(f)

    prefixes[str(guild.id)] = '.'

    with open('prefixes.json', 'w') as f:
        json.dump(prefixes, f, indent=4)


    for channel in guild.text_channels:
        if channel.permissions_for(guild.me).send_messages:
            embed = discord.Embed(
                title = 'Hello!',
                description = 'Thank you for adding me onto your Server!\nVisit **.help** to see all commands!\nHave fun using me!\n[Image source](https://www.anime-planet.com/users/rachell29)',
                color = discord.Colour.from_rgb(239, 164, 176)
            )
            embed.set_footer(text="Bot by EckigerLuca#0001")
            embed.set_image(url="https://uploads.disquscdn.com/images/81f2257d8a2cba4fd000b3a5f6a090f724d0fd6a9324bcd51687ee666df685b5.gif")
            await channel.send(embed=embed)
        break

@client.event
async def on_guild_remove(guild):
    with open('prefixes.json', 'r') as f:
        prefixes = json.load(f)

    prefixes.pop(str(guild.id))

    with open('prefixes.json', 'w') as f:
        json.dump(prefixes, f, indent=4)

@client.command()
@commands.has_permissions(administrator=True)
async def newprefix(ctx, prefix):
        with open('prefixes.json', 'r') as f:
            prefixes = json.load(f)

        prefixes[str(ctx.guild.id)] = prefix

        with open('prefixes.json', 'w') as f:
            json.dump(prefixes, f, indent=4)
        
        embed=discord.Embed(
        title="New prefix",
        description=f'Your prefix changed to:\n**{prefix}**',
        color=discord.Colour.from_rgb(239, 164, 176)
        )
        await ctx.send(embed=embed)


#remove old help command
client.remove_command('help')

#bot game playing message
@client.event
async def ch_pr():
    await client.wait_until_ready()

    statuses = [f"on {len(client.guilds)} servers | .help","Hello World!",".help"]
    while not client.is_closed():
        status = random.choice(statuses)
        await client.change_presence(status=discord.Status.online, activity=discord.Game(name=status))
        await asyncio.sleep(10)


@client.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.MissingRequiredArgument):
        await ctx.send('Please pass in all required arguments.')
    if isinstance(error, commands.MissingPermissions):
        await ctx.send("Sorry, but you're not allowed to do that!")
    if isinstance(error, commands.CommandNotFound):
        await ctx.send("Couldn't find the command you were looking for. Use **.help** to see all commands.")

#clear command
@client.command()
@commands.has_permissions(manage_messages=True)
async def clear(ctx, amount : int):
    await ctx.channel.purge(limit=amount+1)
    embed=discord.Embed(
        title="Deleted the messages!",
        color = discord.Colour.from_rgb(239, 164, 176)
    )
    await ctx.send(embed=embed)
    time.sleep(5)
    await ctx.channel.purge(limit=1)

#bot is ready
@client.event
async def on_ready():
    print("\nI'm ready!11!!!!1!\n")

for filename in os.listdir("./cogs"):
    if filename.endswith(".py") and filename !="__init__.py":
        client.load_extension(f'cogs.{filename[:-3]}')

for songs in os.listdir():
    if songs.endswith(".webm"):
            os.remove(os.path.join(songs))
            print("Deleted webm files")
    elif songs.endswith(".m4a"):
            os.remove(os.path.join(songs))
            print("Deleted m4a files")
    elif songs.endswith(".ogg"):
            os.remove(os.path.join(songs))
            print("Deleted ogg files")
    elif songs.endswith(".mp3"):
            os.remove(os.path.join(songs))
            print("Deleted mp3 files")
    elif songs.endswith(".wav"):
            os.remove(os.path.join(songs))
            print("Deleted wav files")
client.loop.create_task(ch_pr())
client.run(DISCORD_BOT_TOKEN)