const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flip a coin.'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        await interaction.reply({ content: `:coin: The coin landed on **${result}**!`, ephemeral: false });
    },
};