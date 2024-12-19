const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { runQuery } = require('../../utils/db'); // Use the helper functions

module.exports = {
  category: 'moderation',
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Remove a warning from a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove the warning from')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('warningid')
        .setDescription('The warning ID to remove')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const warningId = interaction.options.getInteger('warningid');
    const logChannelId = '1305680195138617435'; // Specify the log channel ID here

    // Check if the user has the required roles
    const allowedRoles = ['1287824832959873064', '1300595323227475998'];
    if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      // Remove the warning from the database using async/await
      const result = await runQuery(
        `DELETE FROM warnings WHERE userId = ? AND id = ?`,
        [user.id, warningId]
      );

      // Check if any rows were affected (warning was removed)
      if (result.changes === 0) {
        return interaction.reply({ content: `No warning with ID ${warningId} found for **${user.tag}**.`, ephemeral: true });
      }

      // Create and send a confirmation message
      const confirmationMessage = `> **Warning ID ${warningId}** has been removed from **${user.tag}**.`;
      await interaction.reply({ content: confirmationMessage, ephemeral: false });

      // Create the log embed for the warning removal
      const logEmbed = new EmbedBuilder()
        .setTitle('Warning Removed')
        .setColor(0xFF0000) // Red color for removal
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})` },
          { name: 'Warning ID', value: `${warningId}` },
          { name: 'Removed by', value: interaction.user.tag },
          { name: 'Date', value: new Date().toLocaleString() }
        )
        .setTimestamp();

      // Send the log embed to the specified log channel
      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send({ embeds: [logEmbed] });
      } else {
        console.error('Log channel not found.');
      }

    } catch (err) {
      console.error('Error removing warning:', err);
      return interaction.reply({ content: 'An error occurred while removing the warning.', ephemeral: true });
    }
  },
};