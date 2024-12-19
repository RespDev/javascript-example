const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Displays the ping of the BimBlox Bot.'),
	async execute(interaction) {
		await interaction.reply({ content: `:ping_pong: Pong! Bot latency is ${interaction.client.ws.ping}ms`, ephemeral: true });
		return;
	},
};