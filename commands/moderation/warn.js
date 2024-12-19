const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { runQuery } = require('../../utils/db'); // Use the helper functions

module.exports = {
  category: 'moderation',
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the warning')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const logChannelId = '1305680195138617435';

    // Check if the user has the required roles
    const allowedRoles = ['1287824832959873064', '1300595323227475998'];
    if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      // Insert the warning into the database using async/await
      const timestamp = new Date().toISOString();
      await runQuery(
        `INSERT INTO warnings (userId, username, reason, moderatorId, moderatorTag, timestamp) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, user.tag, reason, interaction.user.id, interaction.user.tag, timestamp]
      );

      // Send the warning embed to the user via DM
      const warnEmbed = new EmbedBuilder()
        .setTitle('⚠️ You Have Been Warned')
        .setColor(0xFFA500)
        .addFields(
          { name: 'Reason', value: reason },
          { name: 'Warned by', value: interaction.user.tag }
        )
        .setFooter({ text: 'Please follow the server rules or further action may be taken.' })
        .setTimestamp();

      try {
        await user.send({ embeds: [warnEmbed] });
      } catch (error) {
        console.error(`Could not send DM to ${user.tag}.`);
      }

      // Log the warning in a log channel
      const logEmbed = new EmbedBuilder()
        .setTitle('User Warned')
        .setColor(0xFF0000)
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})` },
          { name: 'Reason', value: reason },
          { name: 'Warned by', value: interaction.user.tag }
        )
        .setTimestamp();

      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send({ embeds: [logEmbed] });
      }

      return interaction.reply({ content: `> **${user.tag}** has been warned for the reason: ${reason}`, ephemeral: false });

    } catch (err) {
      console.error(err);
      return interaction.reply({ content: 'An error occurred while issuing the warning.', ephemeral: true });
    }
  },
};
