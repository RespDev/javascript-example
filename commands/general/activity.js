const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const marcsync = require("marcsync"); // Import MarcSync library
const dbClient = new marcsync.Client("eyJhbGciOiJIUzI1NiIsInR5cCI6Im1hcmNzeW5jQWNjZXNzIn0.eyJkYXRhYmFzZUlkIjoiMjhjNTVlZDktYTIyOC00OWNhLTgyZmUtZTM2MmQ4ZDNkMmJlIiwidXNlcklkIjoiOWYxZDliYWItMjc3Mi00YmQ5LTgyOGEtZjhmYzgwNWM5MWE5IiwidG9rZW5JZCI6IjY3MzUzODhlMzMzNjBlNjcyOTJmMDc4YiIsIm5iZiI6MTczMTU0MTEzNCwiZXhwIjo4ODEzMTQ1NDczNCwiaWF0IjoxNzMxNTQxMTM0LCJpc3MiOiJtYXJjc3luYyJ9.J1D03Lj0I9mt5gARnn5p0cc5u-eBp0W4oO-oqpTBazM"); // Replace with your MarcSync API key

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Get playtime activity for a Roblox user')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('Roblox username or user ID')
                .setRequired(true)),

    async execute(interaction) {
        const userInput = interaction.options.getString('user');
        const userId = interaction.user.id;

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

        let fetchedUserId;
        let userName;

        // Attempt to parse the input as a user ID (if it's a number)
        if (!isNaN(userInput)) {
            fetchedUserId = parseInt(userInput);
            userName = await fetchUserNameById(fetchedUserId);
        } else {
            // If it's a username, fetch the user ID via the Roblox API
            try {
                const response = await fetch('https://users.roblox.com/v1/usernames/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usernames: [userInput] })
                });
                const data = await response.json();

                if (!data.data || data.data.length === 0) {
                    return interaction.reply({ content: 'Invalid Roblox username.', ephemeral: true });
                }

                fetchedUserId = data.data[0].id;
                userName = data.data[0].name; // Use the returned username
            } catch (error) {
                console.error('Error fetching user ID:', error);
                return interaction.reply({ content: 'There was an error fetching the user ID from Roblox.', ephemeral: true });
            }
        }

        try {
            // Fetch the user's activity from MarcSync using the user ID
            const activityCollection = dbClient.getCollection("activities");
            const activity = await activityCollection.getEntries({
                ["userId"]: fetchedUserId
            });

            if (!activity || activity.length === 0) {
                return interaction.reply({ content: 'This user has never played BimBlox Supermarket.', ephemeral: true });
            }

            // Retrieve the playtime value
            const playTimeInSeconds = activity[0].getValue('playTime');

            // Convert playtime into days, hours, minutes, and seconds
            const formattedTime = formatPlaytime(playTimeInSeconds);

            // Create an embed to display the activity data
            const embed = new EmbedBuilder()
                .setColor('#FF0000') // Red color
                .setTitle(`${userName}'s BimBlox Activity`)
                .setDescription(`**Roblox User ID:** ${fetchedUserId}`)
                .addFields([{ name: 'Playtime:', value: formattedTime, inline: true }])
                .setTimestamp()
                .setFooter({ text: 'BimBlox Supermarket' });

            // Send the embed as a response
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error retrieving activity data:', error);
            return interaction.reply({ content: 'There was an error retrieving the activity data.', ephemeral: true });
        }
    },
};

// Helper function to fetch the username by user ID
async function fetchUserNameById(userId) {
    try {
        const response = await fetch(`https://users.roblox.com/v1/users/${userId}`);
        const data = await response.json();
        if (data.errors) {
            return null;
        }
        return data.name;
    } catch (error) {
        console.error('Error fetching username by ID:', error);
        return null;
    }
}

// Helper function to format time in seconds to days, hours, minutes, and seconds
function formatPlaytime(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
}