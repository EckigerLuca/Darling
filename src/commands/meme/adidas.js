const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adidas')
        .setDescription('adidas.mp4')
		.setDMPermission(false),

        async execute(interaction) {
            const adidas = 'https://cdn.discordapp.com/attachments/743161085246570638/785943266544713738/Adidas.mp4';
            await interaction.reply(`**Adidas.mp4**\n${adidas}`);
    },
};