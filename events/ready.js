const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        // Log to console
        console.log(`The BimBlox discord bot is now running as: ${client.user.tag}`);

        // Set activity
        client.user.setActivity({
            name: `BimBlox`,
            type: ActivityType.Playing,
        });
	},
};