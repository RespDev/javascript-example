const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('maintenance')
		.setDescription('Sends a maintenance notification.'),
	async execute(interaction) {
		// Check if the user has permission
		if (interaction.user.id === '950091757952057385') {
			// Create the embed with the input text as the description
			const embed = new EmbedBuilder()
				.setTitle('**BimBlox Maintenance Announcement**')
				.setColor(0xFF0000) // Red color
                .setDescription(`
                    Hello, Directors! :wave:

                    The <@1305643081428631703> bot will be entering a period of maintenance within the next 5 minutes. During this period of maintenance the activity system, cafe whitelist commands, shift commands, and all moderation commands will be unavalible.

                    We are sorry for this interruption on your experience. This maintenance is **OVERNIGHT** and their is **NO ETA** on when the bot will be back online. If you need to get someone bakery whitelisted please DM a developer during this maintenance time.

                    This maintenance may add some new features or the bot may act the same and have no new features.

                    :warning: Their is a chance that the bot comes online during the period of maintenance but it has a massive chance of not working or randomly going offline again. :warning:
                `)
                .setFooter({ text: "Regards, Development Team" })
				.setTimestamp();

			const directorNewsChannel = interaction.guild.channels.cache.get('1181271455091142717'); // BimBlx Director-News channel
			if (directorNewsChannel) {
				directorNewsChannel.send({ embeds: [embed] });
			} else {
				console.error(`Logs channel not found: ${directorNewsChannel.id}`);
			}

			await interaction.reply({ content: 'Sending the maintenance notification.', ephemeral: true });
		} else {
			await interaction.reply({ content: 'You do not have permission to execute this command!', ephemeral: true });
		}
	},
};
