const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete a specified number of messages from a channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of messages to delete (1-100).')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Sets default permissions

    async execute(interaction) {
        // Checks if the user has the MANAGE_MESSAGES permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Please enter a number between 1 and 100.', ephemeral: true });
        }

        try {
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);
            return interaction.reply({ content: `Successfully deleted ${deletedMessages.size} messages.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error trying to purge messages in this channel!', ephemeral: true });
        }
    },
};