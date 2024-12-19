const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the unban')
                .setRequired(false)),

    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Checks the users role
        const allowedRoles = ['1287824832959873064'];
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            try {
                // Unban the user
                await interaction.guild.members.unban(userId, reason);
            } catch {
                return interaction.reply({ content: 'That user is not currently banned!', ephemeral: true });
            }

            // Confirmation embed
            const embed = new EmbedBuilder()
                .setTitle('User Unbanned')
                .setColor(0x00FF00) // Green color for the unban action
                .addFields(
                    { name: 'User', value: `${userId}` },
                    { name: 'Reason', value: reason },
                    { name: 'Unbanned by', value: interaction.user.tag }
                )
                .setTimestamp();

            const logsChannel = interaction.guild.channels.cache.get('1273411417927581746');
            if (logsChannel) {
                logsChannel.send({ embeds: [embed] });
            } else {
                console.error(`Logs channel not found: ${logsChannelId}`);
            }
            
            // Acknowledge the command in the interaction
            return interaction.reply({ content: `${userId} has been unbanned.`, ephemeral: true });
        } catch (error) {
            console.error(`Failed to unban user: ${error}`);
            return interaction.reply({ content: `There was an error trying to unban the user with ID ${userId}.`, ephemeral: true });
        }
    },
};