const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { welcomeChannelId, rulesChannelId } = require('../../config.json');

module.exports = {
    category: 'general',  // Set the category of the command
    data: new SlashCommandBuilder()
        .setName('sendembed')
        .setDescription('Send a predefined embed to a specified channel.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of embed to send.')
                .setRequired(true)
                .addChoices(
                    //{ name: 'welcome', value: 'welcome'},
                    { name: 'rules', value: 'rules'},
                )),
    async execute(interaction) {
        const type = interaction.options.getString('type');

        // Checks that the user is either an Admin or has a specific user ID
        if (!interaction.member.roles.cache.has('1208859170044911696') && interaction.user.id !== '950091757952057385') {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Define channel IDs
        const channels = {
            //welcome: welcomeChannelId, // Welcome channel
            rules: rulesChannelId, // Rules
        };

        // Define rules embeds.
        const rules = new EmbedBuilder()
            .setTitle('**BimBlox Game & Discord Rules**')
            .setColor(0xFF0000)  // Red color
            .setDescription(`
Our game rules are designed to ensure the smooth operation of our gaming experience and maintain a friendly and respectful environment for all players. By adhering to these guidelines, we enhance the overall enjoyment of our BimBlox community. Your cooperation in upholding these standards is valued and contributes to a welcoming and enjoyable gaming community.

Rule 1: Game Behavior & Fair Play

Play the game with sportsmanship and integrity.
Do not engage in any form of cheating, hacking, or exploiting game mechanics.
Treat fellow players with respect and avoid behavior that could harm or offend them.
Encouraging rule violations or unfair play is strictly prohibited.

Rule 2: In-Game Communication

Maintain courteous and respectful communication with other players.
Avoid excessive use of profanity or offensive language.
Do not engage in harassment, hate speech, or discriminatory behavior.

Rule 3: Gameplay Etiquette

Play the game as intended, following the established rules and objectives.
Avoid trolling, griefing, or intentionally disrupting the gameplay experience for others.

Rule 4: Personal Information

Respect the privacy of other players.
Do not share personal information such as real names, addresses, or confidential data within the game.

Rule 5: Reporting Misconduct

If you encounter a player violating the rules, report their behavior through the appropriate in-game channels.
Do not submit false reports or engage in any form of harassment as a means of retaliation.

Rule 6: Game Promotion

Do not use the in-game environment for unauthorized promotion or advertising.
Seek permission from the appropriate channels or moderators for any promotional activities.

Rule 7: Language & Communication

Use appropriate language in all in-game communications.
Respect the preferred language for effective communication within the game.

Rule 8: Impersonation

Do not impersonate other players, game moderators, or celebrities.
Respect the identities and integrity of all individuals.

Rule 9: Suspicious Links & Malware

Refrain from sharing links that lead to suspicious or potentially harmful websites.
Do not distribute or promote malware or any malicious software.

Rule 10: Game Mechanics & Bugs

Report any discovered game bugs or glitches through the provided channels.
Do not exploit or abuse known game mechanics issues to gain an unfair advantage.

Rule 11: Assets that we use

We are not giving any information about the assets we use.

Rule 12: You may not talk in a ticket that is already claimed.

Unless you‘re specificly pinged by the person who claimed it. This applies to every rank.

Rule 13: DM Advertisement

DM advertisement will not be tolerated and will lead to an punishment.

Rule 14: Pings

You are not allowed to ping any HR+ Staff member without a valid reason.

**All decisions made by game moderators are final. Please show respect for the dedicated volunteers who work to maintain the quality of the gaming experience.**
            `)
            .setFooter({ text: 'Rules subject to change.' })
            .setTimestamp()
        const verify = new EmbedBuilder()
            .setTitle('__Linking Your Account__')
            .setColor(0x00FFFF) // Aqua color
            .setDescription(`
Account linking
            `)
            .setFooter({ text: 'Verification guide subject to change.' })
            .setTimestamp()
        const adminInfo = new EmbedBuilder()
            .setTitle('__Admin Info__')
            .setColor(0x00FFFF) // Aqua color
            .setDescription(`
Admin Info
            `)
            .setFooter({ text: 'Admin info subject to change.' })
            .setTimestamp()

        // Define the "Rules" button.
        const rulesButton = new ButtonBuilder()
            .setLabel('Rules')
            .setStyle(ButtonStyle.Link)  // Sets the button style to link
            .setURL('https://www.roblox.com/games/12784774328/NEW-MEAT-CORNER-BimBlox-Supermarket');  // Link to the Rules Google Doc

        // Create an action row to hold the button
        const row = new ActionRowBuilder()
            .addComponents(rulesButton);

        // Get the channel ID and embed based on the type
        const channelId = channels[type];

        // Send the embed to the specified channel
        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) {
            return interaction.reply({ content: 'Channel not found.', ephemeral: true });
        }

        // Delete the most recent message in the channel if it exists
        const messages = await channel.messages.fetch({ limit: 1 });
        if (messages.size > 0) {
            const lastMessage = messages.first();
            try {
                await lastMessage.delete();
            } catch (error) {
                console.error('Error deleting old message:', error);
            }
        }

        if (type == 'rules') {
            await channel.send({ embeds: [rules], components: [row], ephemeral: false });
        }
        //else if (type == 'welcome') {
        //    await channel.send({ embeds: [verify] });
        //}

        await interaction.reply({ content: `Embed sent to the ${type} channel.`, ephemeral: true });
    },
};