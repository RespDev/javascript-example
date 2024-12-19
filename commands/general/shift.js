const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	category: 'general',
	data: new SlashCommandBuilder()
		.setName('shift')
		.setDescription('Displays the BimBlox Shift notification.')
		.addStringOption(option => 
            option.setName('cohost')
                .setDescription('Enter the co-host name')
                .setRequired(false)),  // Optional co-host input
	async execute(interaction) {
        const requiredRoleId = '1284872724665335871'; // Replace with the ID of the required role

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: "You do not have the required role to execute this command.", ephemeral: true });
        }

        // Get the co-host name from the interaction if provided
        const cohost = interaction.options.getString('cohost');

        // Define advertisement embed.
        const announcement = new EmbedBuilder()
            .setTitle(':shopping_cart: **| BimBlox Shift**')
            .setColor(0xFF0000)  // Red color
            .setDescription(`
:wave: Hello, a shift is going to be hosted at **BimBlox** shortly. Please start heading down to the **Supermarket** if you will be attending today's shift. We are excited to see you there!

**Notes:** Go to the meeting room!
**Ping:** <@&1208905697635340288>

*Signed, BimBlox Team*
            `)
            .addFields({ name: 'Co-Host', value: cohost ? cohost : 'N/A', inline: true })  // Display co-host if provided
            .setFooter({ text: "Hinting and begging for a rank will result in a dismissal from the shift." })
            .setTimestamp();

        // Define the "Join Now" button.
        const joinButton = new ButtonBuilder()
            .setLabel('Join Now')
            .setStyle(ButtonStyle.Link)  // Sets the button style to link
            .setURL('https://www.roblox.com/games/12784774328/NEW-MEAT-CORNER-BimBlox-Supermarket');  // Link to the Roblox game

        // Create an action row to hold the button
        const row = new ActionRowBuilder()
            .addComponents(joinButton);

            const sessionChannel = interaction.guild.channels.cache.get('1261744306084118652'); // BimBlx shift channel
            if (sessionChannel) {
                sessionChannel.send({ embeds: [announcement], components: [row], ephemeral: false });
            } else {
                console.error(`Logs channel not found: ${sessionChannel.id}`);
            }
    
            await interaction.reply({ content: 'Sending the shift announcement!', ephemeral: true });
	},
};