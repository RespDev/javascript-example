const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('Stops the bot.'),
	async execute(interaction) {
		if (interaction.user.id === '950091757952057385') {
			// Shutdown Embed
            const embed = new EmbedBuilder()
                .setTitle('Bot Shutdown')
                .setColor(0xFF0000) // Red color for the shutdown action
                .addFields(
                    { name: 'Shutdown by', value: interaction.user.tag }
                )
                .setTimestamp();

            const logsChannel = interaction.guild.channels.cache.get('1305680195138617435'); // BimBlx bot logs channel.
            if (logsChannel) {
                logsChannel.send({ embeds: [embed] });
            } else {
                console.error(`Logs channel not found: ${logsChannelId}`);
            }

            await interaction.reply({ content: 'Shutting down the discord bot.', ephemeral: true})
            process.exit();
		}
		interaction.reply({ content: 'You do not have permission to execute this command!', ephemeral: true });
	},
};