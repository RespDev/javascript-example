const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const marcsync = require("marcsync"); // Import MarcSync library
const dbClient = new marcsync.Client("eyJhbGciOiJIUzI1NiIsInR5cCI6Im1hcmNzeW5jQWNjZXNzIn0.eyJkYXRhYmFzZUlkIjoiMjhjNTVlZDktYTIyOC00OWNhLTgyZmUtZTM2MmQ4ZDNkMmJlIiwidXNlcklkIjoiOWYxZDliYWItMjc3Mi00YmQ5LTgyOGEtZjhmYzgwNWM5MWE5IiwidG9rZW5JZCI6IjY3MzUzODhlMzMzNjBlNjcyOTJmMDc4YiIsIm5iZiI6MTczMTU0MTEzNCwiZXhwIjo4ODEzMTQ1NDczNCwiaWF0IjoxNzMxNTQxMTM0LCJpc3MiOiJtYXJjc3luYyJ9.J1D03Lj0I9mt5gARnn5p0cc5u-eBp0W4oO-oqpTBazM"); // Replace with your MarcSync API key

const cooldowns = new Map();

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('setbakery')
        .setDescription('Set a user\'s whitelist for the Istanbul Bakery.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username to set bakery access for')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('access')
                .setDescription('Set bakery access to true or false')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason that you set this user\'s bakery access')
                .setRequired(true)),
    async execute(interaction) {
        const requiredRoleId = '1306385723058028635';
        const userId = interaction.user.id;

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // [ START COOLDOWN ]
        const currentTime = Date.now();
        const cooldownTime = 10000; // 10 seconds in milliseconds

        if (cooldowns.has(userId)) {
            const lastUsed = cooldowns.get(userId);
            const remainingTime = cooldownTime - (currentTime - lastUsed);

            if (remainingTime > 0) {
                return interaction.reply({
                    content: `> Please wait **${Math.ceil(remainingTime / 1000)}** more seconds before using this command again.`,
                    ephemeral: true
                });
            }
        }

        // Update cooldown for this user
        cooldowns.set(userId, currentTime);
        setTimeout(() => cooldowns.delete(userId), cooldownTime);
        // [ END COOLDOWN ]

        const username = interaction.options.getString('username');
        const access = interaction.options.getBoolean('access');
        const reason = interaction.options.getString('reason');

        try {
            const bakeryAccess = dbClient.getCollection("bakeryAccess");

            // Check if the user already exists in the bakery whitelist
            const userEntries = await bakeryAccess.getEntries({ username: username });

            if (access) {
                if (userEntries.length > 0) {
                    return interaction.reply({
                        content: `${username} is already bakery whitelisted.`,
                        ephemeral: true
                    });
                }
                // Set or create bakery access for the user
                await bakeryAccess.createEntry({ username: username, access: true });
            } else {
                if (userEntries.length === 0) {
                    return interaction.reply({
                        content: `That user is not bakery whitelisted.`,
                        ephemeral: true
                    });
                }
                // Remove bakery access for the user
                await bakeryAccess.deleteEntries({ username: username });
            }

            // Confirmation embed
            const embed = new EmbedBuilder()
                .setTitle('Bakery Whitelist')
                .setColor(0xFF0000) // Red color
                .addFields(
                    { name: 'Edited user', value: username },
                    { name: 'Moderator', value: interaction.user.tag },
                    { name: 'Access', value: access ? 'True' : 'False' },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            // Logs channel for BimBlox Bot
            const logsChannel = interaction.guild.channels.cache.get('1305680195138617435');
            if (logsChannel) {
                logsChannel.send({ embeds: [embed] });
            } else {
                console.error(`Logs channel not found: ${logsChannelId}`);
            }

            // Confirm the update to the user
            await interaction.reply({
                content: `${username}'s bakery access has been set to: **${access ? 'True' : 'False'}**.`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error setting bakery access:', error);
            interaction.reply({ content: 'There was an error updating the bakery access.', ephemeral: true });
        }
    },
};
