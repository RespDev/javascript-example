const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock, Paper, Scissors with the bot.')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Your choice: rock, paper, or scissors.')
                .setRequired(true)
                .addChoices(
                    { name: 'rock', value: 'rock' },
                    { name: 'paper', value: 'paper' },
                    { name: 'scissors', value: 'scissors' }
                )),
    async execute(interaction) {
        const userChoice = interaction.options.getString('choice');
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        let result;

        if (userChoice === botChoice) {
            result = "It's a tie!";
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'scissors' && botChoice === 'paper') ||
            (userChoice === 'paper' && botChoice === 'rock')
        ) {
            result = 'You win!';
        } else {
            result = 'You lose!';
        }

        const embed = new EmbedBuilder()
        .setTitle('Rock, Paper, Scissors')
        .setColor(0xFF0000)  // Red color
        .setDescription(`You chose **${userChoice}**.\nI chose **${botChoice}**.`)
        .addFields(
            { name: 'Result', value: `**${result}**`, inline: true }
        )
        .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
