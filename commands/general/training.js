const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	category: 'general',
	data: new SlashCommandBuilder()
		.setName('training')
		.setDescription('Displays the BimBlox Training notification.')
		.addStringOption(option => 
            option.setName('cohost')
                .setDescription('Enter the co-host name')
                .setRequired(false)),  // Optional co-host input
	async execute(interaction) {
        const requiredRoleId = '1228666210183286805'; // Replace with the ID of the required role

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: "You do not have the required role to execute this command.", ephemeral: true });
        }

        // Get the co-host name from the interaction if provided
        const cohost = interaction.options.getString('cohost');

        // Define advertisement embed.
        const announcement = new EmbedBuilder()
            .setTitle(':shopping_cart: **| BimBlox Training**')
            .setColor(0xFF0000)  // Red color
            .setDescription(`
:wave: Hello, a training is going to be hosted at **BimBlox** shortly. Please start heading down to the **Training Center** if you will be attending todays training. We are excited to see you there!

**Notes:** Please wait patiently for the training to begin once you arrive!
**Ping:** <@&1208905697635340288>

*Signed, BimBlox Team*
            `)
            .addFields({ name: 'Co-Host', value: cohost ? cohost : 'N/A', inline: true })  // Display co-host if provided
            .setFooter({ text: "Hinting and begging for a rank will result in a dismissal from the training." })
            .setTimestamp();

        // Define the "Join Now" button.
        const joinButton = new ButtonBuilder()
            .setLabel('Join Now')
            .setStyle(ButtonStyle.Link)  // Sets the button style to link
            .setURL('https://www.roblox.com/games/12784774328/NEW-MEAT-CORNER-BimBlox-Supermarket');  // Link to the Roblox game

        // Create an action row to hold the button
        const row = new ActionRowBuilder()
            .addComponents(joinButton);

		const sessionChannel = interaction.guild.channels.cache.get('1210542170566697022'); // BimBlx training channel
		if (sessionChannel) {
			sessionChannel.send({ embeds: [announcement], components: [row], ephemeral: false });
		} else {
			console.error(`Logs channel not found: ${sessionChannel.id}`);
		}

		await interaction.reply({ content: 'Sending the training announcement!', ephemeral: true });
	},
};