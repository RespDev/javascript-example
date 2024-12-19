const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: 'general',
	data: new SlashCommandBuilder()
		.setName('advertisement')
		.setDescription('Displays the BimBlox advertisement.'),
	async execute(interaction) {
        // Define advertisement embed.
        const advertisement = new EmbedBuilder()
            .setTitle('**BimBlox Game Advertisement**')
            .setColor(0xFF0000)  // Red color
            .setDescription(`
Comming soon!
            `)
            .setFooter({ text: 'Advertisement subject to change.' })
            .setTimestamp()

		await interaction.reply({ embeds: [advertisement], ephemeral: true });
		return;
	},
};