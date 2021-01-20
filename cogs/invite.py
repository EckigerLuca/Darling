import discord
from discord.ext import commands


class invite(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command()
    async def botinvite(self, ctx):
            embed = discord.Embed(
                title="Invite link",
                color = discord.Colour.from_rgb(239, 164, 176)
            )
            embed.add_field(name='Currently not available!', value='Sorry..')
            #embed.add_field(name="Use the link to invite the bot to your server!", value='*[Invite](https://discord.com/api/oauth2/authorize?client_id=743150068726628440&permissions=8&scope=bot/ "Do not worry, this is just an invitation!")*')
            #embed.set_footer(text="I would be glad, if you'd add my bot to your server :>")
            await ctx.send(embed=embed)
    
    @commands.command()
    async def serverinvite(self, ctx):
        link = await ctx.channel.create_invite(max_age = 300)
        await ctx.send(f"Here is your link: {link}\nNote: This link just works for 5 minutes!")
def setup(client):
    client.add_cog(invite(client))