const { color } = require('../../data/config.json');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('deletes a specified amount of messages in a channel')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('define amount of messages to delete')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDMPermission(false),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.editReply({ content: "I'm sorry, but I'm missing permission to do that!" });
            return;
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.editReply({ content: "I'm sorry, but you're not allowed to do that!" });
            return;
        }

        const amount = interaction.options.getInteger('amount');
        const messages = await interaction.channel.messages.fetch({ limit: amount });
        if (messages.find(msg => Date.now() - msg.createdAt >= 1000 * 60 * 60 * 24 * 14)) {
            await interaction.editReply({ content: "I'm sorry, but I can't delete messages which are older than 14 days!" });
            return;
        }

        await interaction.channel.bulkDelete(messages);
        const embed = new EmbedBuilder()
            .setTitle(`Deleted ${messages.size} messages! 🧹`)
            .setColor(color)
            .setThumbnail("https://eckigerluca.com/darling/media/cleaning.gif");
        await interaction.editReply({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 6000));
    },
};
