const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed, CommandInteraction } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('only for the god')
        .setDefaultPermission(true),

    async execute(interaction) {
        let application = await interaction.client.application.fetch()
        let eckigerluca = await interaction.client.users.fetch('173374602389618688')
        let eckigerluca_avatar = eckigerluca.displayAvatarURL({size: 1024, format: 'png', dynamic: true})

        let newsEmbed = new MessageEmbed()
            .setTitle('<a:alarm:891426490594492466> UPDATES BITCHES <a:alarm:891426490594492466>')
            .setAuthor('EckigerLuca', eckigerluca_avatar)
            .setDescription('that was kinda cringe pls do not remind me. thank you.')
            .setColor(color)
            .addFields(
                {name: "Guten Tag,", value: "Luca here. After a long time, I can finally publish an update. But this time, it's a bit special. __WHY?__ Well, Slash Commands and no more Python", inline: false},
                {name: "Why tf did it take that long and WHERE IS MUSIC?????", value: "I'm sorry to tell you (actually not Kappa), but since I had to switch to JavaScipt, alot of things have changed. Including the music feature which wasn't finished in the 'old' Bot lol.\nI'm now at the point where every old command is implemented and working fine, even some new ones are there, but still far away from being a finished Bot. The problem with the Music Feature is quite simple, I wanted to use a module called `@koenie06/discord.js-music` but it's not working as I'd like it to do. So, I am currently changing legit EVERYTHING to make it work properly. How long it will take is a question I can't answer you.", inline: false},
                {name: "Slash Commands? Nani tf is that?!", value: "As the name says, they are commands toggled with a slash. Same as in Minecraft. Just put a / in the chat and you should see various options, including the ones from Darling.", inline: false},
                {name: "And what if there are none?", value: "Try re-adding the Bot. Sounds dumb but will fix the problem. But use [this](https://eckigerluca.com/darling/invite) link or it won't work!", inline: false},
                {name: "And how can I see if something has changed?", value: "There are two options for you existing,\n**Option A:** Check [GitHub](https://eckigerluca.com/darling/github)\n__or__\n**Option B**: [Join my Discord Server](https://eckigerluca.com/discord/) (It's currently only in German tho, but that will change soon (I promise).", inline: true},
                {name: "Support?", value:"Very Important. There are several things to do. Here's a list:\n- [GitHub Issues](https://github.com/eckigerluca/darling/issues)\n- DMs `EckigerLuca#0001`\n- E-Mail (contact@eckigerluca.com)\n- [My Server KEKW](https://eckigerluca.com/discord)", inline: false},
                {name: "Last but not least,", value: "THANK YOU!\nWithout you all I wouldn't be at this point here, publishing another update of the bot.\nHuge thankies to EckigerMike, SillySoon, Sniperspyder, Akage, seesmon aka. wcmeister and of course, you!\nThank you for supporting me and my project! You were helping me to let the bot grow, I mean, we're at 31 Server (8.11.2021 22:20), that's quite much for me!", inline: true},
                {name: "And that's it!", value: "Lets just hope I'll finish the music update soon without wasting much time like on this update here.\nAnyway, see you next time!\n\nBleibt Gesund\n~Luca"},
            )
            .setFooter("Ich mag Waschbären\nCurrent Version: Darling 1.2", eckigerluca_avatar)

        let ownerEmbed = new MessageEmbed()
            .setTitle('ELLO!')
            .setAuthor('EckigerLuca', eckigerluca_avatar)
            .setFooter("Ich mag Waschbären\nCurrent Version: Darling 1.2", eckigerluca_avatar)
            .setDescription("Sorry for the DM I guess.\nMy Bot (Darling.) is added on one or multiply of your servers.\nPlease check the System Channel on your Server! There are some important information about my Bot, Darling.")
            .setColor(color)

            if (interaction.user.id == application.owner.id || application.owner.ownerId) {
            await interaction.deferReply({ephemeral: true})
            let guilds = await interaction.client.guilds.fetch()
            try {
                guilds.forEach(guild => {
                    let guildId = guild.id;
                    guild.fetch(guildId).then(server => {
                        let systemChannel = server.systemChannel
                        systemChannel.send({embeds: [newsEmbed]})
                        let ownerId = server.ownerId
                        interaction.client.users.fetch(ownerId).then(owner => {
                            owner.send({embeds: [ownerEmbed]})
                        })
                    })
                })
            } catch {console.log("error but idc")}
            finally {
                await interaction.editReply({content:"Bonkers", ephemeral: true})
            }
        } else { 
            return await interaction.reply({content: 'No u', ephemeral: true}); 
        }
    }
};