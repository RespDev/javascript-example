const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'general',
	data: new SlashCommandBuilder()
		.setName('group')
		.setDescription('Sends you the link to the BimBlox group.'),
	async execute(interaction) {
		await interaction.reply({ content: "The link to the BimBlox group is: https://www.roblox.com/groups/17040058/BimBlox-Supermarket#!/about", ephemeral: true });
		return;
	},
};