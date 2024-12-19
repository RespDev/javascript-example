const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'general',
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('Sends you the link to the BimBlox game.'),
	async execute(interaction) {
		await interaction.reply({ content: "The link to the BimBlox game is: https://www.roblox.com/games/12784774328/NEW-MEAT-CORNER-BimBlox-Supermarket", ephemeral: true });
		return;
	},
};