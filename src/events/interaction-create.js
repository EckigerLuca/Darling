const logger = require("silly-logger");

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        if (!interaction.guild) return await interaction.reply({ content: "No.", ephemeral: true });

        if (interaction.commandData == undefined) {
            interaction.commandData = {
                name: interaction.commandName,
                options: [interaction.options],
            };
        }

        try {
            await command.execute(interaction);
        }
        catch (error) {
            logger.error(error);
			try {
				try {
					await interaction.reply({ content: `There was an error while executing this command!\nJoin the Support Server and send us the error message:\n \`\`\`js\n ${JSON.stringify(interaction.commandData, null, 4)} \`\`\` \`\`\`js\n${error}\`\`\` \n https://discord.com/invite/tpUr7d3 `, embeds: [], ephemeral: true });
				}
				catch {
					await interaction.editReply({ content: `There was an error while executing this command!\nJoin the Support Server and send us the error message:\n \`\`\`js\n ${JSON.stringify(interaction.commandData, null, 4)} \`\`\` \`\`\`js\n${error}\`\`\` \n https://discord.com/invite/tpUr7d3 `, embeds: [], ephemeral: true });
				}
			}
			// eslint-disable-next-line no-inline-comments
			catch (err) {
				logger.error(err);
				try {
					await interaction.reply({ content: `There was an error while executing this command, but there was another error sending the error message!\n Please contact us and include the following information: \`command name, options, time of execution\` \n https://discord.com/invite/tpUr7d3 `, embeds: [], ephemeral: true });
				}
				catch {
					await interaction.editReply({ content: `There was an error while executing this command, but there was another error sending the error message!\n Please contact us and include the following information: \`command name, options, time of execution\` \n https://discord.com/invite/tpUr7d3 `, embeds: [], ephemeral: true });
				}
			}
        }
	},
};
