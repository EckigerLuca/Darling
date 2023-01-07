const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { website } = require('../../website/settings.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Welcome Function Commands")
        .addSubcommand(subcommand =>
            subcommand
                .setName("setup")
                .setDescription("Set up the welcome function for your server"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("enable")
                .setDescription("Enable the welcome function on your server"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("disable")
                .setDescription("Disable the welcome function on your server"))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),

    async execute(interaction) {
        const dbClient = interaction.client.dbClient;
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) { return await interaction.editReply({ content: "You're not allowed to do that!", ephemeral: true }); }
        const subcommand = await interaction.options.getSubcommand();
        switch (subcommand) {
            case "setup": {
                const embed = new EmbedBuilder()
                    .setTitle("Welcome Setup")
                    .setDescription(`Set up the welcome function via the dashboard [here](${website.domain}/dashboard/${interaction.guild.id}/welcome).`)
                    .setColor(color);
                await interaction.editReply({ embeds: [embed] });
                break;
            }
            case "enable": {
                const db = dbClient.db("darling");
                const welcomeCollection = db.collection("welcome");
                const guildId = interaction.guild.id;
                const filter = {
                    _id: guildId,
                };
                const checkResult = await welcomeCollection.findOne(filter);
                if (checkResult == null) {return await interaction.editReply({ content: "Your server is not existing in the database. Use `/welcome setup` to set up the welcome function.", ephemeral: true });}
                const updateDocument = {
                    $set: {
                        "enabled": true,
                    },
                };
                await welcomeCollection.updateOne(filter, updateDocument);
                await interaction.editReply({ content: "Successfully enabled the welcome function on your server!", ephemeral: true });
                break;
            }
            case "disable": {
                const db = dbClient.db("darling");
                const welcomeCollection = db.collection("welcome");
                const guildId = interaction.guild.id;
                const filter = {
                    _id: guildId,
                };
                const checkResult = await welcomeCollection.findOne(filter);
                if (checkResult == null) {return await interaction.editReply({ content: "Your server is not existing in the database. Use `/welcome setup` to set up the welcome function.", ephemeral: true });}
                const updateDocument = {
                    $set: {
                        "enabled": false,
                    },
                };
                await welcomeCollection.updateOne(filter, updateDocument);
                await interaction.editReply({ content: "Successfully disabled the welcome function on your server!", ephemeral: true });
                break;
            }
        }
    },
};