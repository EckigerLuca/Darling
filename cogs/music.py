import asyncio
from tokenize import Imagnumber, triple_quoted

import os
import traceback
import json
from discord.embeds import Embed
from discord.player import AudioPlayer
from youtube_dl.utils import smuggle_url, update_url_query
from youtube_search import YoutubeSearch

import discord
from discord.ext.commands import bot
import youtube_dl
import wget

from discord.ext import commands
from youtube_dl import YoutubeDL


# Suppress noise about console usage from errors
youtube_dl.utils.bug_reports_message = lambda: ''

ytdl_format_options = {
    'format': 'bestaudio/best',
    'outtmpl': '%(extractor)s-%(id)s-%(title)s.%(ext)s',
    'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0' # bind to ipv4 since ipv6 addresses cause issues sometimes
}

ffmpeg_options = {
    'options': '-vn'
}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)


class YTDLSource(discord.PCMVolumeTransformer):
    def __init__(self, source, *, data: dict, volume=0.5):
        super().__init__(source, volume)

        self.data = data

        self.title = data.get('title')
        self.thumbnail = data.get('thumbnail')
        self.url = data.get('webpage_url')


    @classmethod
    async def from_url(cls, url, *, loop=None, stream=False):
        loop = loop or asyncio.get_event_loop()
        data = await loop.run_in_executor(None, lambda: ytdl.extract_info(url, download=not stream))

        if 'entries' in data:
            # take first item from a playlist
            data = data['entries'][0]

        filename = data['url'] if stream else ytdl.prepare_filename(data)
        return cls(discord.FFmpegPCMAudio(filename, **ffmpeg_options), data=data)


class Music(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def join(self, ctx):
        """Joins a voice channel"""
        
        channel = ctx.message.author.voice.channel

        if ctx.voice_client is not None:
            return await ctx.voice_client.move_to(channel)

        await channel.connect()

    @commands.command()
    async def play(self, ctx, *, url):
        global player
        """Plays from a url (almost anything youtube_dl supports)"""
        async with ctx.typing():
            player = await YTDLSource.from_url(url, loop=self.bot.loop)
            ctx.voice_client.play(player, after=lambda e: print('Player error: %s' % e) if e else None)
        
        if "https://" in url:
            embed = discord.Embed(
                title="Now playing:",
                description = f"[{player.title}]({url})",
                color = discord.Colour.from_rgb(239, 164, 176)
            )
            embed.set_image(url=player.thumbnail)
            await ctx.send(embed=embed)
            
        else:
            embed = discord.Embed(
                title="Now playing",
                description = f"[{player.title}]({player.url})",
                color = discord.Colour.from_rgb(239, 164, 176)
            )
            embed.set_image(url=player.thumbnail)
            await ctx.send(embed=embed)
        
    @commands.command(aliases=['now', 'np'])
    async def nowplaying(self, ctx):
        embed = discord.Embed(
                title="Now playing:",
                description = f"[{player.title}]({player.url})",
                color = discord.Colour.from_rgb(239, 164, 176)
            )
        embed.set_image(url=player.thumbnail)
        await ctx.send(embed=embed)

        

    @commands.command()
    async def volume(self, ctx, volume: int):
        """Changes the player's volume"""

        if ctx.voice_client is None:
            return await ctx.send("Not connected to a voice channel.")

        await ctx.send("Changed volume to {}%".format(volume))
        ctx.voice_client.source.volume = volume / 100

    @commands.command(aliases=['leave','l'])
    async def stop(self, ctx):
        """Stops and disconnects the bot from voice"""

        await ctx.voice_client.disconnect()
    @commands.command()
    async def pause(self, ctx):
        """Pauses the current song"""
        await ctx.send("Paused the current song!")
        await ctx.voice_client.pause()

    @commands.command()
    async def resume(self, ctx):
        """Resumes the current song"""
        await ctx.send("Continued the current song!")
        await ctx.voice_client.resume()

    @play.before_invoke
    async def ensure_voice(self, ctx):
        if ctx.voice_client is None:
            if ctx.author.voice:
                await ctx.author.voice.channel.connect()
            else:
                await ctx.send("You are not connected to a voice channel.")
                raise commands.CommandError("Author not connected to a voice channel.")
        elif ctx.voice_client.is_playing():
            ctx.voice_client.stop()


#bot.add_cog(Music(bot))
def setup(client):
    client.add_cog(Music(client))