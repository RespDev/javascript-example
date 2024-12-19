const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { allQuery } = require('../../utils/db'); // Use the helper functions

module.exports = {
  category: 'moderation',
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to view warnings for')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');

    // Check if the user has the required roles
    const allowedRoles = ['1287824832959873064', '1300595323227475998'];
    if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      // Query the database for warnings using async/await
      const rows = await allQuery(
        `SELECT id, reason, moderatorTag, timestamp FROM warnings WHERE userId = ?`,
        [user.id]
      );

      if (rows.length === 0) {
        return interaction.reply({ content: `No warnings found for **${user.tag}**.`, ephemeral: true });
      }

      // Create the embed to display the warnings
      const warningsEmbed = new EmbedBuilder()
        .setTitle(`Warnings for ${user.tag}`)
        .setColor(0xFFA500)
        .setFooter({ text: 'Warning history' })
        .setTimestamp();

      rows.forEach((row) => {
        warningsEmbed.addFields({
          name: `Warning ID: ${row.id}`,
          value: `**Reason:** ${row.reason}\n**Moderator:** ${row.moderatorTag}\n**Date:** ${new Date(row.timestamp).toLocaleString()}`,
          inline: false,
        });
      });

      return interaction.reply({ embeds: [warningsEmbed], ephemeral: true });

    } catch (err) {
      console.error(err);
      return interaction.reply({ content: 'Failed to retrieve warnings.', ephemeral: true });
    }
  },
};