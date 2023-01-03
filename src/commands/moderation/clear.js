const { color } = require('../../data/config.json');
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('deletes a specified amount of messages in a channel')
        .addNumberOption(option => option.setName('amount').setDescription('define amount of messages to delete').setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

        async execute(interaction) {
            await interaction.deferReply({ ephemeral: true });
            let amount = interaction.options.getNumber('amount');
            if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                if (amount > 0) {
                    if (amount > 100) {
                        amount = 100;
                    }
                    const messages = await interaction.channel.messages.fetch({ limit: amount });
                    await interaction.channel.bulkDelete(messages);
                    const embed = new EmbedBuilder()
                        .setTitle(`Deleted ${messages.size} messages! 🧹`)
                        .setColor(color)
                        .setThumbnail("https://eckigerluca.com/darling/media/cleaning.gif");
                    await interaction.editReply({ embeds: [embed], ephemeral: true });
                    await new Promise(resolve => setTimeout(resolve, 6000));
                    return;
                }
                else {
                    await interaction.editReply({ content: "Please define a number that is bigger than 0. Max. = 100", ephemeral: true });
                    return;
                }
            }
            else {
                await interaction.editReply({ content: "I'm sorry, but you're not allowed to do that!", ephemeral: true });
                return;
            }
    },
};