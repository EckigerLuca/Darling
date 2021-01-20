import asyncio
import discord
from os import name
from typing import Tuple
from discord import file
from discord.ext import commands
import datetime
import json

from discord.ext.commands.cog import Cog

class Admin(commands.Cog):
    def __init__(self, client):
        self.client = client
   
    @commands.command()
    @commands.has_permissions(administrator=True)
    async def status(self, ctx):
        guild = ctx.guild
        no_voice_channels = len(guild.voice_channels)
        no_text_channels = len(guild.text_channels)
        max_members = guild.member_count
        embed=discord.Embed(
            title='Status of the Server',
            color=discord.Colour.from_rgb(239, 164, 176)
        )
        embed.add_field(name="Server Name:", value=guild.name, inline=False)
        embed.add_field(name="Voice Channels on this Server:", value=no_voice_channels, inline=True)
        embed.add_field(name="Text Channels on this Server:", value=no_text_channels, inline=True)
        embed.add_field(name="AFK Channel:", value=guild.afk_channel, inline=True)
        embed.add_field(name="Members on this Server:", value=max_members, inline = False)
        embed.set_footer(text=datetime.datetime.now())
        await ctx.send(embed=embed)

    @commands.command()
    @commands.has_permissions(kick_members=True)
    @commands.guild_only()
    async def kick(self, ctx, member: discord.Member = None, reason: str = "Because"):
        if member is not None:
            await member.send(f"You got kicked from **{member.guild.name}**!\nReason: {reason}")
            await ctx.guild.kick(member, reason=reason)
            await ctx.send(f"Kicked **{member}**\nReason: {reason}")
        else:
            await ctx.send("Please specify user to kick via mention")

    @commands.command()
    @commands.has_permissions(ban_members=True)
    @commands.guild_only()
    async def ban(self, ctx, member: discord.Member = None, reason: str = "Because"):
        if member is not None:
            await member.send(f"You got banned from **{member.guild.name}**!\nReason: {reason}")
            await ctx.guild.ban(member, reason=reason)
            await ctx.send(f"Banned **{member}**.\nReason: {reason}")
        else:
            await ctx.send("Please specify user to ban via mention")
            
    @commands.command()
    @commands.has_permissions(ban_members=True)
    @commands.guild_only()
    async def unban(self, ctx, member: str = "", reason: str = "Because"):
        if member =="":
            await ctx.send("Please specify username as text")
            return
        bans = await ctx.guild.bans()
        for b in bans:
            if b.user.name == member:
                await ctx.guild.unban(b.user, reason=reason)
                await ctx.send(f"Unbanned **{member}**")
                return
        await ctx.send("User was not found in ban list.")

        

def setup(client):
    client.add_cog(Admin(client))