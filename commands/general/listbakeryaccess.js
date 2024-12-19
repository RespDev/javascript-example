const { SlashCommandBuilder } = require('discord.js');
const marcsync = require("marcsync"); // Import MarcSync library
const dbClient = new marcsync.Client("eyJhbGciOiJIUzI1NiIsInR5cCI6Im1hcmNzeW5jQWNjZXNzIn0.eyJkYXRhYmFzZUlkIjoiMjhjNTVlZDktYTIyOC00OWNhLTgyZmUtZTM2MmQ4ZDNkMmJlIiwidXNlcklkIjoiOWYxZDliYWItMjc3Mi00YmQ5LTgyOGEtZjhmYzgwNWM5MWE5IiwidG9rZW5JZCI6IjY3MzUzODhlMzMzNjBlNjcyOTJmMDc4YiIsIm5iZiI6MTczMTU0MTEzNCwiZXhwIjo4ODEzMTQ1NDczNCwiaWF0IjoxNzMxNTQxMTM0LCJpc3MiOiJtYXJjc3luYyJ9.J1D03Lj0I9mt5gARnn5p0cc5u-eBp0W4oO-oqpTBazM"); // Replace with your MarcSync API key

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listbakeryaccess')
        .setDescription('Lists all users who are whitelisted to access the Istanbul Bakery.'),
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

        try {
            // Fetch all users with bakery access
            const bakeryAccess = dbClient.getCollection("bakeryAccess");
            const entries = await bakeryAccess.getEntries({});

            // Validate the data format
            if (!entries || !Array.isArray(entries) || entries.length === 0) {
                return interaction.reply({ content: 'No one currently is whitelisted to access the bakery!', ephemeral: true });
            }

            // Format users in a numbered list with access status
            const formattedList = entries
                .map((entry, index) => {
                    const username = entry.getValue("username") || 'Unknown User';
                    const accessStatus = entry.getValue("access") ? 'True' : 'False';
                    return `${index + 1}. ${username}: ${accessStatus}`;
                })
                .join('\n');

            // Send the list of users with bakery access
            await interaction.reply({
                content: `**Whitelisted Users:**\n\`\`\`\n${formattedList}\n\`\`\``,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error retrieving data:', error);
            interaction.reply({ content: 'There was an error retrieving the list of whitelisted users.', ephemeral: true });
        }
    },
};